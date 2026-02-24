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
  try {
    if (fontFamily === 'Pretendard') {
      return [
        { name: fontFamily, data: await fs.readFile(path.join(process.cwd(), 'public/fonts/Pretendard-Regular.ttf')), weight: 400, style: 'normal' },
        { name: fontFamily, data: await fs.readFile(path.join(process.cwd(), 'public/fonts/Pretendard-Bold.ttf')), weight: 700, style: 'normal' }
      ];
    }
    if (fontFamily === 'HSSanTokki2.0') {
      return [
        { name: fontFamily, data: await fs.readFile(path.join(process.cwd(), 'public/fonts/HSSanTokki2.0.ttf')), weight: 400, style: 'normal' },
        { name: fontFamily, data: await fs.readFile(path.join(process.cwd(), 'public/fonts/HSSanTokki2.0.ttf')), weight: 700, style: 'normal' }
      ];
    }
    if (fontFamily === 'BMJUA_ttf') {
      return [
        { name: fontFamily, data: await fs.readFile(path.join(process.cwd(), 'public/fonts/BMJUA_ttf.ttf')), weight: 400, style: 'normal' },
        { name: fontFamily, data: await fs.readFile(path.join(process.cwd(), 'public/fonts/BMJUA_ttf.ttf')), weight: 700, style: 'normal' }
      ];
    }
    if (fontFamily === 'BMDOHYEON_ttf') {
      return [
        { name: fontFamily, data: await fs.readFile(path.join(process.cwd(), 'public/fonts/BMDOHYEON_ttf.ttf')), weight: 400, style: 'normal' },
        { name: fontFamily, data: await fs.readFile(path.join(process.cwd(), 'public/fonts/BMDOHYEON_ttf.ttf')), weight: 700, style: 'normal' }
      ];
    }

    if (fontFamily !== 'BookkMyungjo') {
      console.log(`[폰트 유틸] 요청된 폰트 ${fontFamily}가 없어 기본 폰트(BookkMyungjo)를 사용합니다.`);
    }

    // 기본값 (BookkMyungjo)
    return [
      { name: fontFamily === 'BookkMyungjo' ? fontFamily : 'BookkMyungjo', data: await fs.readFile(path.join(process.cwd(), 'public/fonts/BookkMyungjo_Light.ttf')), weight: 300, style: 'normal' },
      { name: fontFamily === 'BookkMyungjo' ? fontFamily : 'BookkMyungjo', data: await fs.readFile(path.join(process.cwd(), 'public/fonts/BookkMyungjo_Bold.ttf')), weight: 700, style: 'normal' }
    ];
  } catch (error) {
    console.error(`[폰트 유틸] 폰트 로딩 실패:`, error);
    return [];
  }
} 