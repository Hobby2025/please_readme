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
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    // 사용자 정보 가져오기
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!userResponse.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 스타 수 가져오기
    const starsResponse = await fetch(`https://api.github.com/users/${username}/starred`);
    const starsData = await starsResponse.json();

    // 현재 연도 계산
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1).toISOString().split('T')[0];
    
    // 올해 커밋 수 가져오기
    const yearCommitsResponse = await fetch(`https://api.github.com/search/commits?q=author:${username}+committer-date:>=${startOfYear}`);
    const yearCommitsData = await yearCommitsResponse.json();

    // 전체 커밋 수 가져오기
    const commitsResponse = await fetch(`https://api.github.com/search/commits?q=author:${username}`);
    const commitsData = await commitsResponse.json();

    // PR 수 가져오기
    const prsResponse = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr`);
    const prsData = await prsResponse.json();

    // 이슈 수 가져오기
    const issuesResponse = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:issue`);
    const issuesData = await issuesResponse.json();

    // 기여도 가져오기 (최근 1년)
    const contributionsResponse = await fetch(`https://api.github.com/users/${username}/events`);
    const contributionsData = await contributionsResponse.json();

    // 사용 언어 통계 가져오기
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
    const reposData = await reposResponse.json();

    const languages: { [key: string]: number } = {};
    for (const repo of reposData) {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    }

    // API에서 가져온 값을 사용하거나, 데이터가 없으면 적절한 기본값 설정
    const commits = commitsData.total_count || 0;
    const yearCommits = yearCommitsData.total_count || 0;
    const contributions = contributionsData.length || 0;

    const stats: GitHubStats = {
      stars: starsData.length || 0,
      commits: commits,
      prs: prsData.total_count || 0,
      issues: issuesData.total_count || 0,
      contributions: contributions,
      currentYearCommits: yearCommits,
      languages
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('GitHub API Error:', error);
    
    // 에러 발생 시 데이터를 0으로 설정 (랜덤 값 대신)
    const fallbackStats: GitHubStats = {
      stars: 0,
      commits: 0,
      prs: 0,
      issues: 0,
      contributions: 0,
      currentYearCommits: 0,
      languages: {}
    };
    
    return NextResponse.json(fallbackStats);
  }
} 