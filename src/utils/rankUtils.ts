// src/utils/rankUtils.ts

// 랭크 타입 정의
export type Rank = {
  level: string;
  percentile: number;
  score: number;
};

// 중앙값과 가중치 상수 정의
const COMMITS_MEDIAN = 250;  // 연간 커밋 중앙값
const PRS_MEDIAN = 50;       // PR 중앙값
const ISSUES_MEDIAN = 25;    // 이슈 중앙값
const STARS_MEDIAN = 50;     // 스타 중앙값

// 가중치 설정 - 기여도에 따른 상대적 중요성
const COMMITS_WEIGHT = 2;
const PRS_WEIGHT = 3;
const ISSUES_WEIGHT = 1;
const STARS_WEIGHT = 4;

// 전체 가중치 합계 (나중에 평균 계산에 사용)
const TOTAL_WEIGHT = COMMITS_WEIGHT + PRS_WEIGHT + ISSUES_WEIGHT + STARS_WEIGHT;

// 랭크 점수 임계값 정의 - 각 등급의 최소 점수
const THRESHOLDS = {
  'S': 90,
  'A+': 80,
  'A': 70,
  'A-': 60,
  'B+': 50,
  'B': 40,
  'B-': 30,
  'C+': 20,
  'C': 10,
  // C 미만은 'C'로 표시
};

// 정규화 함수: 값을 0-10 범위로 변환
function normalize(value: number, median: number): number {
  if (value === 0) return 0;
  
  // log 스케일로 정규화 (0~10점 범위)
  // Math.log는 자연로그이므로 값이 median일 때 log(value/median) = 0
  // 5를 더해서 중앙값이 5점이 되도록 함
  const normalizedValue = Math.max(0, Math.min(10, 5 + Math.log(value / median) / Math.log(2)));
  
  return parseFloat(normalizedValue.toFixed(2)); // 소수점 둘째 자리까지만
}

// 랭크 결정 함수
function getRankLevel(score: number): string {
  // 내림차순 정렬된 임계값 키 배열
  const levels = Object.keys(THRESHOLDS).sort(
    (a, b) => THRESHOLDS[b as keyof typeof THRESHOLDS] - THRESHOLDS[a as keyof typeof THRESHOLDS]
  );
  
  // 점수에 해당하는 첫 번째 레벨 찾기
  for (const level of levels) {
    if (score >= THRESHOLDS[level as keyof typeof THRESHOLDS]) {
      return level;
    }
  }
  
  // 기본값 반환
  return 'C';
}

// 최적화된 랭크 계산 함수
export function calculateRank({ commits, prs, issues, stars }: { 
  commits: number; 
  prs: number; 
  issues: number; 
  stars: number; 
}): Rank {
  // 디버깅 정보 출력
  console.log(`[calculateRank] 입력 - commits: ${commits}, prs: ${prs}, issues: ${issues}, stars: ${stars}`);
  console.log(`[calculateRank] 중간값 - COMMITS_MEDIAN: ${COMMITS_MEDIAN}, PRS_MEDIAN: ${PRS_MEDIAN}, ISSUES_MEDIAN: ${ISSUES_MEDIAN}, STARS_MEDIAN: ${STARS_MEDIAN}`);
  console.log(`[calculateRank] 가중치 - COMMITS_WEIGHT: ${COMMITS_WEIGHT}, PRS_WEIGHT: ${PRS_WEIGHT}, ISSUES_WEIGHT: ${ISSUES_WEIGHT}, STARS_WEIGHT: ${STARS_WEIGHT}`);
  
  // 각 지표를 정규화 (0-10 범위)
  const normalizedCommits = normalize(commits, COMMITS_MEDIAN);
  const normalizedPRs = normalize(prs, PRS_MEDIAN);
  const normalizedIssues = normalize(issues, ISSUES_MEDIAN);
  const normalizedStars = normalize(stars, STARS_MEDIAN);
  
  console.log(`[calculateRank] 정규화 값 - commits: ${normalizedCommits}, prs: ${normalizedPRs}, issues: ${normalizedIssues}, stars: ${normalizedStars}`);
  
  // 가중치 적용된 점수 계산
  const weightedCommits = normalizedCommits * COMMITS_WEIGHT;
  const weightedPRs = normalizedPRs * PRS_WEIGHT;
  const weightedIssues = normalizedIssues * ISSUES_WEIGHT;
  const weightedStars = normalizedStars * STARS_WEIGHT;
  
  console.log(`[calculateRank] 각 항목 점수 - commits: ${weightedCommits.toFixed(2)}, prs: ${weightedPRs.toFixed(2)}, issues: ${weightedIssues.toFixed(2)}, stars: ${weightedStars.toFixed(2)}`);
  
  // 총점 계산 (모든 가중치 적용 점수의 합)
  const totalScore = weightedCommits + weightedPRs + weightedIssues + weightedStars;
  
  // 평균 점수 계산 (0-10 범위)
  const avgScore = totalScore / TOTAL_WEIGHT;
  
  console.log(`[calculateRank] 총점: ${totalScore.toFixed(2)}, 평균 점수: ${avgScore.toFixed(2)}`);
  
  // 백분위 점수로 변환 (0-100 범위)
  const percentileScore = avgScore * 10;
  
  // 최종 랭크 레벨 결정
  const level = getRankLevel(percentileScore);
  
  // 계산 과정 로깅
  const adjustedScore = Math.max(0, Math.min(100, percentileScore));
  
  console.log(`[calculateRank] 조정된 점수: ${adjustedScore.toFixed(2)}, 백분위: ${percentileScore.toFixed(2)}`);
  console.log(`[calculateRank] 임계값 ${THRESHOLDS[level as keyof typeof THRESHOLDS]}${percentileScore < THRESHOLDS[level as keyof typeof THRESHOLDS] ? '보다 낮음' : '보다 높음'}, 레벨: ${level}`);
  
  // 최종 결과 반환 (점수는 소수점 한 자리까지만)
  const result: Rank = {
    level,
    score: parseFloat(adjustedScore.toFixed(1)),
    percentile: parseFloat(percentileScore.toFixed(1))
  };
  
  console.log(`[calculateRank] 최종 결과:`, result);
  
  return result;
}