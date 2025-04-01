'use client';

/**
 * 클라이언트에서 사용하는 GitHub API 관련 유틸리티 함수
 */

import { GitHubStats, RankInfo } from '@/utils/github-stats';

/**
 * 클라이언트에서 GitHub 통계 가져오기 (서버 API 엔드포인트 활용)
 */
export async function fetchGitHubStatsClient(username: string): Promise<GitHubStats> {
  if (!username || username.trim() === '') {
    throw new Error('GitHub 사용자명이 필요합니다.');
  }
  
  try {
    // 내부 API 엔드포인트 호출 
    const response = await fetch(`/api/github?username=${encodeURIComponent(username.trim())}`);
    
    if (!response.ok) {
      // 오류 응답 처리
      const errorData = await response.json().catch(() => null);
      
      if (errorData && errorData.error) {
        throw new Error(errorData.error);
      }
      
      // 기본 HTTP 상태 오류 처리
      if (response.status === 404) {
        throw new Error('GitHub 사용자를 찾을 수 없습니다.');
      } else if (response.status === 429 || response.status === 403) {
        throw new Error('GitHub API 요청 제한에 도달했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error(`GitHub API 요청 실패: ${response.status}`);
      }
    }
    
    // 응답 데이터 파싱
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('GitHub 통계 가져오기 실패:', error);
    throw error;
  }
}

/**
 * 랭크 계산 (UI 표시 목적)
 */
export function calculateUserRank(stats: GitHubStats | undefined): RankInfo {
  // 통계가 없는 경우 서버 API 호출 필요
  if (!stats) {
    return {
      name: 'C',
      color: '#E5C1CD',
      emoji: '✨',
      mainColor: '#E5C1CD',
      accentColor: '#D9A7B9',
      headerBg: 'bg-[#D9A7B9]/50',
      headerBgColor: '#D9A7B9',
      highlightColor: '#E5C1CD',
      percentile: 0
    };
  }
  
  // 점수 계산 기본 로직 (간소화 버전)
  const { stars = 0, commits = 0, prs = 0, issues = 0, contributions = 0 } = stats;
  
  const total = stars + commits + prs + issues + contributions;
  let percentile;
  
  // 총점에 따른 백분위 계산 (간소화된 계산 방식)
  if (total > 5000) percentile = 95;
  else if (total > 2000) percentile = 85;
  else if (total > 1000) percentile = 75;
  else if (total > 500) percentile = 65;
  else if (total > 200) percentile = 55;
  else if (total > 100) percentile = 45;
  else if (total > 50) percentile = 35;
  else if (total > 20) percentile = 25;
  else if (total > 10) percentile = 15;
  else percentile = 5;
  
  // 등급 임계값 및 등급 정의
  const THRESHOLDS = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
  const rankIndex = THRESHOLDS.findIndex(t => percentile <= t);
  
  // 무지개 색상에 맞는 등급별 설정
  const RANKS = [
    { 
      name: 'S', 
      color: '#D8B5FF', 
      emoji: '🔮',
      mainColor: '#D8B5FF',
      accentColor: '#7B2CBF',
      headerBg: 'bg-[#C9A3FF]/50',
      headerBgColor: '#C9A3FF',
      highlightColor: '#D8B5FF'
    },
    { 
      name: 'A+', 
      color: '#BDB2FF', 
      emoji: '👑',
      mainColor: '#BDB2FF',
      accentColor: '#5A54C9',
      headerBg: 'bg-[#A397E9]/50',
      headerBgColor: '#A397E9',
      highlightColor: '#BDB2FF'
    },
    { 
      name: 'A', 
      color: '#A0C4FF', 
      emoji: '🌊',
      mainColor: '#A0C4FF',
      accentColor: '#3066BE',
      headerBg: 'bg-[#89B1FF]/50',
      headerBgColor: '#89B1FF',
      highlightColor: '#A0C4FF'
    },
    { 
      name: 'A-', 
      color: '#CAFFBF', 
      emoji: '🌿',
      mainColor: '#CAFFBF',
      accentColor: '#38B000',
      headerBg: 'bg-[#A8F0A0]/50',
      headerBgColor: '#A8F0A0',
      highlightColor: '#CAFFBF'
    },
    { 
      name: 'B+', 
      color: '#FDFFB6', 
      emoji: '⭐',
      mainColor: '#FDFFB6',
      accentColor: '#F9C74F',
      headerBg: 'bg-[#F9F59D]/50',
      headerBgColor: '#F9F59D',
      highlightColor: '#FDFFB6'
    },
    { 
      name: 'B', 
      color: '#FFD6A5', 
      emoji: '🔥',
      mainColor: '#FFD6A5',
      accentColor: '#F3722C',
      headerBg: 'bg-[#FFBF80]/50',
      headerBgColor: '#FFBF80',
      highlightColor: '#FFD6A5'
    },
    { 
      name: 'B-', 
      color: '#FFADAD', 
      emoji: '🚀',
      mainColor: '#FFADAD',
      accentColor: '#F94144',
      headerBg: 'bg-[#FF9A9A]/50',
      headerBgColor: '#FF9A9A',
      highlightColor: '#FFADAD'
    },
    { 
      name: 'C+', 
      color: '#FFC2CD', 
      emoji: '💫',
      mainColor: '#FFC2CD',
      accentColor: '#D81159',
      headerBg: 'bg-[#FFADBF]/50',
      headerBgColor: '#FFADBF',
      highlightColor: '#FFC2CD'
    },
    { 
      name: 'C', 
      color: '#E5C1CD', 
      emoji: '✨',
      mainColor: '#E5C1CD',
      accentColor: '#9A348E',
      headerBg: 'bg-[#D9A7B9]/50',
      headerBgColor: '#D9A7B9',
      highlightColor: '#E5C1CD'
    }
  ];
  
  return { ...RANKS[rankIndex], percentile };
} 