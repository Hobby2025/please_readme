import React from 'react';
import { Profile, GitHubStats, ProfileCardProps, Theme } from '../../types/profile';

// 단순화된 TechBadge 컴포넌트 (@vercel/og 호환) - 아이콘 없음
const SimpleTechBadge = ({ tech }: { tech: string }) => {
  const bgColors: Record<string, string> = {
    'React': '#61DAFB', 'TypeScript': '#3178C6', 'JavaScript': '#F7DF1E', 'Next.js': '#000000',
    'Node.js': '#339933', 'Python': '#3776AB', 'Java': '#007396', 'Go': '#00ADD8',
    'CSS3': '#1572B6', 'HTML5': '#E34F26', 'Tailwind CSS': '#06B6D4', 'MySQL': '#4479A1',
    'PostgreSQL': '#4169E1', 'MongoDB': '#47A248', 'Express': '#000000', 'GraphQL': '#E10098',
    'Redux': '#764ABC', 'Git': '#F05032', 'Docker': '#2496ED', 'Kubernetes': '#326CE5',
    'AWS': '#232F3E', 'Flutter': '#02569B', 'Vue.js': '#4FC08D', 'Angular': '#DD0031',
    'default': '#6B7280'
  };
  const textColors: Record<string, string> = {
    'JavaScript': '#000000', 'Tailwind CSS': '#FFFFFF', 'HTML5': '#FFFFFF', 'Python': '#FFFFFF',
    'Java': '#FFFFFF', 'Go': '#FFFFFF', 'CSS3': '#FFFFFF', 'MySQL': '#FFFFFF', 'PostgreSQL': '#FFFFFF',
    'MongoDB': '#FFFFFF', 'GraphQL': '#FFFFFF', 'Redux': '#FFFFFF', 'Git': '#FFFFFF',
    'Docker': '#FFFFFF', 'Kubernetes': '#FFFFFF', 'AWS': '#FFFFFF', 'Flutter': '#FFFFFF',
    'Vue.js': '#FFFFFF', 'Angular': '#FFFFFF',
    'default': '#FFFFFF' // 기본값 흰색
  };

  const bgColor = bgColors[tech] || bgColors['default'];
  const textColor = textColors[tech] || textColors['default'];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: bgColor,
        color: textColor,
        padding: '5px 10px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 500,
        lineHeight: '1.2',
        whiteSpace: 'nowrap',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      }}
    >
      {/* 아이콘 렌더링 로직 없음 확인 */} 
      {tech}
    </div>
  );
};

