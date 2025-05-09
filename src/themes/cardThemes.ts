import { RankStyle, CardTheme } from '@/types';

// 테마별 랭크 스타일 시스템 정의
// export interface RankStyle { ... }

// 테마별 랭크 스타일 시스템 
export const themeStyles: Record<CardTheme, Record<string, RankStyle>> = {
  // 우주 테마
  cosmic: {
    'S': {
      headerBorderColor: '#A78BFA', // 보라색 별빛
      rankTextColor: '#C4B5FD',
      statsBg: 'rgba(139, 92, 246, 0.25)',
      badgeBg: 'linear-gradient(135deg, #8B5CF6, #C4B5FD)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(79, 70, 229, 0.3)',
      cardShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'A+': {
      headerBorderColor: '#60A5FA', // 푸른 은하
      rankTextColor: '#93C5FD',
      statsBg: 'rgba(59, 130, 246, 0.25)',
      badgeBg: 'linear-gradient(135deg, #3B82F6, #93C5FD)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(37, 99, 235, 0.3)',
      cardShadow: '0 0 15px rgba(59, 130, 246, 0.35)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'A': {
      headerBorderColor: '#34D399', // 오로라 녹색
      rankTextColor: '#6EE7B7',
      statsBg: 'rgba(16, 185, 129, 0.25)',
      badgeBg: 'linear-gradient(135deg, #10B981, #6EE7B7)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(5, 150, 105, 0.3)',
      cardShadow: '0 0 12px rgba(16, 185, 129, 0.3)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'A-': {
      headerBorderColor: '#38BDF8', // 청록색 성운
      rankTextColor: '#7DD3FC',
      statsBg: 'rgba(14, 165, 233, 0.25)',
      badgeBg: 'linear-gradient(135deg, #0EA5E9, #7DD3FC)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(2, 132, 199, 0.3)',
      cardShadow: '0 0 10px rgba(14, 165, 233, 0.25)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'B+': {
      headerBorderColor: '#FBBF24', // 노란 별빛
      rankTextColor: '#FCD34D',
      statsBg: 'rgba(217, 119, 6, 0.25)',
      badgeBg: 'linear-gradient(135deg, #D97706, #FBBF24)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(180, 83, 9, 0.3)',
      cardShadow: '0 0 8px rgba(217, 119, 6, 0.2)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'B': {
      headerBorderColor: '#F87171', // 붉은 성운
      rankTextColor: '#FCA5A5',
      statsBg: 'rgba(220, 38, 38, 0.25)',
      badgeBg: 'linear-gradient(135deg, #DC2626, #F87171)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(185, 28, 28, 0.3)',
      cardShadow: '0 0 8px rgba(220, 38, 38, 0.2)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'B-': {
      headerBorderColor: '#FB7185', // 분홍색 성운
      rankTextColor: '#FDA4AF',
      statsBg: 'rgba(225, 29, 72, 0.25)',
      badgeBg: 'linear-gradient(135deg, #E11D48, #FB7185)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(190, 18, 60, 0.3)',
      cardShadow: '0 0 8px rgba(225, 29, 72, 0.2)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'C+': {
      headerBorderColor: '#C084FC', // 연보라 성운
      rankTextColor: '#DDD6FE',
      statsBg: 'rgba(147, 51, 234, 0.25)',
      badgeBg: 'linear-gradient(135deg, #9333EA, #C084FC)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(126, 34, 206, 0.3)',
      cardShadow: '0 0 8px rgba(147, 51, 234, 0.2)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'C': {
      headerBorderColor: '#94A3B8', // 회색 성운
      rankTextColor: '#CBD5E1',
      statsBg: 'rgba(71, 85, 105, 0.25)',
      badgeBg: 'linear-gradient(135deg, #475569, #94A3B8)',
      badgeText: '#FFFFFF', 
      headerBg: 'rgba(51, 65, 85, 0.3)',
      cardShadow: '0 0 8px rgba(71, 85, 105, 0.2)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    '?': {
      headerBorderColor: '#6B7280', // 미지의 우주
      rankTextColor: '#9CA3AF',
      statsBg: 'rgba(55, 65, 81, 0.25)',
      badgeBg: 'linear-gradient(135deg, #4B5563, #6B7280)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(31, 41, 55, 0.3)',
      cardShadow: '0 0 8px rgba(55, 65, 81, 0.2)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
  },
  
  // 광물 테마
  mineral: {
    'S': {
      headerBorderColor: '#E5E7EB', // 다이아몬드
      rankTextColor: '#F9FAFB',
      statsBg: 'rgba(229, 231, 235, 0.25)',
      badgeBg: 'linear-gradient(135deg, #E5E7EB, #F9FAFB)',
      badgeText: '#111827',
      headerBg: 'rgba(209, 213, 219, 0.3)',
      cardShadow: '0 0 20px rgba(229, 231, 235, 0.5)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'A+': {
      headerBorderColor: '#F87171', // 루비
      rankTextColor: '#FCA5A5',
      statsBg: 'rgba(220, 38, 38, 0.25)',
      badgeBg: 'linear-gradient(135deg, #DC2626, #F87171)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(185, 28, 28, 0.3)',
      cardShadow: '0 0 15px rgba(220, 38, 38, 0.35)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'A': {
      headerBorderColor: '#60A5FA', // 사파이어
      rankTextColor: '#93C5FD',
      statsBg: 'rgba(59, 130, 246, 0.25)',
      badgeBg: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(37, 99, 235, 0.3)',
      cardShadow: '0 0 12px rgba(59, 130, 246, 0.3)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'A-': {
      headerBorderColor: '#34D399', // 에메랄드
      rankTextColor: '#6EE7B7',
      statsBg: 'rgba(16, 185, 129, 0.25)',
      badgeBg: 'linear-gradient(135deg, #10B981, #34D399)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(5, 150, 105, 0.3)',
      cardShadow: '0 0 10px rgba(16, 185, 129, 0.25)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'B+': {
      headerBorderColor: '#C084FC', // 자수정
      rankTextColor: '#DDD6FE',
      statsBg: 'rgba(147, 51, 234, 0.25)',
      badgeBg: 'linear-gradient(135deg, #9333EA, #C084FC)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(126, 34, 206, 0.3)',
      cardShadow: '0 0 8px rgba(147, 51, 234, 0.2)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'B': {
      headerBorderColor: '#FBBF24', // 토파즈
      rankTextColor: '#FCD34D',
      statsBg: 'rgba(217, 119, 6, 0.25)',
      badgeBg: 'linear-gradient(135deg, #D97706, #FBBF24)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(180, 83, 9, 0.3)',
      cardShadow: '0 0 8px rgba(217, 119, 6, 0.2)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'B-': {
      headerBorderColor: '#38BDF8', // 아쿠아마린
      rankTextColor: '#7DD3FC',
      statsBg: 'rgba(14, 165, 233, 0.25)',
      badgeBg: 'linear-gradient(135deg, #0EA5E9, #38BDF8)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(2, 132, 199, 0.3)',
      cardShadow: '0 0 8px rgba(14, 165, 233, 0.2)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'C+': {
      headerBorderColor: '#A8A29E', // 오닉스
      rankTextColor: '#D6D3D1',
      statsBg: 'rgba(87, 83, 78, 0.25)',
      badgeBg: 'linear-gradient(135deg, #57534E, #A8A29E)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(68, 64, 60, 0.3)',
      cardShadow: '0 0 8px rgba(87, 83, 78, 0.2)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'C': {
      headerBorderColor: '#FB7185', // 핑크 투어멀린
      rankTextColor: '#FDA4AF',
      statsBg: 'rgba(225, 29, 72, 0.25)', 
      badgeBg: 'linear-gradient(135deg, #E11D48, #FB7185)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(190, 18, 60, 0.3)',
      cardShadow: '0 0 8px rgba(225, 29, 72, 0.2)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    '?': {
      headerBorderColor: '#94A3B8', // 미지의 광물
      rankTextColor: '#CBD5E1',
      statsBg: 'rgba(71, 85, 105, 0.25)',
      badgeBg: 'linear-gradient(135deg, #475569, #94A3B8)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(51, 65, 85, 0.3)',
      cardShadow: '0 0 8px rgba(71, 85, 105, 0.2)',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
  },
  
  // 기본 테마 (기존 스타일)
  default: {
    'S': {
      headerBorderColor: '#a78bfa',
      rankTextColor: '#c4b5fd',
      statsBg: 'rgba(91, 33, 182, 0.2)',
      badgeBg: 'linear-gradient(to right, #a855f7, #6366f1)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(91, 33, 182, 0.3)',
      cardShadow: '',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'A+': {
      headerBorderColor: '#60a5fa',
      rankTextColor: '#93c5fd',
      statsBg: 'rgba(30, 64, 175, 0.2)',
      badgeBg: 'linear-gradient(to right, #3b82f6, #0ea5e9)',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(30, 64, 175, 0.3)',
      cardShadow: '',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'A': {
      headerBorderColor: '#93c5fd',
      rankTextColor: '#bfdbfe',
      statsBg: 'rgba(59, 130, 246, 0.15)',
      badgeBg: '#60a5fa',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(59, 130, 246, 0.2)',
      cardShadow: '',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'A-': {
      headerBorderColor: '#7dd3fc',
      rankTextColor: '#bae6fd',
      statsBg: 'rgba(14, 165, 233, 0.15)',
      badgeBg: '#38bdf8',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(14, 165, 233, 0.2)',
      cardShadow: '',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'B+': {
      headerBorderColor: '#4ade80',
      rankTextColor: '#86efac',
      statsBg: 'rgba(22, 163, 74, 0.15)',
      badgeBg: '#22c55e',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(22, 163, 74, 0.2)',
      cardShadow: '',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'B': {
      headerBorderColor: '#86efac',
      rankTextColor: '#bbf7d0',
      statsBg: 'rgba(22, 163, 74, 0.15)',
      badgeBg: '#4ade80',
      badgeText: '#166534',
      headerBg: 'rgba(22, 163, 74, 0.15)',
      cardShadow: '',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'B-': {
      headerBorderColor: '#bef264',
      rankTextColor: '#d9f99d',
      statsBg: 'rgba(132, 204, 22, 0.15)',
      badgeBg: '#a3e635',
      badgeText: '#3f6212',
      headerBg: 'rgba(132, 204, 22, 0.15)',
      cardShadow: '',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'C+': {
      headerBorderColor: '#fde047',
      rankTextColor: '#fef08a',
      statsBg: 'rgba(234, 179, 8, 0.15)',
      badgeBg: '#facc15',
      badgeText: '#713f12',
      headerBg: 'rgba(234, 179, 8, 0.15)',
      cardShadow: '',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    'C': {
      headerBorderColor: '#fef08a',
      rankTextColor: '#fef9c3',
      statsBg: 'rgba(234, 179, 8, 0.1)',
      badgeBg: '#fde047',
      badgeText: '#854d0e',
      headerBg: 'rgba(234, 179, 8, 0.1)',
      cardShadow: '',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
    '?': {
      headerBorderColor: '#6b7280',
      rankTextColor: '#9ca3af',
      statsBg: 'rgba(75, 85, 99, 0.1)',
      badgeBg: '#4b5563',
      badgeText: '#FFFFFF',
      headerBg: 'rgba(75, 85, 99, 0.1)',
      cardShadow: '',
      cardBg: 'rgb(17, 24, 39)',
      textColor: '#D1D5DB',
      titleColor: '#F9FAFB',
    },
  },

  // 파스텔 테마 추가
  pastel: {
    'S': {
      headerBorderColor: '#C7B5FD', // 파스텔 보라
      rankTextColor: '#9883FC',
      statsBg: 'rgba(199, 181, 253, 0.3)',
      badgeBg: 'linear-gradient(135deg, #C7B5FD, #E0E7FF)',
      badgeText: '#4338CA',
      headerBg: 'rgba(199, 181, 253, 0.3)',
      cardShadow: '0 0 15px rgba(199, 181, 253, 0.5)',
      cardBg: '#FBFAFF',
      textColor: '#6B7280',
      titleColor: '#4338CA',
    },
    'A+': {
      headerBorderColor: '#BFDBFE', // 파스텔 파랑
      rankTextColor: '#60A5FA',
      statsBg: 'rgba(191, 219, 254, 0.3)',
      badgeBg: 'linear-gradient(135deg, #BFDBFE, #E0F2FE)',
      badgeText: '#1D4ED8',
      headerBg: 'rgba(191, 219, 254, 0.3)',
      cardShadow: '0 0 15px rgba(191, 219, 254, 0.5)',
      cardBg: '#FBFAFF',
      textColor: '#6B7280',
      titleColor: '#1D4ED8',
    },
    'A': {
      headerBorderColor: '#A7F3D0', // 파스텔 그린
      rankTextColor: '#34D399',
      statsBg: 'rgba(167, 243, 208, 0.3)',
      badgeBg: 'linear-gradient(135deg, #A7F3D0, #D1FAE5)',
      badgeText: '#065F46',
      headerBg: 'rgba(167, 243, 208, 0.3)',
      cardShadow: '0 0 12px rgba(167, 243, 208, 0.5)',
      cardBg: '#FBFAFF',
      textColor: '#6B7280',
      titleColor: '#065F46',
    },
    'A-': {
      headerBorderColor: '#BAE6FD', // 파스텔 스카이블루
      rankTextColor: '#38BDF8',
      statsBg: 'rgba(186, 230, 253, 0.3)',
      badgeBg: 'linear-gradient(135deg, #BAE6FD, #E0F2FE)',
      badgeText: '#0369A1',
      headerBg: 'rgba(186, 230, 253, 0.3)',
      cardShadow: '0 0 12px rgba(186, 230, 253, 0.5)',
      cardBg: '#FBFAFF',
      textColor: '#6B7280',
      titleColor: '#0369A1',
    },
    'B+': {
      headerBorderColor: '#FDE68A', // 파스텔 노랑
      rankTextColor: '#FBBF24',
      statsBg: 'rgba(253, 230, 138, 0.3)',
      badgeBg: 'linear-gradient(135deg, #FDE68A, #FEF3C7)',
      badgeText: '#92400E',
      headerBg: 'rgba(253, 230, 138, 0.3)',
      cardShadow: '0 0 12px rgba(253, 230, 138, 0.5)',
      cardBg: '#FBFAFF',
      textColor: '#6B7280',
      titleColor: '#92400E',
    },
    'B': {
      headerBorderColor: '#FED7AA', // 파스텔 오렌지
      rankTextColor: '#FB923C',
      statsBg: 'rgba(254, 215, 170, 0.3)',
      badgeBg: 'linear-gradient(135deg, #FED7AA, #FFEDD5)',
      badgeText: '#9A3412',
      headerBg: 'rgba(254, 215, 170, 0.3)',
      cardShadow: '0 0 12px rgba(254, 215, 170, 0.5)',
      cardBg: '#FBFAFF',
      textColor: '#6B7280',
      titleColor: '#9A3412',
    },
    'B-': {
      headerBorderColor: '#FECDD3', // 파스텔 핑크
      rankTextColor: '#FB7185',
      statsBg: 'rgba(254, 205, 211, 0.3)',
      badgeBg: 'linear-gradient(135deg, #FECDD3, #FEE2E2)',
      badgeText: '#BE123C',
      headerBg: 'rgba(254, 205, 211, 0.3)',
      cardShadow: '0 0 12px rgba(254, 205, 211, 0.5)',
      cardBg: '#FBFAFF',
      textColor: '#6B7280',
      titleColor: '#BE123C',
    },
    'C+': {
      headerBorderColor: '#DDD6FE', // 파스텔 퍼플
      rankTextColor: '#A78BFA',
      statsBg: 'rgba(221, 214, 254, 0.3)',
      badgeBg: 'linear-gradient(135deg, #DDD6FE, #EDE9FE)',
      badgeText: '#6D28D9',
      headerBg: 'rgba(221, 214, 254, 0.3)',
      cardShadow: '0 0 12px rgba(221, 214, 254, 0.5)',
      cardBg: '#FBFAFF',
      textColor: '#6B7280',
      titleColor: '#6D28D9',
    },
    'C': {
      headerBorderColor: '#D8B4FE', // 파스텔 라일락
      rankTextColor: '#C084FC',
      statsBg: 'rgba(216, 180, 254, 0.3)',
      badgeBg: 'linear-gradient(135deg, #D8B4FE, #F3E8FF)',
      badgeText: '#7E22CE',
      headerBg: 'rgba(216, 180, 254, 0.3)',
      cardShadow: '0 0 12px rgba(216, 180, 254, 0.5)',
      cardBg: '#FBFAFF',
      textColor: '#6B7280',
      titleColor: '#7E22CE',
    },
    '?': {
      headerBorderColor: '#E5E7EB', // 파스텔 그레이
      rankTextColor: '#9CA3AF',
      statsBg: 'rgba(229, 231, 235, 0.3)',
      badgeBg: 'linear-gradient(135deg, #E5E7EB, #F3F4F6)',
      badgeText: '#374151',
      headerBg: 'rgba(229, 231, 235, 0.3)',
      cardShadow: '0 0 12px rgba(229, 231, 235, 0.5)',
      cardBg: '#FBFAFF',
      textColor: '#6B7280',
      titleColor: '#374151',
    },
  }
};

// 랭크 스타일을 가져오는 함수
export const getRankStyle = (rankLevel: string, theme: CardTheme = 'default'): RankStyle => {
  const selectedTheme = themeStyles[theme] || themeStyles.default;
  return selectedTheme[rankLevel] || selectedTheme['?'];
}; 