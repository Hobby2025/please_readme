import { NextRequest, NextResponse } from 'next/server';
import { GitHubService } from '@/services/github';
import { Profile } from '@/types';
import { ImageResponse } from '@vercel/og';
import ProfileCardStatic from '@/components/ProfileCard/ProfileCardStatic';
import { getFontData, VercelFontOptions } from '@/utils/fontUtils';
import { getCachedData, setCachedData, deleteCachedData } from '@/utils/cache';

const CACHE_TTL_SECONDS = 4 * 60 * 60; // 4 hours

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username') || 'UNKNOWN';
    const nocache = searchParams.get('nocache') === 'true';

    if (username === 'UNKNOWN') {
      return NextResponse.json({ message: 'GitHub 사용자명(username)이 필요합니다.' }, { status: 400 });
    }
    
    // 가장 단순한 캐시키
    const cacheKey = `card:v5:${username}`;
    const safeETag = Buffer.from(cacheKey).toString('base64');
    
    if (nocache) {
      await deleteCachedData(cacheKey);
      await deleteCachedData(`github:stats:${username}`);
    }
    
    const cachedCard = await getCachedData<Buffer>(cacheKey);
    if (cachedCard && !nocache) {
      const response = new NextResponse(Buffer.from(cachedCard));
      response.headers.set('Content-Type', 'image/png');
      response.headers.set('Cache-Control', 'public, max-age=14400, s-maxage=14400, stale-while-revalidate=86400');
      response.headers.set('ETag', `"${safeETag}"`);
      return response;
    }
    
    console.log('[DEBUG-CARD] Fetching Github & Font...');
    // 가장 단순한 API + 단일 폰트 로드
    const [stats, fontsResult] = await Promise.all([
      GitHubService.getInstance().getUserStats(username, nocache),
      getFontData('Pretendard') // 무조건 Pretendard-Bold (400) 만 사용
    ]);
    
    console.log('[DEBUG-CARD] Rendering Satori ImageResponse...');
    const profile: Profile = {
      githubUsername: username,
      name: stats.name,
      bio: stats.bio ?? undefined,
      theme: 'default',
      skills: ['GITHUB', 'REACT', 'NEXTJS', 'TYPESCRIPT'], // 옵션 다 지우고 하드코딩된 기본 스택으로 제한
      fontFamily: 'Pretendard', 
    };
    
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
        height: 920,
        fonts: fontsResult as VercelFontOptions[],
        headers: {
          'Cache-Control': 'public, max-age=86400',
          'ETag': `"${safeETag}"`,
        }
      }
    );
    
    console.log('[DEBUG-CARD] Calling arrayBuffer()...');
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);

    console.log('[DEBUG-CARD] Caching...');
    await setCachedData(cacheKey, imageBuffer, CACHE_TTL_SECONDS);

    const response = new NextResponse(imageBuffer);
    response.headers.set('Content-Type', 'image/png');
    response.headers.set('Cache-Control', 'public, max-age=14400, s-maxage=14400, stale-while-revalidate=86400');
    response.headers.set('ETag', `"${safeETag}"`);
    
    console.log(`[DEBUG-CARD] Done in ${(Date.now() - startTime) / 1000}s`);
    return response;
  } catch (error) {
    console.error('카드 생성 실패:', error);
    return NextResponse.json({ message: 'Error generating card' }, { status: 500 });
  }
}