// 랭크별 전체 디자인 요소 모음 (색상, 배경, 효과 등)
const rankDesignSystem: Record<string, {
  border: string;         // 테두리 스타일
  background: string;     // 배경 스타일 (그라데이션 등)
  textColor: string;      // 랭크 텍스트 색상
  glow: string;           // 외부 발광 효과
  badge: string;          // 배지 스타일
  shadow: string;         // 그림자 효과
  statsBg: string;        // 통계 항목 배경
}> = {
  'S': {
    border: 'border-purple-500 dark:border-purple-400',
    background: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20',
    textColor: 'text-purple-600 dark:text-purple-400',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)] dark:shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    badge: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
    shadow: 'shadow-lg shadow-purple-200 dark:shadow-purple-900/30',
    statsBg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  'A+': {
    border: 'border-blue-500 dark:border-blue-400',
    background: 'bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900/30 dark:to-blue-800/20',
    textColor: 'text-blue-600 dark:text-blue-400',
    glow: 'shadow-[0_0_10px_rgba(59,130,246,0.4)] dark:shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    badge: 'bg-gradient-to-r from-blue-500 to-sky-500 text-white',
    shadow: 'shadow-lg shadow-blue-200 dark:shadow-blue-900/30',
    statsBg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  'A': {
    border: 'border-blue-400 dark:border-blue-300',
    background: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10',
    textColor: 'text-blue-500 dark:text-blue-300',
    glow: 'shadow-[0_0_8px_rgba(59,130,246,0.3)] dark:shadow-[0_0_12px_rgba(59,130,246,0.2)]',
    badge: 'bg-blue-500 text-white',
    shadow: 'shadow-md shadow-blue-100 dark:shadow-blue-900/20',
    statsBg: 'bg-blue-50/80 dark:bg-blue-900/10',
  },
  'A-': {
    border: 'border-sky-400 dark:border-sky-300',
    background: 'bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/20 dark:to-sky-800/10',
    textColor: 'text-sky-500 dark:text-sky-300',
    glow: 'shadow-[0_0_6px_rgba(14,165,233,0.3)] dark:shadow-[0_0_10px_rgba(14,165,233,0.2)]',
    badge: 'bg-sky-500 text-white',
    shadow: 'shadow-md shadow-sky-100 dark:shadow-sky-900/20',
    statsBg: 'bg-sky-50/80 dark:bg-sky-900/10',
  },
  'B+': {
    border: 'border-green-500 dark:border-green-400',
    background: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10',
    textColor: 'text-green-500 dark:text-green-400',
    glow: '',
    badge: 'bg-green-500 text-white',
    shadow: 'shadow-md shadow-green-100 dark:shadow-green-900/20',
    statsBg: 'bg-green-50/80 dark:bg-green-900/10',
  },
  'B': {
    border: 'border-green-400 dark:border-green-300',
    background: 'bg-white dark:bg-gray-800',
    textColor: 'text-green-500 dark:text-green-300',
    glow: '',
    badge: 'bg-green-400 text-white',
    shadow: 'shadow-md',
    statsBg: 'bg-gray-50 dark:bg-gray-700/50',
  },
  'B-': {
    border: 'border-lime-400 dark:border-lime-300',
    background: 'bg-white dark:bg-gray-800',
    textColor: 'text-lime-500 dark:text-lime-300',
    glow: '',
    badge: 'bg-lime-400 text-white',
    shadow: 'shadow-md',
    statsBg: 'bg-gray-50 dark:bg-gray-700/50',
  },
  'C+': {
    border: 'border-yellow-400 dark:border-yellow-300',
    background: 'bg-white dark:bg-gray-800',
    textColor: 'text-yellow-500 dark:text-yellow-300',
    glow: '',
    badge: 'bg-yellow-400 text-white',
    shadow: 'shadow-md',
    statsBg: 'bg-gray-50 dark:bg-gray-700/50',
  },
  'C': {
    border: 'border-yellow-300 dark:border-yellow-200',
    background: 'bg-white dark:bg-gray-800',
    textColor: 'text-yellow-400 dark:text-yellow-200',
    glow: '',
    badge: 'bg-yellow-300 text-white',
    shadow: 'shadow-md',
    statsBg: 'bg-gray-50 dark:bg-gray-700/50',
  },
  '?': {
    border: 'border-gray-200 dark:border-gray-700',
    background: 'bg-white dark:bg-gray-800',
    textColor: 'text-gray-500 dark:text-gray-400',
    glow: '',
    badge: 'bg-gray-400 text-white',
    shadow: 'shadow-md',
    statsBg: 'bg-gray-50 dark:bg-gray-700/50',
  },
};

