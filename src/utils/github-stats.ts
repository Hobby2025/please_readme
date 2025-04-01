/**
 * GitHub 통계 관련 유틸리티 함수
 * 이 파일은 서버 컴포넌트에서만 사용됨
 */

/**
 * GitHub 통계 인터페이스
 */
export interface GitHubStats {
  stars: number;
  commits: number;
  prs: number;
  issues: number;
  contributions: number;
  currentYearCommits: number;
  languages: { [key: string]: number };
  avatar_url?: string;
}

/**
 * 지수 분포 누적 분포 함수 계산
 */
export function exponentialCdf(x: number): number {
  return 1 - 2 ** -x;
}

/**
 * 로그 정규 분포 누적 분포 함수 계산 (근사값)
 */
export function logNormalCdf(x: number): number {
  return x / (1 + x);
}

/**
 * 랭크 정보 인터페이스
 */
export interface RankInfo {
  name: string;
  color: string;
  emoji: string;
  mainColor: string;
  accentColor: string;
  headerBg: string;
  headerBgColor: string;
  highlightColor: string;
  percentile: number;
}

/**
 * 사용자 랭크 계산 함수
 */
export function calculateRank(stats: GitHubStats | undefined): RankInfo {
  const { contributions = 0, currentYearCommits = 0, prs = 0, issues = 0, stars = 0 } = stats || {};
  
  // 중간값 및 가중치 설정
  const COMMITS_MEDIAN = 250;
  const COMMITS_WEIGHT = 2;
  const PRS_MEDIAN = 50;
  const PRS_WEIGHT = 3;
  const ISSUES_MEDIAN = 25;
  const ISSUES_WEIGHT = 1;
  const CONTRIBUTIONS_MEDIAN = 200;
  const CONTRIBUTIONS_WEIGHT = 3;
  const STARS_MEDIAN = 50;
  const STARS_WEIGHT = 4;
  
  const TOTAL_WEIGHT = COMMITS_WEIGHT + PRS_WEIGHT + ISSUES_WEIGHT + CONTRIBUTIONS_WEIGHT + STARS_WEIGHT;
  
  // 평가 점수 계산 (0~1 범위)
  const score = 1 - (
    (COMMITS_WEIGHT * exponentialCdf(currentYearCommits / COMMITS_MEDIAN) +
    PRS_WEIGHT * exponentialCdf(prs / PRS_MEDIAN) +
    ISSUES_WEIGHT * exponentialCdf(issues / ISSUES_MEDIAN) +
    CONTRIBUTIONS_WEIGHT * exponentialCdf(contributions / CONTRIBUTIONS_MEDIAN) +
    STARS_WEIGHT * logNormalCdf(stars / STARS_MEDIAN)) / TOTAL_WEIGHT
  );
  
  // 퍼센타일 계산 (0~100%)
  const percentile = score * 100;
  
  // 등급 임계값 및 등급 정의
  const THRESHOLDS = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
  const rankIndex = THRESHOLDS.findIndex(t => percentile <= t);
  
  // 무지개 색상에 맞는 등급별 설정 (파스텔 톤으로 변경)
  const RANKS = [
    { 
      name: 'S', 
      color: '#D8B5FF', 
      emoji: '🔮',
      mainColor: '#D8B5FF',
      accentColor: '#7B2CBF',
      headerBg: 'bg-[#C9A3FF]/50',
      headerBgColor: '#C9A3FF',
      highlightColor: '#D8B5FF'
    },
    { 
      name: 'A+', 
      color: '#BDB2FF', 
      emoji: '👑',
      mainColor: '#BDB2FF',
      accentColor: '#5A54C9',
      headerBg: 'bg-[#A397E9]/50',
      headerBgColor: '#A397E9',
      highlightColor: '#BDB2FF'
    },
    { 
      name: 'A', 
      color: '#A0C4FF', 
      emoji: '🌊',
      mainColor: '#A0C4FF',
      accentColor: '#3066BE',
      headerBg: 'bg-[#89B1FF]/50',
      headerBgColor: '#89B1FF',
      highlightColor: '#A0C4FF'
    },
    { 
      name: 'A-', 
      color: '#CAFFBF', 
      emoji: '🌿',
      mainColor: '#CAFFBF',
      accentColor: '#38B000',
      headerBg: 'bg-[#A8F0A0]/50',
      headerBgColor: '#A8F0A0',
      highlightColor: '#CAFFBF'
    },
    { 
      name: 'B+', 
      color: '#FDFFB6', 
      emoji: '⭐',
      mainColor: '#FDFFB6',
      accentColor: '#F9C74F',
      headerBg: 'bg-[#F9F59D]/50',
      headerBgColor: '#F9F59D',
      highlightColor: '#FDFFB6'
    },
    { 
      name: 'B', 
      color: '#FFD6A5', 
      emoji: '🔥',
      mainColor: '#FFD6A5',
      accentColor: '#F3722C',
      headerBg: 'bg-[#FFBF80]/50',
      headerBgColor: '#FFBF80',
      highlightColor: '#FFD6A5'
    },
    { 
      name: 'B-', 
      color: '#FFADAD', 
      emoji: '🚀',
      mainColor: '#FFADAD',
      accentColor: '#F94144',
      headerBg: 'bg-[#FF9A9A]/50',
      headerBgColor: '#FF9A9A',
      highlightColor: '#FFADAD'
    },
    { 
      name: 'C+', 
      color: '#FFC2CD', 
      emoji: '💫',
      mainColor: '#FFC2CD',
      accentColor: '#D81159',
      headerBg: 'bg-[#FFADBF]/50',
      headerBgColor: '#FFADBF',
      highlightColor: '#FFC2CD'
    },
    { 
      name: 'C', 
      color: '#E5C1CD', 
      emoji: '✨',
      mainColor: '#E5C1CD',
      accentColor: '#9A348E',
      headerBg: 'bg-[#D9A7B9]/50',
      headerBgColor: '#D9A7B9',
      highlightColor: '#E5C1CD'
    }
  ];
  
  return { ...RANKS[rankIndex], percentile };
}

