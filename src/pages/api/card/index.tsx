import { NextApiRequest, NextApiResponse } from 'next';
import { GitHubService } from '@/services/github';
import { Profile, GitHubStats, Theme } from '@/types/profile';
import { ImageResponse } from '@vercel/og';
import ProfileCardStatic from '@/components/ProfileCard/ProfileCardStatic';
import fs from 'fs/promises';
import path from 'path';
import React from 'react';

const CACHE_TTL_SECONDS = 6 * 60 * 60; // 6 hours cache TTL

function isValidTheme(theme: string): theme is Theme {
  return theme === 'light' || theme === 'dark';
}

// 로컬 폰트 데이터 로드 함수 (Pretendard 사용)
async function getFontData(): Promise<{ name: string; data: ArrayBuffer; weight: number; style: 'normal' | 'italic' }[]> {
  const fontDirectory = path.join(process.cwd(), 'public', 'fonts');

  const fontFiles = [
    { file: 'Pretendard-Regular.woff2', weight: 400 },
    { file: 'Pretendard-Medium.woff2', weight: 500 },
    { file: 'Pretendard-Bold.woff2', weight: 700 },
    // 필요하다면 ExtraBold 등 다른 weight 추가
    // { file: 'Pretendard-ExtraBold.woff2', weight: 800 }, 
  ];

  const fontDataPromises = fontFiles.map(async ({ file, weight }) => {
    try {
      const filePath = path.join(fontDirectory, file);
      const data = await fs.readFile(filePath);
      return { name: 'Pretendard', data: data.buffer, weight, style: 'normal' as 'normal' | 'italic' };
    } catch (error) {
      console.error(`Error loading font ${file}:`, error);
      return null; // 오류 발생 시 null 반환
    }
  });

  const settledFontData = await Promise.all(fontDataPromises);
  
  const validFontData = settledFontData.filter(data => data !== null) as { name: string; data: ArrayBuffer; weight: number; style: 'normal' | 'italic' }[];
  
  if (validFontData.length === 0) {
     console.error('Failed to load any local fonts.');
     return [];
  }
  
  return validFontData;
}

// Edge 런타임 설정 제거
// export const config = {
//   runtime: 'edge',
// };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Node.js 런타임 방식으로 GET 메서드 확인 복원
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '허용되지 않는 메서드입니다.' });
  }

  try {
    // req.query 사용 복원 (Node.js 런타임)
    const { 
      username, 
      theme: themeParam, 
      bg: customBgUrl, 
      bio: customBio, 
      skills: skillsParam,
      name: customName
    } = req.query;
    
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ message: 'GitHub 사용자명(username)이 필요합니다.' });
    }
    
    const theme: Theme = (typeof themeParam === 'string' && isValidTheme(themeParam)) 
      ? themeParam 
      : 'light';
    
    console.log(`Processing request for user: ${username}, theme: ${theme}`);
    console.log(`Additional params: name=${customName || 'default'}, bio=${Boolean(customBio)}, bg=${Boolean(customBgUrl)}, skills=${skillsParam || 'none'}`);

    let stats: GitHubStats | null = null;
    try {
      console.log(`Fetching GitHub stats for ${username}...`);
      stats = await GitHubService.getInstance().getUserStats(username);
      console.log(`Successfully fetched stats for ${username}`);
    } catch (error) {
      console.error(`Error fetching GitHub stats for ${username}:`, error);
      return res.status(500).json({ 
        message: `GitHub 통계를 가져오는데 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` 
      });
    }

    const skills = typeof skillsParam === 'string' && skillsParam.trim() !== '' 
      ? skillsParam.split(',').map(skill => skill.trim())
      : [];

    const profile: Profile = {
        githubUsername: username,
        name: (typeof customName === 'string' && customName.trim() !== '') 
          ? customName 
          : (stats?.name || username),
        bio: (typeof customBio === 'string' && customBio.trim() !== '') 
          ? customBio 
          : (stats?.bio || 'Bio not available.'),
        skills: skills,
        theme: theme,
        backgroundImageUrl: customBgUrl && typeof customBgUrl === 'string' ? customBgUrl : undefined,
    };
    console.log('Prepared profile data:', { 
      username, 
      name: profile.name,
      skillsCount: skills.length,
      skillsList: skills.join(', '), 
      bio: customBio || 'default',
      bg: customBgUrl || 'none'
    });

    const fontData = await getFontData();
    
    // 모든 필수 폰트 로딩 실패 시 에러 응답
    if (fontData.length === 0) {
      return res.status(500).json({ message: '이미지 생성에 필요한 폰트를 로드할 수 없습니다.' });
    }

    // ImageResponse 생성 및 응답 처리 (Node.js 런타임)
    console.log('Generating image with @vercel/og...');
    const imageResponse = new ImageResponse(
      (
        <ProfileCardStatic
          profile={profile}
          stats={stats}
          loading={false}
        />
      ),
      {
        width: 500,
        height: 280,
        fonts: fontData.map(font => ({
          name: font.name,
          data: font.data,
          weight: font.weight as (100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900),
          style: font.style as ('normal' | 'italic'),
        })),
      }
    );

    // 응답 헤더 설정
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', `public, max-age=${CACHE_TTL_SECONDS}, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=3600`);

    // 생성된 이미지 스트림을 응답으로 전송
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    return res.status(200).send(imageBuffer);

  } catch (error) {
    console.error('Error generating profile card image:', error);
    return res.status(500).json({ message: `이미지 생성 중 오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}` });
  }
} 