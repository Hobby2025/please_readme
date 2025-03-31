import { NextResponse } from 'next/server';
import { createCanvas } from 'canvas';

// 폰트 등록 (실제 구현시 필요)
// registerFont('./fonts/NanumGothic.ttf', { family: 'NanumGothic' });

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || 'GitHub 사용자';
    const bio = searchParams.get('bio') || '안녕하세요, 제 GitHub 프로필에 오신 것을 환영합니다!';
    const theme = searchParams.get('theme') || 'default';
    const username = searchParams.get('username') || '';
    
    // 캔버스 생성
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');
    
    // 배경 칠하기
    ctx.fillStyle = getThemeBackground(theme);
    ctx.fillRect(0, 0, 800, 400);
    
    // 제목 텍스트
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = getThemeText(theme);
    ctx.textAlign = 'center';
    ctx.fillText(name, 400, 100);
    
    // 사용자명 표시
    if (username) {
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = getThemeText(theme);
      ctx.fillText(`@${username}`, 400, 140);
    }
    
    // 자기소개 텍스트
    ctx.font = '20px Arial';
    ctx.fillStyle = getThemeText(theme);
    
    // 여러 줄로 텍스트 렌더링
    wrapText(ctx, bio, 400, username ? 180 : 150, 600, 30);
    
    // 캔버스를 PNG로 변환
    const buffer = canvas.toBuffer('image/png');
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('이미지 생성 오류:', error);
    return NextResponse.json({ error: '이미지 생성에 실패했습니다.' }, { status: 500 });
  }
}

// 테마에 따른 배경색
function getThemeBackground(theme: string): string {
  switch (theme) {
    case 'dark':
      return '#0d1117';
    case 'light':
      return '#ffffff';
    case 'blue':
      return '#1e40af';
    case 'green':
      return '#166534';
    case 'purple':
      return '#6b21a8';
    case 'synthwave':
      return '#2e1065';
    case 'cyberpunk':
      return '#b91c1c';
    case 'dracula':
      return '#0f172a';
    case 'tokyonight':
      return '#1a1b26';
    default:
      return '#f8fafc';
  }
}

// 테마에 따른 텍스트 색상
function getThemeText(theme: string): string {
  switch (theme) {
    case 'dark':
    case 'blue':
    case 'green':
    case 'purple':
    case 'synthwave':
    case 'cyberpunk':
    case 'dracula':
    case 'tokyonight':
      return '#ffffff';
    case 'light':
    default:
      return '#0f172a';
  }
}

// 텍스트 래핑 함수
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapText(ctx: CanvasRenderingContext2D | any, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let testLine = '';
  let lineCount = 0;

  ctx.textAlign = 'center';

  for (let n = 0; n < words.length; n++) {
    testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y + (lineCount * lineHeight));
      line = words[n] + ' ';
      lineCount++;
    } else {
      line = testLine;
    }
  }
  
  ctx.fillText(line, x, y + (lineCount * lineHeight));
} 