import { NextResponse } from 'next/server';
import { getGitHubStats } from '@/utils/github-stats';

/**
 * GitHub API 엔드포인트
 * 이 API는 클라이언트에서 GitHub 데이터에 안전하게 접근하기 위한 프록시 역할을 합니다.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json({ error: '사용자명이 필요합니다.' }, { status: 400 });
    }
    
    // 환경 변수 존재 여부 확인 (로그만 남기고 실행은 계속)
    if (!process.env.GITHUB_TOKEN) {
      console.warn('GitHub 토큰이 설정되지 않았습니다. API 요청 제한이 적용될 수 있습니다.');
    }
    
    try {
      // GitHub 통계 데이터 가져오기
      const githubStats = await getGitHubStats(username);
      
      // 캐시 헤더 설정 (10분)
      return NextResponse.json(githubStats, {
        headers: {
          'Cache-Control': 'public, max-age=600, s-maxage=600, stale-while-revalidate=300'
        }
      });
    } catch (statsError) {
      console.error('GitHub 통계 데이터 가져오기 오류:', statsError);
      
      // 구체적인 오류 메시지 처리
      const errorMessage = statsError instanceof Error ? statsError.message : '알 수 없는 오류';
      
      // GitHub API 오류에 따라 적절한 상태 코드 반환
      if (errorMessage.includes('요청 제한')) {
        return NextResponse.json({ error: errorMessage }, { status: 429 }); // Too Many Requests
      } else if (errorMessage.includes('찾을 수 없습니다')) {
        return NextResponse.json({ error: errorMessage }, { status: 404 }); // Not Found
      } else {
        return NextResponse.json({ error: errorMessage }, { status: 500 }); // Internal Server Error
      }
    }
  } catch (error) {
    console.error('GitHub API 처리 오류:', error);
    return NextResponse.json(
      { error: '요청을 처리하는 중 오류가 발생했습니다.' }, 
      { status: 500 }
    );
  }
} 