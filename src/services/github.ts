import { GitHubUser, GitHubRepo, GitHubGraphQLResponse } from '@/types/github';
import { GitHubStats } from '@/types/profile';
import { calculateRank, Rank } from '@/utils/rankUtils';

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
    // 환경 변수에서 GitHub 토큰을 가져옵니다. .env 파일 등에 GITHUB_TOKEN 설정 필요
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    if (!token) {
      console.error('GitHub API 토큰이 설정되지 않았습니다. 환경변수 NEXT_PUBLIC_GITHUB_TOKEN을 확인하세요.');
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
        const errorData = await response.json().catch(() => ({})); // 에러 응답 파싱 시도
        console.error('GitHub GraphQL API Error:', response.status, errorData);
        if (response.status === 401) {
           throw new Error('GitHub API 인증에 실패했습니다. 토큰을 확인하세요.');
        }
        // 상세 에러 메시지 포함 시도
        const message = errorData?.message || 'GitHub GraphQL API 요청 중 오류가 발생했습니다';
        throw new Error(message);
      }

      const data = await response.json();
      if (data.errors) {
        // GraphQL 쿼리 자체의 에러 처리
        console.error('GitHub GraphQL Query Errors:', data.errors);
        throw new Error(`GraphQL 오류: ${data.errors.map((e: any) => e.message).join(', ')}`);
      }

      return data.data; // data 필드만 반환
    } catch (error) {
      console.error('GraphQL Fetch Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('GitHub GraphQL API 요청 중 예측하지 못한 오류가 발생했습니다.');
    }
  }

  // GraphQL 쿼리 정의 수정
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
          # followers 제거
          # following 제거
          # 저장소 정보: 스타 수 계산용
          repositories(ownerAffiliations: OWNER, first: 100, orderBy: {field: STARGAZERS, direction: DESC}) {
            totalCount 
            nodes {
              stargazerCount
            }
          }
          # contributionsCollection 복원 (올해 커밋 수용)
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
            restrictedContributionsCount
          }
          # 전체 PR 및 이슈 수 유지
          pullRequests(states: [OPEN, CLOSED, MERGED]) {
             totalCount
          }
          issues(states: [OPEN, CLOSED]) {
             totalCount
          }
          createdAt
          updatedAt
          # publicRepositories 제거
        }
      }
    `;
  }

  // getUserStats 메서드를 GraphQL 기반으로 수정
  public async getUserStats(username: string): Promise<GitHubStats> {
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

      // statsData 객체는 Rank 계산에 필요한 필드만 포함
      const rankParams = {
        commits: currentYearCommits,
        prs: userData.pullRequests.totalCount,
        issues: userData.issues.totalCount,
        stars: totalStars,
      };

      // 새로운 calculateRank 함수 호출
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
        rank: rankResult, // grade 대신 rank 사용
        twitterUsername: '', // 필요시 유지 또는 제거
      };

      return finalStats;

    } catch (error) {
       console.error(`GitHub 통계 조회 실패 (${username}):`, error);
       // 에러 시 기본 Rank 값 설정
       const defaultRank: Rank = { level: '?', percentile: 0, score: 0 };
       return {
         name: username, avatarUrl: '', bio: '', location: '', company: '', email: '', blog: '',
         totalStars: 0, currentYearCommits: 0,
         totalPRs: 0, totalIssues: 0, createdAt: '', updatedAt: '',
         rank: defaultRank, // grade 대신 rank 사용
         twitterUsername: '',
       };
    }
  }
} 