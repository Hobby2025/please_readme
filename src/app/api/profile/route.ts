import { NextResponse } from 'next/server';
import { createCanvas, loadImage, CanvasRenderingContext2D, registerFont } from 'canvas';
import path from 'path';
import { calculateRank, getGitHubStats, type GitHubStats, type RankInfo } from '@/utils/github-stats';

// 시스템 폰트 사용 시도 (맥/리눅스에서는 보통 이런 폰트들이 있음)
try {
  // 시스템에 설치된 폰트들을 시도
  // macOS/Linux에서 사용 가능한 일반적인 한글 폰트
  // 실제 사용 가능성이 높은 순서대로 시도
  const fontPaths = [
    path.resolve('./public/fonts/RIDIBatang.woff'),    // 직접 다운로드한 폰트
    path.resolve('./public/fonts/NotoSansKR-Regular.ttf'), // 직접 다운로드한 폰트
    path.resolve('./public/fonts/NotoSansKR-Bold.ttf'),   // 직접 다운로드한 폰트
    '/System/Library/Fonts/AppleSDGothicNeo.ttc',       // macOS
    '/System/Library/Fonts/AppleGothic.ttf',           // macOS
    '/usr/share/fonts/truetype/nanum/NanumGothic.ttf', // Linux
    '/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc', // Linux
    '/usr/share/fonts/NotoSansCJK-Regular.ttc',        // Linux
  ];

  // 여러 폰트를 시도하여 최소한 하나라도 로드되도록 함
  let fontLoaded = false;
  for (const fontPath of fontPaths) {
    try {
      registerFont(fontPath, { family: 'CustomFont' });
      console.log(`폰트 등록 성공: ${fontPath}`);
      fontLoaded = true;
      break; // 성공하면 중단
    } catch (e) {
      console.log(`폰트 로드 실패: ${fontPath}`);
    }
  }

  if (!fontLoaded) {
    console.warn('모든 한글 폰트 로드 실패, 기본 폰트 사용');
  }
} catch (error) {
  console.error('폰트 등록 실패:', error);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || 'GitHub 사용자';
    const bio = searchParams.get('bio') || '안녕하세요, 제 GitHub 프로필에 오신 것을 환영합니다!';
    const theme = searchParams.get('theme') || 'default';
    const username = searchParams.get('username') || '';
    const skills = searchParams.get('skills') ? searchParams.get('skills')!.split(',') : [];
    const backgroundColorParam = searchParams.get('bg_color') || '';
    const backgroundImageUrl = searchParams.get('background_image_url') || '';
    
    // GitHub 통계 확인 - URL에서 직접 제공된 값이 있는지 확인
    let githubStats: GitHubStats = {
      stars: parseInt(searchParams.get('stars') || '0'),
      commits: parseInt(searchParams.get('commits') || '0'),
      prs: parseInt(searchParams.get('prs') || '0'),
      issues: parseInt(searchParams.get('issues') || '0'),
      contributions: parseInt(searchParams.get('contributions') || '0'),
      currentYearCommits: parseInt(searchParams.get('currentYearCommits') || '0'),
      languages: {}
    };
    
    // 모든 통계값이 0인 경우, 실시간 GitHub API 호출
    const isDefaultStats = 
      githubStats.stars === 0 && 
      githubStats.commits === 0 && 
      githubStats.prs === 0 && 
      githubStats.issues === 0 && 
      githubStats.contributions === 0 && 
      githubStats.currentYearCommits === 0;
    
    // 사용자명이 있고 기본 통계값인 경우 GitHub API에서 최신 통계 가져오기
    if (username && isDefaultStats) {
      console.log(`GitHub 실시간 통계 가져오기: ${username}`);
      try {
        // 공통 모듈에서 제공하는 getGitHubStats 함수 사용
        const liveStats = await getGitHubStats(username);
        githubStats = liveStats;
      } catch (error) {
        console.error('GitHub 통계 가져오기 오류:', error);
        // 기본값 유지
      }
    }
    
    // 랭크 계산
    const rank = calculateRank(githubStats);
    
    // 캔버스 크기 설정 (GithubCard 컴포넌트와 더 유사한 비율로 조정)
    // max-w-3xl(768px)로 설정된 GithubCard 컴포넌트 비율에 맞게 설정
    const width = 768;
    const height = 628; // 더 정사각형에 가까운 비율로 조정
    
    // 캔버스 생성
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // 테마에 따른 배경색 설정
    const isDark = theme === 'dark';
    const bgColor = backgroundColorParam || (isDark ? '#1f2937' : '#ffffff');
    const textColor = isDark ? '#ffffff' : '#1f2937';
    
    // 이미지 생성을 위한 rank 객체의 headerBg 값 변환 (Tailwind 클래스에서 실제 색상 값으로)
    const headerBgColor = convertHeaderBgToColor(rank.headerBg, isDark);
    
    // 배경 그리기 - 둥근 테두리 적용
    ctx.fillStyle = bgColor;
    // 전체 캔버스에 라운드 적용
    roundRect(ctx, 0, 0, width, height, 16, true);
    
    // 배경 이미지가 있으면 적용
    if (backgroundImageUrl) {
      try {
        // 이미지 로드
        const backgroundImage = await loadImage(backgroundImageUrl);
        
        // 이미지 그리기 (라운드 적용을 위해 클리핑 사용)
        ctx.save();
        ctx.beginPath();
        roundRect(ctx, 0, 0, width, height, 16, false);
        ctx.clip();
        
        // 이미지 적당한 크기로 조정하여 그리기
        const imgRatio = backgroundImage.width / backgroundImage.height;
        const canvasRatio = width / height;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        if (imgRatio > canvasRatio) {
          // 이미지가 더 넓은 경우
          drawHeight = height;
          drawWidth = height * imgRatio;
          drawX = (width - drawWidth) / 2;
          drawY = 0;
        } else {
          // 이미지가 더 높은 경우
          drawWidth = width;
          drawHeight = width / imgRatio;
          drawX = 0;
          drawY = (height - drawHeight) / 2;
        }
        
        // 이미지 그리기
        ctx.drawImage(backgroundImage, drawX, drawY, drawWidth, drawHeight);
        
        // 배경 오버레이 (이미지 위에 반투명 색상)
        ctx.fillStyle = isDark ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.restore();
      } catch (error) {
        console.error('배경 이미지 로드 실패:', error);
        // 이미지 로드 실패 시 기본 배경색 유지
      }
    }
    
    // 헤더 그리기
    ctx.fillStyle = headerBgColor;
    // 헤더에도 라운드 적용 (상단 부분만)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width - 16, 0);
    ctx.quadraticCurveTo(width, 0, width, 16);
    ctx.lineTo(width, 80);
    ctx.lineTo(0, 80);
    ctx.lineTo(0, 16);
    ctx.quadraticCurveTo(0, 0, 16, 0);
    ctx.closePath();
    ctx.fill();
    
    // 아바타 로드 및 그리기
    try {
      const avatarSize = 80; // 아바타 크기를 GithubCard 컴포넌트와 동일하게 설정
      const avatarX = 30;
      const avatarY = 10;
      
      // 아바타 원형 배경
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
      ctx.fill();
      
      // 아바타 테두리
      ctx.strokeStyle = rank.accentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
      ctx.stroke();
      
      if (username) {
        const avatar = await loadImage(`https://github.com/${username}.png`);
        
        // 아바타 클리핑
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2 - 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();
      }
    } catch (error) {
      console.error('아바타 로드 실패:', error);
    }
    
    // 이름 그리기 - 한글 폰트 사용
    ctx.font = 'bold 24px "CustomFont", "AppleGothic", "Arial", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(name, 130, 35);
    
    // 사용자명 그리기
    if (username) {
      ctx.font = '16px "CustomFont", "AppleGothic", "Arial", sans-serif';
      ctx.fillStyle = rank.accentColor;
      ctx.fillText(`@${username}`, 130, 60);
    }
    
    // 푸터 그리기
    ctx.fillStyle = headerBgColor;
    // 푸터에도 라운드 적용 (하단 부분만)
    ctx.beginPath();
    ctx.moveTo(0, height - 40);
    ctx.lineTo(width, height - 40);
    ctx.lineTo(width, height - 16);
    ctx.quadraticCurveTo(width, height, width - 16, height);
    ctx.lineTo(16, height);
    ctx.quadraticCurveTo(0, height, 0, height - 16);
    ctx.lineTo(0, height - 40);
    ctx.closePath();
    ctx.fill();
    
    // 현재 날짜 그리기
    const now = new Date();
    const dateStr = `${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}`;
    ctx.font = '12px "CustomFont", "AppleGothic", "Arial", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(dateStr, 20, height - 15);
    
    // 크레딧 그리기
    ctx.font = '12px "CustomFont", "AppleGothic", "Arial", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText('created by Please Readme', width - 20, height - 15);
    
    // 자기소개 그리기
    if (bio) {
      // 자기소개 배경
      const bioY = 100;
      const bioHeight = 100; // GithubCard 컴포넌트에 맞게 높이 조정
      
      // 배경색 설정
      ctx.fillStyle = isDark ? '#374151' : '#f3f4f6';
      roundRect(ctx, 20, bioY, width - 40, bioHeight, 8, true);
      
      // 테두리 그리기
      ctx.strokeStyle = rank.mainColor;
      ctx.lineWidth = 2;
      roundRect(ctx, 20, bioY, width - 40, bioHeight, 8, false, true);
      
      // 따옴표 아이콘
      ctx.fillStyle = rank.accentColor;
      ctx.fillText('❝', 35, bioY + 25);
      ctx.textAlign = 'right';
      ctx.fillText('❞', width - 35, bioY + bioHeight - 20);
      ctx.textAlign = 'left';
      
      // 자기소개 텍스트 - 한글 폰트 사용
      ctx.font = '16px "CustomFont", "AppleGothic", "Arial", sans-serif';
      ctx.fillStyle = textColor;
      wrapText(ctx, bio, width / 2, bioY + 50, width - 100, 20);
    }
    
    // 기술 스택 그리기
    if (skills.length > 0) {
      const skillsY = 220; // 위치 조정
      const skillsHeight = 100; // GithubCard 컴포넌트에 맞게 높이 조정
      
      // 배경색 설정
      ctx.fillStyle = isDark ? '#374151' : '#f3f4f6';
      roundRect(ctx, 20, skillsY, width - 40, skillsHeight, 8, true);
      
      // 테두리 그리기
      ctx.strokeStyle = rank.mainColor;
      ctx.lineWidth = 2;
      roundRect(ctx, 20, skillsY, width - 40, skillsHeight, 8, false, true);
      
      // 스택 제목 - 한글 폰트 사용
      ctx.font = 'bold 16px "CustomFont", "AppleGothic", "Arial", sans-serif';
      ctx.fillStyle = rank.accentColor;
      ctx.textAlign = 'left';
      ctx.fillText('기술 스택', 40, skillsY + 30);
      
      // 스킬 배지 그리기
      ctx.font = '12px "CustomFont", "AppleGothic", "Arial", sans-serif';
      let skillX = 40;
      let skillY = skillsY + 60;
      
      for (const skill of skills) {
        const badgeWidth = ctx.measureText(skill).width + 20;
        
        if (skillX + badgeWidth > width - 40) {
          skillX = 40;
          skillY += 30;
        }
        
        // 배지 배경
        ctx.fillStyle = rank.accentColor;
        roundRect(ctx, skillX, skillY - 15, badgeWidth, 25, 12, true);
        
        // 배지 텍스트
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(skill, skillX + badgeWidth / 2, skillY);
        ctx.textAlign = 'left';
        
        skillX += badgeWidth + 10;
      }
    }
    
    // GitHub 통계 그리기 - GithubCard 컴포넌트와 동일한 그리드 구조 (2x2)
    const statsY = 340;
    
    // 통계 카드 그리기
    drawStatCard(ctx, '커밋 | ' + new Date().getFullYear(), githubStats.currentYearCommits.toString(), 20, statsY, (width - 60) / 2, 60, isDark, rank.mainColor, rank.highlightColor, textColor);
    drawStatCard(ctx, 'PR', githubStats.prs.toString(), width / 2 + 10, statsY, (width - 60) / 2, 60, isDark, rank.mainColor, rank.highlightColor, textColor);
    drawStatCard(ctx, '이슈', githubStats.issues.toString(), 20, statsY + 70, (width - 60) / 2, 60, isDark, rank.mainColor, rank.highlightColor, textColor);
    drawStatCard(ctx, '별', githubStats.stars.toString(), width / 2 + 10, statsY + 70, (width - 60) / 2, 60, isDark, rank.mainColor, rank.highlightColor, textColor);
    
    // 랭크 카드 그리기
    const rankY = 490; // 위치 조정
    ctx.fillStyle = isDark ? '#374151' : '#f3f4f6';
    roundRect(ctx, 20, rankY, width - 40, 60, 8, true);
    
    // 랭크 테두리
    ctx.strokeStyle = rank.mainColor;
    ctx.lineWidth = 2;
    ctx.strokeStyle = rank.mainColor;
    ctx.beginPath();
    ctx.moveTo(24, rankY);
    ctx.lineTo(24, rankY + 60);
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // 랭크 표시 - 한글 폰트 사용
    ctx.font = 'bold 16px "CustomFont", "AppleGothic", "Arial", sans-serif';
    ctx.fillStyle = rank.highlightColor;
    ctx.textAlign = 'left';
    ctx.fillText(`${rank.emoji} 랭크: ${rank.name}`, 40, rankY + 35);
    
    // 기여도 표시 - 한글 폰트 사용
    ctx.font = '14px "CustomFont", "AppleGothic", "Arial", sans-serif';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'right';
    ctx.fillText(`기여도 | ${new Date().getFullYear()}: `, width - 100, rankY + 35);
    
    ctx.font = 'bold 14px "CustomFont", "AppleGothic", "Arial", sans-serif';
    ctx.fillStyle = rank.highlightColor;
    ctx.fillText(githubStats.contributions.toString(), width - 60, rankY + 35);
    
    // 현재 시간 캐시 버스팅용 쿼리 파라미터 추가
    ctx.font = '10px "CustomFont", "AppleGothic", "Arial", sans-serif';
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    ctx.textAlign = 'left';
    ctx.fillText(`Updated: ${new Date().toISOString()}`, 20, height - 50);
    
    // 캔버스를 PNG로 변환
    const buffer = canvas.toBuffer('image/png');
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('이미지 생성 오류:', error);
    return NextResponse.json({ error: '이미지 생성에 실패했습니다.' }, { status: 500 });
  }
}

