import { FC } from 'react';
import { cn } from '../../utils/cn';
import { techMap, TechInfo } from '../../constants/techStacks';
import { FaQuestionCircle } from 'react-icons/fa';

interface TechBadgeProps {
  tech: string;
}

// HEX 코드 추출 함수 (예: "bg-[#RRGGBB]" -> "#RRGGBB")
const getHexColor = (className: string): string | undefined => {
  const match = className.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/);
  return match ? match[0] : undefined;
};

const getTechInfo = (tech: string): TechInfo => {
  return techMap[tech] || techMap['default'];
};

export const TechBadge: FC<TechBadgeProps> = ({ tech }) => {
  const techInfo = getTechInfo(tech);
  
  // 디버깅을 위한 콘솔 로그 추가
  // console.log(`Rendering TechBadge for: ${tech}`, techInfo);

  // techInfo 또는 아이콘이 유효하지 않은 경우 처리
  if (!techInfo || !techInfo.icon) {
    console.error(`[TechBadge] Invalid tech info or icon found for tech: ${tech}`, techInfo);
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium gap-1.5 bg-gray-400 text-white">
        <FaQuestionCircle className="w-4 h-4 mr-1" />
        {tech}
      </span>
    );
  }

  const { icon: Icon, bg, text } = techInfo;
  const backgroundColor = getHexColor(bg);

  return (
    <span
      className={cn(
        'inline-grid grid-cols-[auto_1fr] items-center px-3 py-1.5 rounded-full text-sm font-medium gap-x-1.5',
        text
      )}
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="flex items-center justify-center w-5 h-5">
        <Icon className="flex-shrink-0 w-full h-full" />
      </div>
      <span className='text-center'>{tech}</span>
    </span>
  );
}; 