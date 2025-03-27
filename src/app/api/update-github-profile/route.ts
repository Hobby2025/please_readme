import { NextResponse } from 'next/server';
import type { GithubApiResponse } from '@/types';

export async function POST(request: Request): Promise<NextResponse<GithubApiResponse>> {
  try {
    const body = await request.json();
    const { username, markdown } = body;

    if (!username || !markdown) {
      return NextResponse.json({
        success: false,
        message: '유효하지 않은 요청 데이터입니다.'
      }, { status: 400 });
    }

    // 이 프로젝트에서는 실제로 GitHub 프로필을 업데이트하지 않습니다.
    // 실제 구현을 위해서는 GitHub OAuth 인증과 API 연동이 필요합니다.
    return NextResponse.json({
      success: false,
      message: '실제 GitHub 프로필 업데이트는 지원되지 않습니다. 마크다운을 복사하여 GitHub 프로필 README에 직접 붙여넣어주세요.'
    }, { status: 501 });
  } catch (error: Error | unknown) {
    console.error('API 오류:', error);
    
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    
    return NextResponse.json({
      success: false,
      message: errorMessage
    }, { status: 500 });
  }
} 