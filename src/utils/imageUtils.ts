/**
 * 현재 환경(로컬/Vercel)에 맞게 이미지 URL을 적절히 변환하는 유틸리티
 */

import { getCachedData, setCachedData } from './cache';

const IMAGE_CACHE_TTL = 24 * 60 * 60; // 24시간 캐시

/**
 * 외부 이미지 URL을 가져와 캐싱
 * - 이미지 최적화는 별도의 라이브러리 없이 간단한 방식으로 구현
 */
export async function optimizeImage(url: string): Promise<string | null> {
  try {
    // 캐시 키 생성
    const cacheKey = `image:${url}`;
    
    // 캐시 확인
    const cachedImage = await getCachedData<string>(cacheKey);
    if (cachedImage) {
      return cachedImage;
    }
    
    // URL이 이미 base64인 경우
    if (url.startsWith('data:')) {
      return url;
    }
    
    // 이미지 다운로드
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // 원본 콘텐츠 타입 사용
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Base64로 인코딩
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${contentType};base64,${base64}`;
    
    // 이미지가 너무 크면 경고만 출력 (5MB 이상)
    if (buffer.length > 5 * 1024 * 1024) {
      console.warn(`이미지 크기가 큽니다: ${(buffer.length / (1024 * 1024)).toFixed(2)}MB`);
    }
    
    // 캐시에 저장
    await setCachedData(cacheKey, dataUrl, IMAGE_CACHE_TTL);
    
    return dataUrl;
  } catch (error) {
    console.error('이미지 처리 실패:', error);
    return null;
  }
}

// 배경 이미지 경로를 환경에 맞게 변환하는 함수
export function getImageUrl(path: string): string {
  const domain = process.env.NEXT_PUBLIC_VERCEL_URL || '';
  return `https://${domain}${path}`;
}

// 이미지 파일을 base64로 인코딩하는 유틸리티 함수들은 이곳에 추가할 수 있습니다. 