import { RankStyle, CardTheme } from '@/types';

// 테마별 랭크 스타일 시스템 정의
// export interface RankStyle { ... }

// 테마별 랭크 스타일 시스템 
// 테마별 랭크 스타일 시스템 
export const themeStyles: Record<CardTheme, Record<string, RankStyle>> = {
  // Classic Gold (The Standard)
  default: {
    'S': {
      headerBorderColor: '#FFD700', // Pure Gold
      rankTextColor: '#FFD700',
      statsBg: 'rgba(255, 215, 0, 0.05)',
      badgeBg: '#FFD700',
      badgeText: '#000000',
      headerBg: '#000000',
      cardShadow: '0 0 40px rgba(255, 215, 0, 0.3)',
      cardBg: '#000000',
      textColor: '#FFFFFF',
      titleColor: '#FFD700',
    },
    '?': {
      headerBorderColor: '#FFD700',
      rankTextColor: '#FFD700',
      statsBg: 'rgba(255, 215, 0, 0.05)',
      badgeBg: '#FFD700',
      badgeText: '#000000',
      headerBg: '#000000',
      cardShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
      cardBg: '#000000',
      textColor: '#A0A0A0',
      titleColor: '#FFFFFF',
    },
  },

  // Cyber Crimson (Red & Gold)
  cosmic: {
    'S': {
      headerBorderColor: '#FF4500', // Orange Red
      rankTextColor: '#FFD700',
      statsBg: 'rgba(255, 69, 0, 0.05)',
      badgeBg: '#FF4500',
      badgeText: '#FFFFFF',
      headerBg: '#000000',
      cardShadow: '0 0 40px rgba(255, 69, 0, 0.3)',
      cardBg: '#000000',
      textColor: '#FFFFFF',
      titleColor: '#FF4500',
    },
    '?': {
      headerBorderColor: '#FF4500',
      rankTextColor: '#FFD700',
      statsBg: 'rgba(255, 69, 0, 0.05)',
      badgeBg: '#FF4500',
      badgeText: '#FFFFFF',
      headerBg: '#000000',
      cardShadow: '0 0 20px rgba(255, 69, 0, 0.2)',
      cardBg: '#000000',
      textColor: '#A0A0A0',
      titleColor: '#FFFFFF',
    },
  },

  // Titanium Silver (Silver & Gold)
  mineral: {
    'S': {
      headerBorderColor: '#E2E8F0', // Slate 200 (Silver)
      rankTextColor: '#FFD700',
      statsBg: 'rgba(226, 232, 240, 0.1)',
      badgeBg: '#FFFFFF',
      badgeText: '#000000',
      headerBg: '#001A00',
      cardShadow: '0 0 50px rgba(255, 255, 255, 0.2)',
      cardBg: '#000000',
      textColor: '#94A3B8',
      titleColor: '#FFFFFF',
    },
    '?': {
      headerBorderColor: '#E2E8F0',
      rankTextColor: '#FFD700',
      statsBg: 'rgba(255, 255, 255, 0.05)',
      badgeBg: '#E2E8F0',
      badgeText: '#000000',
      headerBg: '#000000',
      cardShadow: '0 0 30px rgba(255, 255, 255, 0.1)',
      cardBg: '#000000',
      textColor: '#94A3B8',
      titleColor: '#FFFFFF',
    },
  },

  // Emerald Gold (Green & Gold)
  pastel: {
    'S': {
      headerBorderColor: '#00FF41', // Matrix Green
      rankTextColor: '#FFD700',
      statsBg: 'rgba(0, 255, 65, 0.1)',
      badgeBg: '#00FF41',
      badgeText: '#000000',
      headerBg: '#000000',
      cardShadow: '0 0 40px rgba(0, 255, 65, 0.5)',
      cardBg: '#000000',
      textColor: '#B5A1FF',
      titleColor: '#FFFFFF',
    },
    '?': {
      headerBorderColor: '#00FF41',
      rankTextColor: '#FFD700',
      statsBg: 'rgba(0, 255, 65, 0.05)',
      badgeBg: '#00FF41',
      badgeText: '#000000',
      headerBg: '#000000',
      cardShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
      cardBg: '#000000',
      textColor: '#A0A0A0',
      titleColor: '#FFFFFF',
    },
  },
};

// 랭크 스타일을 가져오는 함수
export const getRankStyle = (rankLevel: string, theme: CardTheme = 'default'): RankStyle => {
  const selectedTheme = themeStyles[theme] || themeStyles.default;
  return selectedTheme[rankLevel] || selectedTheme['?'];
};
 