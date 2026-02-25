import React from 'react';
import { GitHubStats, ProfileConfig } from '../../types';

interface ProfileCardProps {
  stats: GitHubStats;
  config: ProfileConfig;
}

export default function ProfileCard({ stats, config }: ProfileCardProps) {
  const rank = stats.rank.level;
  
  const getRankTheme = () => {
    switch(rank) {
      case 'S+': return { color: '#FFE55C', glow: 'rgba(255, 229, 92, 0.15)' };
      case 'S':  return { color: '#BC13FE', glow: 'rgba(188, 19, 254, 0.15)' };
      case 'A+': return { color: '#00F3FF', glow: 'rgba(0, 243, 255, 0.15)' };
      case 'A':  return { color: '#30D158', glow: 'rgba(48, 209, 88, 0.15)' };
      case 'B+': return { color: '#FF9F0A', glow: 'rgba(255, 159, 10, 0.15)' };
      case 'B':  return { color: '#FF375F', glow: 'rgba(255, 55, 95, 0.15)' };
      case 'C+': return { color: '#E5E5EA', glow: 'rgba(229, 229, 234, 0.15)' };
      default:   return { color: '#30D158', glow: 'rgba(48, 209, 88, 0.15)' };
    }
  };

  const theme = getRankTheme();
  const activeColor = theme.color;
  
  // Format real GitHub Node ID into a 4-4-4 tech ID
  const nodeIdHash = Buffer.from(stats.nodeId).toString('hex').toUpperCase();
  const systemId = `${nodeIdHash.slice(0, 4)}-${nodeIdHash.slice(4, 8)}-${nodeIdHash.slice(8, 12)}`;
  const currentDate = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  // Calculate Seniority
  const joinedYear = new Date(stats.createdAt).getFullYear();
  const yearsActive = new Date().getFullYear() - joinedYear;
  let seniorityBadge = 'CORE_DEVELOPER';
  if (yearsActive >= 10) seniorityBadge = 'GENESIS_USER';
  else if (yearsActive >= 5) seniorityBadge = 'ELITE_VETERAN';

  return (
    <div
      style={{
        height: '400px',
        width: '1200px',
        display: 'flex',
        backgroundColor: '#020204',
        color: '#ffffff',
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #1a1a24',
      }}
    >
      {/* 1. MESH BACKGROUND & DEPTH */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #050508 0%, #020204 100%)' }} />
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', borderRadius: '250px', background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)` }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '600px', height: '600px', borderRadius: '300px', background: `radial-gradient(circle, ${activeColor}08 0%, transparent 70%)` }} />
      
      {/* 2. BACKGROUND WATERMARK (MASSIVE RANK) */}
      <div style={{ position: 'absolute', right: '40px', bottom: '-40px', fontSize: '320px', fontWeight: '950', color: activeColor, opacity: 0.04, lineHeight: 1, letterSpacing: '-15px' }}>
        {rank}
      </div>

      {/* 3. TECH HUD LINES & DOTS */}
      {/* Horizontal Top Segmented Line */}
      <div style={{ position: 'absolute', top: '25px', left: '60px', right: '60px', height: '1px', backgroundColor: '#ffffff0a', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '40px', height: '3px', backgroundColor: activeColor, marginTop: '-1px' }} />
        <div style={{ display: 'flex', gap: '4px' }}>
           {[1,2,3].map(i => <div key={i} style={{ width: '3px', height: '3px', backgroundColor: i === 3 ? activeColor : '#ffffff22' }} />)}
        </div>
      </div>
      
      {/* Vertical Side Accents */}
      <div style={{ position: 'absolute', left: '30px', top: '25px', bottom: '25px', width: '1px', backgroundColor: '#ffffff0a' }} />
      <div style={{ position: 'absolute', left: '26px', top: '50%', height: '40px', width: '8px', backgroundColor: `${activeColor}22`, marginTop: '-20px' }} />
      
      {/* Seniority & Status Markers */}
      <div style={{ position: 'absolute', top: '35px', left: '40px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
         <span style={{ fontSize: '12px', color: activeColor, fontWeight: '1000', letterSpacing: '1px' }}>{seniorityBadge}</span>
         <span style={{ fontSize: '11px', color: '#aaa', fontWeight: 'bold' }}>USER_SINCE_{joinedYear}</span>
      </div>

      {/* 4. MAIN CONTENT LAYER */}
      <div style={{ display: 'flex', width: '100%', height: '100%', padding: '0 40px', alignItems: 'center', zIndex: 10 }}>
        
        {/* Left: Identity Halo Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px', position: 'relative' }}>
          <div style={{ position: 'relative', width: '190px', height: '190px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             {/* Rotating Frame Feel */}
             <div style={{ position: 'absolute', width: '190px', height: '190px', borderRadius: '95px', border: `1px dashed ${activeColor}44` }} />
             <div style={{ position: 'absolute', width: '176px', height: '176px', borderRadius: '88px', border: `3px solid ${activeColor}` }} />
             <div style={{ position: 'absolute', top: 0, width: '12px', height: '12px', backgroundColor: activeColor, borderRadius: '50%' }} />
             <img 
               src={stats.avatarUrl} 
               style={{ 
                 width: '160px', 
                 height: '160px', 
                 borderRadius: '80px',
               }} 
             />
          </div>
          <div style={{ marginTop: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: activeColor, fontSize: '10px', fontWeight: '900', letterSpacing: '3px', opacity: 0.7 }}>PROFILE_CARD_ID</span>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '4px', color: '#aaa', fontFamily: 'monospace' }}>
              {systemId}
            </div>
          </div>
        </div>

        {/* Middle: Content HUD */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginLeft: '20px', minWidth: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '35px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ backgroundColor: `${activeColor}`, width: '4px', height: '18px', marginRight: '10px' }} />
              <span style={{ 
                color: activeColor, 
                fontSize: '14px', 
                fontWeight: '900',
                letterSpacing: '1px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {config.title ? config.title.toUpperCase() : 'GITHUB ENGINEER'}
              </span>
            </div>
            
            <h1 style={{ 
              fontSize: '78px', 
              margin: '0', 
              fontWeight: '1000', 
              letterSpacing: '-4px', 
              color: '#fff', 
              lineHeight: '1.2',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '650px',
              paddingBottom: '12px'
            }}>
              {stats.name || stats.username}
            </h1>
            
            <p style={{ 
              fontSize: '19px', 
              color: '#eee', 
              fontWeight: '500', 
              margin: '20px 0 0 0', 
              overflow: 'hidden', 
              whiteSpace: 'nowrap', 
              textOverflow: 'ellipsis',
              maxWidth: '650px' 
            }}>
              {stats.bio || 'Architecting digital solutions at the frontier of technology.'}
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', overflow: 'hidden', maxHeight: '35px' }}>
            {(stats.topLanguages.length > 0 ? stats.topLanguages.slice(0, 5) : ['Developer']).map((lang) => (
              <div key={lang} style={{ fontSize: '12px', fontWeight: 'bold', color: activeColor, backgroundColor: `${activeColor}11`, padding: '5px 14px', borderRadius: '2px', borderLeft: `2px solid ${activeColor}`, whiteSpace: 'nowrap' }}>
                {lang.toUpperCase()}
              </div>
            ))}
          </div>

        </div>

        {/* Right: Intelligence Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '260px', marginLeft: '40px', height: '100%', justifyContent: 'center', borderLeft: '1px solid #ffffff0d', paddingLeft: '30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '35px' }}>
            {[
              { label: 'STARS_COUNT', val: stats.totalStars, align: 'flex-start' },
              { label: 'COMMIT_TOTAL', val: stats.totalCommits, align: 'flex-end' },
              { label: 'PULL_REQUESTS', val: stats.totalPRs, align: 'flex-start' },
              { label: 'ACTIVE_ISSUES', val: stats.totalIssues, align: 'flex-end' }
            ].reduce((rows: any[], curr, i) => {
              if (i % 2 === 0) rows.push([curr]); else rows[rows.length-1].push(curr);
              return rows;
            }, []).map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                {row.map((item: any) => (
                  <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: item.align }}>
                    <span style={{ fontSize: '10px', color: '#bbb', fontWeight: '900', letterSpacing: '1px' }}>{item.label}</span>
                    <span style={{ fontSize: '30px', fontWeight: '950', color: '#fff', lineHeight: '1.1' }}>{item.val.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
             <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '16px', color: activeColor, fontWeight: '1000', letterSpacing: '4px' }}>RANK</span>
                <span style={{ fontSize: '10px', color: '#aaa', fontWeight: 'bold' }}>VERIFIED_USER</span>
             </div>
             <span style={{ fontSize: '110px', fontWeight: '1000', color: activeColor, lineHeight: '0.8' }}>{rank}</span>
          </div>
        </div>

      </div>
      
      {/* 5. FOOTER: VERIFICATION & TIMESTAMP */}
      <div style={{ position: 'absolute', bottom: '25px', left: '60px', right: '60px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ffffff0a', paddingTop: '10px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', backgroundColor: activeColor, borderRadius: '50%' }} />
            <span style={{ fontSize: '10px', color: '#bbb', fontWeight: '900', letterSpacing: '1px' }}>PLEASE_README_VERIFIED</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
           <span style={{ fontSize: '10px', color: '#bbb', fontWeight: '900', letterSpacing: '1px' }}>LAST_UPDATED:</span>
           <span style={{ fontSize: '10px', color: activeColor, fontWeight: 'bold', fontFamily: 'monospace' }}>{currentDate}</span>
        </div>
      </div>
    </div>
  );
}
