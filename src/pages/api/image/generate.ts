import { NextApiRequest, NextApiResponse } from 'next';
import { ImageService } from '../../../services/image';
import { Profile, GitHubStats } from '../../../types/profile';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '허용되지 않는 메서드입니다.' });
  }

  try {
    const { profile, stats } = req.body as {
      profile: Profile;
      stats: GitHubStats;
    };

    if (!profile || !stats) {
      return res.status(400).json({ message: '프로필과 통계 정보가 필요합니다.' });
    }

    const imageService = ImageService.getInstance();
    const imageUrl = await imageService.generateProfileImage(profile, stats);

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('이미지 생성 실패:', error);
    res.status(500).json({
      message: error instanceof Error ? error.message : '이미지 생성에 실패했습니다.',
    });
  }
} 