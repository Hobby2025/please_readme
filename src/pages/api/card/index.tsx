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

// 이미지 URL을 Base64로 변환하는 함수
async function getImageAsBase64(url: string): Promise<string | null> {
  try {
    console.log(`이미지 가져오기 시작: ${url}`);
    
    // URL이 이미 base64 데이터인 경우 그대로 반환
    if (url.startsWith('data:')) {
      console.log('이미 Base64 형식의 URL입니다.');
      return url;
    }
    
    // 직접 요청 - Node.js 서버 환경에서는 CORS 제한이 없음
    console.log(`직접 이미지 URL 요청: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // 이미지 크기가 너무 큰 경우 JPEG 또는 webp로 변환
    let base64 = buffer.toString('base64');
    
    // 이미지가 100KB를 초과하면 경고 메시지 출력
    if (base64.length > 100 * 1024) {
      console.warn(`이미지 크기가 커서 @vercel/og에서 문제가 발생할 수 있습니다: ${Math.round(base64.length/1024)}KB`);
      console.warn('배경이 적용되지 않으면 더 작은 이미지를 사용하세요 (100KB 미만 권장)');
    }
    
    console.log(`이미지 변환 완료: ${contentType}, 크기: ${buffer.length} 바이트`);
    console.log(`변환된 Base64 문자열 길이: ${base64.length}`);
    
    // 최종 데이터 URL 생성
    const dataUrl = `data:${contentType};base64,${base64}`;
    console.log(`최종 Data URL 길이: ${dataUrl.length}, 시작: ${dataUrl.substring(0, 30)}...`);
    
    return dataUrl;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
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
      return { name: 'BookkMyungjo', data: data, weight, style: 'normal' as 'normal' | 'italic' }; // 폰트 이름 변경
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
      name: customName,
      opacity: opacityParam
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
      
      // 아바타 URL을 Base64로 변환
      if (stats.avatarUrl) {
        try {
          const base64Avatar = await getImageAsBase64(stats.avatarUrl);
          if (base64Avatar) {
            stats.avatarUrl = base64Avatar;
            console.log('Avatar image converted to base64 successfully');
          } else {
            console.error('Failed to convert avatar image to base64');
          }
        } catch (avatarError) {
          console.error('Error converting avatar to base64:', avatarError);
        }
      }
      
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

    // 배경 이미지 처리
    let backgroundImageUrl: string | undefined = undefined;
    if (customBgUrl && typeof customBgUrl === 'string') {
      console.log('처리할 배경 이미지 URL:', customBgUrl);
      // 이미지 URL을 Base64로 변환
      const base64Image = await getImageAsBase64(customBgUrl);
      backgroundImageUrl = base64Image || undefined;
      console.log(`Background image processed: ${base64Image ? 'success' : 'failed'}`);
      if (base64Image) {
        console.log('Base64 이미지 시작 부분:', base64Image.substring(0, 50) + '...');
        
        // base64 이미지가 너무 크면 @vercel/og에서 처리에 문제가 있을 수 있으므로 경고
        if (base64Image.length > 1024 * 1024) { // 1MB 이상인 경우
          console.warn(`경고: 배경 이미지가 매우 큽니다 (${Math.round(base64Image.length / 1024)}KB). @vercel/og에서 처리하지 못할 수 있습니다.`);
          console.warn('작은 이미지를 대신 사용합니다.');
          
          // 기본 그라데이션 배경을 사용 (이미지가 매우 클 경우)
          backgroundImageUrl = undefined;
        }
      }
    } else {
      console.log('배경 이미지 URL이 제공되지 않았습니다.');
    }

    // 투명도 값 처리 (기본값: 0.5)
    let opacity = 0.5;
    if (opacityParam && typeof opacityParam === 'string') {
      const parsedOpacity = parseFloat(opacityParam);
      if (!isNaN(parsedOpacity) && parsedOpacity >= 0 && parsedOpacity <= 1) {
        opacity = parsedOpacity;
        console.log(`배경 이미지 투명도 설정: ${opacity}`);
      } else {
        console.warn(`올바르지 않은 투명도 값: ${opacityParam}, 기본값 0.5 사용`);
      }
    }

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
        backgroundImageUrl: backgroundImageUrl,
        backgroundOpacity: opacity, // 투명도 값 추가
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
    console.log('배경 이미지 설정 여부:', Boolean(profile.backgroundImageUrl));
    const imageResponse = new ImageResponse(
      (
        <ProfileCardStatic
          profile={profile}
          stats={stats}
          loading={false}
        />
      ),
      {
        width: 600,
        height: 800,
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