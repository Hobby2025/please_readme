import { NextApiRequest, NextApiResponse } from 'next';
import { GitHubService } from '@/services/github';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '허용되지 않는 메서드입니다.' });
  }

  const { username } = req.query;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({
      message: 'username이 필요합니다.',
    });
  }

  try {
    const githubService = GitHubService.getInstance();
    const stats = await githubService.getUserStats(username);
    res.status(200).json(stats);
  } catch (error) {
    console.error('GitHub 통계 조회 실패:', error);
    res.status(500).json({
      message: 'GitHub 통계를 가져오는데 실패했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    });
  }
} 