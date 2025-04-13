// 메모리 캐싱 구현
type CacheItem<T> = {
  data: T;
  expiry: number; // 만료 시간 (timestamp)
  lastAccessed: number; // 마지막 액세스 시간 (timestamp) - 추가됨
};

// 메모리 캐시 저장소
const memoryCache: Record<string, CacheItem<any>> = {};

// LRU 캐시 최대 항목 수
const MAX_CACHE_ITEMS = 1000;

// 캐시에서 데이터 가져오기
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const item = memoryCache[key];
    
    // 캐시 항목이 없는 경우
    if (!item) {
      return null;
    }
    
    // 만료 시간 확인
    if (Date.now() > item.expiry) {
      // 만료된 항목 삭제
      delete memoryCache[key];
      return null;
    }
    
    // 마지막 액세스 시간 업데이트
    item.lastAccessed = Date.now();
    
    return item.data;
  } catch (error) {
    console.error(`캐시 조회 실패: ${error}`);
    return null;
  }
}

// 캐시에 데이터 저장하기
export async function setCachedData<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
  try {
    // 캐시 크기 확인 및 관리
    if (Object.keys(memoryCache).length >= MAX_CACHE_ITEMS) {
      // LRU 방식으로 가장 오래된 항목 제거
      evictOldestCache();
    }
    
    memoryCache[key] = {
      data,
      expiry: Date.now() + (ttlSeconds * 1000),
      lastAccessed: Date.now()
    };
  } catch (error) {
    console.error(`캐시 저장 실패: ${error}`);
  }
}

// LRU 방식으로 가장 오래 액세스되지 않은 항목 제거
function evictOldestCache(): void {
  let oldestKey: string | null = null;
  let oldestTime = Infinity;
  
  for (const key in memoryCache) {
    if (memoryCache[key].lastAccessed < oldestTime) {
      oldestTime = memoryCache[key].lastAccessed;
      oldestKey = key;
    }
  }
  
  if (oldestKey) {
    delete memoryCache[oldestKey];
    console.log(`LRU 캐시 정책에 따라 항목 제거: ${oldestKey}`);
  }
}

// 캐시에서 데이터 삭제하기
export async function deleteCachedData(key: string): Promise<void> {
  try {
    delete memoryCache[key];
  } catch (error) {
    console.error(`캐시 삭제 실패: ${error}`);
  }
}

// 패턴으로 캐시 삭제하기 (예: 'github:stats:*')
export async function deleteCachedDataByPattern(pattern: string): Promise<void> {
  try {
    const regex = new RegExp(pattern.replace('*', '.*'));
    
    Object.keys(memoryCache).forEach(key => {
      if (regex.test(key)) {
        delete memoryCache[key];
      }
    });
  } catch (error) {
    console.error(`패턴 캐시 삭제 실패: ${error}`);
  }
}

// 캐시 통계 정보 가져오기
export function getCacheStats(): { total: number, expired: number, size: number } {
  const now = Date.now();
  let expired = 0;
  let totalItems = 0;
  
  // 추정 메모리 사용량 (대략적인 계산)
  let approximateSize = 0;
  
  for (const key in memoryCache) {
    totalItems++;
    if (memoryCache[key].expiry < now) {
      expired++;
    }
    
    // 키와 메타데이터 크기 추정 (바이트)
    approximateSize += key.length * 2; // 문자열은 UTF-16으로 약 2바이트
    approximateSize += 24; // 객체 오버헤드 + 타임스탬프 두 개
    
    // 데이터 크기 추정 - JSON 문자열화하여 길이 계산
    try {
      const dataSize = JSON.stringify(memoryCache[key].data).length * 2;
      approximateSize += dataSize;
    } catch (e) {
      // 직렬화 불가 객체인 경우 대략적인 크기 (1KB)
      approximateSize += 1024;
    }
  }
  
  return {
    total: totalItems,
    expired: expired,
    size: Math.round(approximateSize / 1024) // KB 단위
  };
}

// 캐시 정리 함수 (만료된 항목 제거)
export function cleanupCache(): void {
  const now = Date.now();
  let removed = 0;
  
  Object.keys(memoryCache).forEach(key => {
    if (memoryCache[key].expiry < now) {
      delete memoryCache[key];
      removed++;
    }
  });
  
  if (removed > 0) {
    console.log(`캐시 정리: ${removed}개 항목 제거됨`);
  }
}

// 주기적으로 만료된 캐시 정리 (5분마다)
setInterval(cleanupCache, 5 * 60 * 1000); 