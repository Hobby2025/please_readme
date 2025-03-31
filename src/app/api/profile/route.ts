import { NextResponse } from 'next/server';
import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';

// 폰트 등록 (실제 구현시 필요)
// registerFont('./fonts/NanumGothic.ttf', { family: 'NanumGothic' });

/**
 * 지수 분포 누적 분포 함수 계산
 */
function exponentialCdf(x: number): number {
  return 1 - 2 ** -x;
}

/**
 * 로그 정규 분포 누적 분포 함수 계산 (근사값)
 */
function logNormalCdf(x: number): number {
  return x / (1 + x);
}

/**
 * 사용자 랭크 계산 함수
 */
function calculateRank(stats: any) {
  const { contributions = 0, currentYearCommits = 0, prs = 0, issues = 0, stars = 0 } = stats || {};
  
  // 중간값 및 가중치 설정
  const COMMITS_MEDIAN = 250;
  const COMMITS_WEIGHT = 2;
  const PRS_MEDIAN = 50;
  const PRS_WEIGHT = 3;
  const ISSUES_MEDIAN = 25;
  const ISSUES_WEIGHT = 1;
  const CONTRIBUTIONS_MEDIAN = 200;
  const CONTRIBUTIONS_WEIGHT = 3;
  const STARS_MEDIAN = 50;
  const STARS_WEIGHT = 4;
  
  const TOTAL_WEIGHT = COMMITS_WEIGHT + PRS_WEIGHT + ISSUES_WEIGHT + CONTRIBUTIONS_WEIGHT + STARS_WEIGHT;
  
  // 평가 점수 계산 (0~1 범위)
  const score = 1 - (
    (COMMITS_WEIGHT * exponentialCdf(currentYearCommits / COMMITS_MEDIAN) +
    PRS_WEIGHT * exponentialCdf(prs / PRS_MEDIAN) +
    ISSUES_WEIGHT * exponentialCdf(issues / ISSUES_MEDIAN) +
    CONTRIBUTIONS_WEIGHT * exponentialCdf(contributions / CONTRIBUTIONS_MEDIAN) +
    STARS_WEIGHT * logNormalCdf(stars / STARS_MEDIAN)) / TOTAL_WEIGHT
  );
  
  // 퍼센타일 계산 (0~100%)
  const percentile = score * 100;
  
  // 등급 임계값 및 등급 정의
  const THRESHOLDS = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
  const rankIndex = THRESHOLDS.findIndex(t => percentile <= t);
  
  // 무지개 색상에 맞는 등급별 설정
  const RANKS = [
    { 
      name: 'S', 
      color: '#9400D3', 
      emoji: '🔮',
      mainColor: '#9400D3',
      accentColor: '#8A2BE2',
      headerBg: '#8A2BE280',
      highlightColor: '#9400D3'
    },
    { 
      name: 'A+', 
      color: '#4B0082', 
      emoji: '👑',
      mainColor: '#4B0082',
      accentColor: '#483D8B',
      headerBg: '#483D8B80',
      highlightColor: '#4B0082'
    },
    { 
      name: 'A', 
      color: '#0000FF', 
      emoji: '🌊',
      mainColor: '#0000FF',
      accentColor: '#1E90FF',
      headerBg: '#1E90FF80',
      highlightColor: '#0000FF'
    },
    { 
      name: 'A-', 
      color: '#00FF00', 
      emoji: '🌿',
      mainColor: '#00FF00',
      accentColor: '#32CD32',
      headerBg: '#32CD3280',
      highlightColor: '#00FF00'
    },
    { 
      name: 'B+', 
      color: '#FFFF00', 
      emoji: '⭐',
      mainColor: '#FFFF00',
      accentColor: '#FFD700',
      headerBg: '#FFD70080',
      highlightColor: '#FFFF00'
    },
    { 
      name: 'B', 
      color: '#FFA500', 
      emoji: '🔥',
      mainColor: '#FFA500',
      accentColor: '#FF8C00',
      headerBg: '#FF8C0080',
      highlightColor: '#FFA500'
    },
    { 
      name: 'B-', 
      color: '#FF4500', 
      emoji: '🚀',
      mainColor: '#FF4500',
      accentColor: '#FF6347',
      headerBg: '#FF634780',
      highlightColor: '#FF4500'
    },
    { 
      name: 'C+', 
      color: '#FF0000', 
      emoji: '💫',
      mainColor: '#FF0000',
      accentColor: '#DC143C',
      headerBg: '#DC143C80',
      highlightColor: '#FF0000'
    },
    { 
      name: 'C', 
      color: '#8B0000', 
      emoji: '✨',
      mainColor: '#8B0000',
      accentColor: '#B22222',
      headerBg: '#B2222280',
      highlightColor: '#8B0000'
    }
  ];
  
  return { ...RANKS[rankIndex], percentile };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || 'GitHub 사용자';
    const bio = searchParams.get('bio') || '안녕하세요, 제 GitHub 프로필에 오신 것을 환영합니다!';
    const theme = searchParams.get('theme') || 'default';
    const username = searchParams.get('username') || '';
    const skills = searchParams.get('skills') ? searchParams.get('skills')!.split(',') : [];
    
    // GitHub 통계 기본값
    const githubStats = {
      stars: parseInt(searchParams.get('stars') || '0'),
      commits: parseInt(searchParams.get('commits') || '0'),
      prs: parseInt(searchParams.get('prs') || '0'),
      issues: parseInt(searchParams.get('issues') || '0'),
      contributions: parseInt(searchParams.get('contributions') || '0'),
      currentYearCommits: parseInt(searchParams.get('currentYearCommits') || '0'),
      languages: {}
    };
    
    // 랭크 계산
    const rank = calculateRank(githubStats);
    
    // 캔버스 크기 설정
    const width = 800;
    const height = 600;
    
    // 캔버스 생성
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // 테마에 따른 배경색 설정
    const isDark = theme === 'dark';
    const bgColor = isDark ? '#1f2937' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#1f2937';
    
    // 배경 그리기
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    // 헤더 그리기
    ctx.fillStyle = rank.headerBg;
    ctx.fillRect(0, 0, width, 80);
    
    // 아바타 로드 및 그리기
    try {
      const avatarSize = 60;
      const avatarX = 30;
      const avatarY = 10;
      
      // 아바타 원형 배경
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
      ctx.fill();
      
      // 아바타 테두리
      ctx.strokeStyle = rank.accentColor;
      ctx.lineWidth = 3;
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
    
    // 이름 그리기
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(name, 110, 35);
    
    // 사용자명 그리기
    if (username) {
      ctx.font = '16px Arial';
      ctx.fillStyle = rank.accentColor;
      ctx.fillText(`@${username}`, 110, 60);
    }
    
    // 현재 날짜 그리기
    const now = new Date();
    const dateStr = `${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}`;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(dateStr, 20, height - 20);
    
    // 푸터 그리기
    ctx.fillStyle = rank.headerBg;
    ctx.fillRect(0, height - 40, width, 40);
    
    ctx.font = '12px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText('created by Please Readme', width - 20, height - 20);
    
    // 자기소개 그리기
    if (bio) {
      // 자기소개 배경
      const bioY = 100;
      const bioHeight = 100;
      
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
      
      // 자기소개 텍스트
      ctx.font = '16px Arial';
      ctx.fillStyle = textColor;
      wrapText(ctx, bio, width / 2, bioY + 50, width - 100, 20);
    }
    
    // 기술 스택 그리기
    if (skills.length > 0) {
      const skillsY = 220;
      const skillsHeight = 100;
      
      // 배경색 설정
      ctx.fillStyle = isDark ? '#374151' : '#f3f4f6';
      roundRect(ctx, 20, skillsY, width - 40, skillsHeight, 8, true);
      
      // 테두리 그리기
      ctx.strokeStyle = rank.mainColor;
      ctx.lineWidth = 2;
      roundRect(ctx, 20, skillsY, width - 40, skillsHeight, 8, false, true);
      
      // 스택 제목
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = rank.accentColor;
      ctx.fillText('Stacks', 40, skillsY + 30);
      
      // 스킬 배지 그리기
      ctx.font = '14px Arial';
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
    
    // GitHub 통계 그리기
    const statsY = 340;
    
    // 통계 카드 그리기
    drawStatCard(ctx, 'Total Commits | ' + new Date().getFullYear(), githubStats.currentYearCommits.toString(), 20, statsY, (width - 60) / 2, 60, isDark, rank.mainColor, rank.highlightColor, textColor);
    drawStatCard(ctx, 'Total PRs', githubStats.prs.toString(), width / 2 + 10, statsY, (width - 60) / 2, 60, isDark, rank.mainColor, rank.highlightColor, textColor);
    drawStatCard(ctx, 'Total Issues', githubStats.issues.toString(), 20, statsY + 70, (width - 60) / 2, 60, isDark, rank.mainColor, rank.highlightColor, textColor);
    drawStatCard(ctx, 'Total Stars', githubStats.stars.toString(), width / 2 + 10, statsY + 70, (width - 60) / 2, 60, isDark, rank.mainColor, rank.highlightColor, textColor);
    
    // 랭크 카드 그리기
    const rankY = 430;
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
    
    // 랭크 표시
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = rank.highlightColor;
    ctx.textAlign = 'left';
    ctx.fillText(`${rank.emoji} Rank : ${rank.name}`, 40, rankY + 35);
    
    // 기여도 표시
    ctx.font = '14px Arial';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'right';
    ctx.fillText(`Contributions | ${new Date().getFullYear()} : `, width - 100, rankY + 35);
    
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = rank.highlightColor;
    ctx.fillText(githubStats.contributions.toString(), width - 60, rankY + 35);
    
    // 캔버스를 PNG로 변환
    const buffer = canvas.toBuffer('image/png');
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=60, s-maxage=60',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('이미지 생성 오류:', error);
    return NextResponse.json({ error: '이미지 생성에 실패했습니다.' }, { status: 500 });
  }
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

// 통계 카드 그리기 함수
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
  
  // 레이블
  ctx.font = '14px Arial';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'left';
  ctx.fillText(label, x + 20, y + 30);
  
  // 값
  ctx.font = 'bold 18px Arial';
  ctx.fillStyle = valueColor;
  ctx.textAlign = 'right';
  ctx.fillText(value, x + width - 20, y + 30);
} 