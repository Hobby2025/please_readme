'use client';

/**
 * 클라이언트에서 사용하는 GitHub API 관련 유틸리티 함수
 */

import { GitHubStats, RankInfo } from '@/utils/github-stats';

/**
 * 임시 기본 GitHub 통계 객체 생성
 */
function createDefaultStats(): GitHubStats {
  return {
    stars: 0,
    commits: 0,
    prs: 0,
    issues: 0,
    contributions: 0,
    currentYearCommits: 0,
    languages: {}
  };
}

/**
 * 클라이언트에서 GitHub 통계 가져오기 (기본값 반환, 서버 API가 삭제됨)
 */
export async function fetchGitHubStatsClient(username: string): Promise<GitHubStats> {
  if (!username || username.trim() === '') {
    throw new Error('GitHub 사용자명이 필요합니다.');
  }
  
  try {
    // 서버 컴포넌트에서 통계를 받아오므로 여기서는 기본 통계만 반환
    // 실제 통계는 github-card API 엔드포인트에서 처리됨
    
    // GitHub 사용자 존재 여부 확인 (기본 API 호출)
    const userResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(username.trim())}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'please-readme-client'
      }
    });
    
    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        throw new Error('GitHub 사용자를 찾을 수 없습니다.');
      } else if (userResponse.status === 403 || userResponse.status === 429) {
        throw new Error('GitHub API 요청 제한에 도달했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error(`GitHub API 요청 실패: ${userResponse.status}`);
      }
    }
    
    // 사용자 정보 파싱
    const userData = await userResponse.json();
    
    // 기본 통계에 사용자 아바타 추가
    const stats = createDefaultStats();
    stats.avatar_url = userData.avatar_url;
    
    // 클라이언트에서는 이제 기본 통계 객체만 반환
    // 실제 상세 통계는 서버 컴포넌트에서 처리됨
    return stats;
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