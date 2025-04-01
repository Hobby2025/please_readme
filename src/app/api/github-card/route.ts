import { NextResponse } from 'next/server';
import { getGitHubStats, calculateRank, type GitHubStats, type RankInfo } from '@/utils/github-stats';

export const runtime = 'edge';

/**
 * SVG 기반의 GitHub 카드 생성 API
 * 기존 GithubCard 컴포넌트 디자인을 SVG로 구현
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const theme = searchParams.get('theme') || 'light';
    const bio = searchParams.get('bio') || '';
    const name = searchParams.get('name') || '';
    const cacheSeconds = parseInt(searchParams.get('cache_seconds') || '86400', 10);

    // 사용자명 확인
    if (!username) {
      return NextResponse.json({ error: '사용자명이 필요합니다.' }, { status: 400 });
    }

    // GitHub 통계 가져오기
    let stats: GitHubStats;
    try {
      stats = await getGitHubStats(username);
    } catch (statsError) {
      console.error('GitHub 통계 가져오기 오류:', statsError);
      // 오류 발생시 기본 오류 SVG 반환
      return new Response(renderErrorCard('GitHub 통계를 가져올 수 없습니다.'), {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // 랭크 계산
    const rank = calculateRank(stats);

    // SVG 카드 렌더링
    const svg = renderGithubCard(stats, username, name, bio, theme, rank);

    // 응답 헤더 설정
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': `public, max-age=${cacheSeconds}`,
      },
    });
  } catch (error) {
    console.error('통계 카드 생성 오류:', error);
    return new Response(renderErrorCard('통계 카드를 생성할 수 없습니다.'), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}

/**
 * 오류 카드 렌더링
 */
function renderErrorCard(message: string): string {
  return `
    <svg width="600" height="120" viewBox="0 0 600 120" xmlns="http://www.w3.org/2000/svg">
      <style>
        .text { font: 600 16px 'Segoe UI', Ubuntu, Sans-Serif; fill: #d30000 }
        .small { font: 600 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #252525 }
        .gray { fill: #858585 }
      </style>

      <rect x="0.5" y="0.5" width="599" height="99%" rx="4.5" fill="#fefefe" stroke="#e4e2e2"/>
      <text x="25" y="45" class="text">오류 발생</text>
      <text x="25" y="65" class="small">${message}</text>
      <text x="25" y="85" class="small gray">README에 표시하려면 올바른 사용자명을 입력해주세요.</text>
    </svg>
  `;
}

/**
 * GitHub 카드 렌더링 (GithubCard 컴포넌트 디자인 기반)
 */
