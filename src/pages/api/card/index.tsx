import { NextApiRequest, NextApiResponse } from 'next';
import { GitHubService } from '@/services/github';
import { Profile, CardTheme } from '@/types';
import { ImageResponse } from '@vercel/og';
import ProfileCardStatic from '@/components/ProfileCard/ProfileCardStatic';
import { optimizeProfileImages } from '@/utils/imageUtils';
import { getFontData, VercelFontOptions } from '@/utils/fontUtils';
import { calculateCardHeight } from '@/utils/layoutUtils';
import { measurePerformance } from '@/utils/performanceUtils';
import { getCachedData, setCachedData, deleteCachedData } from '@/utils/cache';

// 캐시 TTL 설정
const CACHE_TTL_SECONDS = 4 * 60 * 60; // vercel 캐싱 주기 4시간으로 조절
const GITHUB_DATA_TTL_SECONDS = 4 * 60 * 60; // GitHub 데이터 4시간 캐싱

// CardTheme 타입 가드 함수
function isValidCardTheme(theme: string): theme is CardTheme {
  return ['cosmic', 'mineral', 'default', 'pastel'].includes(theme);
}

// Edge 런타임 설정 제거
// export const config = {
//   runtime: 'edge',
// };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const startTime = Date.now();
  console.log(`[카드 API 요청 시작] ${new Date().toISOString()}`);
  
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
      nocache,
      fontFamily
    } = req.query;
    
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ message: 'GitHub 사용자명(username)이 필요합니다.' });
    }
    
    // 테마 처리 (CardTheme 사용)
    const theme: CardTheme = (typeof themeParam === 'string' && isValidCardTheme(themeParam)) 
      ? themeParam as CardTheme 
      : 'default'; // 기본값은 'default' CardTheme
    
    console.log(`[카드 API] 요청된 테마 파라미터: ${themeParam}, 사용될 CardTheme: ${theme}`);
    
    // 캐싱을 위한 키 생성 (모든 파라미터 포함)
    const cacheKey = `card:${username}:${theme}:${customBgUrl || ''}:${customBio || ''}:${skillsParam || ''}:${customName || ''}:${opacityParam || ''}:${fontFamily || ''}`;
    
    // nocache 파라미터가 있으면 캐시 강제 삭제 및 강제 새로고침 사용
    const forceRefresh = nocache === 'true';
    if (forceRefresh) {
      console.log(`[카드 API] 캐시 강제 삭제: ${cacheKey}`);
      await deleteCachedData(cacheKey);
      
      // GitHub 통계 캐시도 삭제
      const statsKey = `github:stats:${username}`;
      await deleteCachedData(statsKey);
    }
    
    // 캐시 확인
    const cachedCard = await getCachedData<Buffer>(cacheKey);
    if (cachedCard && !forceRefresh) {
      // 캐시된 이미지가 있으면 Content-Type 설정하고 반환
      console.log(`[카드 API] 캐시 사용: ${cacheKey}`);
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'no-cache');
      
      // 처리 완료 시간 로깅 (캐시 사용)
      const endTime = Date.now();
      const processingTime = (endTime - startTime) / 1000;
      console.log(`[카드 API 완료] 캐시 사용 - 처리 시간: ${processingTime.toFixed(2)}초`);
      
      return res.status(200).send(Buffer.from(cachedCard));
    }
    
    // 모든 데이터 가져오기를 병렬로 처리
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
    
    // 이미지 최적화 (measurePerformance + 분리된 함수 사용)
    const { result: { optimizedStats }, time: imageOptTime } = await measurePerformance(
       '이미지 최적화', 
       () => optimizeProfileImages(stats)
    );
    
    // 스킬 배열 파싱
    const skills = typeof skillsParam === 'string' ? skillsParam.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    // 프로필 객체 생성 (theme: CardTheme 사용)
    const profile: Profile = {
      githubUsername: username,
      name: (typeof customName === 'string' ? customName : optimizedStats.name) || '',
      bio: (typeof customBio === 'string' ? customBio : optimizedStats.bio) || '',
      theme,
      skills,
      fontFamily: typeof fontFamily === 'string' ? fontFamily : 'BookkMyungjo', 
      // backgroundImageUrl, backgroundOpacity 는 현재 쿼리 파라미터로 처리하지 않음
    };
    
    // 카드 높이 계산 (분리된 함수 사용)
    const cardHeight = calculateCardHeight(profile.skills.length, profile.fontFamily);
    
    // @vercel/og 이미지 생성 (measurePerformance 사용)
    const { result: imageBuffer, time: imageGenTime } = await measurePerformance('카드 이미지 생성', async () => {
      const imageResponse = new ImageResponse(
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
          // debug: true, // 필요시 디버깅 활성화
          headers: {
            'Cache-Control': 'no-cache',
          },
        }
      );
      // ArrayBuffer로 변환
      const imageArrayBuffer = await imageResponse.arrayBuffer();
      return Buffer.from(imageArrayBuffer);
    });

    // 캐시에 이미지 저장
    await setCachedData(cacheKey, imageBuffer, CACHE_TTL_SECONDS);

    // 응답 헤더 설정 및 이미지 반환
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-cache');
    
    // 처리 완료 시간 로깅
    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;
    console.log(`[카드 API 완료] 캐시 생성 - 총 처리 시간: ${totalTime.toFixed(2)}초 (GitHub: ${githubResult.time.toFixed(2)}s, 폰트: ${fontsResult.time.toFixed(2)}s, 이미지 최적화: ${imageOptTime.toFixed(2)}s, 이미지 생성: ${imageGenTime.toFixed(2)}s)`);
    
    return res.status(200).send(imageBuffer);
  } catch (error) {
    console.error('카드 생성 실패:', error);
    
    // 에러 처리 시간 로깅
    const errorTime = (Date.now() - startTime) / 1000;
    console.log(`[카드 API 오류] 처리 시간: ${errorTime.toFixed(2)}초`);
    
    return res.status(500).json({ 
      message: '카드 생성에 실패했습니다.', 
      error: error instanceof Error ? error.message : '알 수 없는 오류' 
    });
  }
} 