/**
 * REST API를 사용하여 GitHub 통계 가져오기
 */
export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  try {
    // GitHub API 요청 시 사용자 에이전트 설정
    const headers = {
      'User-Agent': 'Please-Readme-App',
      'Accept': 'application/vnd.github.v3+json'
    };
    
    // 기본 사용자 정보 가져오기
    const userResponse = await fetch(`https://api.github.com/users/${username}`, { headers });
    
    if (!userResponse.ok) {
      if (userResponse.status === 403) {
        const rateLimitRemaining = userResponse.headers.get('X-RateLimit-Remaining');
        if (rateLimitRemaining === '0') {
          const resetTime = userResponse.headers.get('X-RateLimit-Reset');
          const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : new Date();
          const minutesUntilReset = Math.ceil((resetDate.getTime() - new Date().getTime()) / (60 * 1000));
          throw new Error(`GitHub API 요청 제한에 도달했습니다. ${minutesUntilReset}분 후에 다시 시도해 주세요.`);
        }
      }
      
      if (userResponse.status === 404) {
        throw new Error(`GitHub 사용자 '${username}'을(를) 찾을 수 없습니다.`);
      }
      
      throw new Error(`GitHub API 요청 실패: ${userResponse.status}`);
    }
    
    const userData = await userResponse.json();
    
    // 사용자 레포지토리 가져오기
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });
    
    if (!reposResponse.ok) {
      throw new Error(`GitHub 레포지토리 요청 실패: ${reposResponse.status}`);
    }
    
    const repos = await reposResponse.json();
    
    // 사용자 스타 가져오기
    const starredResponse = await fetch(`https://api.github.com/users/${username}/starred?per_page=100`, { headers });
    let starCount = 0;
    
    if (starredResponse.ok) {
      const starred = await starredResponse.json();
      starCount = starred.length;
    }
    
    // 레포지토리 합계 계산
    let totalCommits = 0;
    let totalIssues = 0;
    let totalPRs = 0;
    let totalContributions = repos.length; // 레포지토리 수를 기본 기여도로 사용
    
    // 언어 통계
    const languages: Record<string, number> = {};
    
    // 각 레포지토리 정보 분석
    for (const repo of repos) {
      // 레포지토리 기여도 통계
      if (!repo.fork) { // 포크가 아닌 레포지토리만 계산
        // 언어 통계 추가
        if (repo.language && repo.language !== 'null') {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
        
        // 커밋 수 추가 (약식 계산 - 실제로는 각 레포지토리의 커밋 API 필요)
        totalCommits += repo.watchers_count * 2; // 별표 수를 기준으로 대략적 커밋 수 추정
        
        // 이슈 및 PR 수는 별표/워처 수에 비례하여 추정
        totalIssues += Math.round(repo.open_issues_count * 0.7); // 오픈 이슈 중 약 70%
        totalPRs += Math.round(repo.open_issues_count * 0.3); // 오픈 이슈 중 약 30%가 PR이라 가정
      }
    }
    
    // 연간 커밋 추정 (실제로는 특정 날짜 범위 필터링 필요)
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const daysPassed = Math.floor((Date.now() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
    const yearRatio = daysPassed / 365;
    
    // 대략적인 연간 커밋 추정
    const currentYearCommits = Math.round(totalCommits * yearRatio);
    
    return {
      stars: starCount || userData.public_repos || 0, // 실제 스타 수 또는 레포 수
      commits: totalCommits || userData.public_repos * 5 || 0, // 총 커밋 수 또는 레포당 약 5개로 추정
      prs: totalPRs || Math.round(userData.public_repos * 0.3) || 0, // 총 PR 수
      issues: totalIssues || Math.round(userData.public_repos * 0.7) || 0, // 총 이슈 수
      contributions: totalContributions || userData.public_repos || 0, // 총 기여도
      currentYearCommits: currentYearCommits || Math.round(totalCommits * 0.4) || 0, // 올해 커밋 수
      languages: languages, // 언어 사용 통계
      avatar_url: userData.avatar_url
    };
  } catch (error) {
    console.error('GitHub 통계 가져오기 실패:', error);
    throw error; // 오류를 상위 함수로 전파하여 적절한 오류 메시지 표시
  }
}

/**
 * GraphQL API를 사용하여 GitHub 통계 가져오기
 */
export async function fetchGitHubStatsGraphQL(username: string, token?: string): Promise<GitHubStats> {
  try {
    // 토큰이 없으면 REST API로 폴백
    if (!token) {
      console.warn('GitHub 토큰이 없어 GraphQL API 사용 불가, REST API로 폴백합니다.');
      return fetchGitHubStats(username);
    }
    
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            contributionCalendar {
              totalContributions
            }
          }
          repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC) {
            totalCount
            nodes {
              stargazerCount
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  node {
                    name
                  }
                  size
                }
              }
            }
          }
          starredRepositories {
            totalCount
          }
          avatarUrl
        }
      }
    `;
    
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { username } }),
    });
    
    if (!response.ok) {
      throw new Error(`GitHub GraphQL API 요청 실패: ${response.status}`);
    }
    
    const { data } = await response.json();
    
    if (!data || !data.user) {
      throw new Error('사용자 데이터를 찾을 수 없습니다');
    }
    
    const user = data.user;
    const contributions = user.contributionsCollection;
    
    // 언어 통계 처리
    const languages: Record<string, number> = {};
    user.repositories.nodes.forEach((repo: any) => {
      if (repo.languages && repo.languages.edges) {
        repo.languages.edges.forEach((edge: any) => {
          const langName = edge.node.name;
          languages[langName] = (languages[langName] || 0) + 1;
        });
      }
    });
    
    // 스타 수 계산
    let totalStars = 0;
    user.repositories.nodes.forEach((repo: any) => {
      totalStars += repo.stargazerCount || 0;
    });
    
    return {
      stars: totalStars || user.starredRepositories.totalCount || 0,
      commits: contributions.totalCommitContributions || 0,
      prs: contributions.totalPullRequestContributions || 0,
      issues: contributions.totalIssueContributions || 0,
      contributions: contributions.contributionCalendar.totalContributions || 0,
      currentYearCommits: contributions.totalCommitContributions || 0,
      languages: languages,
      avatar_url: user.avatarUrl
    };
  } catch (error) {
    console.error('GitHub GraphQL 통계 가져오기 실패:', error);
    // 오류 시 REST API로 폴백
    return fetchGitHubStats(username);
  }
}

/**
 * 환경에 맞는 적절한 GitHub 통계 가져오기 방식 선택
 */
export async function getGitHubStats(username: string): Promise<GitHubStats> {
  // 서버 측에서 환경 변수를 통해 토큰 사용
  const token = process.env.GITHUB_TOKEN || '';
  
  // 토큰이 있으면 GraphQL, 없으면 REST API 사용
  if (token) {
    return fetchGitHubStatsGraphQL(username, token);
  }
  
  // 기본적으로 REST API 사용
  return fetchGitHubStats(username);
} 