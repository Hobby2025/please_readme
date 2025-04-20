export async function measurePerformance<T>(
    name: string, 
    fn: () => Promise<T>
  ): Promise<{ result: T, time: number }> {
    const startTime = Date.now();
    console.log(`[성능 측정] ${name} 시작`);
    
    try {
      const result = await fn();
      const time = (Date.now() - startTime) / 1000;
      console.log(`[성능 측정] ${name} 완료: ${time.toFixed(2)}초`);
      return { result, time };
    } catch (error) {
      const time = (Date.now() - startTime) / 1000;
      console.error(`[성능 측정] ${name} 실패: ${time.toFixed(2)}초`, error);
      throw error;
    }
  }
  