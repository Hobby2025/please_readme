import { NextRequest, NextResponse } from 'next/server';
import { GitHubService } from '@/services/github';
import { Profile, CardTheme } from '@/types';
import { ImageResponse } from '@vercel/og';
import ProfileCardStatic from '@/components/ProfileCard/ProfileCardStatic';
import { optimizeProfileImages } from '@/utils/imageUtils';
import { getFontData, VercelFontOptions } from '@/utils/fontUtils';
import { calculateCardHeight } from '@/utils/layoutUtils';
import { measurePerformance } from '@/utils/performanceUtils';
import { getCachedData, setCachedData, deleteCachedData } from '@/utils/cache';

const CACHE_TTL_SECONDS = 4 * 60 * 60; // vercel 캐싱 주기 4시간

function isValidCardTheme(theme: string): theme is CardTheme {
  return ['cosmic', 'mineral', 'default', 'pastel'].includes(theme);
}

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  console.log(`[카드 API 요청 시작] ${new Date().toISOString()}`);
  
  try {
    const { searchParams } = new URL(req.url);
    const dataParam = searchParams.get('data');
    
    let username, themeParam, customBgUrl, customBio, skillsParam, customName, opacityParam, nocache, fontFamily;

    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(Buffer.from(dataParam, 'base64').toString('utf-8')));
        username = decodedData.username;
        themeParam = decodedData.theme;
        customBgUrl = decodedData.bg;
        customBio = decodedData.bio;
        skillsParam = decodedData.skills;
        customName = decodedData.name;
        opacityParam = decodedData.opacity;
        fontFamily = decodedData.fontFamily;
        nocache = searchParams.get('nocache') === 'true'; 
      } catch (e) {
        console.error('Base64 디코딩 실패', e);
        return NextResponse.json({ message: '잘못된 데이터 형식입니다.' }, { status: 400 });
      }
    } else {
      // 구 버전 하위 호환성 (마크다운 이미지 직접 링크 사용 시 대응)
      username = searchParams.get('username');
      themeParam = searchParams.get('theme');
      customBgUrl = searchParams.get('bg');
      customBio = searchParams.get('bio');
      skillsParam = searchParams.get('skills');
      customName = searchParams.get('name');
      opacityParam = searchParams.get('opacity');
      nocache = searchParams.get('nocache') === 'true';
      fontFamily = searchParams.get('fontFamily');
    }

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ message: 'GitHub 사용자명(username)이 필요합니다.' }, { status: 400 });
    }
    
    // 테마 처리
    const theme: CardTheme = (typeof themeParam === 'string' && isValidCardTheme(themeParam)) 
      ? themeParam as CardTheme 
      : 'default'; 
    
    // 캐싱을 위한 키 생성
    const cacheKey = `card:${username}:${theme}:${customBgUrl || ''}:${customBio || ''}:${skillsParam || ''}:${customName || ''}:${opacityParam || ''}:${fontFamily || ''}`;
    
    const forceRefresh = nocache;
    if (forceRefresh) {
      await deleteCachedData(cacheKey);
      await deleteCachedData(`github:stats:${username}`);
    }
    
    const cachedCard = await getCachedData<Buffer>(cacheKey);
    if (cachedCard && !forceRefresh) {
      const response = new NextResponse(Buffer.from(cachedCard));
      response.headers.set('Content-Type', 'image/png');
      response.headers.set('Cache-Control', 'public, max-age=86400');
      response.headers.set('ETag', `"${cacheKey}"`);
      return response;
    }
    
    // 데이터 가져오기 (GitHub API & 폰트)
    const [githubResult, fontsResult] = await Promise.all([
      measurePerformance('GitHub 데이터 요청', () => 
        GitHubService.getInstance().getUserStats(username, forceRefresh)
      ),
      measurePerformance('폰트 로딩', () => {
        const fontFamilyStr = typeof fontFamily === 'string' ? fontFamily : undefined;
        return getFontData(fontFamilyStr);
      })
    ]);
    
    const stats = githubResult.result;
    const fonts = fontsResult.result;
    
    const { result: { optimizedStats } } = await measurePerformance(
       '이미지 최적화', 
       () => optimizeProfileImages(stats)
    );
    
    const skills = typeof skillsParam === 'string' ? skillsParam.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    const profile: Profile = {
      githubUsername: username,
      name: (typeof customName === 'string' ? customName : optimizedStats.name) || '',
      bio: (typeof customBio === 'string' ? customBio : optimizedStats.bio) || '',
      theme,
      skills,
      fontFamily: typeof fontFamily === 'string' ? fontFamily : 'BookkMyungjo', 
    };
    
    const cardHeight = calculateCardHeight(profile.skills.length, profile.fontFamily);
    
    const { result: imageBuffer } = await measurePerformance('카드 이미지 생성', async () => {
      const imageResponse = new ImageResponse(
        // @ts-ignore
        (
          <ProfileCardStatic 
            profile={profile}
            stats={optimizedStats}
            loading={false}
          />
        ),
        {
          width: 600,
          height: cardHeight,
          fonts: fonts as VercelFontOptions[],
          headers: {
            'Cache-Control': 'public, max-age=86400',
            'ETag': `"${cacheKey}"`,
          },
          emoji: 'twemoji',
        }
      );
      const imageArrayBuffer = await imageResponse.arrayBuffer();
      return Buffer.from(imageArrayBuffer);
    });

    await setCachedData(cacheKey, imageBuffer, CACHE_TTL_SECONDS);

    const response = new NextResponse(imageBuffer);
    response.headers.set('Content-Type', 'image/png');
    response.headers.set('Cache-Control', 'public, max-age=86400');
    response.headers.set('ETag', `"${cacheKey}"`);
    
    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;
    console.log(`[카드 API 완료] 캐시 생성 - 총 처리 시간: ${totalTime.toFixed(2)}초`);
    
    return response;
  } catch (error) {
    console.error('카드 생성 실패:', error);
    return NextResponse.json({ 
      message: '카드 생성에 실패했습니다.', 
      error: error instanceof Error ? error.message : '알 수 없는 오류' 
    }, { status: 500 });
  }
}