function renderGithubCard(stats: GitHubStats, username: string, name: string, bio: string, theme: string, rank: RankInfo): string {
  const { stars, currentYearCommits, prs, issues, contributions } = stats;
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  const dateStr = `${year}. ${month}. ${day}`;
  
  // 다크모드 여부
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1f2937' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#1f2937';
  const boxBgColor = isDark ? 'rgba(55, 65, 81, 0.9)' : 'rgba(243, 244, 246, 0.9)';
  
  // 사용자 이름
  const displayName = name || `${username}'s GitHub`;
  
  // 자기소개
  const displayBio = bio || `${username}의 GitHub 프로필입니다.`;
  
  return `
    <svg width="600" height="500" viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
      <style>
        .header { font: 600 22px 'Segoe UI', Ubuntu, Sans-Serif; }
        .subheader { font: 500 16px 'Segoe UI', Ubuntu, Sans-Serif; }
        .bio { font: italic 500 14px 'Segoe UI', Ubuntu, Sans-Serif; }
        .stat { font: 500 14px 'Segoe UI', Ubuntu, Sans-Serif; }
        .stat-value { font: 700 16px 'Segoe UI', Ubuntu, Sans-Serif; }
        .footer { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; }
      </style>

      <!-- 배경 -->
      <rect width="600" height="500" rx="10" fill="${bgColor}"/>
      
      <!-- 헤더 영역 -->
      <rect width="600" height="70" rx="10 10 0 0" fill="${rank.headerBgColor}"/>
      
      <!-- 아바타 -->
      <clipPath id="avatarClip">
        <circle cx="40" cy="35" r="20"/>
      </clipPath>
      <circle cx="40" cy="35" r="20" fill="white" stroke="${rank.accentColor}" stroke-width="2"/>
      <image href="https://github.com/${username}.png" width="40" height="40" x="20" y="15" clip-path="url(#avatarClip)"/>
      
      <!-- 사용자 정보 -->
      <text x="80" y="35" fill="white" class="header">${displayName}</text>
      <text x="80" y="55" fill="${rank.accentColor}" class="subheader">@${username}</text>
      
      <!-- 자기소개 -->
      <rect x="20" y="85" width="560" height="75" rx="8" fill="${boxBgColor}" stroke="${rank.mainColor}" stroke-width="2"/>
      <text x="35" y="125" fill="${textColor}" class="bio">
        <tspan x="45" text-anchor="start">${displayBio}</tspan>
      </text>
      <text x="30" y="105" font-size="22" fill="${rank.accentColor}" opacity="0.6">"</text>
      <text x="560" y="150" font-size="22" fill="${rank.accentColor}" opacity="0.6" text-anchor="end">"</text>
      
      <!-- 구분선 -->
      <line x1="30" y1="180" x2="275" y2="180" stroke="${rank.accentColor}" stroke-width="2"/>
      <circle cx="300" cy="180" r="3" fill="${rank.accentColor}"/>
      <circle cx="290" cy="180" r="3" fill="${rank.accentColor}"/>
      <circle cx="310" cy="180" r="3" fill="${rank.accentColor}"/>
      <line x1="325" y1="180" x2="570" y2="180" stroke="${rank.accentColor}" stroke-width="2"/>
      
      <!-- GitHub 통계 -->
      <!-- 커밋 -->
      <rect x="20" y="200" width="275" height="60" rx="8" fill="${boxBgColor}"/>
      <rect x="20" y="200" width="4" height="60" fill="${rank.mainColor}" rx="2"/>
      <text x="35" y="235" fill="${textColor}" class="stat">Total Commits | ${year}</text>
      <text x="280" y="235" fill="${rank.accentColor}" class="stat-value" text-anchor="end">${currentYearCommits}</text>
      
      <!-- PR -->
      <rect x="305" y="200" width="275" height="60" rx="8" fill="${boxBgColor}"/>
      <rect x="305" y="200" width="4" height="60" fill="${rank.mainColor}" rx="2"/>
      <text x="320" y="235" fill="${textColor}" class="stat">Total PRs</text>
      <text x="565" y="235" fill="${rank.accentColor}" class="stat-value" text-anchor="end">${prs}</text>
      
      <!-- 이슈 -->
      <rect x="20" y="275" width="275" height="60" rx="8" fill="${boxBgColor}"/>
      <rect x="20" y="275" width="4" height="60" fill="${rank.mainColor}" rx="2"/>
      <text x="35" y="310" fill="${textColor}" class="stat">Total Issues</text>
      <text x="280" y="310" fill="${rank.accentColor}" class="stat-value" text-anchor="end">${issues}</text>
      
      <!-- 스타 -->
      <rect x="305" y="275" width="275" height="60" rx="8" fill="${boxBgColor}"/>
      <rect x="305" y="275" width="4" height="60" fill="${rank.mainColor}" rx="2"/>
      <text x="320" y="310" fill="${textColor}" class="stat">Total Stars</text>
      <text x="565" y="310" fill="${rank.accentColor}" class="stat-value" text-anchor="end">${stars}</text>
      
      <!-- 랭크 -->
      <rect x="20" y="350" width="560" height="60" rx="8" fill="${boxBgColor}"/>
      <rect x="20" y="350" width="4" height="60" fill="${rank.mainColor}" rx="2"/>
      <text x="35" y="385" fill="${rank.accentColor}" class="stat">${rank.emoji} Rank: ${rank.name}</text>
      <text x="565" y="385" fill="${textColor}" class="stat" text-anchor="end">
        Contributions | ${year}: <tspan fill="${rank.accentColor}" font-weight="bold">${contributions}</tspan>
      </text>
      
      <!-- 푸터 -->
      <rect x="0" y="430" width="600" height="70" rx="0 0 10 10" fill="${rank.headerBgColor}"/>
      <text x="20" y="475" fill="white" class="footer">${dateStr}</text>
      <text x="485" y="475" fill="white" class="footer">created by Please Readme</text>
    </svg>
  `;
} 