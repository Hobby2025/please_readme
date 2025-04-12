// 메모리 캐싱 구현
type CacheItem<T> = {
  data: T;
  expiry: number; // 만료 시간 (timestamp)
};

// 메모리 캐시 저장소
const memoryCache: Record<string, CacheItem<any>> = {};

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
    
    return item.data;
  } catch (error) {
    console.error(`캐시 조회 실패: ${error}`);
    return null;
  }
}

// 캐시에 데이터 저장하기
export async function setCachedData<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
  try {
    memoryCache[key] = {
      data,
      expiry: Date.now() + (ttlSeconds * 1000)
    };
  } catch (error) {
    console.error(`캐시 저장 실패: ${error}`);
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

// 캐시 정리 함수 (만료된 항목 제거)
export function cleanupCache(): void {
  const now = Date.now();
  
  Object.keys(memoryCache).forEach(key => {
    if (memoryCache[key].expiry < now) {
      delete memoryCache[key];
    }
  });
}

// 주기적으로 만료된 캐시 정리 (10분마다)
setInterval(cleanupCache, 10 * 60 * 1000); 