// Tailwind bg 클래스에서 실제 색상값 추출 헬퍼 함수
function convertHeaderBgToColor(headerBg: string, isDark: boolean): string {
  // bg-[#색상]/50 와 같은 형식에서 실제 색상 값 추출
  const match = headerBg.match(/bg-\[(.*?)\]/);
  if (match && match[1]) {
    // #RRGGBB/50 형식에서 알파 값(50) 추출
    const parts = match[1].split('/');
    const baseColor = parts[0];
    const opacity = parts.length > 1 ? parseInt(parts[1]) / 100 : 0.5; // 기본값 0.5
    
    // 16진수 색상을 RGB로 변환
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // 기본값
  return isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(219, 234, 254, 0.5)';
}

// 텍스트 래핑 함수
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
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

// 둥근 사각형 그리기 함수
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number = 5,
  fill: boolean = false,
  stroke: boolean = false
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  
  if (fill) {
    ctx.fill();
  }
  
  if (stroke) {
    ctx.stroke();
  }
}

// 통계 카드 그리기 함수 수정
function drawStatCard(
  ctx: CanvasRenderingContext2D,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
  height: number,
  isDark: boolean,
  borderColor: string,
  valueColor: string,
  textColor: string
) {
  // 배경
  ctx.fillStyle = isDark ? '#374151' : '#f3f4f6';
  roundRect(ctx, x, y, width, height, 8, true);
  
  // 테두리
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 4, y);
  ctx.lineTo(x + 4, y + height);
  ctx.lineWidth = 4;
  ctx.stroke();
  
  // 레이블 - 한글 폰트 사용
  ctx.font = '14px "CustomFont", "AppleGothic", "Arial", sans-serif';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'left';
  ctx.fillText(label, x + 20, y + 30);
  
  // 값 - 한글 폰트 사용
  ctx.font = 'bold 18px "CustomFont", "AppleGothic", "Arial", sans-serif';
  ctx.fillStyle = valueColor;
  ctx.textAlign = 'right';
  ctx.fillText(value, x + width - 20, y + 30);
} 