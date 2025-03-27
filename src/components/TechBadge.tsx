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
      className="inline-flex rounded-full items-center py-1 pl-2 pr-1 text-sm font-medium transition-all"
      style={{ 
        backgroundColor: `${techColor}20`, 
        color: techColor,
        border: `1px solid ${techColor}40`
      }}
    >
      {hasIcon ? (
        <i className={`${techIcons[formattedTech]} mr-1`} style={{ fontSize: '16px' }}></i>
      ) : null}
      {tech}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(tech)}
          className="flex-shrink-0 ml-1 h-5 w-5 rounded-full inline-flex items-center justify-center hover:bg-black/10 focus:outline-none transition-colors"
          style={{ color: techColor }}
        >
          <span className="sr-only">제거</span>
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      )}
    </span>
  );
} 