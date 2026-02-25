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
      case 'S+': return { color: '#FFE55C' };
      case 'S':  return { color: '#BC13FE' };
      case 'A+': return { color: '#00F3FF' };
      case 'A':  return { color: '#30D158' };
      case 'B+': return { color: '#FF9F0A' };
      case 'B':  return { color: '#FF375F' };
      case 'C+': return { color: '#E5E5EA' };
      default:   return { color: '#30D158' };
    }
  };

  const theme = getRankTheme();
  const activeColor = theme.color;
  
  // Generate a techy system ID (replaces redundant username)
  const systemId = Buffer.from(stats.username).toString('hex').substring(0, 10).toUpperCase();
  const currentDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

  return (
    <div
      style={{
        height: '400px',
        width: '1200px',
        display: 'flex',
        backgroundColor: '#0a0a0c',
        color: '#ffffff',
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #1a1a1f',
      }}
    >
      {/* Background Decorator */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '200px', backgroundColor: `${activeColor}08` }} />
      
      {/* Top Accent Line */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', backgroundColor: `${activeColor}44` }} />

      <div style={{ display: 'flex', width: '100%', height: '100%', padding: '0 60px', alignItems: 'center' }}>
        
        {/* Left: Identity Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '240px', position: 'relative' }}>
          <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <div style={{ position: 'absolute', width: '202px', height: '202px', borderRadius: '101px', border: `1.5px solid ${activeColor}33` }} />
             <div style={{ position: 'absolute', width: '190px', height: '190px', borderRadius: '95px', border: `3px solid ${activeColor}` }} />
             <img 
               src={stats.avatarUrl} 
               style={{ 
                 width: '176px', 
                 height: '176px', 
                 borderRadius: '88px',
               }} 
             />
          </div>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: activeColor, fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px', opacity: 0.6 }}>SYSTEM_ID</span>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '2px', color: '#fff', opacity: 0.8, letterSpacing: '1px' }}>
              {systemId}
            </div>
          </div>
        </div>

        {/* Middle: Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginLeft: '60px', minWidth: 0, position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '35px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ 
                backgroundColor: `${activeColor}15`, 
                color: activeColor, 
                padding: '4px 12px', 
                borderRadius: '4px', 
                fontSize: '13px', 
                fontWeight: 'bold',
                border: `1px solid ${activeColor}44`
              }}>
                {config.title || 'GITHUB ENGINEER'}
              </span>
            </div>
            
            <h1 style={{ fontSize: '76px', margin: '0', fontWeight: '950', letterSpacing: '-3px', color: '#fff', lineHeight: '0.9' }}>
              {stats.name || stats.username}
            </h1>
            
            <p style={{ fontSize: '18px', color: '#808085', fontWeight: '500', margin: '15px 0 0 0', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {stats.bio || 'Building future-proof applications with excellence.'}
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(stats.topLanguages.length > 0 ? stats.topLanguages.slice(0, 5) : ['Developer']).map((lang) => (
              <div key={lang} style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff', backgroundColor: '#ffffff08', padding: '5px 12px', borderRadius: '4px', border: '1px solid #ffffff15' }}>
                {lang}
              </div>
            ))}
          </div>

          {/* Footer Info Area */}
          <div style={{ display: 'flex', marginTop: '40px', paddingTop: '15px', borderTop: '1px solid #ffffff08', gap: '30px', alignItems: 'baseline' }}>
             <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '9px', color: '#555', fontWeight: 'bold', letterSpacing: '1px' }}>LAST UPDATED</span>
                <span style={{ fontSize: '12px', color: '#888', fontWeight: '600' }}>{currentDate} UTC</span>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '9px', color: '#555', fontWeight: 'bold', letterSpacing: '1px' }}>VERIFIED BY</span>
                <span style={{ fontSize: '12px', color: activeColor, fontWeight: '800' }}>Please Readme</span>
             </div>
          </div>
        </div>

        {/* Right: Metric Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '320px', marginLeft: '60px', height: '100%', justifyContent: 'center', borderLeft: '1px solid #ffffff0d', paddingLeft: '50px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', color: '#606065', fontWeight: 'bold', letterSpacing: '1px' }}>STARS</span>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>{stats.totalStars.toLocaleString()}</span>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '11px', color: '#606065', fontWeight: 'bold', letterSpacing: '1px' }}>COMMITS</span>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>{stats.totalCommits.toLocaleString()}</span>
               </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', color: '#606065', fontWeight: 'bold', letterSpacing: '1px' }}>PULL REQUESTS</span>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>{stats.totalPRs.toLocaleString()}</span>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '11px', color: '#606065', fontWeight: 'bold', letterSpacing: '1px' }}>ISSUES</span>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>{stats.totalIssues.toLocaleString()}</span>
               </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
             <span style={{ fontSize: '110px', fontWeight: '1000', color: activeColor, lineHeight: '0.8' }}>{rank}</span>
             <div style={{ display: 'flex', flexDirection: 'column', borderLeft: `2px solid ${activeColor}33`, paddingLeft: '15px' }}>
                <span style={{ fontSize: '15px', color: activeColor, fontWeight: '900', letterSpacing: '3px' }}>RANK</span>
                <span style={{ fontSize: '10px', color: '#404045', fontWeight: 'bold', marginTop: '2px' }}>CORE ENGINE v4</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
