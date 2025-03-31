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
      color: '#8B0000',
      emoji: '✨',
      mainColor: '#8B0000',
      accentColor: '#B22222',
      headerBg: 'bg-[#B22222]/50',
      highlightColor: '#8B0000',
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
      color: '#9400D3', 
      emoji: '🔮',
      mainColor: '#9400D3',
      accentColor: '#8A2BE2',
      headerBg: 'bg-[#8A2BE2]/50',
      highlightColor: '#9400D3'
    },
    { 
      name: 'A+', 
      color: '#4B0082', 
      emoji: '👑',
      mainColor: '#4B0082',
      accentColor: '#483D8B',
      headerBg: 'bg-[#483D8B]/50',
      highlightColor: '#4B0082'
    },
    { 
      name: 'A', 
      color: '#0000FF', 
      emoji: '🌊',
      mainColor: '#0000FF',
      accentColor: '#1E90FF',
      headerBg: 'bg-[#1E90FF]/50',
      highlightColor: '#0000FF'
    },
    { 
      name: 'A-', 
      color: '#00FF00', 
      emoji: '🌿',
      mainColor: '#00FF00',
      accentColor: '#32CD32',
      headerBg: 'bg-[#32CD32]/50',
      highlightColor: '#00FF00'
    },
    { 
      name: 'B+', 
      color: '#FFFF00', 
      emoji: '⭐',
      mainColor: '#FFFF00',
      accentColor: '#FFD700',
      headerBg: 'bg-[#FFD700]/50',
      highlightColor: '#FFFF00'
    },
    { 
      name: 'B', 
      color: '#FFA500', 
      emoji: '🔥',
      mainColor: '#FFA500',
      accentColor: '#FF8C00',
      headerBg: 'bg-[#FF8C00]/50',
      highlightColor: '#FFA500'
    },
    { 
      name: 'B-', 
      color: '#FF4500', 
      emoji: '🚀',
      mainColor: '#FF4500',
      accentColor: '#FF6347',
      headerBg: 'bg-[#FF6347]/50',
      highlightColor: '#FF4500'
    },
    { 
      name: 'C+', 
      color: '#FF0000', 
      emoji: '💫',
      mainColor: '#FF0000',
      accentColor: '#DC143C',
      headerBg: 'bg-[#DC143C]/50',
      highlightColor: '#FF0000'
    },
    { 
      name: 'C', 
      color: '#8B0000', 
      emoji: '✨',
      mainColor: '#8B0000',
      accentColor: '#B22222',
      headerBg: 'bg-[#B22222]/50',
      highlightColor: '#8B0000'
    }
  ];
  
  return { ...RANKS[rankIndex], percentile };
} 