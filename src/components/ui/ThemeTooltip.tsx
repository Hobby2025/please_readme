import React, { useState } from 'react';
import { Theme } from '@/types/profile';
import { getRankStyle } from '@/styles/rankThemes';

interface ThemeTooltipProps {
  theme: Theme;
  children: React.ReactNode;
}

const ThemeTooltip: React.FC<ThemeTooltipProps> = ({ theme, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  // 랭크 레벨 배열
  const rankLevels = ['S', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', '?'];

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div className="absolute z-10 w-64 p-3 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            {theme === 'dark' ? '다크 테마' : '라이트 테마'} 스펙트럼
          </div>
          <div className="grid grid-cols-1 gap-2">
            {rankLevels.map(rank => {
              const style = getRankStyle(rank, theme);
              return (
                <div key={rank} className="flex items-center space-x-2">
                  <div className="flex-shrink-0 w-6 text-start">{rank}</div>
                  <div className="flex-1 flex space-x-1">
                    <div 
                      className="w-8 h-6 rounded" 
                      style={{ backgroundColor: style.headerBorderColor }}
                      title="headerBorderColor"
                    />
                    <div 
                      className="w-8 h-6 rounded" 
                      style={{ backgroundColor: style.rankTextColor }}
                      title="rankTextColor"
                    />
                    <div 
                      className="w-8 h-6 rounded" 
                      style={{ background: style.badgeBg }}
                      title="badgeBg"
                    />
                    <div 
                      className="w-8 h-6 rounded" 
                      style={{ backgroundColor: style.cardBg }}
                      title="cardBg"
                    />
                    <div 
                      className="w-8 h-6 rounded" 
                      style={{ backgroundColor: style.textColor }}
                      title="textColor"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeTooltip; 