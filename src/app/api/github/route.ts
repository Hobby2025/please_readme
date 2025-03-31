import { NextResponse } from 'next/server';
import { getGitHubStats } from '@/utils/github-stats';

/**
 * GitHub API 엔드포인트
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json({ error: '사용자명이 필요합니다.' }, { status: 400 });
    }
    
    // 공통 github-stats 모듈을 사용하여 GitHub 통계 데이터 가져오기
    const githubStats = await getGitHubStats(username);
    
    return NextResponse.json(githubStats);
  } catch (error) {
    console.error('GitHub API 오류:', error);
    return NextResponse.json(
      { error: '통계 데이터를 가져오는 중 오류가 발생했습니다.' }, 
      { status: 500 }
    );
  }
} 