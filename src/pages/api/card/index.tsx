import { NextApiRequest, NextApiResponse } from 'next';
import { GitHubService } from '@/services/github';
import { Profile, GitHubStats, Theme } from '@/types/profile';
import nodeHtmlToImage from 'node-html-to-image';
import { renderToString } from 'react-dom/server';
import ProfileCardStatic from '@/components/ProfileCard/ProfileCardStatic';
import fs from 'fs/promises';
import path from 'path';
import React from 'react';

const CACHE_TTL_SECONDS = 6 * 60 * 60; // 6 hours cache TTL

function isValidTheme(theme: string): theme is Theme {
  return theme === 'light' || theme === 'dark';
}

async function getTailwindCss(): Promise<string> {
  try {
    const cssPath = path.join(process.cwd(), 'src', 'styles', 'globals.css');
    const css = await fs.readFile(cssPath, 'utf-8');
    return `<style>${css}</style>`;
  } catch (error) {
    console.error("Error reading CSS file, using CDN as fallback:", error);
    return '<link href="https://cdn.jsdelivr.net/npm/tailwindcss@^3.0/dist/tailwind.min.css" rel="stylesheet">';
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // API는 GET 요청만 처리
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
      name: customName
    } = req.query;
    
    // username이 필요함
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ message: 'GitHub 사용자명(username)이 필요합니다.' });
    }
    
    // 테마 유효성 검사
    const theme: Theme = (typeof themeParam === 'string' && isValidTheme(themeParam)) 
      ? themeParam 
      : 'light';
    
    console.log(`Processing request for user: ${username}, theme: ${theme}`);
    console.log(`Additional params: name=${customName || 'default'}, bio=${Boolean(customBio)}, bg=${Boolean(customBgUrl)}, skills=${skillsParam || 'none'}`);

    // GitHub 통계 가져오기
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

    // skills 파라미터 처리 - 쉼표로 구분된 문자열을 배열로 변환
    const skills = typeof skillsParam === 'string' && skillsParam.trim() !== '' 
      ? skillsParam.split(',').map(skill => skill.trim())
      : [];

    // 프로필 데이터 준비
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

    // ProfileCardStatic 컴포넌트를 HTML 문자열로 렌더링
    console.log('Rendering ProfileCardStatic to HTML string...');
    const cardElement = (
      <ProfileCardStatic
        profile={profile}
        stats={stats}
        loading={false}
      />
    );
    const profileCardHtml = renderToString(cardElement);
    console.log('ProfileCardStatic rendered to HTML.');

    // Tailwind CSS 가져오기
    const tailwindCss = await getTailwindCss();
    
    // 전체 HTML 문서 준비
    const html = `
      <html>
        <head>
          ${tailwindCss}
          <style>
            body { 
              margin: 0; 
              padding: 0;
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh; 
              background: #eee; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }
            
            /* 컨테이너 스타일링 */
            .card-container {
              width: 500px;
              max-width: 100%;
            }
            
            /* Tailwind의 dark mode가 잘 작동하도록 추가 CSS */
            .dark { color-scheme: dark; }
            
            /* 이미지 관련 추가 CSS */
            img { display: block; max-width: 100%; }
            .opacity-15 { opacity: 0.15; }
            
            /* 배경 오버레이 스타일 */
            .bg-white\\/50 { background-color: rgba(255, 255, 255, 0.5); }
            .dark .bg-gray-900\\/50 { background-color: rgba(17, 24, 39, 0.5); }
            
            /* 스타일 보강: 카드 통계 항목 */
            .bg-white\\/70 { background-color: rgba(255, 255, 255, 0.7); }
            .dark .bg-gray-800\\/60 { background-color: rgba(31, 41, 55, 0.6); }
            
            /* 반응형 그리드 */
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
            .gap-2 { gap: 0.5rem; }
            .gap-3 { gap: 0.75rem; }
            .gap-4 { gap: 1rem; }
            
            /* 테두리와 효과 */
            .border-2 { border-width: 2px; }
            .rounded-lg { border-radius: 0.5rem; }
            .rounded-full { border-radius: 9999px; }
            .overflow-hidden { overflow: hidden; }
            .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
            .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
            .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
            
            /* 포지셔닝 */
            .relative { position: relative; }
            .absolute { position: absolute; }
            .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
            .z-0 { z-index: 0; }
            .z-10 { z-index: 10; }
            
            /* 레이아웃 */
            .flex { display: flex; }
            .flex-row { flex-direction: row; }
            .flex-col { flex-direction: column; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
            .justify-end { justify-content: flex-end; }
            
            /* 여백 */
            .p-2 { padding: 0.5rem; }
            .p-3 { padding: 0.75rem; }
            .p-6 { padding: 1.5rem; }
            .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
            .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
            .m-0 { margin: 0; }
            .mt-2 { margin-top: 0.5rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mt-4 { margin-top: 1rem; }
            .mt-6 { margin-top: 1.5rem; }
            .mr-2 { margin-right: 0.5rem; }
            .gap-4 { gap: 1rem; }
            
            /* 타이포그래피 */
            .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
            .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
            .text-2xl { font-size: 1.5rem; line-height: 2rem; }
            .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .font-medium { font-weight: 500; }
            .text-center { text-align: center; }
            
            /* 색상 (기본 색상만 정의, 나머지는 내부 스타일로) */
            .text-white { color: white; }
            .text-gray-900 { color: #111827; }
            .text-gray-800 { color: #1f2937; }
            .text-gray-600 { color: #4b5563; }
            .text-gray-500 { color: #6b7280; }
            .text-gray-400 { color: #9ca3af; }
            .text-gray-300 { color: #d1d5db; }
            .dark .text-white { color: white; }
            .dark .text-gray-200 { color: #e5e7eb; }
            .dark .text-gray-300 { color: #d1d5db; }
            .dark .text-gray-400 { color: #9ca3af; }
            
            .bg-white { background-color: white; }
            .dark .bg-gray-800 { background-color: #1f2937; }
            
            /* 랭크별 색상 */
            .text-purple-600 { color: #7c3aed; }
            .dark .text-purple-400 { color: #a78bfa; }
            .text-blue-600 { color: #2563eb; }
            .dark .text-blue-400 { color: #60a5fa; }
            .text-blue-500 { color: #3b82f6; }
            .dark .text-blue-300 { color: #93c5fd; }
            .text-sky-500 { color: #0ea5e9; }
            .dark .text-sky-300 { color: #7dd3fc; }
            .text-green-500 { color: #10b981; }
            .dark .text-green-400 { color: #4ade80; }
            .text-green-400 { color: #4ade80; }
            .dark .text-green-300 { color: #86efac; }
            .text-lime-500 { color: #84cc16; }
            .dark .text-lime-300 { color: #bef264; }
            .text-yellow-500 { color: #eab308; }
            .dark .text-yellow-300 { color: #fde047; }
            .text-yellow-400 { color: #facc15; }
            .dark .text-yellow-200 { color: #fef08a; }
            
            /* 테두리 색상 */
            .border-purple-500 { border-color: #7c3aed; }
            .dark .border-purple-400 { border-color: #a78bfa; }
            .border-blue-500 { border-color: #3b82f6; }
            .dark .border-blue-400 { border-color: #60a5fa; }
            .border-blue-400 { border-color: #60a5fa; }
            .dark .border-blue-300 { border-color: #93c5fd; }
            .border-sky-400 { border-color: #38bdf8; }
            .dark .border-sky-300 { border-color: #7dd3fc; }
            .border-green-500 { border-color: #10b981; }
            .dark .border-green-400 { border-color: #4ade80; }
            .border-green-400 { border-color: #4ade80; }
            .dark .border-green-300 { border-color: #86efac; }
            .border-lime-400 { border-color: #a3e635; }
            .dark .border-lime-300 { border-color: #bef264; }
            .border-yellow-400 { border-color: #facc15; }
            .dark .border-yellow-300 { border-color: #fde047; }
            .border-yellow-300 { border-color: #fde047; }
            .dark .border-yellow-200 { border-color: #fef08a; }
            .border-gray-200 { border-color: #e5e7eb; }
            .dark .border-gray-700 { border-color: #374151; }
            
            /* 그라데이션 바 */
            .h-px { height: 1px; }
            .my-4 { margin-top: 1rem; margin-bottom: 1rem; }
            .my-6 { margin-top: 1.5rem; margin-bottom: 1.5rem; }
            .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
            .from-transparent { --tw-gradient-from: transparent; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(0, 0, 0, 0)); }
            .via-gray-400 { --tw-gradient-stops: var(--tw-gradient-from), #9ca3af, var(--tw-gradient-to, rgba(156, 163, 175, 0)); }
            .dark .via-gray-500 { --tw-gradient-stops: var(--tw-gradient-from), #6b7280, var(--tw-gradient-to, rgba(107, 114, 128, 0)); }
            .to-transparent { --tw-gradient-to: transparent; }
            
            /* 배경 그라데이션 */
            .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
            .from-purple-50 { --tw-gradient-from: #f5f3ff; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(245, 243, 255, 0)); }
            .to-purple-100 { --tw-gradient-to: #ede9fe; }
            .dark .from-purple-900\\/30 { --tw-gradient-from: rgba(76, 29, 149, 0.3); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(76, 29, 149, 0)); }
            .dark .to-purple-800\\/20 { --tw-gradient-to: rgba(91, 33, 182, 0.2); }
            
            /* 크기 조정 */
            .min-h-\\[600px\\] { min-height: 600px; }
            .min-w-\\[500px\\] { min-width: 500px; }
            .w-full { width: 100%; }
            .h-full { height: 100%; }
            .w-20 { width: 5rem; }
            .h-20 { height: 5rem; }
            .w-3\\/4 { width: 75%; }
            .w-1\\/2 { width: 50%; }
            .w-16 { width: 4rem; }
            
            /* 인라인 블록 */
            .inline-block { display: inline-block; }
          </style>
        </head>
        <body class="${theme === 'dark' ? 'dark' : ''}">
          <div class="card-container">
            ${profileCardHtml}
          </div>
        </body>
      </html>
    `;

    // 디버깅용 HTML 직접 반환 (이미지 제작 문제 해결을 위해 잠시 활성화)
    // res.setHeader('Content-Type', 'text/html');
    // return res.status(200).send(html);

    // 이미지 생성
    console.log('Generating image with node-html-to-image...');
    const imageBuffer = await nodeHtmlToImage({
      html: html,
      puppeteerArgs: {
        defaultViewport: {
          width: 550,  // 카드 컨테이너에 여백 추가
          height: 750  // 높이 조정
        },
        args: ['--no-sandbox']
      },
      selector: '.card-container', // 특정 요소만 캡처
      waitUntil: 'networkidle0', // 모든 리소스 로드 대기
      quality: 95 // 이미지 품질 향상
    }) as Buffer;
    console.log('Image generated successfully.');

    // 이미지 응답 반환 (캐시 설정 포함)
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${CACHE_TTL_SECONDS}`);
    res.status(200).send(imageBuffer);

  } catch (error: any) {
    console.error('Error in API route:', error);
    res.status(500).json({ 
      message: `Internal Server Error: ${error.message || 'Unknown error'}` 
    });
  }
} 