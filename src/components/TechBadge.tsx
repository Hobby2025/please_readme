'use client';

import { useState, useEffect } from 'react';
import { techIcons, techColors } from '../utils/techIcons';

interface TechBadgeProps {
  tech: string;
  onRemove?: (tech: string) => void;
}

export default function TechBadge({ tech, onRemove }: TechBadgeProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // DevIcon CSS 로드 (클라이언트 사이드에서만)
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css';
    
    // 이미 로드되어 있는지 확인
    if (!document.querySelector('link[href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"]')) {
      document.head.appendChild(link);
    }
    
    return () => {
      // 컴포넌트가 언마운트되면 CSS 제거하지 않음 (다른 뱃지에서도 사용 가능)
    };
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  const formattedTech = tech.toLowerCase().trim();
  const hasIcon = techIcons[formattedTech] !== undefined;
  const techColor = techColors[formattedTech] || '#3a3a3a';
  
  return (
    <span
      className="inline-flex rounded-md items-center py-1.5 pl-2 pr-2.5 text-xs font-medium shadow-sm transition-all duration-200 hover:shadow-md"
      style={{ 
        backgroundColor: techColor, 
        color: '#ffffff',
        border: `1px solid ${techColor}`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
      }}
    >
      {hasIcon ? (
        <div className="flex items-center justify-center mr-1.5 relative">
          <i 
            className={`${techIcons[formattedTech]}`} 
            style={{ 
              fontSize: '16px',
              color: '#ffffff',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}
          ></i>
        </div>
      ) : (
        <span 
          className="w-4 h-4 rounded-full mr-1.5 flex items-center justify-center bg-white/30"
        >
          <span className="text-2xs font-bold text-white">
            {tech.charAt(0).toUpperCase()}
          </span>
        </span>
      )}
      
      <span className="font-bold tracking-wide text-white text-xs" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
        {tech}
      </span>

      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(tech)}
          className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center bg-white/20 hover:bg-white/30 focus:outline-none transition-colors"
          style={{ 
            color: '#ffffff'
          }}
        >
          <span className="sr-only">제거</span>
          <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      )}
    </span>
  );
} 