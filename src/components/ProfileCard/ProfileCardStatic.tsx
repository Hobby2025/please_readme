import React from 'react';
import { Profile, GitHubStats, ProfileCardProps, Theme } from '../../types/profile';
// TechBadge를 직접 정의해서 사용합니다
// import { TechBadge } from '../ui/TechBadge';

// 단순화된 TechBadge 컴포넌트 (@vercel/og 호환)
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

  // 아이콘을 직접 렌더링하는 대신, 색상만 사용하거나 매우 단순한 SVG만 사용
  const bgColor = bgColors[tech] || bgColors['default'];
  const textColor = textColors[tech] || textColors['default'];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: bgColor,
        color: textColor,
        padding: '3px 8px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: 500,
        lineHeight: '1.2',
        whiteSpace: 'nowrap',
        margin: '2px', // 뱃지 간 간격
      }}
    >
      {/* 아이콘은 @vercel/og에서 외부 URL 로드가 불안정할 수 있어 제거하거나 data URI 사용 */}
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

// ProfileCardStatic 컴포넌트: @vercel/og 호환 스타일 적용
export default function ProfileCardStatic({ profile, stats }: ProfileCardProps) {
  const rankLevel = stats?.rank?.level ?? '?';
  const currentYear = new Date().getFullYear();

  const getRankStyle = (rankLevel: string, theme: Theme) => {
    const isDark = theme === 'dark';
    const styles: { [key: string]: any } = {
      headerBg: '', headerBorderColor: '', cardShadow: '', rankTextColor: '',
      statsBg: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.7)', // 기본 stats 배경 (회색 계열)
      badgeBg: isDark ? '#6B7280' : '#9CA3AF', badgeText: '#FFFFFF',
      cardBg: isDark ? 'rgb(17, 24, 39)' : '#ffffff', // 기본 카드 배경 (rgb 사용)
      textColor: isDark ? '#D1D5DB' : '#374151', titleColor: isDark ? '#F9FAFB' : '#111827', // 텍스트 색상 조정
    };

    // 랭크별 스타일 정의... (이전 코드와 유사하게 각 case별로 설정)
     switch(rankLevel) {
       case 'S':
         styles.headerBorderColor = isDark ? '#a78bfa' : '#8b5cf6';
         styles.rankTextColor = isDark ? '#c4b5fd' : '#7c3aed'; // 더 밝거나 어두운 보라
         styles.statsBg = isDark ? 'rgba(91, 33, 182, 0.2)' : 'rgba(245, 243, 255, 1)';
         styles.badgeBg = 'linear-gradient(to right, #a855f7, #6366f1)';
         styles.badgeText = '#FFFFFF';
         // cardShadow는 @vercel/og에서 직접 지원 안 함 (테두리로 강조)
         break;
       case 'A+':
         styles.headerBorderColor = isDark ? '#60a5fa' : '#3b82f6';
         styles.rankTextColor = isDark ? '#93c5fd' : '#2563eb'; // 더 밝거나 어두운 파랑
         styles.statsBg = isDark ? 'rgba(30, 64, 175, 0.2)' : 'rgba(239, 246, 255, 1)';
         styles.badgeBg = 'linear-gradient(to right, #3b82f6, #0ea5e9)';
         styles.badgeText = '#FFFFFF';
         break;
       case 'A':
          styles.headerBorderColor = isDark ? '#93c5fd' : '#60a5fa';
          styles.rankTextColor = isDark ? '#bfdbfe' : '#3b82f6';
          styles.statsBg = isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(219, 234, 254, 1)';
          styles.badgeBg = '#60a5fa';
          styles.badgeText = '#FFFFFF';
          break;
       case 'A-':
          styles.headerBorderColor = isDark ? '#7dd3fc' : '#38bdf8';
          styles.rankTextColor = isDark ? '#bae6fd' : '#0ea5e9';
          styles.statsBg = isDark ? 'rgba(14, 165, 233, 0.15)' : 'rgba(224, 242, 254, 1)';
          styles.badgeBg = '#38bdf8';
          styles.badgeText = '#FFFFFF';
          break;
       case 'B+':
          styles.headerBorderColor = isDark ? '#4ade80' : '#22c55e';
          styles.rankTextColor = isDark ? '#86efac' : '#16a34a';
          styles.statsBg = isDark ? 'rgba(22, 163, 74, 0.15)' : 'rgba(240, 253, 244, 1)';
          styles.badgeBg = '#22c55e';
          styles.badgeText = '#FFFFFF';
          break;
       case 'B':
          styles.headerBorderColor = isDark ? '#86efac' : '#4ade80'; // 테두리 색 조정
          styles.rankTextColor = isDark ? '#bbf7d0' : '#22c55e';
          styles.badgeBg = '#4ade80';
          styles.badgeText = '#166534'; // 어두운 텍스트
          break;
       case 'B-':
          styles.headerBorderColor = isDark ? '#bef264' : '#a3e635';
          styles.rankTextColor = isDark ? '#d9f99d' : '#84cc16';
          styles.badgeBg = '#a3e635';
          styles.badgeText = '#3f6212'; // 어두운 텍스트
          break;
       case 'C+':
          styles.headerBorderColor = isDark ? '#fde047' : '#facc15';
          styles.rankTextColor = isDark ? '#fef08a' : '#eab308';
          styles.badgeBg = '#facc15';
          styles.badgeText = '#713f12'; // 어두운 텍스트
          break;
       case 'C':
          styles.headerBorderColor = isDark ? '#fef08a' : '#fde047'; // 테두리 색 조정
          styles.rankTextColor = isDark ? '#fef9c3' : '#facc15';
          styles.badgeBg = '#fde047';
          styles.badgeText = '#854d0e'; // 어두운 텍스트
          break;
       default: // '?' 또는 기타
         styles.headerBorderColor = isDark ? '#6b7280' : '#d1d5db';
         styles.rankTextColor = isDark ? '#9ca3af' : '#6b7280';
         styles.badgeBg = isDark ? '#4b5563' : '#9ca3af';
         styles.badgeText = '#FFFFFF';
         break;
     }

    return styles;
  };

  const rankStyle = getRankStyle(rankLevel, profile.theme);
  const isDark = profile.theme === 'dark';

  return (
    <div // 전체 카드 컨테이너
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '500px',
        // height: '280px', // @vercel/og는 높이를 명시적으로 지정해야 함
        fontFamily: '"Noto Sans KR", sans-serif',
        borderRadius: '8px', // 0.5rem
        border: `1px solid ${rankStyle.headerBorderColor}`,
        backgroundColor: rankStyle.cardBg,
        position: 'relative', // 배경 이미지 오버레이용
        color: rankStyle.textColor, // 기본 텍스트 색
      }}
    >
      {/* 배경 이미지 */}
      {profile.backgroundImageUrl && (
        <img
          src={profile.backgroundImageUrl}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 0, opacity: 0.1, // 투명도 약하게
          }}
        />
      )}

      {/* 콘텐츠 영역 (배경 위) */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>

        {/* 헤더 */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', // gap 조정
            padding: '16px 24px', // p-4 px-6 정도
            borderBottom: `1px solid ${rankStyle.headerBorderColor}`,
          }}
        >
          {stats?.avatarUrl && (
             <img
               src={stats.avatarUrl}
               style={{ width: '64px', height: '64px', borderRadius: '9999px' }}
             />
           )}
           <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
             <h1 style={{ fontSize: '20px', fontWeight: 700, color: rankStyle.titleColor, margin: 0, lineHeight: 1.3 }}>
               {profile.name || profile.githubUsername}
             </h1>
             {profile.bio && (
               <p style={{ fontSize: '13px', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                 {profile.bio}
               </p>
             )}
           </div>
           {/* 랭크 배지 */}
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: '16px' }}>
               <div style={{
                   display: 'inline-flex', // inline-block 대신 flex
                   padding: '5px 10px', // 패딩 조정
                   borderRadius: '6px',
                   fontSize: '13px', // 약간 크게
                   fontWeight: 600,
                   background: rankStyle.badgeBg,
                   color: rankStyle.badgeText,
               }}>
                  Rank {rankLevel}
               </div>
               <p style={{ fontSize: '10px', margin: '4px 0 0 0', color: rankStyle.textColor }}>
                   (Top {stats?.rank.percentile ?? '?'}%)
               </p>
           </div>
        </div>

        {/* 본문 */}
        <div style={{ padding: '16px 24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}> {/* p-4 px-6 */}
          {/* 기술 스택 */}
          {profile.skills && profile.skills.length > 0 && (
            <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              {profile.skills.slice(0, 15).map((skill) => ( // 너무 많으면 잘릴 수 있도록 제한
                <SimpleTechBadge key={skill} tech={skill} />
              ))}
            </div>
          )}

          {/* 구분선 (선택적) */}
          {profile.skills && profile.skills.length > 0 && (
            <div style={{ height: '1px', margin: '8px 0 12px 0', background: `linear-gradient(to right, transparent, ${rankStyle.headerBorderColor} 50%, transparent)` }} />
          )}

          {/* 통계 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: 'auto' }}> {/* gap 조정, marginTop: auto */}
            <div style={{ textAlign: 'center', padding: '6px', borderRadius: '6px', flex: 1, background: rankStyle.statsBg }}>
               <p style={{ fontSize: '18px', fontWeight: 700, color: rankStyle.rankTextColor, margin: 0, lineHeight: 1.2 }}>
                 {stats?.totalStars ?? '-'}
               </p>
               <p style={{ fontSize: '10px', color: rankStyle.textColor, margin: '2px 0 0 0' }}>Total Stars</p>
            </div>
             <div style={{ textAlign: 'center', padding: '6px', borderRadius: '6px', flex: 1, background: rankStyle.statsBg }}>
               <p style={{ fontSize: '18px', fontWeight: 700, color: rankStyle.rankTextColor, margin: 0, lineHeight: 1.2 }}>
                 {stats?.currentYearCommits ?? '-'}
               </p>
               <p style={{ fontSize: '10px', color: rankStyle.textColor, margin: '2px 0 0 0' }}>Commits ({currentYear})</p>
            </div>
             <div style={{ textAlign: 'center', padding: '6px', borderRadius: '6px', flex: 1, background: rankStyle.statsBg }}>
               <p style={{ fontSize: '18px', fontWeight: 700, color: rankStyle.rankTextColor, margin: 0, lineHeight: 1.2 }}>
                 {stats?.totalPRs ?? '-'}
               </p>
               <p style={{ fontSize: '10px', color: rankStyle.textColor, margin: '2px 0 0 0' }}>Total PRs</p>
            </div>
             <div style={{ textAlign: 'center', padding: '6px', borderRadius: '6px', flex: 1, background: rankStyle.statsBg }}>
               <p style={{ fontSize: '18px', fontWeight: 700, color: rankStyle.rankTextColor, margin: 0, lineHeight: 1.2 }}>
                 {stats?.totalIssues ?? '-'}
               </p>
               <p style={{ fontSize: '10px', color: rankStyle.textColor, margin: '2px 0 0 0' }}>Total Issues</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
} 