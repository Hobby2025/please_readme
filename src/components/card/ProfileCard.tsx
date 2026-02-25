import React from 'react';
import { GitHubStats, ProfileConfig } from '../../types';

interface ProfileCardProps {
  stats: GitHubStats;
  config: ProfileConfig;
}

export default function ProfileCard({ stats, config }: ProfileCardProps) {
  const rank = stats.rank.level;
  
  // Dynamic Color Palette based on Rank (Vibrant & Legendary)
  const getRankColor = () => {
    switch(rank) {
      case 'S+': return '#FFE55C'; // Radiant Gold
      case 'S':  return '#BC13FE'; // Neon Purple
      case 'A+': return '#00F3FF'; // Cyber Cyan
      case 'A':  return '#30D158'; // Spring Green
      case 'B+': return '#FF9F0A'; // Bright Orange
      case 'B':  return '#FF375F'; // Neon Pink
      case 'C+': return '#E5E5EA'; // Silver Gray
      default:   return '#30D158'; // Default Green
    }
  };

  const activeColor = getRankColor();
  const terminalGradient = 'linear-gradient(135deg, #050505 0%, #121214 100%)';

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: terminalGradient,
        color: activeColor,
        padding: '8px',
        boxSizing: 'border-box',
        fontFamily: 'monospace',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          border: `1.5px solid ${activeColor}33`,
          padding: '25px 45px',
          position: 'relative',
          backgroundColor: 'transparent',
          alignItems: 'center',
          gap: '50px'
        }}
      >
        {/* Terminal Brackets / Decorators */}
        <div style={{ display: 'flex', position: 'absolute', top: '12px', left: '20px', fontSize: '12px', fontWeight: 'bold', opacity: 0.4, color: activeColor }}>
          LAST_UPDATE: {new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC
        </div>
        <div style={{ display: 'flex', position: 'absolute', inset: '8px', border: `1px solid ${activeColor}11`, pointerEvents: 'none' }} />

        {/* Left: Identity Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '250px' }}>
          <div style={{ display: 'flex', position: 'relative', marginBottom: '25px' }}>
            <img 
              src={stats.avatarUrl} 
              style={{ 
                width: '160px', 
                height: '160px', 
                borderRadius: '50%', 
                border: `4px solid ${activeColor}`,
                padding: '5px',
                filter: 'brightness(1.05) contrast(1.05)'
              }} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px', borderTop: `1px solid ${activeColor}22`, paddingTop: '10px', width: '140px' }}>
              <span style={{ display: 'flex', fontSize: '11px', fontWeight: 'bold', opacity: 0.5 }}>FOLLOWERS</span>
              <span style={{ display: 'flex', fontSize: '20px', fontWeight: '900' }}>{stats.followers || 0}</span>
            </div>
          </div>
        </div>

        {/* Middle: Core Information */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '30px' }}>
            <span style={{ display: 'flex', fontSize: '18px', fontWeight: '500', opacity: 0.7, marginBottom: '5px' }}>
              GITHUB PROFILE
            </span>
            <h1 style={{ display: 'flex', fontSize: '56px', margin: '0', fontWeight: '900', letterSpacing: '-2px', lineHeight: '1' }}>
              {stats.name || stats.username}
            </h1>
            <div style={{ display: 'flex', width: '70%', height: '2.5px', backgroundColor: activeColor, marginTop: '12px', opacity: 0.3 }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
             <h2 style={{ display: 'flex', fontSize: '20px', margin: '0', fontWeight: '900' }}>
               TECH STACK:
             </h2>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '10px' }}>
               {(stats.topLanguages.length > 0 ? stats.topLanguages : [stats.bio || 'Scale']).map((lang) => (
                 <span key={lang} style={{ 
                   display: 'flex', 
                   fontSize: '16px', 
                   fontWeight: '900', 
                   color: activeColor,
                   backgroundColor: `${activeColor}11`,
                   padding: '3px 10px',
                   borderRadius: '4px',
                   border: `1px solid ${activeColor}33`
                 }}>
                   {lang}
                 </span>
               ))}
             </div>
          </div>
        </div>

        {/* Right: Kernel Registry (Stats) */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '250px', borderLeft: `1px solid ${activeColor}22`, paddingLeft: '30px' }}>
           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px 15px', marginBottom: '25px' }}>
              {[
                { label: 'STARS', value: stats.totalStars },
                { label: 'COMMITS', value: stats.totalCommits },
                { label: 'PULL_REQ', value: stats.totalPRs },
                { label: 'ISSUES', value: stats.totalIssues }
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', flexDirection: 'column', width: '100px' }}>
                  <span style={{ display: 'flex', fontSize: '12px', fontWeight: '800', opacity: 0.5 }}>{item.label}</span>
                  <span style={{ display: 'flex', fontSize: '28px', fontWeight: '900' }}>{item.value}</span>
                </div>
              ))}
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                 <span style={{ display: 'flex', fontSize: '13px', fontWeight: 'bold', opacity: 0.6 }}>RANK</span>
                 <span style={{ display: 'flex', fontSize: '110px', fontWeight: '900', lineHeight: '1', marginTop: '-10px' }}>{rank}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', borderTop: `1px solid ${activeColor}22`, paddingTop: '8px' }}>
                 <span style={{ display: 'flex', fontSize: '12px', fontWeight: 'bold', opacity: 0.6 }}>VERIFIED_BY</span>
                 <span style={{ display: 'flex', fontSize: '15px', fontWeight: '900' }}>Please_Readme</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
