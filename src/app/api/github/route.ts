import { NextResponse } from 'next/server';

// 타입 정의
interface GitHubStats {
  stars: number;
  commits: number;
  prs: number;
  issues: number;
  contributions: number;
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

    // 커밋 수 가져오기
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

    const stats: GitHubStats = {
      stars: starsData.length,
      commits: commitsData.total_count || 0,
      prs: prsData.total_count || 0,
      issues: issuesData.total_count || 0,
      contributions: contributionsData.length,
      languages
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch GitHub stats' }, { status: 500 });
  }
} 