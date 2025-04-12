import { GitHubUser, GitHubRepo, GitHubGraphQLResponse } from '@/types/github';
import { GitHubStats } from '@/types/profile';
import { calculateRank, Rank } from '@/utils/rankUtils';
import { getCachedData, setCachedData } from '@/utils/cache';

// 캐시 TTL 상수
const GITHUB_STATS_CACHE_TTL = 6 * 60 * 60; // 6시간

export class GitHubService {
  private static instance: GitHubService;
  // GraphQL 엔드포인트 추가
  private readonly graphqlUrl = 'https://api.github.com/graphql';
  // REST API baseUrl은 유지 (필요시 사용 가능)
  private readonly restBaseUrl = 'https://api.github.com';

  private constructor() {}

  public static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService();
    }
    return GitHubService.instance;
  }

  // GraphQL 요청을 위한 fetch 메서드
  private async fetchGraphQL<T>(query: string, variables: Record<string, any>): Promise<T> {
    // 캐시 키 생성
    const cacheKey = `github:graphql:${JSON.stringify(variables)}`;
    
    // 캐시에서 데이터 확인
    const cachedData = await getCachedData<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // 환경 변수에서 GitHub 토큰을 가져옵니다.
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    if (!token) {
      throw new Error('GitHub API 토큰이 필요합니다.');
    }

    try {
      const response = await fetch(this.graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
           throw new Error('GitHub API 인증에 실패했습니다.');
        }
        throw new Error(errorData?.message || 'GitHub API 요청 실패');
      }

      const data = await response.json();
      if (data.errors) {
        throw new Error(`GraphQL 오류: ${data.errors.map((e: any) => e.message).join(', ')}`);
      }

      // 캐시에 저장
      await setCachedData(cacheKey, data.data, GITHUB_STATS_CACHE_TTL);
      
      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('GitHub API 요청 중 오류가 발생했습니다.');
    }
  }

  // GraphQL 쿼리 정의
  private getGraphQLUserStatsQuery(): string {
    return ` 
      query GetUserStats($username: String!, $from: DateTime!, $to: DateTime!) { 
        user(login: $username) {
          name
          login
          avatarUrl
          bio
          location
          company
          email
          websiteUrl
          # 저장소 정보: 스타 수 계산용
          repositories(ownerAffiliations: OWNER, first: 100, orderBy: {field: STARGAZERS, direction: DESC}) {
            totalCount 
            nodes {
              stargazerCount
            }
          }
          # 올해 커밋 수
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
            restrictedContributionsCount
          }
          # PR 및 이슈 수 
          pullRequests(states: [OPEN, CLOSED, MERGED]) {
             totalCount
          }
          issues(states: [OPEN, CLOSED]) {
             totalCount
          }
          createdAt
          updatedAt
        }
      }
    `;
  }

  // getUserStats 메서드를 GraphQL 기반으로 최적화
  public async getUserStats(username: string): Promise<GitHubStats> {
    // 캐시 키 생성
    const cacheKey = `github:stats:${username}`;
    
    // 캐시 확인
    const cachedStats = await getCachedData<GitHubStats>(cacheKey);
    if (cachedStats) {
      return cachedStats;
    }
    
    const query = this.getGraphQLUserStatsQuery();
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const variables = {
      username: username,
      from: startOfYear.toISOString(),
      to: now.toISOString(),
    };

    try {
      const result = await this.fetchGraphQL<GitHubGraphQLResponse>(query, variables);

      if (!result.user) {
        throw new Error(`사용자 '${username}'를 찾을 수 없습니다.`);
      }

      const userData = result.user;
      const contributions = userData.contributionsCollection;
      const totalStars = userData.repositories.nodes.reduce((sum: number, repo: any) => sum + (repo.stargazerCount || 0), 0);
      const currentYearCommits = contributions.totalCommitContributions + contributions.restrictedContributionsCount;

      // Rank 계산에 필요한 필드만 포함
      const rankParams = {
        commits: currentYearCommits,
        prs: userData.pullRequests.totalCount,
        issues: userData.issues.totalCount,
        stars: totalStars,
      };

      const rankResult = calculateRank(rankParams);

      // 최종 반환 객체 구성
      const finalStats: GitHubStats = {
        name: userData.name || userData.login,
        avatarUrl: userData.avatarUrl,
        bio: userData.bio || '',
        location: userData.location || '',
        company: userData.company || '',
        email: userData.email || '',
        blog: userData.websiteUrl || '',
        totalStars: totalStars,
        currentYearCommits: currentYearCommits,
        totalPRs: userData.pullRequests.totalCount,
        totalIssues: userData.issues.totalCount,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        rank: rankResult,
        twitterUsername: '',
      };

      // 캐시에 저장
      await setCachedData(cacheKey, finalStats, GITHUB_STATS_CACHE_TTL);

      return finalStats;
    } catch (error) {
       console.error(`GitHub 통계 조회 실패 (${username}):`, error);
       // 에러 시 기본값 반환
       const defaultRank: Rank = { level: '?', percentile: 0, score: 0 };
       return {
         name: username, avatarUrl: '', bio: '', location: '', company: '', email: '', blog: '',
         totalStars: 0, currentYearCommits: 0,
         totalPRs: 0, totalIssues: 0, createdAt: '', updatedAt: '',
         rank: defaultRank,
         twitterUsername: '',
       };
    }
  }
} 