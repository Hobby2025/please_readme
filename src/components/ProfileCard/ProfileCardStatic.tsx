import React from 'react';
import { Profile, GitHubStats, ProfileCardProps, Theme } from '../../types/profile';

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
        display: 'flex',
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

// ProfileCardStatic 컴포넌트
export default function ProfileCardStatic({ profile, stats, loading }: ProfileCardProps) {

  // --- getRankStyle 함수 정의를 여기로 이동 --- 
  const getRankStyle = (rankLevel: string, theme: Theme) => {
    const isDark = theme === 'dark';
    const styles: { [key: string]: any } = {
      headerBg: '', headerBorderColor: '', cardShadow: '', rankTextColor: '',
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
         break;
       case 'A+':
         styles.headerBorderColor = isDark ? '#60a5fa' : '#3b82f6';
         styles.rankTextColor = isDark ? '#93c5fd' : '#2563eb';
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
          styles.headerBorderColor = isDark ? '#86efac' : '#4ade80';
          styles.rankTextColor = isDark ? '#bbf7d0' : '#22c55e';
          styles.badgeBg = '#4ade80';
          styles.badgeText = '#166534';
          break;
       case 'B-':
          styles.headerBorderColor = isDark ? '#bef264' : '#a3e635';
          styles.rankTextColor = isDark ? '#d9f99d' : '#84cc16';
          styles.badgeBg = '#a3e635';
          styles.badgeText = '#3f6212';
          break;
       case 'C+':
          styles.headerBorderColor = isDark ? '#fde047' : '#facc15';
          styles.rankTextColor = isDark ? '#fef08a' : '#eab308';
          styles.badgeBg = '#facc15';
          styles.badgeText = '#713f12';
          break;
       case 'C':
          styles.headerBorderColor = isDark ? '#fef08a' : '#fde047';
          styles.rankTextColor = isDark ? '#fef9c3' : '#facc15';
          styles.badgeBg = '#fde047';
          styles.badgeText = '#854d0e';
          break;
       default:
         styles.headerBorderColor = isDark ? '#6b7280' : '#d1d5db';
         styles.rankTextColor = isDark ? '#9ca3af' : '#6b7280';
         styles.badgeBg = isDark ? '#4b5563' : '#9ca3af';
         styles.badgeText = '#FFFFFF';
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
        height: '700px',
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
          padding: '24px', // p-6
          display: 'flex',
          alignItems: 'center',
          gap: '16px', // gap-4
          borderBottom: `1px solid ${rankStyle.headerBorderColor}`, // 헤더 구분선 추가
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
      <div style={{ position: 'relative', display: 'flex', flexGrow: 1 }}>
        {/* 배경 이미지는 완전히 제거하고 단순화 */}
        
        {/* 실제 콘텐츠 */}
        <div style={{ 
          position: 'relative', 
          padding: '24px', 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1, 
          backgroundColor: isDark ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderRadius: '0 0 8px 8px',
          overflow: 'hidden', // auto에서 hidden으로 변경
        }}>
          {/* 소개 섹션 */}
          <div style={{ 
            fontSize: '18px', 
            fontWeight: 600, 
            marginBottom: '8px', 
            color: isDark ? '#E5E7EB' : '#1F2937', 
            display: 'flex',
            justifyContent: 'flex-start'
          }}>
            소개
          </div>
          <div style={{
            fontSize: '14px', 
            color: rankStyle.textColor, 
            marginBottom: '16px', 
            padding: '8px',
            borderRadius: '8px', 
            backgroundColor: isDark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.7)',
            lineHeight: 1.5,
            display: 'flex',
            justifyContent: 'flex-start'
          }}>
            {profile.bio || stats?.bio || '소개가 없습니다.'}
          </div>

          {/* 구분선 - 여백 축소 */}
          <div style={{ 
            height: '1px', 
            margin: '12px 0', // 여백 축소
            background: `linear-gradient(to right, transparent, ${isDark ? '#4B5563' : '#D1D5DB'} 50%, transparent)`,
            display: 'flex' 
          }} />

          {/* 기술 스택 섹션 - 여백 축소 */}
          {profile.skills && profile.skills.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                marginBottom: '6px', // 여백 축소
                color: isDark ? '#E5E7EB' : '#1F2937', 
                display: 'flex',
                justifyContent: 'flex-start'
              }}>
                기술스택
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}> {/* 여백 축소 */}
                {profile.skills.slice(0, 15).map((skill, index) => (
                  <SimpleTechBadge key={index} tech={skill} />
                ))}
              </div>
            </div>
          )}

          {/* 구분선 - 여백 축소 */}
          <div style={{ 
            height: '1px', 
            margin: '12px 0', // 여백 축소
            background: `linear-gradient(to right, transparent, ${isDark ? '#4B5563' : '#D1D5DB'} 50%, transparent)`,
            display: 'flex' 
          }} />

          {/* 통계 섹션 - 여백 축소 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: isDark ? '#E5E7EB' : '#1F2937', 
              marginBottom: '12px', // 여백 축소
              display: 'flex',
              justifyContent: 'flex-start'
            }}>
              GitHub 통계
            </div>
            
            {/* 통계 항목들 - 여백 축소 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}> {/* 여백 축소 */}
              <div style={{ display: 'flex', gap: '16px' }}>
                {/* Commits */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '4px', 
                  flex: 1, 
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? 'rgba(31, 41, 55, 0.6)' : 'rgba(255, 255, 255, 0.7)'
                }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: 700, 
                    color: rankStyle.titleColor,
                    display: 'flex'
                  }}>
                    {stats?.currentYearCommits ?? '-'}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
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
                  gap: '4px', 
                  flex: 1, 
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? 'rgba(31, 41, 55, 0.6)' : 'rgba(255, 255, 255, 0.7)'
                }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: 700, 
                    color: rankStyle.titleColor,
                    display: 'flex'
                  }}>
                    {stats?.totalStars ?? '-'}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
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
                  gap: '4px', 
                  flex: 1, 
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? 'rgba(31, 41, 55, 0.6)' : 'rgba(255, 255, 255, 0.7)'
                }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: 700, 
                    color: rankStyle.titleColor,
                    display: 'flex'
                  }}>
                    {stats?.totalPRs ?? '-'}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
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
                  gap: '4px', 
                  flex: 1, 
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? 'rgba(31, 41, 55, 0.6)' : 'rgba(255, 255, 255, 0.7)'
                }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: 700, 
                    color: rankStyle.titleColor,
                    display: 'flex'
                  }}>
                    {stats?.totalIssues ?? '-'}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: isDark ? '#D1D5DB' : '#4B5563',
                    display: 'flex'
                  }}>
                    Total Issues
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 랭크 표시 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
              <div style={{
                display: 'flex',
                padding: '12px 24px',
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.6)',
                alignItems: 'center'
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

            {/* 크레딧 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <div style={{ 
                fontSize: '12px', 
                color: isDark ? '#6B7280' : '#9CA3AF',
                display: 'flex'
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