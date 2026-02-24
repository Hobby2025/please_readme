import { NextRequest, NextResponse } from 'next/server';
import { ImageService } from '@/services/image';
import { Profile, GitHubStats } from '@/types/profile';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, stats } = body as {
      profile: Profile;
      stats: GitHubStats;
    };

    if (!profile || !stats) {
      return NextResponse.json({ message: '프로필과 통계 정보가 필요합니다.' }, { status: 400 });
    }

    const imageService = ImageService.getInstance();
    const imageUrl = await imageService.generateProfileImage(profile, stats);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('이미지 생성 실패:', error);
    return NextResponse.json({
      message: error instanceof Error ? error.message : '이미지 생성에 실패했습니다.',
    }, { status: 500 });
  }
}