// ProfileCardStatic 컴포넌트
export default function ProfileCardStatic({ profile, stats, loading }: ProfileCardProps) {

  // --- getRankStyle 함수 정의를 여기로 이동 --- 
  const getRankStyle = (rankLevel: string, theme: Theme) => {
    const isDark = theme === 'dark';
    const styles: { [key: string]: any } = {
      headerBg: isDark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.9)', // 기본 헤더 배경
      headerBorderColor: '', cardShadow: '', rankTextColor: '',
      statsBg: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.7)',
      badgeBg: isDark ? '#6B7280' : '#9CA3AF', badgeText: '#FFFFFF',
      cardBg: isDark ? 'rgb(17, 24, 39)' : '#ffffff',
      textColor: isDark ? '#D1D5DB' : '#374151', titleColor: isDark ? '#F9FAFB' : '#111827',
    };

    // 랭크별 스타일 정의...
     switch(rankLevel) {
       case 'S':
         styles.headerBorderColor = isDark ? '#a78bfa' : '#8b5cf6';
         styles.rankTextColor = isDark ? '#c4b5fd' : '#7c3aed';
         styles.statsBg = isDark ? 'rgba(91, 33, 182, 0.2)' : 'rgba(245, 243, 255, 1)';
         styles.badgeBg = 'linear-gradient(to right, #a855f7, #6366f1)';
         styles.badgeText = '#FFFFFF';
         styles.headerBg = isDark ? 'rgba(91, 33, 182, 0.3)' : 'rgba(245, 243, 255, 0.8)';
         break;
       case 'A+':
         styles.headerBorderColor = isDark ? '#60a5fa' : '#3b82f6';
         styles.rankTextColor = isDark ? '#93c5fd' : '#2563eb';
         styles.statsBg = isDark ? 'rgba(30, 64, 175, 0.2)' : 'rgba(239, 246, 255, 1)';
         styles.badgeBg = 'linear-gradient(to right, #3b82f6, #0ea5e9)';
         styles.badgeText = '#FFFFFF';
         styles.headerBg = isDark ? 'rgba(30, 64, 175, 0.3)' : 'rgba(239, 246, 255, 0.8)';
         break;
       case 'A':
          styles.headerBorderColor = isDark ? '#93c5fd' : '#60a5fa';
          styles.rankTextColor = isDark ? '#bfdbfe' : '#3b82f6';
          styles.statsBg = isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(219, 234, 254, 1)';
          styles.badgeBg = '#60a5fa';
          styles.badgeText = '#FFFFFF';
          styles.headerBg = isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(219, 234, 254, 0.8)';
          break;
       case 'A-':
          styles.headerBorderColor = isDark ? '#7dd3fc' : '#38bdf8';
          styles.rankTextColor = isDark ? '#bae6fd' : '#0ea5e9';
          styles.statsBg = isDark ? 'rgba(14, 165, 233, 0.15)' : 'rgba(224, 242, 254, 1)';
          styles.badgeBg = '#38bdf8';
          styles.badgeText = '#FFFFFF';
          styles.headerBg = isDark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(224, 242, 254, 0.8)';
          break;
       case 'B+':
          styles.headerBorderColor = isDark ? '#4ade80' : '#22c55e';
          styles.rankTextColor = isDark ? '#86efac' : '#16a34a';
          styles.statsBg = isDark ? 'rgba(22, 163, 74, 0.15)' : 'rgba(240, 253, 244, 1)';
          styles.badgeBg = '#22c55e';
          styles.badgeText = '#FFFFFF';
          styles.headerBg = isDark ? 'rgba(22, 163, 74, 0.2)' : 'rgba(240, 253, 244, 0.8)';
          break;
       case 'B':
          styles.headerBorderColor = isDark ? '#86efac' : '#4ade80';
          styles.rankTextColor = isDark ? '#bbf7d0' : '#22c55e';
          styles.badgeBg = '#4ade80';
          styles.badgeText = '#166534';
          styles.headerBg = isDark ? 'rgba(22, 163, 74, 0.15)' : 'rgba(240, 253, 244, 0.7)';
          break;
       case 'B-':
          styles.headerBorderColor = isDark ? '#bef264' : '#a3e635';
          styles.rankTextColor = isDark ? '#d9f99d' : '#84cc16';
          styles.badgeBg = '#a3e635';
          styles.badgeText = '#3f6212';
          styles.headerBg = isDark ? 'rgba(132, 204, 22, 0.15)' : 'rgba(247, 254, 231, 0.7)';
          break;
       case 'C+':
          styles.headerBorderColor = isDark ? '#fde047' : '#facc15';
          styles.rankTextColor = isDark ? '#fef08a' : '#eab308';
          styles.badgeBg = '#facc15';
          styles.badgeText = '#713f12';
          styles.headerBg = isDark ? 'rgba(234, 179, 8, 0.15)' : 'rgba(254, 249, 195, 0.7)';
          break;
       case 'C':
          styles.headerBorderColor = isDark ? '#fef08a' : '#fde047';
          styles.rankTextColor = isDark ? '#fef9c3' : '#facc15';
          styles.badgeBg = '#fde047';
          styles.badgeText = '#854d0e';
          styles.headerBg = isDark ? 'rgba(234, 179, 8, 0.1)' : 'rgba(254, 249, 195, 0.6)';
          break;
       default:
         styles.headerBorderColor = isDark ? '#6b7280' : '#d1d5db';
         styles.rankTextColor = isDark ? '#9ca3af' : '#6b7280';
         styles.badgeBg = isDark ? '#4b5563' : '#9ca3af';
         styles.badgeText = '#FFFFFF';
         styles.headerBg = isDark ? 'rgba(75, 85, 99, 0.1)' : 'rgba(229, 231, 235, 0.6)';
         break;
     }
    return styles;
  };
  // --- 함수 정의 끝 --- 

  const rankLevel = stats?.rank?.level ?? '?';
  const currentYear = new Date().getFullYear();
  const rankStyle = getRankStyle(rankLevel, profile.theme);
  const isDark = profile.theme === 'dark';

  return (
    <div // 전체 카드 컨테이너
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '600px',
        minHeight: '780px', // 추가: 최소 높이 설정
        fontFamily: '"BookkMyungjo", serif',
        borderRadius: '8px',
        border: `2px solid ${rankStyle.headerBorderColor}`,
        backgroundColor: rankStyle.cardBg,
        position: 'relative',
        color: rankStyle.textColor,
      }}
    >
      {/* --- 헤더 영역 (ProfileCard.tsx 상단 부분) --- */}
      <div
        style={{
          padding: '20px 24px', // 상하 패딩 조정
          display: 'flex',
          alignItems: 'center',
          gap: '16px', // gap-4
          borderBottom: `1px solid ${rankStyle.headerBorderColor}`, // 헤더 구분선 추가
          backgroundColor: rankStyle.headerBg, // 랭크에 맞는 배경색 추가
        }}
      >
        {stats?.avatarUrl && (
          // 아바타 + 테두리 효과 (div로 감싸서 표현)
          <div style={{
            width: '80px', height: '80px', // w-20 h-20
            borderRadius: '9999px', // rounded-full
            border: `2px solid ${rankStyle.headerBorderColor}`, // border-2
            padding: '2px', // p-0.5 느낌
            backgroundColor: isDark ? 'rgb(17, 24, 39)' : '#ffffff', // bg-white dark:bg-gray-800
            overflow: 'hidden',
            display: 'flex', // 추가
          }}>
            <img
              src={stats.avatarUrl}
              style={{ width: '100%', height: '100%', borderRadius: '9999px', objectFit: 'cover' }}
            />
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <h2 style={{ // text-2xl font-bold text-gray-900 dark:text-white
            fontSize: '24px',
            fontWeight: 700,
            color: rankStyle.titleColor, // titleColor 사용
            margin: 0,
            lineHeight: 1.3,
            display: 'flex', // 추가
          }}>
            {profile.name || stats?.name || '이름 없음'}
          </h2>
          {/* GitHub 사용자 이름 표시 (원래 디자인 참고) */}
          <p style={{ // text-gray-600 dark:text-gray-400
            fontSize: '14px', // text-base 정도
            color: rankStyle.textColor, // 기본 textColor 사용
            margin: '4px 0 0 0',
            lineHeight: 1.4,
            display: 'flex', // 추가
          }}>
            @{profile.githubUsername}
          </p>
        </div>
        {/* 랭크 표시는 카드 하단으로 이동 */}
      </div>

      {/* --- 본문 영역 --- */}
      <div style={{ 
        position: 'relative', 
        display: 'flex', 
        flexGrow: 1, // 본문 영역이 남은 공간 채우도록 유지
        backgroundColor: isDark ? '#111827' : '#f3f4f6', // 기본 배경색 추가
      }}>
        {/* 배경 이미지 */}
        {profile.backgroundImageUrl && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${profile.backgroundImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: profile.backgroundOpacity !== undefined ? profile.backgroundOpacity : 0.5,
            }}
          />
        )}
        
        {/* 실제 콘텐츠 */}
        <div style={{ 
          position: 'relative', 
          padding: '28px 32px', 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1, // 실제 콘텐츠 영역이 남은 공간 채우도록 유지
          backgroundColor: 'transparent',
          borderRadius: '0 0 8px 8px',
          overflow: 'hidden', // 다시 추가: 콘텐츠 넘침 방지
        }}>
          {/* 소개 섹션 */}
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 600, 
            marginBottom: '12px', // 조금 더 여백 추가
            color: isDark ? '#F3F4F6' : '#111827', 
            display: 'flex',
            alignItems: 'center',
            textShadow: profile.backgroundImageUrl ? '0 1px 2px rgba(0,0,0,0.4)' : 'none',
            padding: '0 0 4px 0',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '6px' }}>
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" 
                fill={isDark ? '#F3F4F6' : '#111827'} />
            </svg>
            About
          </div>
          <div style={{
            fontSize: '14px', 
            color: rankStyle.textColor, 
            marginBottom: '28px', // 섹션 간 간격 증가
            padding: '16px', // 패딩 증가
            borderRadius: '8px', 
            backgroundColor: isDark ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            lineHeight: 1.5,
            display: 'flex',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            justifyContent: 'flex-start',
            border: `1px solid ${rankStyle.headerBorderColor}`,
            width: '100%', // 추가: 너비 100% 설정
          }}>
            {profile.bio || stats?.bio || 'No description available.'}
          </div>

          {/* 기술 스택 섹션 */}
          {profile.skills && profile.skills.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '28px', width: '100%' }}> {/* width: 100% 추가 */}
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 600, 
                marginBottom: '12px', // 조금 더 여백 추가
                color: isDark ? '#F3F4F6' : '#111827', 
                display: 'flex',
                alignItems: 'center',
                textShadow: profile.backgroundImageUrl ? '0 1px 2px rgba(0,0,0,0.4)' : 'none',
                padding: '0 0 4px 0',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '6px' }}>
                  <path d="M15.22 4.97a.75.75 0 0 1 1.06 0l6.5 6.5a.75.75 0 0 1 0 1.06l-6.5 6.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L21.19 12l-5.97-5.97a.75.75 0 0 1 0-1.06Zm-6.44 0a.75.75 0 0 1 0 1.06L2.81 12l5.97 5.97a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-6.5-6.5a.75.75 0 0 1 0-1.06l6.5-6.5a.75.75 0 0 1 1.06 0Z" 
                  fill={isDark ? '#F3F4F6' : '#111827'} />
                </svg>
                Skills
              </div>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '10px', // 뱃지 간 간격 조금 더 늘림
                padding: '18px 24px', // 패딩 증가
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                border: `1px solid ${rankStyle.headerBorderColor}`,
              }}> 
                {profile.skills.slice(0, 15).map((skill, index) => (
                  <SimpleTechBadge key={index} tech={skill} />
                ))}
              </div>
            </div>
          )}

          {/* 통계 섹션 */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            width: '100%', // 추가: 너비 100% 설정
          }}>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: isDark ? '#F3F4F6' : '#111827', 
              marginBottom: '12px', // 조금 더 여백 추가
              display: 'flex',
              alignItems: 'center',
              textShadow: profile.backgroundImageUrl ? '0 1px 2px rgba(0,0,0,0.4)' : 'none',
              padding: '0 0 4px 0',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '6px' }}>
                <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5807 20.2772 21.0497 21.7437 19.0074C23.2101 16.965 23.9993 14.5143 24 12C24 5.37 18.63 0 12 0Z" 
                fill={isDark ? '#F3F4F6' : '#111827'} />
              </svg>
              GitHub Stats
            </div>
            
            {/* 통계 항목들 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}> 
              <div style={{ display: 'flex', gap: '16px' }}>
                {/* Commits */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '6px',
                  flex: 1, 
                  padding: '18px 12px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: `1px solid ${rankStyle.headerBorderColor}`,
                }}>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 700, 
                    color: rankStyle.titleColor,
                    display: 'flex'
                  }}>
                    {stats?.currentYearCommits ?? '-'}
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: isDark ? '#D1D5DB' : '#4B5563',
                    display: 'flex'
                  }}>
                    Commits | {currentYear}
                  </div>
                </div>
                
                {/* Stars */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '6px',
                  flex: 1, 
                  padding: '18px 12px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: `1px solid ${rankStyle.headerBorderColor}`,
                }}>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 700, 
                    color: rankStyle.titleColor,
                    display: 'flex'
                  }}>
                    {stats?.totalStars ?? '-'}
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: isDark ? '#D1D5DB' : '#4B5563',
                    display: 'flex'
                  }}>
                    Total Stars
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                {/* PRs */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '6px',
                  flex: 1, 
                  padding: '18px 12px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: `1px solid ${rankStyle.headerBorderColor}`,
                }}>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 700, 
                    color: rankStyle.titleColor,
                    display: 'flex'
                  }}>
                    {stats?.totalPRs ?? '-'}
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: isDark ? '#D1D5DB' : '#4B5563',
                    display: 'flex'
                  }}>
                    Total PRs
                  </div>
                </div>
                
                {/* Issues */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '6px',
                  flex: 1, 
                  padding: '18px 12px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: `1px solid ${rankStyle.headerBorderColor}`,
                }}>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 700, 
                    color: rankStyle.titleColor,
                    display: 'flex'
                  }}>
                    {stats?.totalIssues ?? '-'}
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: isDark ? '#D1D5DB' : '#4B5563',
                    display: 'flex'
                  }}>
                    Total Issues
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 랭크 표시 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                padding: '12px 24px',
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: `1px solid ${rankStyle.headerBorderColor}`
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: 500, 
                  color: isDark ? '#9CA3AF' : '#6B7280', 
                  marginRight: '8px',
                  display: 'flex'
                }}>
                  Rank | {currentYear} :
                </div>
                <div style={{ 
                  fontSize: '30px', 
                  fontWeight: 700, 
                  color: rankStyle.rankTextColor,
                  display: 'flex'
                }}>
                  {stats?.rank?.level ?? '?'}
                </div>
              </div>
            </div>

            {/* 크레딧 - 카드 최하단으로 이동 */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              paddingTop: '8px',
            }}>
              <div style={{ 
                fontSize: '12px', 
                color: isDark ? '#F3F4F6' : '#111827',
                display: 'flex',
                textShadow: profile.backgroundImageUrl ? '0 1px 1px rgba(0,0,0,0.2)' : 'none',
              }}>
                created by Please Readme
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 