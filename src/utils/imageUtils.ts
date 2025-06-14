/**
 * 현재 환경(로컬/Vercel)에 맞게 이미지 URL을 적절히 변환하는 유틸리티
 */

import { getCachedData, setCachedData } from './cache';
import path from 'path';
import fs from 'fs/promises';
import { GitHubStats } from '@/types'; // GitHubStats 타입 import

const IMAGE_CACHE_TTL = 24 * 60 * 60; // 24시간 캐시

/**
 * 외부 이미지 URL을 가져와 캐싱
 * - 이미지 최적화는 별도의 라이브러리 없이 간단한 방식으로 구현
 */
export async function optimizeAndCacheImage(url: string): Promise<string | null> {
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
    
    // 로컬 이미지 파일 처리 (/bg-image/ 경로인 경우)
    if (url.startsWith('/bg-image/')) {
      try {
        const imagePath = path.join(process.cwd(), 'public', url);
        console.log(`로컬 이미지 파일 경로: ${imagePath}`);
        
        // 파일 존재 여부 확인
        const imageBuffer = await fs.readFile(imagePath);
        
        // 파일 확장자에 따라 MIME 타입 결정
        let contentType = 'image/png';
        if (url.endsWith('.jpeg') || url.endsWith('.jpg')) {
          contentType = 'image/jpeg';
        } else if (url.endsWith('.webp')) {
          contentType = 'image/webp';
        } else if (url.endsWith('.svg')) {
          contentType = 'image/svg+xml';
        }
        
        // Base64로 인코딩
        const base64 = imageBuffer.toString('base64');
        const dataUrl = `data:${contentType};base64,${base64}`;
        
        // 캐시에 저장
        await setCachedData(cacheKey, dataUrl, IMAGE_CACHE_TTL);
        
        return dataUrl;
      } catch (error) {
        console.error(`로컬 이미지 파일 로드 실패: ${url}`, error);
        return null;
      }
    }
    
    // 외부 URL 이미지 처리 - http나 https로 시작하는 경우만 fetch 사용
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      console.error(`외부 URL 처리를 위해서는 http:// 또는 https://로 시작하는 URL이 필요합니다: ${url}`);
      return null;
    }
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }
      });
      
      if (!response.ok) {
        console.error(`이미지를 가져오지 못했습니다: ${response.status} ${response.statusText}`);
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
      console.error(`외부 URL에서 이미지를 가져오는 중 오류가 발생했습니다: ${url}`, error);
      return null;
    }
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

/**
 * 큰 숫자를 K, M 단위로 변환하는 함수입니다.
 * 예: 1500 -> 1.5K, 1500000 -> 1.5M
 */
export function formatNumberUnit(num: number): string {
  if (num === undefined || num === null) return '0';
  
  if (num === 0) return '0';
  
  // 백만 단위 이상
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  
  // 천 단위 이상
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  
  // 그 외의 경우 그대로 반환
  return num.toString();
}

// 이미지 파일을 base64로 인코딩하는 유틸리티 함수들은 이곳에 추가할 수 있습니다. 

// ImageService에서 분리된 loadImage 함수
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // 외부 이미지 로드를 위해 CORS 설정이 필요할 수 있음 (특히 Canvas에서 사용 시)
    img.crossOrigin = 'anonymous'; 
    img.onload = () => resolve(img);
    img.onerror = (err) => {
      console.error(`이미지 로드 실패: ${url}`, err);
      reject(new Error(`이미지 로드 실패: ${url}`));
    };
    // 유효한 URL인지 먼저 검사 (선택 사항, urlUtils 사용 가능)
    // if (!validateImageUrl(url)) { 
    //   reject(new Error(`유효하지 않은 이미지 URL: ${url}`));
    //   return;
    // }
    img.src = url;
  });
}

// API 핸들러에서 분리된 이미지 처리 최적화 함수
export async function optimizeProfileImages(
  stats: GitHubStats
): Promise<{ 
  optimizedStats: GitHubStats;
}> {
  console.log(`[이미지 유틸] 프로필 이미지 최적화 시작`);
  try {
    // 아바타 이미지 최적화 (optimizeAndCacheImage 사용)
    const optimizedAvatar = stats.avatarUrl ? await optimizeAndCacheImage(stats.avatarUrl) : null;

    // GitHub 이미지 URL이 있는지 확인하고 미리 로드
    if (stats.avatarUrl && stats.avatarUrl.includes('github.com')) {
      // 미리 이미지 로드를 위한 함수 호출
      await preloadGitHubImage(stats.avatarUrl);
    }

    // 최적화된 아바타 적용
    const optimizedStats = {
      ...stats,
      avatarUrl: optimizedAvatar || stats.avatarUrl, // 최적화 실패 시 원본 유지
    };
    
    console.log(`[이미지 유틸] 프로필 이미지 최적화 완료`);
    return { optimizedStats };

  } catch (error) {
    console.error(`[이미지 유틸] 프로필 이미지 최적화 실패`, error);
    // 오류 발생 시 원본 데이터 반환
    return { optimizedStats: stats };
  }
}

/**
 * GitHub 이미지를 미리 로드하여 캐싱하는 함수
 * - README에서 이미지가 제대로 표시되도록 돔
 */
export async function preloadGitHubImage(url: string): Promise<void> {
  try {
    if (!url.includes('github.com')) return;
    
    console.log(`GitHub 이미지 미리 로드 시작: ${url}`);
    
    // 이미지 미리 로드를 위한 헤더 설정
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };
    
    // 이미지 미리 로드
    const response = await fetch(url, { headers, cache: 'no-store' });
    
    if (!response.ok) {
      console.error(`GitHub 이미지 미리 로드 실패: ${response.status} ${response.statusText}`);
      return;
    }
    
    // 이미지 데이터 버퍼로 가져오기
    await response.arrayBuffer();
    console.log(`GitHub 이미지 미리 로드 성공: ${url}`);
  } catch (error) {
    console.error(`GitHub 이미지 미리 로드 오류:`, error);
  }
} 