import { NextResponse } from 'next/server';

// 타입 정의
interface GitHubStats {
  stars: number;
  commits: number;
  prs: number;
  issues: number;
  contributions: number;
  currentYearCommits: number;
  languages: { [key: string]: number };
  avatar_url?: string;
}

// GitHub GraphQL API를 통해 사용자 정보 및 통계 데이터 가져오기
export async function fetchGitHubUserData(username: string): Promise<GitHubStats> {
  try {
    // GraphQL 요청을 사용하여 모든 필요한 데이터를 한 번에 가져옴
    const currentYear = new Date().getFullYear();

    const query = `
      query($username: String!) {
        user(login: $username) {
          avatarUrl
          contributionsCollection {
            totalCommitContributions
            restrictedContributionsCount
          }
          repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
            totalCount
            nodes {
              stargazers {
                totalCount
              }
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                  }
                }
              }
            }
          }
          pullRequests {
            totalCount
          }
          issues {
            totalCount
          }
          currentYearContributions: contributionsCollection(from: "${currentYear}-01-01T00:00:00Z") {
            totalCommitContributions
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('GitHub API 응답 오류:', errorData);
      throw new Error(`GitHub API 요청 실패: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // 응답 구조에 대한 오류 처리
    if (data.errors) {
      console.error('GraphQL 오류:', data.errors);
      throw new Error(`GraphQL 오류: ${data.errors[0].message}`);
    }

    if (!data.data?.user) {
      throw new Error(`사용자 '${username}'를 찾을 수 없습니다`);
    }

    const user = data.data.user;
    
    // 언어 사용 통계 집계
    const languageCounts: Record<string, number> = {};
    user.repositories.nodes.forEach((repo: any) => {
      if (repo.languages?.edges) {
        repo.languages.edges.forEach((edge: any) => {
          const langName = edge.node.name;
          if (!languageCounts[langName]) {
            languageCounts[langName] = 0;
          }
          languageCounts[langName]++;
        });
      }
    });

    // 스타 수 집계
    const totalStars = user.repositories.nodes.reduce((sum: number, repo: any) => 
      sum + repo.stargazers.totalCount, 0);
    
    // 현재 연도 커밋 데이터 추출
    const currentYearContributions = user.currentYearContributions?.totalCommitContributions;
    
    // currentYearContributions가 존재하고 숫자인지 확인
    const currentYearCommits = typeof currentYearContributions === 'number' 
      ? currentYearContributions 
      : 0;

    return {
      stars: totalStars,
      commits: user.contributionsCollection.totalCommitContributions + 
              user.contributionsCollection.restrictedContributionsCount,
      prs: user.pullRequests.totalCount,
      issues: user.issues.totalCount,
      contributions: user.contributionsCollection.totalCommitContributions,
      currentYearCommits,
      languages: languageCounts,
      avatar_url: user.avatarUrl,
    };
  } catch (error) {
    console.error('GitHub 데이터 가져오기 오류:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    // URL에서 username 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json(
        { error: '사용자명이 필요합니다.' },
        { status: 400 }
      );
    }
    
    // URL 디코딩 및 공백 제거
    const decodedUsername = decodeURIComponent(username).trim();
    
    if (!decodedUsername) {
      return NextResponse.json(
        { error: '사용자명이 필요합니다.' },
        { status: 400 }
      );
    }
    
    console.log(`GitHub API 요청: 사용자 '${decodedUsername}' 통계 가져오는 중...`);
    
    // GitHub API를 통해 사용자 데이터 가져오기
    const stats = await fetchGitHubUserData(decodedUsername);
    
    // GitHub Token이 없는 경우 REST API로 폴백
    if (!process.env.GITHUB_TOKEN) {
      console.warn('GitHub Token이 없어 기본 통계 데이터를 사용합니다.');
      // 기본 REST API로 대체 로직
      const userResponse = await fetch(`https://api.github.com/users/${decodedUsername}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Profile-Generator'
        }
      });
      
      if (!userResponse.ok) {
        return NextResponse.json(
          { error: '사용자를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      
      const userData = await userResponse.json();
      
      // 기본 통계 데이터 생성
      return NextResponse.json({
        stars: 0,
        commits: 0,
        prs: 0,
        issues: 0,
        contributions: 0,
        currentYearCommits: 0,
        languages: {},
        avatar_url: userData.avatar_url
      });
    }
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('GitHub API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 