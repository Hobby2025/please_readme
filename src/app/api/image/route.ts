import { NextResponse } from 'next/server';
import { createCanvas, loadImage } from 'canvas';
import { GitHubStats } from '@/types';

// 폰트 설정 개선
let fontFamily = 'sans-serif';
try {
  // 시스템 폰트로 fallback
  console.log('시스템 기본 폰트를 사용합니다');
  fontFamily = 'Arial, sans-serif';
} catch (error) {
  console.error('폰트 설정 오류:', error);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 사용자명 가져오고 공백 제거
    let username = searchParams.get('username');
    if (username) username = username.trim();
    
    const name = searchParams.get('name') || '';
    const bio = searchParams.get('bio') || '';
    const skills = searchParams.get('skills') || '';
    const theme = searchParams.get('theme') || 'light';
    
    if (!username) {
      return NextResponse.json(
        { error: '사용자명이 필요합니다.' },
        { status: 400 }
      );
    }
    
    try {
      // GitHub API에서 사용자 데이터 가져오기 - 절대 URL로 변경
      const origin = new URL(request.url).origin;
      const apiUrl = `${origin}/api/github/${encodeURIComponent(username)}`;
      
      console.log('GitHub API 요청 URL:', apiUrl);
      
      const githubStatsRes = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!githubStatsRes.ok) {
        const errorText = await githubStatsRes.text();
        console.error('GitHub API 응답 오류:', errorText);
        
        // GitHub 사용자를 찾을 수 없는 경우 기본 이미지 생성을 계속 진행
        // 기본 통계 데이터로 폴백
        console.log('기본 통계 데이터를 사용하여 계속 진행합니다.');
        
        const defaultStats: GitHubStats = {
          totalCommits: 0,
          totalPRs: 0,
          totalIssues: 0,
          avatar_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' // GitHub 기본 로고
        };
        
        const githubStats = defaultStats;
        
        // 캔버스 생성
        const width = 1000;
        const height = 500;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // 배경 칠하기
        ctx.fillStyle = theme === 'light' ? '#ffffff' : '#0d1117';
        ctx.fillRect(0, 0, width, height);
        
        // 경계선 추가
        ctx.strokeStyle = theme === 'light' ? '#e1e4e8' : '#30363d';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, width - 4, height - 4);
        
        // 텍스트 스타일 설정
        ctx.fillStyle = theme === 'light' ? '#24292e' : '#c9d1d9';
        ctx.font = `bold 36px ${fontFamily}`;
        ctx.textAlign = 'center';
        
        // 오류 메시지 표시
        ctx.fillText(`GitHub 사용자 '${username}'를 찾을 수 없습니다`, width / 2, height / 2 - 20);
        ctx.font = `18px ${fontFamily}`;
        ctx.fillText('올바른 GitHub 사용자명인지 확인해 주세요', width / 2, height / 2 + 20);
        
        // 캔버스를 PNG로 변환
        const buffer = canvas.toBuffer('image/png');
        
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'max-age=60'
          }
        });
      }
      
      const githubStats: GitHubStats = await githubStatsRes.json();
      
      // 캔버스 생성
      const width = 1000;
      const height = 500;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      
      // 배경 칠하기
      ctx.fillStyle = theme === 'light' ? '#ffffff' : '#0d1117';
      ctx.fillRect(0, 0, width, height);
      
      // 경계선 추가
      ctx.strokeStyle = theme === 'light' ? '#e1e4e8' : '#30363d';
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, width - 4, height - 4);
      
      // 아바타 이미지 로드
      let avatarImg;
      try {
        avatarImg = await loadImage(githubStats.avatar_url);
      } catch (error) {
        console.error('아바타 이미지를 로드할 수 없습니다:', error);
      }
      
      // 아바타 이미지 그리기
      if (avatarImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(120, 110, 80, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImg, 40, 30, 160, 160);
        ctx.restore();
      }
      
      // 기본 텍스트 스타일 설정
      ctx.fillStyle = theme === 'light' ? '#24292e' : '#c9d1d9';
      ctx.font = `bold 36px ${fontFamily}`;
      ctx.textAlign = 'left';
      
      // 이름 표시
      ctx.fillText(name || username, 240, 80);
      
      // 자기소개 표시 - 한글 텍스트를 위한 설정
      ctx.font = `18px ${fontFamily}`;
      
      // 기본 폰트로 fallback을 위한 설정
      if (bio) {
        try {
          // 자기소개 줄바꿈 처리
          const maxWidth = 700;
          const lineHeight = 24;
          const words = bio.split(' ');
          let line = '';
          let y = 120;
          
          for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && i > 0) {
              ctx.fillText(line, 240, y);
              line = words[i] + ' ';
              y += lineHeight;
            } else {
              line = testLine;
            }
          }
          
          ctx.fillText(line, 240, y);
        } catch (error) {
          // 에러 발생 시 단순 텍스트로 표시
          console.error('텍스트 렌더링 오류:', error);
          ctx.fillText(bio, 240, 120);
        }
      }
      
      // 스킬 배지 표시
      const skillsList = skills.split(',').filter(Boolean);
      let skillX = 240;
      let skillY = 180;
      
      for (const skill of skillsList) {
        const badgeWidth = ctx.measureText(skill).width + 20;
        
        // 스킬 배지 배경
        ctx.fillStyle = theme === 'light' ? '#e1e4e8' : '#30363d';
        ctx.fillRect(skillX, skillY - 15, badgeWidth, 25);
        
        // 스킬 텍스트
        ctx.fillStyle = theme === 'light' ? '#24292e' : '#c9d1d9';
        ctx.fillText(skill, skillX + 10, skillY);
        
        // 다음 배지 위치 이동
        skillX += badgeWidth + 10;
        if (skillX > width - 100) {
          skillX = 240;
          skillY += 30;
        }
      }
      
      // GitHub 통계 그리기 - 중앙에 배치
      const statsY = Math.max(skillY + 60, 280); // 스킬 배지 아래에 충분한 공간 확보
      
      ctx.fillStyle = theme === 'light' ? '#24292e' : '#c9d1d9';
      ctx.font = `bold 24px ${fontFamily}`;
      ctx.fillText('GitHub 통계', 50, statsY);
      
      // 통계 항목 표시 - 가로로 배열
      ctx.font = `18px ${fontFamily}`;
      
      // 통계 아이콘과 수치를 그릴 위치 계산
      const statsStartY = statsY + 40;
      const statsSpacing = 150; // 각 통계 항목 사이의 간격
      
      // 커밋 정보
      ctx.fillText(`commits: ${githubStats.totalCommits}`, 50, statsStartY);
      
      // PR 정보
      ctx.fillText(`Pull Requests: ${githubStats.totalPRs}`, 50 + statsSpacing, statsStartY);
      
      // 이슈 정보
      ctx.fillText(`issue: ${githubStats.totalIssues}`, 50 + statsSpacing * 2, statsStartY);
      
      // 캔버스를 PNG로 변환
      const buffer = canvas.toBuffer('image/png');
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'max-age=60'
        }
      });
    } catch (error) {
      console.error('데이터 처리 오류:', error);
      return NextResponse.json(
        { error: '이미지 생성에 실패했습니다.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('이미지 생성 오류:', error);
    return NextResponse.json(
      { error: '이미지 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 