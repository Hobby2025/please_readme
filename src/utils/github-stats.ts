'use client';

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
  
  // 무지개 색상에 맞는 등급별 설정
  const RANKS = [
    { 
      name: 'S', 
      color: '#9400D3', 
      emoji: '🔮',
      mainColor: '#9400D3',
      accentColor: '#8A2BE2',
      headerBg: 'bg-[#8A2BE2]/50',
      highlightColor: '#9400D3'
    },
    { 
      name: 'A+', 
      color: '#4B0082', 
      emoji: '👑',
      mainColor: '#4B0082',
      accentColor: '#483D8B',
      headerBg: 'bg-[#483D8B]/50',
      highlightColor: '#4B0082'
    },
    { 
      name: 'A', 
      color: '#0000FF', 
      emoji: '🌊',
      mainColor: '#0000FF',
      accentColor: '#1E90FF',
      headerBg: 'bg-[#1E90FF]/50',
      highlightColor: '#0000FF'
    },
    { 
      name: 'A-', 
      color: '#00FF00', 
      emoji: '🌿',
      mainColor: '#00FF00',
      accentColor: '#32CD32',
      headerBg: 'bg-[#32CD32]/50',
      highlightColor: '#00FF00'
    },
    { 
      name: 'B+', 
      color: '#FFFF00', 
      emoji: '⭐',
      mainColor: '#FFFF00',
      accentColor: '#FFD700',
      headerBg: 'bg-[#FFD700]/50',
      highlightColor: '#FFFF00'
    },
    { 
      name: 'B', 
      color: '#FFA500', 
      emoji: '🔥',
      mainColor: '#FFA500',
      accentColor: '#FF8C00',
      headerBg: 'bg-[#FF8C00]/50',
      highlightColor: '#FFA500'
    },
    { 
      name: 'B-', 
      color: '#FF4500', 
      emoji: '🚀',
      mainColor: '#FF4500',
      accentColor: '#FF6347',
      headerBg: 'bg-[#FF6347]/50',
      highlightColor: '#FF4500'
    },
    { 
      name: 'C+', 
      color: '#FF0000', 
      emoji: '💫',
      mainColor: '#FF0000',
      accentColor: '#DC143C',
      headerBg: 'bg-[#DC143C]/50',
      highlightColor: '#FF0000'
    },
    { 
      name: 'C', 
      color: '#8B0000', 
      emoji: '✨',
      mainColor: '#8B0000',
      accentColor: '#B22222',
      headerBg: 'bg-[#B22222]/50',
      highlightColor: '#8B0000'
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
      languages: languages // 언어 사용 통계
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
  // GITHUB_TOKEN을 직접 참조
  // @ts-ignore - Vercel 환경 변수 처리
  const token = process.env.GITHUB_TOKEN || '';
  
  if (token) {
    return fetchGitHubStatsGraphQL(username, token);
  }
  
  return fetchGitHubStats(username);
} 