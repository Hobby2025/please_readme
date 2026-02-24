import React from 'react';
import { Profile, GitHubStats, ProfileCardProps, SimpleTechBadgeProps, TechNormalizationMap, CardTheme, RankStyle } from '@/types';
import { formatNumberUnit } from '../../utils/imageUtils';
import { getRankStyle } from '@/themes/cardThemes';
import { FiStar, FiExternalLink, FiMapPin, FiUsers, FiBriefcase, FiMail, FiTwitter, FiLink, FiCalendar, FiEdit } from 'react-icons/fi';
import { SiGithub } from 'react-icons/si';
import Head from 'next/head';
import { getTechColor, darkenColor } from '@/utils/colorUtils';

// ProfileCardStatic component: Redesigned as a Premium Technical Label
export default function ProfileCardStatic({ profile, stats, loading }: ProfileCardProps) {
  const rankLevel = stats?.rank?.level ?? '?';
  const currentYear = new Date().getFullYear();
  const rankStyle = getRankStyle(rankLevel, profile.theme);
  
  // Dynamic Palette based on Theme
  const ACCENT = rankStyle.headerBorderColor || '#FFD700';
  const ACCENT_DIM = `${ACCENT}88`;
  const ACCENT_GHOST = `${ACCENT}11`;
  
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
      {/* Decorative Side Barcode Strip */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '40px',
        height: '100%',
        backgroundColor: ACCENT,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 0',
        zIndex: 10,
      }}>
        <div style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          color: '#000000',
          fontSize: '14px',
          fontWeight: 900,
          letterSpacing: '0.5em',
          textTransform: 'uppercase',
        }}>
          PLEASE_README_PROTOCOL_V3.1.7 // PROPERTY_OF_{profile.githubUsername?.toUpperCase() || 'UNKNOWN'}
        </div>
      </div>

      {/* Main Label Content */}
      <div style={{ marginLeft: '40px', padding: '50px', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
        
        {/* Top Header Information */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${ACCENT}`, paddingBottom: '20px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, opacity: 0.6 }}>SPECIFICATION_LABEL / NO. {stats?.totalStars || '0000'}</span>
            <h1 style={{ fontSize: '42px', fontWeight: 900, margin: 0, lineHeight: 0.9, letterSpacing: '-0.02em', color: '#FFF' }}>
              {profile.name || stats?.name || 'UNKNOWN'}
            </h1>
            <span style={{ fontSize: '14px', fontWeight: 700, color: ACCENT }}>GITHUB_USER_LINK // @{profile.githubUsername?.toUpperCase()}</span>
          </div>
          
          <div style={{ 
            width: '120px', 
            height: '120px', 
            border: `2px solid ${ACCENT}`, 
            position: 'relative',
            background: ACCENT_GHOST
          }}>
            {stats?.avatarUrl ? (
              <img src={stats.avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.2)' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '10px', textAlign: 'center' }}>NO_IMAGE</div>
            )}
            {/* Crosshair decorators */}
            <div style={{ position: 'absolute', top: '-5px', left: '-5px', width: '10px', height: '10px', borderTop: `2px solid ${ACCENT}`, borderLeft: `2px solid ${ACCENT}` }} />
            <div style={{ position: 'absolute', top: '-5px', right: '-5px', width: '10px', height: '10px', borderTop: `2px solid ${ACCENT}`, borderRight: `2px solid ${ACCENT}` }} />
            <div style={{ position: 'absolute', bottom: '-5px', left: '-5px', width: '10px', height: '10px', borderBottom: `2px solid ${ACCENT}`, borderLeft: `2px solid ${ACCENT}` }} />
            <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', width: '10px', height: '10px', borderBottom: `2px solid ${ACCENT}`, borderRight: `2px solid ${ACCENT}` }} />
          </div>
        </div>

        {/* Technical Data Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* IDENTIFICATION DATA */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 900, borderLeft: `5px solid ${ACCENT}`, paddingLeft: '10px', marginBottom: '15px' }}>01_IDENTIFICATION_NARRATIVE</div>
            <div style={{ 
              backgroundColor: ACCENT_GHOST, 
              padding: '20px', 
              fontSize: '15px', 
              lineHeight: 1.6, 
              color: '#FFF', 
              border: `1px solid ${ACCENT_DIM}`,
              fontStyle: 'italic'
            }}>
              "{profile.bio || stats?.bio || 'SYSTEM_INFO: No narrative data recovered from target server.'}"
            </div>
          </div>

          {/* ARSENAL DATA */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 900, borderLeft: `5px solid ${ACCENT}`, paddingLeft: '10px', marginBottom: '15px' }}>02_TECHNICAL_CORE_ARSENAL</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {(profile.skills && profile.skills.length > 0 ? profile.skills.slice(0, 12) : ['GITHUB', 'TYPESCRIPT', 'NEXTJS', 'REACT']).map((skill, i) => (
                <div key={i} style={{ 
                  border: `1px solid ${ACCENT_DIM}`, 
                  padding: '10px 5px', 
                  fontSize: '11px', 
                  textAlign: 'center', 
                  fontWeight: 900,
                  backgroundColor: ACCENT_GHOST,
                  width: '107px', // 460px 넓이에서 10px 간격 4열 기준
                }}>{skill.toUpperCase()}</div>
              ))}
            </div>
          </div>

          {/* DIAGNOSTIC DATA */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 900, borderLeft: `5px solid ${ACCENT}`, paddingLeft: '10px', marginBottom: '15px' }}>03_PERFORMANCE_DIAGNOSTICS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1px', backgroundColor: ACCENT_DIM, border: `1px solid ${ACCENT_DIM}` }}>
              {[
                { label: 'TOTAL_COMMITS', value: formatNumberUnit(stats?.totalCommits || 0) },
                { label: 'DELIVERED_STARS', value: formatNumberUnit(stats?.totalStars || 0) },
                { label: 'PULL_REQUESTS', value: formatNumberUnit(stats?.totalPRs || 0) },
                { label: 'SYSTEM_ISSUES', value: formatNumberUnit(stats?.totalIssues || 0) },
              ].map((stat, i) => (
                <div key={i} style={{ backgroundColor: '#000', padding: '20px', display: 'flex', flexDirection: 'column', gap: '5px', width: '229.5px' }}>
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
            <div style={{ fontSize: '10px', fontWeight: 900, color: ACCENT_DIM }}>LAST_CALIBRATION: {currentYear}.02.25</div>
            <div style={{ fontSize: '12px', fontWeight: 900, color: ACCENT }}>STATUS: // SECURED_STABLE</div>
            <div style={{ width: '150px', height: '40px', background: `repeating-linear-gradient(90deg, ${ACCENT}, ${ACCENT} 2px, transparent 2px, transparent 4px)` }} />
          </div>

          <div style={{ 
            width: '120px', 
            height: '110px', 
            border: `4px double ${ACCENT}`, 
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'rotate(-15deg)',
            background: 'rgba(0,0,0,0.5)',
            boxShadow: `0 0 15px ${ACCENT_DIM}`
          }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: ACCENT }}>QC_PASSED</span>
            <span style={{ fontSize: '48px', fontWeight: 900, color: '#FFF', lineHeight: 1 }}>{rankLevel}</span>
            <span style={{ fontSize: '10px', fontWeight: 900, color: ACCENT }}>RANK_AUTH</span>
          </div>
        </div>
      </div>

      {/* Background Decorative Text */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '-10%',
        fontSize: '200px',
        fontWeight: 900,
        color: ACCENT_GHOST,
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        {rankLevel}
      </div>
    </div>
  );
}