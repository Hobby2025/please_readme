import { NextRequest, NextResponse } from 'next/server';
import { GitHubService } from '@/services/github';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username || typeof username !== 'string') {
    return NextResponse.json({
      message: 'username이 필요합니다.',
    }, { status: 400 });
  }

  try {
    const githubService = GitHubService.getInstance();
    const stats = await githubService.getUserStats(username);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('GitHub 통계 조회 실패:', error);
    return NextResponse.json({
      message: 'GitHub 통계를 가져오는데 실패했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    }, { status: 500 });
  }
}
