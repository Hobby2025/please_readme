import React from 'react';
import { Profile, GitHubStats, ProfileCardProps, Theme } from '../../types/profile';

// 단순화된 TechBadge 컴포넌트 (@vercel/og 호환) - 아이콘 없음
const SimpleTechBadge = ({ tech }: { tech: string }) => {
  const bgColors: Record<string, string> = {
    // 기본 스택
    'React': '#61DAFB',
    'TypeScript': '#3178C6',
    'JavaScript': '#F7DF1E',
    'Next.js': '#000000',
    'Node.js': '#339933',
    'Python': '#3776AB',
    'Java': '#007396',
    'Go': '#00ADD8',
    'CSS3': '#1572B6',
    'CSS': '#1572B6',
    'HTML5': '#E34F26',
    'HTML': '#E34F26',
    'Tailwind CSS': '#06B6D4',
    'TailwindCSS': '#06B6D4',
    'MySQL': '#4479A1',
    'PostgreSQL': '#4169E1',
    'MongoDB': '#47A248',
    'Express': '#000000',
    'GraphQL': '#E10098',
    'Redux': '#764ABC',
    'Git': '#F05032',
    'Docker': '#2496ED',
    'Kubernetes': '#326CE5',
    'AWS': '#232F3E',
    'Vue.js': '#4FC08D',
    'Angular': '#DD0031',
    'Linux': '#FCC624',
    'Rust': '#DEA584',
    'Kotlin': '#7F52FF',
    'Swift': '#F05138',
    'Redis': '#DC382D',
    'C#': '#512BD4',
    'PHP': '#777BB4',
    'Ruby': '#CC342D',
    'Sass': '#CC6699',
    'Figma': '#F24E1E',
    'Spring Boot': '#6DB33F',
    'Spring': '#6DB33F',
    'C++': '#00599C',
    'Django': '#092E20',
    'Flask': '#000000',
    'GCP': '#4285F4',
    'Azure': '#0078D4',
    'Bootstrap': '#7952B3',
    'Svelte': '#FF3E00',
    'MobX': '#FF9955',
    'Cypress': '#17202C',
    'GitHub': '#181717',
    'GitLab': '#FC6D26',
    'Jira': '#0052CC',

    // 기타 스택
    'REST API': '#FF6C37', 
    'CI/CD': '#D33833',
    '테스트': '#4E9BCD',
    'default': '#2563EB'
  };

  const textColors: Record<string, string> = {
    'JavaScript': '#000000',
    'Linux': '#000000',
    'Rust': '#000000',
    'default': '#FFFFFF'
  };

  const bgColor = bgColors[tech] || bgColors['default'];
  const textColor = textColors[tech] || textColors['default'];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        color: textColor,
        padding: '5px 8px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 500,
        lineHeight: '1.2',
        whiteSpace: 'nowrap',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        margin: '0 auto',
        textAlign: 'center',
        maxWidth: '100%', // 너비 제한
      }}
    >
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
    const styles: { [key: string]: any } = {
      headerBg: 'rgba(31, 41, 55, 0.7)', // 다크 테마 기본 헤더 배경
      headerBorderColor: '', cardShadow: '', rankTextColor: '',
      statsBg: 'rgba(55, 65, 81, 0.5)',
      badgeBg: '#6B7280', badgeText: '#FFFFFF',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB', titleColor: '#F9FAFB',
    };

    // 랭크별 스타일 정의...
     switch(rankLevel) {
       case 'S':
         styles.headerBorderColor = '#a78bfa';
         styles.rankTextColor = '#c4b5fd';
         styles.statsBg = 'rgba(91, 33, 182, 0.2)';
         styles.badgeBg = 'linear-gradient(to right, #a855f7, #6366f1)';
         styles.badgeText = '#FFFFFF';
         styles.headerBg = 'rgba(91, 33, 182, 0.3)';
         break;
       case 'A+':
         styles.headerBorderColor = '#60a5fa';
         styles.rankTextColor = '#93c5fd';
         styles.statsBg = 'rgba(30, 64, 175, 0.2)';
         styles.badgeBg = 'linear-gradient(to right, #3b82f6, #0ea5e9)';
         styles.badgeText = '#FFFFFF';
         styles.headerBg = 'rgba(30, 64, 175, 0.3)';
         break;
       case 'A':
          styles.headerBorderColor = '#93c5fd';
          styles.rankTextColor = '#bfdbfe';
          styles.statsBg = 'rgba(59, 130, 246, 0.15)';
          styles.badgeBg = '#60a5fa';
          styles.badgeText = '#FFFFFF';
          styles.headerBg = 'rgba(59, 130, 246, 0.2)';
          break;
       case 'A-':
          styles.headerBorderColor = '#7dd3fc';
          styles.rankTextColor = '#bae6fd';
          styles.statsBg = 'rgba(14, 165, 233, 0.15)';
          styles.badgeBg = '#38bdf8';
          styles.badgeText = '#FFFFFF';
          styles.headerBg = 'rgba(14, 165, 233, 0.2)';
          break;
       case 'B+':
          styles.headerBorderColor = '#4ade80';
          styles.rankTextColor = '#86efac';
          styles.statsBg = 'rgba(22, 163, 74, 0.15)';
          styles.badgeBg = '#22c55e';
          styles.badgeText = '#FFFFFF';
          styles.headerBg = 'rgba(22, 163, 74, 0.2)';
          break;
       case 'B':
          styles.headerBorderColor = '#86efac';
          styles.rankTextColor = '#bbf7d0';
          styles.badgeBg = '#4ade80';
          styles.badgeText = '#166534';
          styles.headerBg = 'rgba(22, 163, 74, 0.15)';
          break;
       case 'B-':
          styles.headerBorderColor = '#bef264';
          styles.rankTextColor = '#d9f99d';
          styles.badgeBg = '#a3e635';
          styles.badgeText = '#3f6212';
          styles.headerBg = 'rgba(132, 204, 22, 0.15)';
          break;
       case 'C+':
          styles.headerBorderColor = '#fde047';
          styles.rankTextColor = '#fef08a';
          styles.badgeBg = '#facc15';
          styles.badgeText = '#713f12';
          styles.headerBg = 'rgba(234, 179, 8, 0.15)';
          break;
       case 'C':
          styles.headerBorderColor = '#fef08a';
          styles.rankTextColor = '#fef9c3';
          styles.badgeBg = '#fde047';
          styles.badgeText = '#854d0e';
          styles.headerBg = 'rgba(234, 179, 8, 0.1)';
          break;
       default:
         styles.headerBorderColor = '#6b7280';
         styles.rankTextColor = '#9ca3af';
         styles.badgeBg = '#4b5563';
         styles.badgeText = '#FFFFFF';
         styles.headerBg = 'rgba(75, 85, 99, 0.1)';
         break;
     }
    return styles;
  };
  // --- 함수 정의 끝 --- 

  const rankLevel = stats?.rank?.level ?? '?';
  console.log('[ProfileCardStatic] stats:', stats);
  console.log('[ProfileCardStatic] 랭크 정보:', stats?.rank);
  console.log('[ProfileCardStatic] 랭크 레벨:', rankLevel);
  
  // 기술 스택 줄 수 계산 (한 줄에 4개 제한)
  const SKILLS_PER_ROW = 4;
  const skillsCount = profile.skills?.length || 0;
  const skillRows = Math.ceil(skillsCount / SKILLS_PER_ROW);
  console.log('[ProfileCardStatic] 기술 스택 줄 수:', skillRows);
  
  // 기본 높이 + 추가 줄 수에 따른 높이 계산 (줄당 40px 추가)
  const BASE_HEIGHT = 780;
  const ROW_HEIGHT = 40;
  const cardHeight = BASE_HEIGHT + (Math.max(0, skillRows - 1) * ROW_HEIGHT);
  console.log('[ProfileCardStatic] 계산된 카드 높이:', cardHeight);
  
  // 기술 스택 간격 조정을 위한 상수 (정확한 값으로 수정)
  const BADGE_WIDTH = 110; // 고정 뱃지 너비

  const currentYear = new Date().getFullYear();
  const rankStyle = getRankStyle(rankLevel, profile.theme);

  return (
    <div // 전체 카드 컨테이너
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '600px',
        height: `${cardHeight}px`,
        fontFamily: '"BookkMyungjo", serif',
        borderRadius: '0',
        border: 'none',
        backgroundColor: rankStyle.cardBg,
        position: 'relative',
        color: rankStyle.textColor,
      }}
    >
      {/* --- 헤더 영역 (ProfileCard.tsx 상단 부분) --- */}
      <div
        style={{
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          borderBottom: `1px solid ${rankStyle.headerBorderColor}`,
          backgroundColor: rankStyle.headerBg,
          borderRadius: '0',
        }}
      >
        {stats?.avatarUrl && (
          // 아바타 + 테두리 효과 (div로 감싸서 표현)
          <div style={{
            width: '80px', height: '80px',
            borderRadius: '9999px',
            border: `2px solid ${rankStyle.headerBorderColor}`,
            padding: '2px',
            backgroundColor: 'rgb(17, 24, 39)',
            overflow: 'hidden',
            display: 'flex',
          }}>
            <img
              src={stats.avatarUrl}
              style={{ width: '100%', height: '100%', borderRadius: '9999px', objectFit: 'cover' }}
            />
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: rankStyle.titleColor,
            margin: 0,
            lineHeight: 1.3,
            display: 'flex',
          }}>
            {profile.name || stats?.name || '이름 없음'}
          </h2>
          {/* GitHub 사용자 이름 표시 (원래 디자인 참고) */}
          <p style={{
            fontSize: '14px',
            color: rankStyle.textColor,
            margin: '4px 0 0 0',
            lineHeight: 1.4,
            display: 'flex',
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
        flexGrow: 1,
        backgroundColor: '#111827',
        background: `linear-gradient(to bottom right, ${rankStyle.headerBg.replace('rgba', 'rgba').replace('0.3', '0.1')}, ${rankStyle.cardBg})`,
        borderRadius: '0',
      }}>
        {/* 실제 콘텐츠 */}
        <div style={{ 
          position: 'relative', 
          padding: '28px 32px', 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1,
          backgroundColor: 'transparent',
          borderRadius: '0',
          overflow: 'hidden',
        }}>
          {/* 소개 섹션 */}
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 600, 
            marginBottom: '12px',
            color: '#FFFFFF', 
            display: 'flex',
            alignItems: 'center',
            textShadow: profile.backgroundImageUrl ? '0 1px 2px rgba(0,0,0,0.4)' : 'none',
            padding: '0 0 4px 0',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '6px' }}>
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" 
                fill="#FFFFFF" />
            </svg>
            About
          </div>
          <div style={{
            fontSize: '14px', 
            color: '#FFFFFF', 
            marginBottom: '28px',
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(17, 24, 39, 0.85)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            lineHeight: 1.5
          }}>
            {profile.bio || stats?.bio || 'No description available.'}
          </div>

          {/* 기술 스택 섹션 */}
          {profile.skills && profile.skills.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '28px', width: '100%' }}>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 600, 
                marginBottom: '12px',
                color: '#FFFFFF', 
                display: 'flex',
                alignItems: 'center',
                textShadow: profile.backgroundImageUrl ? '0 1px 2px rgba(0,0,0,0.4)' : 'none',
                padding: '0 0 4px 0',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '6px' }}>
                  <path d="M15.22 4.97a.75.75 0 0 1 1.06 0l6.5 6.5a.75.75 0 0 1 0 1.06l-6.5 6.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L21.19 12l-5.97-5.97a.75.75 0 0 1 0-1.06Zm-6.44 0a.75.75 0 0 1 0 1.06L2.81 12l5.97 5.97a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-6.5-6.5a.75.75 0 0 1 0-1.06l6.5-6.5a.75.75 0 0 1 1.06 0Z" 
                  fill="#F3F4F6" />
                </svg>
                Skills
              </div>
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '16px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(17, 24, 39, 0.85)',
                border: 'none',
                justifyContent: 'space-between',
              }}> 
                {profile.skills.slice(0, 15).map((skill, index) => (
                  <div key={index} style={{ 
                    width: `${BADGE_WIDTH}px`,
                    marginBottom: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <SimpleTechBadge tech={skill} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 통계 섹션 */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            width: '100%',
          }}>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: '#FFFFFF', 
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              textShadow: profile.backgroundImageUrl ? '0 1px 2px rgba(0,0,0,0.4)' : 'none',
              padding: '0 0 4px 0',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '6px' }}>
                <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5807 20.2772 21.0497 21.7437 19.0074C23.2101 16.965 23.9993 14.5143 24 12C24 5.37 18.63 0 12 0Z" 
                fill="#F3F4F6" />
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
                  backgroundColor: 'rgba(17, 24, 39, 0.85)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  border: 'none',
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
                    color: '#9CA3AF',
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
                  backgroundColor: 'rgba(17, 24, 39, 0.85)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  border: 'none',
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
                    color: '#9CA3AF',
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
                  backgroundColor: 'rgba(17, 24, 39, 0.85)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  border: 'none',
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
                    color: '#9CA3AF',
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
                  backgroundColor: 'rgba(17, 24, 39, 0.85)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  border: 'none',
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
                    color: '#9CA3AF',
                    display: 'flex'
                  }}>
                    Total Issues
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 랭크 표시 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', marginTop: '8px' }}>
              <div style={{
                display: 'flex',
                padding: '16px 32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(17, 24, 39, 0.85)',
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3)`,
                border: 'none',
                minWidth: '150px',
              }}>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  color: '#9CA3AF',
                  marginRight: '12px',
                  display: 'flex'
                }}>
                  RANK:
                </div>
                <div style={{ 
                  fontSize: '42px', 
                  fontWeight: 800, 
                  color: rankStyle.rankTextColor,
                  display: 'flex',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
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
                color: '#FFFFFF',
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