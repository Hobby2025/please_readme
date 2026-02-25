import React from 'react';
import { ProfileCardProps } from '@/types';
import { formatNumberUnit } from '../../utils/imageUtils';
import { getRankStyle } from '@/themes/cardThemes';

// ProfileCardStatic component: Redesigned as a Premium Technical Label
export default function ProfileCardStatic({ profile, stats, loading }: ProfileCardProps) {
  const rankLevel = stats?.rank?.level ?? '?';
  const currentYear = new Date().getFullYear();
  const rankStyle = getRankStyle(rankLevel, profile.theme);
  
  // Dynamic Palette based on Theme
  const ACCENT = rankStyle.headerBorderColor || '#FFD700';
  const ACCENT_DIM = `${ACCENT}88`;
  const ACCENT_GHOST = `${ACCENT}11`;

  const truncateText = (text: string, len: number) => {
    return text.length > len ? text.slice(0, len - 3) + '...' : text;
  };
  
  const bioRaw = `"${profile.bio || stats?.bio || 'SYSTEM_INFO: No narrative data recovered from target server.'}"`;
  const bioText = truncateText(bioRaw, 130);
  
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '600px',
        height: '920px',
        fontFamily: profile.fontFamily ? `"${profile.fontFamily}", monospace` : '"JetBrains Mono", "Roboto Mono", monospace',
        backgroundColor: '#000000',
        position: 'relative',
        color: ACCENT,
        border: `3px solid ${ACCENT}`,
        padding: '0',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '-180px', // 위치 조정
        width: '400px',
        height: '40px',
        backgroundColor: ACCENT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'rotate(-90deg)', // 전체 회전으로 세로 효과
        zIndex: 10,
      }}>
        <div style={{
          color: '#000000',
          fontSize: '14px',
          fontWeight: 900,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          display: 'flex',
        }}>
          {`PLEASE_README_PROTOCOL_V3.1.7 // PROPERTY_OF_${profile.githubUsername?.toUpperCase() || 'UNKNOWN'}`}
        </div>
      </div>

      {/* Main Label Content */}
      <div style={{ marginLeft: '40px', padding: '50px', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
        
        {/* Top Header Information */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${ACCENT}`, paddingBottom: '20px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, opacity: 0.6, display: 'flex' }}>
              {`SPECIFICATION_LABEL / NO. ${stats?.totalStars || '0000'}`}
            </span>
            <h1 style={{ 
              fontSize: '42px', 
              fontWeight: 900, 
              margin: 0, 
              lineHeight: 0.9, 
              letterSpacing: '-0.02em', 
              color: '#FFF',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '350px',
              display: 'flex',
            }}>
              {profile.name || stats?.name || 'UNKNOWN'}
            </h1>
            <span style={{ fontSize: '14px', fontWeight: 700, color: ACCENT, display: 'flex' }}>
              {`GITHUB_USER_LINK // @${profile.githubUsername?.toUpperCase()}`}
            </span>
          </div>
          
          <div style={{ 
            width: '120px', 
            height: '120px', 
            border: `2px solid ${ACCENT}`, 
            position: 'relative',
            background: ACCENT_GHOST,
            display: 'flex',
          }}>
            {stats?.avatarUrl ? (
              <img src={stats.avatarUrl} style={{ width: '100%', height: '100%' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '10px', textAlign: 'center', width: '100%' }}>NO_IMAGE</div>
            )}
            {/* Crosshair decorators */}
            <div style={{ position: 'absolute', top: '-5px', left: '-5px', width: '10px', height: '10px', borderTop: `2px solid ${ACCENT}`, borderLeft: `2px solid ${ACCENT}`, display: 'flex' }} />
            <div style={{ position: 'absolute', top: '-5px', right: '-5px', width: '10px', height: '10px', borderTop: `2px solid ${ACCENT}`, borderRight: `2px solid ${ACCENT}`, display: 'flex' }} />
            <div style={{ position: 'absolute', bottom: '-5px', left: '-5px', width: '10px', height: '10px', borderBottom: `2px solid ${ACCENT}`, borderLeft: `2px solid ${ACCENT}`, display: 'flex' }} />
            <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', width: '10px', height: '10px', borderBottom: `2px solid ${ACCENT}`, borderRight: `2px solid ${ACCENT}`, display: 'flex' }} />
          </div>
        </div>

        {/* Technical Data Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* IDENTIFICATION DATA */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, borderLeft: `5px solid ${ACCENT}`, paddingLeft: '10px', marginBottom: '15px', display: 'flex' }}>01_IDENTIFICATION_NARRATIVE</div>
            <div style={{ 
              backgroundColor: ACCENT_GHOST, 
              padding: '20px', 
              fontSize: '15px', 
              lineHeight: 1.6, 
              color: '#FFF', 
              border: `1px solid ${ACCENT_DIM}`,
              fontStyle: 'italic',
              display: 'flex',
              overflow: 'hidden',
              height: '80px' // 줄어들거나 늘어나도 레이아웃 유지
            }}>
              {bioText}
            </div>
          </div>

          {/* ARSENAL DATA */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, borderLeft: `5px solid ${ACCENT}`, paddingLeft: '10px', marginBottom: '15px', display: 'flex' }}>02_TECHNICAL_CORE_ARSENAL</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {(() => {
                const allSkills = profile.skills && profile.skills.length > 0 
                  ? profile.skills 
                  : ['GITHUB', 'TYPESCRIPT', 'NEXTJS', 'REACT'];
                
                const MAX_SKILLS = 12;
                const displaySkills = allSkills.length > MAX_SKILLS 
                  ? [...allSkills.slice(0, 11), `+${allSkills.length - 11} MORE`]
                  : allSkills;

                return displaySkills.map((skill, i) => (
                  <div key={i} style={{ 
                    border: `1px solid ${ACCENT_DIM}`, 
                    padding: '10px 5px', 
                    fontSize: '11px', 
                    textAlign: 'center', 
                    fontWeight: 900,
                    backgroundColor: ACCENT_GHOST,
                    width: '107px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>{skill.toUpperCase()}</div>
                ));
              })()}
            </div>
          </div>

          {/* DIAGNOSTIC DATA */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, borderLeft: `5px solid ${ACCENT}`, paddingLeft: '10px', marginBottom: '15px', display: 'flex' }}>03_PERFORMANCE_DIAGNOSTICS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1px', backgroundColor: ACCENT_DIM, border: `1px solid ${ACCENT_DIM}` }}>
              {[
                { label: 'TOTAL_COMMITS', value: formatNumberUnit(stats?.totalCommits || 0) },
                { label: 'DELIVERED_STARS', value: formatNumberUnit(stats?.totalStars || 0) },
                { label: 'PULL_REQUESTS', value: formatNumberUnit(stats?.totalPRs || 0) },
                { label: 'SYSTEM_ISSUES', value: formatNumberUnit(stats?.totalIssues || 0) },
              ].map((stat, i) => (
                <div key={i} style={{ backgroundColor: '#000', padding: '20px', display: 'flex', flexDirection: 'column', gap: '5px', width: '228px' }}>
                   <span style={{ fontSize: '9px', fontWeight: 900, opacity: 0.6 }}>{stat.label}</span>
                   <span style={{ fontSize: '28px', fontWeight: 900, color: '#FFF' }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QC Stamp Section */}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ fontSize: '10px', fontWeight: 900, color: ACCENT_DIM, display: 'flex' }}>
              {`LAST_CALIBRATION: ${currentYear}.02.25`}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 900, color: ACCENT, display: 'flex' }}>STATUS: // SECURED_STABLE</div>
            <div style={{ display: 'flex', width: '150px', height: '40px', overflow: 'hidden' }}>
              {[...Array(25)].map((_, i) => (
                <div key={i} style={{ width: i % 2 === 0 ? '2px' : '4px', height: '100%', backgroundColor: ACCENT, marginRight: '2px', display: 'flex' }} />
              ))}
            </div>          </div>

          <div style={{ 
            width: '120px', 
            height: '110px', 
            border: `4px solid ${ACCENT}`, 
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'rotate(-15deg)',
            background: 'rgba(0,0,0,0.5)',
          }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: ACCENT }}>QC_PASSED</span>
            <span style={{ fontSize: '48px', fontWeight: 900, color: '#FFF', lineHeight: 1 }}>{rankLevel}</span>
            <span style={{ fontSize: '10px', fontWeight: 900, color: ACCENT }}>RANK_AUTH</span>
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute',
        top: '20%',
        right: '-10%',
        fontSize: '200px',
        fontWeight: 900,
        color: ACCENT_GHOST,
        zIndex: 0,
        display: 'flex',
      }}>
        {rankLevel}
      </div>
    </div>
  );
}