import { NextApiRequest, NextApiResponse } from 'next';
import { GitHubService } from '@/services/github';
import { Profile, GitHubStats, Theme } from '@/types/profile';
import { ImageResponse } from '@vercel/og';
import ProfileCardStatic from '@/components/ProfileCard/ProfileCardStatic';
import fs from 'fs/promises';
import path from 'path';
import React from 'react';
import { optimizeImage, getImageUrl } from '@/utils/imageUtils';
import { getCachedData, setCachedData, deleteCachedData } from '@/utils/cache';

// 캐시 TTL 설정
const CACHE_TTL_SECONDS = 6 * 60 * 60; // 6 hours cache TTL

function isValidTheme(theme: string): theme is Theme {
  return theme === 'light' || theme === 'dark';
}

// 로컬 폰트 데이터 로드 함수 (BookkMyungjo TTF 사용)
async function getFontData(): Promise<{ name: string; data: Buffer; weight: number; style: 'normal' | 'italic' }[]> {
  const fontDirectory = path.join(process.cwd(), 'public', 'fonts');

  const fontFiles = [
    { file: 'BookkMyungjo_Light.ttf', weight: 300 }, // Light weight
    { file: 'BookkMyungjo_Bold.ttf', weight: 700 },  // Bold weight
  ];

  const fontDataPromises = fontFiles.map(async ({ file, weight }) => {
    try {
      const filePath = path.join(fontDirectory, file);
      const data = await fs.readFile(filePath);
      return { name: 'BookkMyungjo', data: data, weight, style: 'normal' as 'normal' | 'italic' };
    } catch (error) {
      console.error(`Error loading font ${file}:`, error);
      return null; // 오류 발생 시 null 반환
    }
  });

  const settledFontData = await Promise.all(fontDataPromises);
  
  const validFontData = settledFontData.filter(data => data !== null) as { name: string; data: Buffer; weight: number; style: 'normal' | 'italic' }[];
  
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
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '허용되지 않는 메서드입니다.' });
  }

  try {
    const { 
      username, 
      theme: themeParam, 
      bg: customBgUrl, 
      bio: customBio, 
      skills: skillsParam,
      name: customName,
      opacity: opacityParam,
      nocache
    } = req.query;
    
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ message: 'GitHub 사용자명(username)이 필요합니다.' });
    }
    
    const theme: Theme = (typeof themeParam === 'string' && isValidTheme(themeParam)) 
      ? themeParam 
      : 'light';
    
    // 캐싱을 위한 키 생성 (모든 파라미터 포함)
    const cacheKey = `card:${username}:${theme}:${customBgUrl || ''}:${customBio || ''}:${skillsParam || ''}:${customName || ''}:${opacityParam || ''}`;
    
    // nocache 파라미터가 있으면 캐시 강제 삭제
    if (nocache) {
      console.log(`[카드 API] 캐시 강제 삭제: ${cacheKey}`);
      await deleteCachedData(cacheKey);
      
      // GitHub 통계 캐시도 삭제
      const statsKey = `github:stats:${username}`;
      await deleteCachedData(statsKey);
    }
    
    // 캐시 확인
    const cachedCard = await getCachedData<Buffer>(cacheKey);
    if (cachedCard) {
      // 캐시된 이미지가 있으면 Content-Type 설정하고 반환
      console.log(`[카드 API] 캐시 사용: ${cacheKey}`);
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', `public, max-age=${CACHE_TTL_SECONDS}`);
      return res.status(200).send(Buffer.from(cachedCard));
    }
    
    // 병렬로 처리할 수 있는 작업 동시 실행
    const [stats, fonts] = await Promise.all([
      GitHubService.getInstance().getUserStats(username),
      getFontData()
    ]);
    
    // 아바타 이미지와 배경 이미지를 병렬로 처리
    const [optimizedAvatar, optimizedBgImage] = await Promise.all([
      stats.avatarUrl ? optimizeImage(stats.avatarUrl) : null,
      customBgUrl && typeof customBgUrl === 'string' ? optimizeImage(customBgUrl) : null
    ]);
    
    // 최적화된 아바타 적용
    if (optimizedAvatar) {
      stats.avatarUrl = optimizedAvatar;
    }
    
    // 배경 이미지 처리 결과 로깅
    if (customBgUrl) {
      if (optimizedBgImage) {
        console.log(`배경 이미지 처리 성공: ${typeof customBgUrl === 'string' ? customBgUrl : 'unknown'}`);
      } else {
        console.log(`배경 이미지 처리 실패: ${typeof customBgUrl === 'string' ? customBgUrl : 'unknown'}`);
      }
    }
    
    // 스킬 배열 파싱
    const skills = skillsParam && typeof skillsParam === 'string'
      ? skillsParam.split(',').map(skill => skill.trim()).filter(Boolean)
      : [];
    
    // 배경 불투명도 파싱
    const opacity = opacityParam && typeof opacityParam === 'string'
      ? parseFloat(opacityParam)
      : 0.1;
    
    // 프로필 객체 구성
    const profile: Profile = {
      githubUsername: username,
      name: customName && typeof customName === 'string' ? customName : undefined,
      bio: customBio && typeof customBio === 'string' ? customBio : undefined,
      skills,
      theme,
      backgroundImageUrl: optimizedBgImage || undefined,
      backgroundOpacity: opacity,
    };
    
    // 이미지 생성에 필요한 옵션
    const options = {
      width: 1200,
      height: 800,
      fonts: fonts.map(font => ({
        name: font.name,
        data: font.data,
        weight: font.weight as (100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900),
        style: font.style as ('normal' | 'italic'),
      })),
    };
    
    // 이미지 응답 생성
    const imageResponse = new ImageResponse(
      (
        <ProfileCardStatic
          profile={profile}
          stats={stats}
          loading={false}
          currentYear={new Date().getFullYear()}
        />
      ),
      options
    );
    
    // 이미지 버퍼 얻기
    const imgBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imgBuffer);
    
    // 캐시에 저장
    await setCachedData(cacheKey, buffer, CACHE_TTL_SECONDS);
    
    // 응답 헤더 설정
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', `public, max-age=${CACHE_TTL_SECONDS}`);
    return res.status(200).send(buffer);
    
  } catch (error) {
    console.error('카드 생성 실패:', error);
    return res.status(500).json({ 
      message: '카드 생성에 실패했습니다.', 
      error: error instanceof Error ? error.message : '알 수 없는 오류' 
    });
  }
} 