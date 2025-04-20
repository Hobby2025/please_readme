import fs from 'fs/promises';
import path from 'path';

// FontOptions 타입 정의 (vercel/og 호환)
// 참고: vercel/og의 실제 타입은 약간 다를 수 있으나, weight/style 옵션 포함
export interface VercelFontOptions {
  name: string;
  data: Buffer;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  style?: 'normal' | 'italic';
}

// FontData 인터페이스 제거 또는 수정 (VercelFontOptions 사용)
// export interface FontData { ... }

// 로컬 폰트 데이터 로드 함수 (반환 타입을 VercelFontOptions[]로)
export async function getFontData(fontFamily: string = 'BookkMyungjo'): Promise<VercelFontOptions[]> {
  const fontDirectory = path.join(process.cwd(), 'public', 'fonts');

  // 폰트별 파일 설정 (weight 값을 vercel/og 호환 숫자로)
  const fontConfig: Record<string, {files: {file: string; weight: VercelFontOptions['weight']}[]}> = {
    'BookkMyungjo': {
      files: [
        { file: 'BookkMyungjo_Light.ttf', weight: 300 },
        { file: 'BookkMyungjo_Bold.ttf', weight: 700 },
      ]
    },
    'Pretendard': {
      files: [
        { file: 'Pretendard-Regular.ttf', weight: 400 },
        { file: 'Pretendard-Bold.ttf', weight: 700 },
      ]
    },
    'HSSanTokki2.0': {
      files: [
        { file: 'HSSanTokki2.0.ttf', weight: 400 }, 
        // Bold 를 700으로 가정. 실제 폰트 파일 확인 필요
        { file: 'HSSanTokki2.0.ttf', weight: 700 }, 
      ]
    },
    'BMJUA_ttf': {
      files: [
        { file: 'BMJUA_ttf.ttf', weight: 400 },
        { file: 'BMJUA_ttf.ttf', weight: 700 }, // Bold 가정
      ]
    },
    'BMDOHYEON_ttf': {
      files: [
        { file: 'BMDOHYEON_ttf.ttf', weight: 400 },
        { file: 'BMDOHYEON_ttf.ttf', weight: 700 }, // Bold 가정
      ]
    }
  };

  if (!fontConfig[fontFamily]) {
    console.log(`[폰트 유틸] 요청된 폰트 ${fontFamily}가 없어 기본 폰트(BookkMyungjo)를 사용합니다.`);
    fontFamily = 'BookkMyungjo';
  }

  const fontFiles = fontConfig[fontFamily].files;

  const fontDataPromises = fontFiles.map(async ({ file, weight }) => {
    try {
      const filePath = path.join(fontDirectory, file);
      const data = await fs.readFile(filePath);
      // VercelFontOptions 타입으로 반환 (style은 기본값 'normal')
      return { name: fontFamily, data: data, weight, style: 'normal' as 'normal' };
    } catch (error) {
      console.error(`[폰트 유틸] 폰트 ${file} 로딩 실패:`, error);
      return null; 
    }
  });

  const settledFontData = await Promise.all(fontDataPromises);
  
  const validFontData = settledFontData.filter(data => data !== null) as VercelFontOptions[];
  
  if (validFontData.length === 0) {
     console.error('[폰트 유틸] 폰트 로딩 실패. 기본 시스템 폰트를 사용합니다.');
     return [];
  }
  
  return validFontData;
} 