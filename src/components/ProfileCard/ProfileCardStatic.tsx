import React from 'react';
import { Profile, GitHubStats, ProfileCardProps, SimpleTechBadgeProps, TechNormalizationMap, CardTheme } from '@/types';
import { formatNumberUnit } from '../../utils/imageUtils';
import { getRankStyle } from '@/themes/cardThemes';
import { FiStar, FiExternalLink, FiMapPin, FiUsers, FiBriefcase, FiMail, FiTwitter, FiLink, FiCalendar, FiEdit } from 'react-icons/fi';
import { SiGithub } from 'react-icons/si';
import Head from 'next/head';
import { getTechColor, darkenColor } from '@/utils/colorUtils';

const SimpleTechBadge: React.FC<SimpleTechBadgeProps> = ({ tech }) => {
  const { background: bgColor, text: textColor } = getTechColor(tech);
  
  const darkBgColor = darkenColor(bgColor);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${bgColor}, ${darkBgColor})`,
        color: textColor,
        padding: '5px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.02em',
        lineHeight: '1.2',
        width: '125px',
        height: '30px',
        textAlign: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        margin: '0',
        boxSizing: 'border-box',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      {tech}
    </div>
  );
};

// ProfileCardStatic component
export default function ProfileCardStatic({ profile, stats, loading }: ProfileCardProps) {
  const rankLevel = stats?.rank?.level ?? '?';
  console.log('[ProfileCardStatic] stats:', stats);
  console.log('[ProfileCardStatic] 랭크 정보:', stats?.rank);
  console.log('[ProfileCardStatic] 랭크 레벨:', rankLevel);

  const SKILLS_PER_ROW = 4;
  const skillsCount = profile.skills?.length || 0;
  const skillRows = Math.ceil(skillsCount / SKILLS_PER_ROW);
  console.log('[ProfileCardStatic] 기술 스택 줄 수:', skillRows);

  const BASE_HEIGHT = (profile.fontFamily === 'BookkMyungjo' || profile.fontFamily === 'BMJUA_ttf') ? 780 : 820;
  const ROW_HEIGHT = 40;
  const cardHeight = BASE_HEIGHT + (Math.max(0, skillRows - 1) * ROW_HEIGHT);
  console.log('[ProfileCardStatic] 사용 폰트:', profile.fontFamily);
  console.log('[ProfileCardStatic] 계산된 카드 높이:', cardHeight);

  const currentYear = new Date().getFullYear();
  
  // 내부 테마 매핑 로직 제거
  // const cardTheme: CardTheme = profile.theme === 'light' ? 'pastel' : 'default'; 
  
  // profile.theme (이제 CardTheme 타입)을 직접 사용
  const rankStyle = getRankStyle(rankLevel, profile.theme); 

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '600px',
        height: `${cardHeight}px`,
        fontFamily: profile.fontFamily ? `"${profile.fontFamily}", serif` : '"BookkMyungjo", serif',
        borderRadius: '0',
        border: 'none',
        backgroundColor: rankStyle.cardBg, // Theme-based card background
        position: 'relative',
        color: rankStyle.textColor, // Theme-based text color
      }}
    >
      {/* Header Section */}
      <div
        style={{
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          borderBottom: `1px solid ${rankStyle.headerBorderColor}`,
          backgroundColor: rankStyle.headerBg, // Rank-based header background
          borderRadius: '0',
        }}
      >
        {stats?.avatarUrl && (
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '9999px',
              border: `2px solid ${rankStyle.headerBorderColor}`,
              padding: '2px',
              backgroundColor: rankStyle.cardBg,
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            <img
              src={stats.avatarUrl}
              style={{ width: '100%', height: '100%', borderRadius: '9999px', objectFit: 'cover' }}
            />
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: rankStyle.titleColor, // Theme-based title color
              margin: 0,
              lineHeight: 1.3,
              display: 'flex',
            }}
          >
            {profile.name || stats?.name || '이름 없음'}
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: rankStyle.textColor,
              margin: '4px 0 0 0',
              lineHeight: 1.4,
              display: 'flex',
            }}
          >
            @{profile.githubUsername}
          </p>
        </div>
        {stats?.totalStars !== undefined && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '16px',
              padding: '6px 12px',
              border: `1px solid ${rankStyle.headerBorderColor}`,
              position: 'absolute',
              right: '24px',
              top: '20px',
            }}
          >
            <span
              style={{
                color: '#FFD700',
                fontSize: '16px',
                lineHeight: 1,
                fontWeight: 'bold',
                textShadow: '0 1px 2px rgba(0,0,0,0.7)',
              }}
            >
              ★
            </span>
            <span
              style={{
                color: '#FFD700',
                fontWeight: '600',
                fontSize: '15px',
                textShadow: '0 1px 1px rgba(0,0,0,0.5)',
              }}
            >
              {formatNumberUnit(stats.totalStars)}
            </span>
          </div>
        )}
      </div>

      {/* Body Section */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexGrow: 1,
          background: `linear-gradient(to bottom right, ${rankStyle.headerBg}, ${rankStyle.cardBg})`, // Gradient from header to card background
          borderRadius: '0',
        }}
      >
        <div
          style={{
            position: 'relative',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            backgroundColor: 'transparent',
            borderRadius: '0',
            overflow: 'hidden',
          }}
        >
          {/* About Section */}
          <div
            style={{
              fontSize: '20px',
              fontWeight: 600,
              marginBottom: '12px',
              color: rankStyle.titleColor,
              display: 'flex',
              alignItems: 'center',
              textShadow: profile.backgroundImageUrl ? '0 1px 2px rgba(0,0,0,0.4)' : 'none',
              padding: '0 0 4px 0',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '6px' }}>
              <path
                d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                fill={rankStyle.titleColor}
              />
            </svg>
            About
          </div>
          <div
            style={{
              fontSize: '14px',
              color: rankStyle.textColor,
              marginBottom: '28px',
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: rankStyle.statsBg, // Rank-based stats background
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              lineHeight: 1.5,
            }}
          >
            {profile.bio || stats?.bio || 'No description available.'}
          </div>

          {/* Skills Section */}
          {profile.skills && profile.skills.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px', width: '100%', justifyContent: 'center' }}>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  marginBottom: '12px',
                  color: rankStyle.titleColor,
                  display: 'flex',
                  alignItems: 'center',
                  textShadow: profile.backgroundImageUrl ? '0 1px 2px rgba(0,0,0,0.4)' : 'none',
                  padding: '0 0 4px 0',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '6px' }}>
                  <path
                    d="M15.22 4.97a.75.75 0 0 1 1.06 0l6.5 6.5a.75.75 0 0 1 0 1.06l-6.5 6.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L21.19 12l-5.97-5.97a.75.75 0 0 1 0-1.06Zm-6.44 0a.75.75 0 0 1 0 1.06L2.81 12l5.97 5.97a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-6.5-6.5a.75.75 0 0 1 0-1.06l6.5-6.5a.75.75 0 0 1 1.06 0Z"
                    fill={rankStyle.titleColor}
                  />
                </svg>
                Skills
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  padding: '12px',
                  borderRadius: '6px',
                  backgroundColor: rankStyle.statsBg,
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  justifyContent: 'flex-start',
                  gap: '8px',
                  boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.05)',
                }}
              >
                {(() => {
                  const techNormalization: TechNormalizationMap = {
                    'CSS': 'CSS',
                    'CSS3': 'CSS',
                    'HTML': 'HTML',
                    'HTML5': 'HTML',
                    'Tailwind CSS': 'Tailwind CSS',
                    'TailwindCSS': 'Tailwind CSS',
                    'Spring Boot': 'Spring',
                    'Spring': 'Spring',
                    'Node.js': 'Node.js',
                    'NodeJS': 'Node.js',
                    'Javascript': 'JavaScript',
                    'JS': 'JavaScript',
                    'TS': 'TypeScript',
                    'ReactJS': 'React',
                    'ReactNative': 'React Native',
                    'VueJS': 'Vue.js',
                    'Vue': 'Vue.js',
                    'Postgres': 'PostgreSQL',
                    'MySQL': 'MySQL',
                    'MariaDB': 'MySQL',
                  };
                  const normalizedSkills = profile.skills.map(skill => techNormalization[skill] || skill);
                  const uniqueSkills = Array.from(new Set(normalizedSkills));
                  return uniqueSkills.slice(0, 16).map((skill, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '120px',
                        height: '24px',
                        flexShrink: 0,
                        marginBottom: '8px',
                      }}
                    >
                      <SimpleTechBadge tech={skill} />
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* GitHub Stats Section */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: rankStyle.titleColor,
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                textShadow: profile.backgroundImageUrl ? '0 1px 2px rgba(0,0,0,0.4)' : 'none',
                padding: '0 0 4px 0',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '6px' }}>
                <path
                  d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5807 20.2772 21.0497 21.7437 19.0074C23.2101 16.965 23.9993 14.5143 24 12C24 5.37 18.63 0 12 0Z"
                  fill={rankStyle.titleColor}
                />
              </svg>
              GitHub Stats
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '6px',
                    flex: 1,
                    padding: '18px 12px',
                    borderRadius: '8px',
                    backgroundColor: rankStyle.statsBg,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: 'none',
                  }}
                >
                  <div style={{ fontSize: '24px', fontWeight: 700, color: rankStyle.titleColor, display: 'flex' }}>
                    {stats?.totalCommits ?? '-'}
                  </div>
                  <div style={{ fontSize: '13px', color: rankStyle.textColor, display: 'flex' }}>
                    Total Commits
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '6px',
                    flex: 1,
                    padding: '18px 12px',
                    borderRadius: '8px',
                    backgroundColor: rankStyle.statsBg,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: 'none',
                  }}
                >
                  <div style={{ fontSize: '24px', fontWeight: 700, color: rankStyle.titleColor, display: 'flex' }}>
                    {stats?.currentYearCommits ?? '-'}
                  </div>
                  <div style={{ fontSize: '13px', color: rankStyle.textColor, display: 'flex' }}>
                    Commits | {currentYear}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '6px',
                    flex: 1,
                    padding: '18px 12px',
                    borderRadius: '8px',
                    backgroundColor: rankStyle.statsBg,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: 'none',
                  }}
                >
                  <div style={{ fontSize: '24px', fontWeight: 700, color: rankStyle.titleColor, display: 'flex' }}>
                    {stats?.totalPRs ?? '-'}
                  </div>
                  <div style={{ fontSize: '13px', color: rankStyle.textColor, display: 'flex' }}>
                    Total PRs
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '6px',
                    flex: 1,
                    padding: '18px 12px',
                    borderRadius: '8px',
                    backgroundColor: rankStyle.statsBg,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: 'none',
                  }}
                >
                  <div style={{ fontSize: '24px', fontWeight: 700, color: rankStyle.titleColor, display: 'flex' }}>
                    {stats?.totalIssues ?? '-'}
                  </div>
                  <div style={{ fontSize: '13px', color: rankStyle.textColor, display: 'flex' }}>
                    Total Issues
                  </div>
                </div>
              </div>
            </div>

            {/* Rank Display */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', marginTop: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  background: rankStyle.badgeBg, // Rank-based badge background
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                  minWidth: '150px',
                }}
              >
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: rankStyle.badgeText,
                    marginRight: '12px',
                    display: 'flex',
                  }}
                >
                  RANK:
                </div>
                <div
                  style={{
                    fontSize: '42px',
                    fontWeight: 800,
                    color: rankStyle.rankTextColor,
                    display: 'flex',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  {stats?.rank?.level ?? '?'}
                </div>
              </div>
            </div>

            {/* Credits */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
              <div
                style={{
                  fontSize: '12px',
                  color: rankStyle.textColor,
                  display: 'flex',
                  textShadow: profile.backgroundImageUrl ? '0 1px 1px rgba(0,0,0,0.2)' : 'none',
                }}
              >
                created by Please Readme
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}