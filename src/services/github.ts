import { GitHubUser, GitHubRepo, GitHubGraphQLResponse } from '@/types/github';
import { GitHubStats } from '@/types/profile';
import { calculateRank, Rank } from '@/utils/rankUtils';
import { getCachedData, setCachedData } from '@/utils/cache';

// 캐시 TTL 상수
const GITHUB_STATS_CACHE_TTL = 24 * 60 * 60; // 24시간 (하루)으로 증가
const GITHUB_GRAPHQL_CACHE_TTL = 12 * 60 * 60; // 12시간

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
    // 캐시 키 생성 - 쿼리 내용과 변수를 포함하여 더 정밀한 캐싱
    const queryHash = this.hashString(query); // 긴 쿼리 문자열 대신 해시 사용
    const cacheKey = `github:graphql:${queryHash}:${JSON.stringify(variables)}`;
    
    // 캐시에서 데이터 확인
    const cachedData = await getCachedData<T>(cacheKey);
    if (cachedData) {
      console.log(`[GraphQL 캐시 사용] ${cacheKey}`);
      return cachedData;
    }
    
    // 환경 변수에서 GitHub 토큰을 가져옵니다.
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    if (!token) {
      throw new Error('GitHub API 토큰이 필요합니다.');
    }

    try {
      console.time(`github:graphql:${queryHash}`);
      const response = await fetch(this.graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query, variables }),
      });
      console.timeEnd(`github:graphql:${queryHash}`);

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
      await setCachedData(cacheKey, data.data, GITHUB_GRAPHQL_CACHE_TTL);
      
      return data.data;
    } catch (error) {
      console.error(`GraphQL 요청 실패:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('GitHub API 요청 중 오류가 발생했습니다.');
    }
  }

  // 문자열을 간단한 해시로 변환하는 헬퍼 메서드 (캐시 키용)
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // 32비트 정수로 변환
    }
    return hash.toString(16); // 16진수 문자열로 변환
  }

  // GraphQL 쿼리 정의 - 최적화 버전
  private getGraphQLUserStatsQuery(): string {
    return ` 
      query GetUserStats($username: String!, $from: DateTime!, $to: DateTime!) { 
        user(login: $username) {
          # 기본 정보만 간결히 요청
          name
          login
          avatarUrl(size: 200)
          bio
          # location, company, email은 랭크 계산에 필요없는 정보
          location
          company
          email
          websiteUrl
          
          # 저장소 정보: 스타 수만 계산
          # 최상위 100개만 가져오고, stargazerCount만 필요함
          repositories(
            ownerAffiliations: OWNER, 
            first: 100, 
            orderBy: {field: STARGAZERS, direction: DESC}
          ) {
            nodes {
              stargazerCount
            }
          }
          
          # 올해 커밋 수 - 필수 필드만
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
            restrictedContributionsCount
          }
          
          # PR 및 이슈 수 - 카운트만 필요
          pullRequests(states: [OPEN, CLOSED, MERGED]) {
             totalCount
          }
          issues(states: [OPEN, CLOSED]) {
             totalCount
          }
          
          # 날짜 정보
          createdAt
          updatedAt
        }
      }
    `;
  }

  // 쿼리 변수 구성 함수를 별도로 분리 (코드 명확성 향상)
  private getQueryVariables(username: string): Record<string, any> {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    
    return {
      username,
      from: startOfYear.toISOString(),
      to: now.toISOString(),
    };
  }

  // getUserStats 메서드를 GraphQL 기반으로 최적화
  public async getUserStats(username: string, forceRefresh: boolean = false): Promise<GitHubStats> {
    // 캐시 키 생성
    const cacheKey = `github:stats:${username}`;
    
    // 캐시 확인 (강제 새로고침이 아닌 경우)
    if (!forceRefresh) {
      const cachedStats = await getCachedData<GitHubStats>(cacheKey);
      if (cachedStats) {
        console.log(`[캐시 사용] ${username}의 데이터 캐시에서 로드됨, 랭크:`, cachedStats.rank);
        return cachedStats;
      }
    }
    
    console.log(`[GitHub API 요청] ${username}의 통계 데이터 요청 중...`);
    console.time(`github:stats:${username}`);
    
    try {
      // 최적화: 쿼리 및 변수를 한 번만 생성
      const query = this.getGraphQLUserStatsQuery();
      const variables = this.getQueryVariables(username);

      // GraphQL 요청 실행
      const result = await this.fetchGraphQL<GitHubGraphQLResponse>(query, variables);

      if (!result.user) {
        throw new Error(`사용자 '${username}'를 찾을 수 없습니다.`);
      }

      // 최적화: 필요한 데이터만 추출하는 구조 분해 할당 사용
      const { 
        name, login, avatarUrl, bio, location, company, email, websiteUrl,
        repositories, contributionsCollection, pullRequests, issues,
        createdAt, updatedAt 
      } = result.user;

      // 최적화: 계산 로직 단순화
      const totalStars = repositories.nodes.reduce(
        (sum: number, repo: any) => sum + (repo.stargazerCount || 0), 
        0
      );
      
      const currentYearCommits = 
        contributionsCollection.totalCommitContributions + 
        contributionsCollection.restrictedContributionsCount;

      // Rank 계산에 필요한 필드만 포함
      const rankParams = {
        commits: currentYearCommits,
        prs: pullRequests.totalCount,
        issues: issues.totalCount,
        stars: totalStars,
      };

      console.log(`[랭크 계산 전] ${username}의 통계:`, rankParams);
      const rankResult = calculateRank(rankParams);
      console.log(`[랭크 계산 후] ${username}의 랭크:`, rankResult);

      // 최종 반환 객체 구성 (불변 객체로 한 번에 생성)
      const finalStats: GitHubStats = {
        name: name || login,
        avatarUrl,
        bio: bio || '',
        location: location || '',
        company: company || '',
        email: email || '',
        blog: websiteUrl || '',
        totalStars,
        currentYearCommits,
        totalPRs: pullRequests.totalCount,
        totalIssues: issues.totalCount,
        createdAt,
        updatedAt,
        rank: rankResult,
        twitterUsername: '',
      };

      // 캐시에 저장
      await setCachedData(cacheKey, finalStats, GITHUB_STATS_CACHE_TTL);
      console.timeEnd(`github:stats:${username}`);

      return finalStats;
    } catch (error) {
      console.error(`GitHub 통계 조회 실패 (${username}):`, error);
      console.timeEnd(`github:stats:${username}`);
       
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