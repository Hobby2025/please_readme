import { NextApiRequest, NextApiResponse } from 'next';
import { GitHubService } from '@/services/github';
import { Profile, GitHubStats, Theme } from '@/types/profile';
import { ImageResponse } from '@vercel/og';
import ProfileCardStatic from '@/components/ProfileCard/ProfileCardStatic';
import React from 'react';

const CACHE_TTL_SECONDS = 6 * 60 * 60; // 6 hours cache TTL

function isValidTheme(theme: string): theme is Theme {
  return theme === 'light' || theme === 'dark';
}

// 폰트 데이터 로드 함수 (예: Noto Sans KR)
async function getFontData(): Promise<{ name: string; data: ArrayBuffer; weight: number; style: string }[]> {
  const fontRegularUrl = 'https://fonts.gstatic.com/s/notosanskr/v27/pdcS_xqap1mcErQ7Hfk_kD1MWlg.woff2'; // Regular 400
  const fontMediumUrl = 'https://fonts.gstatic.com/s/notosanskr/v27/pdCv_xqap1mcErQ7Hfk_kDBq5dU.woff2'; // Medium 500
  const fontBoldUrl = 'https://fonts.gstatic.com/s/notosanskr/v27/pdCw_xqap1mcErQ7Hfk_kDWu8IE.woff2'; // Bold 700

  const [regular, medium, bold] = await Promise.all([
    fetch(fontRegularUrl).then((res) => res.arrayBuffer()),
    fetch(fontMediumUrl).then((res) => res.arrayBuffer()),
    fetch(fontBoldUrl).then((res) => res.arrayBuffer()),
  ]);

  return [
    { name: 'Noto Sans KR', data: regular, weight: 400, style: 'normal' },
    { name: 'Noto Sans KR', data: medium, weight: 500, style: 'normal' },
    { name: 'Noto Sans KR', data: bold, weight: 700, style: 'normal' },
  ];
}

// API 핸들러 런타임 설정 (Edge 권장)
export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET 요청만 처리 (Edge에서는 req.method 직접 사용)
  // if (req.method !== 'GET') { ... } // (Edge 런타임에서는 req 객체 구조가 다를 수 있어 제거)

  // URL 객체를 사용하여 쿼리 파라미터 추출 (Edge 런타임 방식)
  const { searchParams } = new URL(req.url!, `http://${req.headers.host}`);

  try {
    const username = searchParams.get('username');
    const themeParam = searchParams.get('theme');
    const customBgUrl = searchParams.get('bg');
    const customBio = searchParams.get('bio');
    const skillsParam = searchParams.get('skills');
    const customName = searchParams.get('name');
    
    if (!username || typeof username !== 'string') {
      return new Response(JSON.stringify({ message: 'GitHub 사용자명(username)이 필요합니다.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
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
      return new Response(JSON.stringify({ 
        message: `GitHub 통계를 가져오는데 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` 
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
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

    // 폰트 데이터 로드
    const fontData = await getFontData();

    // ImageResponse를 사용하여 이미지 생성
    console.log('Generating image with @vercel/og...');
    return new ImageResponse(
      (
        // ProfileCardStatic 컴포넌트를 직접 사용 (스타일 호환성 확인 필요)
        // Tailwind 클래스 대신 인라인 스타일 또는 tw 속성 사용 권장
        <ProfileCardStatic
          profile={profile}
          stats={stats}
          loading={false} // API에서는 항상 false
          // 폰트 스타일 적용 필요 시 컴포넌트 내에서 처리
        />
      ),
      {
        width: 500, // 이미지 너비
        height: 280, // 이미지 높이 (카드 디자인에 맞게 조정)
        fonts: fontData.map(font => ({
          name: font.name,
          data: font.data,
          weight: font.weight as (100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900),
          style: font.style as ('normal' | 'italic'),
        })),
        // debug: true, // 디버깅 필요 시
        headers: {
          'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=3600`,
        }
      }
    );

  } catch (error) {
    console.error('Error generating profile card image:', error);
    return new Response(JSON.stringify({ message: `이미지 생성 중 오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
} 