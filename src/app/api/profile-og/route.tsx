import { NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';
import { calculateRank, getGitHubStats, type GitHubStats } from '@/utils/github-stats';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || 'GitHub 사용자';
    const bio = searchParams.get('bio') || '안녕하세요, 제 GitHub 프로필에 오신 것을 환영합니다!';
    const theme = searchParams.get('theme') || 'default';
    const username = searchParams.get('username') || '';
    const skills = searchParams.get('skills') ? searchParams.get('skills')!.split(',') : [];
    
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
    
    // 테마에 따른 배경색 설정
    const isDark = theme === 'dark';
    const bgColor = isDark ? '#1f2937' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#1f2937';
    
    // 현재 날짜 생성
    const now = new Date();
    const dateStr = `${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}`;
    
    // headerBgColor 추출
    let headerBgColor = '#c9a3ff'; // 기본값
    
    if (rank.headerBgColor) {
      headerBgColor = rank.headerBgColor;
    } else {
      // bg-[#색상]/50 와 같은 형식에서 실제 색상 값 추출
      const match = rank.headerBg?.match(/bg-\[(.*?)\]/);
      if (match && match[1]) {
        // #RRGGBB/50 형식에서 알파 값(50) 추출
        const parts = match[1].split('/');
        headerBgColor = parts[0];
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            backgroundColor: bgColor,
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          {/* 헤더 영역 */}
          <div style={{ 
            display: 'flex', 
            width: '100%', 
            padding: '24px', 
            backgroundColor: headerBgColor,
            alignItems: 'center'
          }}>
            {/* 아바타 */}
            {username && (
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '40px', 
                border: `2px solid ${rank.accentColor}`,
                backgroundColor: 'white',
                marginRight: '20px',
                overflow: 'hidden'
              }}>
                <img
                  src={`https://github.com/${username}.png`}
                  alt={`${username} 아바타`}
                  width="80"
                  height="80"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ 
                color: 'white', 
                fontSize: '24px', 
                fontWeight: 'bold',
                margin: 0,
                padding: 0,
              }}>
                {name}
              </h1>
              
              {username && (
                <p style={{ 
                  color: rank.accentColor, 
                  fontSize: '16px',
                  margin: 0,
                  padding: 0,
                }}>
                  @{username}
                </p>
              )}
            </div>
          </div>
          
          {/* 바이오 영역 */}
          {bio && (
            <div style={{ 
              margin: '24px',
              padding: '16px',
              backgroundColor: isDark ? '#374151' : '#f3f4f6',
              borderRadius: '8px',
              borderLeft: `4px solid ${rank.mainColor}`,
              width: 'calc(100% - 48px)',
              position: 'relative',
            }}>
              <p style={{ 
                color: textColor, 
                fontSize: '16px',
                margin: 0,
                padding: '0 20px',
                textAlign: 'center',
              }}>
                {bio}
              </p>
            </div>
          )}
          
          {/* 스킬 영역 */}
          {skills.length > 0 && (
            <div style={{ 
              margin: '0 24px',
              padding: '16px',
              backgroundColor: isDark ? '#374151' : '#f3f4f6',
              borderRadius: '8px',
              borderLeft: `4px solid ${rank.mainColor}`,
              width: 'calc(100% - 48px)',
            }}>
              <h3 style={{ 
                color: rank.accentColor, 
                fontSize: '16px',
                margin: '0 0 12px 0',
              }}>
                기술 스택
              </h3>
              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                {skills.map((skill, i) => (
                  <div key={i} style={{ 
                    backgroundColor: rank.accentColor,
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* GitHub 통계 영역 */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            margin: '24px',
            width: 'calc(100% - 48px)',
          }}>
            <div style={{ 
              backgroundColor: isDark ? '#374151' : '#f3f4f6',
              padding: '12px',
              borderRadius: '8px',
              borderLeft: `4px solid ${rank.mainColor}`,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span style={{ color: textColor, fontSize: '14px' }}>
                커밋 | {new Date().getFullYear()}
              </span>
              <span style={{ color: rank.highlightColor, fontWeight: 'bold', fontSize: '18px' }}>
                {githubStats.currentYearCommits}
              </span>
            </div>
            
            <div style={{ 
              backgroundColor: isDark ? '#374151' : '#f3f4f6',
              padding: '12px',
              borderRadius: '8px',
              borderLeft: `4px solid ${rank.mainColor}`,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span style={{ color: textColor, fontSize: '14px' }}>PR</span>
              <span style={{ color: rank.highlightColor, fontWeight: 'bold', fontSize: '18px' }}>
                {githubStats.prs}
              </span>
            </div>
            
            <div style={{ 
              backgroundColor: isDark ? '#374151' : '#f3f4f6',
              padding: '12px',
              borderRadius: '8px',
              borderLeft: `4px solid ${rank.mainColor}`,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span style={{ color: textColor, fontSize: '14px' }}>이슈</span>
              <span style={{ color: rank.highlightColor, fontWeight: 'bold', fontSize: '18px' }}>
                {githubStats.issues}
              </span>
            </div>
            
            <div style={{ 
              backgroundColor: isDark ? '#374151' : '#f3f4f6',
              padding: '12px',
              borderRadius: '8px',
              borderLeft: `4px solid ${rank.mainColor}`,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span style={{ color: textColor, fontSize: '14px' }}>별</span>
              <span style={{ color: rank.highlightColor, fontWeight: 'bold', fontSize: '18px' }}>
                {githubStats.stars}
              </span>
            </div>
          </div>
          
          {/* 랭크 영역 */}
          <div style={{ 
            margin: '0 24px 24px 24px',
            padding: '12px',
            backgroundColor: isDark ? '#374151' : '#f3f4f6',
            borderRadius: '8px',
            borderLeft: `4px solid ${rank.mainColor}`,
            width: 'calc(100% - 48px)',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '20px', marginRight: '8px' }}>{rank.emoji}</span>
              <span style={{ color: rank.highlightColor, fontWeight: 'bold' }}>
                랭크: {rank.name}
              </span>
            </div>
            
            <div>
              <span style={{ color: textColor, fontSize: '14px' }}>
                기여도 | {new Date().getFullYear()}: 
              </span>
              <span style={{ color: rank.highlightColor, fontWeight: 'bold', marginLeft: '4px' }}>
                {githubStats.contributions}
              </span>
            </div>
          </div>
          
          {/* 푸터 */}
          <div style={{ 
            width: '100%', 
            backgroundColor: headerBgColor,
            padding: '12px 24px',
            marginTop: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            color: 'white',
            fontSize: '12px',
          }}>
            <span>{dateStr}</span>
            <span>created by Please Readme</span>
          </div>
        </div>
      ),
      {
        width: 768,
        height: 628,
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('이미지 생성 오류:', error);
    return NextResponse.json({ error: '이미지 생성에 실패했습니다.' }, { status: 500 });
  }
} 