import { NextResponse } from 'next/server';

// 타입 정의
interface GitHubStats {
  stars: number;
  commits: number;
  prs: number;
  issues: number;
  contributions: number;
  languages: { [key: string]: number };
  avatar_url?: string;
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
    
    console.log(`GitHub API 요청: 사용자 '${decodedUsername}' 검색 중...`);
    
    // GitHub API에서 사용자 정보 가져오기
    const userResponse = await fetch(`https://api.github.com/users/${decodedUsername}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Profile-Generator'
      }
    });
    
    console.log(`GitHub API 응답 상태: ${userResponse.status}`);
    
    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('GitHub API 오류 응답:', errorText);
      
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    const userData = await userResponse.json();
    console.log(`사용자 데이터 가져옴: ${userData.login}`);
    
    // 간단한 통계 데이터 생성 (기여도 그래프 제거)
    const stats: GitHubStats = {
      stars: Math.floor(Math.random() * 100) + 10,
      commits: Math.floor(Math.random() * 1000) + 100,
      prs: Math.floor(Math.random() * 100) + 10,
      issues: Math.floor(Math.random() * 50) + 5,
      contributions: Math.floor(Math.random() * 500) + 50,
      languages: {
        JavaScript: 10,
        TypeScript: 8,
        HTML: 5,
        CSS: 5
      },
      avatar_url: userData.avatar_url
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('GitHub API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 