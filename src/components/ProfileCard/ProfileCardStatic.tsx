import React from 'react';
import { ProfileCardProps } from '@/types';
import { formatNumberUnit } from '../../utils/imageUtils';

export default function ProfileCardStatic({ profile, stats, loading }: ProfileCardProps) {
  const ACCENT = '#FFD700';
  const DIM_ACCENT = '#FFD70033';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '600px',
        height: '920px',
        fontFamily: profile.fontFamily ? `"${profile.fontFamily}", monospace` : '"Pretendard", monospace',
        backgroundColor: '#000000',
        color: '#FFFFFF',
        padding: '50px',
        boxSizing: 'border-box',
        border: `3px solid ${ACCENT}`,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', borderBottom: `2px solid ${ACCENT}`, paddingBottom: '30px', marginBottom: '30px' }}>
        <span style={{ fontSize: '12px', color: ACCENT, letterSpacing: '0.2em' }}>
          NO. {stats?.totalStars || '000'} // IDENTIFICATION
        </span>
        <h1 style={{ fontSize: '48px', fontWeight: 900, margin: '10px 0 0 0', lineHeight: 1.1 }}>
          {profile.name || stats?.name || profile.githubUsername}
        </h1>
        <span style={{ fontSize: '18px', color: ACCENT, marginTop: '10px' }}>
          @{profile.githubUsername?.toUpperCase()}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
        <span style={{ fontSize: '14px', fontWeight: 900, color: ACCENT, marginBottom: '15px' }}>01_NARRATIVE</span>
        <div style={{ fontSize: '16px', lineHeight: 1.6, padding: '20px', backgroundColor: DIM_ACCENT, border: `1px solid ${ACCENT}`, fontStyle: 'italic' }}>
          "{profile.bio || stats?.bio || 'SYSTEM_INFO: No narrative data recovered'}"
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
        <span style={{ fontSize: '14px', fontWeight: 900, color: ACCENT, marginBottom: '15px' }}>02_PERFORMANCE</span>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: DIM_ACCENT, padding: '20px', border: `1px solid ${ACCENT}` }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', opacity: 0.8 }}>COMMITS</span>
            <span style={{ fontSize: '32px', fontWeight: 900 }}>{formatNumberUnit(stats?.totalCommits || 0)}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', opacity: 0.8 }}>STARS</span>
            <span style={{ fontSize: '32px', fontWeight: 900 }}>{formatNumberUnit(stats?.totalStars || 0)}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', opacity: 0.8 }}>PRs</span>
            <span style={{ fontSize: '32px', fontWeight: 900 }}>{formatNumberUnit(stats?.totalPRs || 0)}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', opacity: 0.8 }}>ISSUES</span>
            <span style={{ fontSize: '32px', fontWeight: 900 }}>{formatNumberUnit(stats?.totalIssues || 0)}</span>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', marginBottom: '40px' }}>
        <span style={{ fontSize: '14px', fontWeight: 900, color: ACCENT, marginBottom: '15px' }}>03_CORE_ARSENAL</span>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {/* Satori flex-wrap bug 우회 - 명시적 슬라이싱 4개까지만 표출 */}
          {(profile.skills && profile.skills.length > 0 ? profile.skills.slice(0, 4) : ['GITHUB', 'REACT', 'NEXTJS', 'TYPESCRIPT']).map((skill, idx) => (
             <div key={idx} style={{ 
               padding: '10px 15px', 
               border: `1px solid ${ACCENT}`, 
               backgroundColor: DIM_ACCENT,
               fontSize: '14px',
               fontWeight: 900,
               marginRight: '10px',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center'
             }}>
               {skill.toUpperCase()}
             </div>
          ))}
          {profile.skills && profile.skills.length > 4 && (
             <div style={{ 
               padding: '10px 15px', 
               border: `1px dashed ${ACCENT}`, 
               fontSize: '14px',
               fontWeight: 900,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center'
             }}>
               +{profile.skills.length - 4} MORE
             </div>
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '20px', borderTop: `2px solid ${ACCENT}55`, alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
           <span style={{ fontSize: '12px', color: ACCENT, marginBottom: '5px' }}>LAST_CALIBRATION: 2026.02</span>
           <span style={{ fontSize: '16px', color: ACCENT, fontWeight: 900 }}>STATUS: ONLINE</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
           <span style={{ fontSize: '12px', color: ACCENT, marginBottom: '5px' }}>QUALITY_CLASS</span>
           <span style={{ fontSize: '48px', fontWeight: 900, lineHeight: 1 }}>{stats?.rank?.level || '?'}</span>
        </div>
      </div>
    </div>
  );
}