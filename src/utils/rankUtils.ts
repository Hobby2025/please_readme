// src/utils/rankUtils.ts

function calcExponentialCDF(x: number): number {
  // Handle potential division by zero or negative inputs if necessary
  if (x <= 0) return 0;
  
  // 2의 음수 제곱으로 지수 분포 CDF 계산
  const result = 1 - Math.pow(2, -x);
  return result;
}

function calcLogNormalCDF(x: number): number {
  // Handle potential division by zero or negative inputs if necessary
  if (x <= 0) return 0;
  
  // 로그 정규 분포 계산 - 단순화된 접근
  const result = x / (1 + x);
  return result;
}

function formatScore(score: number): number {
  // Ensure score is a number and handle potential NaN
  if (isNaN(score)) return 0;
  if (score % 1 === 0) {
    return Math.floor(score);
  }
  // Round to one decimal place as in the original logic
  return parseFloat(score.toFixed(1));
}

export type Rank = { level: string; percentile: number; score: number };

// Adjusted RankParams for available data
type RankParams = {
  commits: number; // Represents currentYearCommits
  prs: number;     // Represents totalPRs
  issues: number;  // Represents totalIssues
  stars: number;   // Represents totalStars
};

export function calculateRank({ commits, prs, issues, stars }: RankParams): Rank {
  console.log(`[calculateRank] 입력 - commits: ${commits}, prs: ${prs}, issues: ${issues}, stars: ${stars}`);
  
  // 데이터 정규화를 위한 중간값 설정
  const COMMITS_MEDIAN = 250;
  const COMMITS_WEIGHT = 2;
  const PRS_MEDIAN = 50;
  const PRS_WEIGHT = 3;
  const ISSUES_MEDIAN = 25;
  const ISSUES_WEIGHT = 1;
  const STARS_MEDIAN = 50;
  const STARS_WEIGHT = 4;

  // 총 가중치 계산
  const TOTAL_WEIGHT = COMMITS_WEIGHT + PRS_WEIGHT + ISSUES_WEIGHT + STARS_WEIGHT;

  // 가중치가 0인 경우 처리
  if (TOTAL_WEIGHT === 0) {
    console.log(`[calculateRank] 가중치 합계가 0입니다`);
    return { level: '?', percentile: 0, score: 0 };
  }

  // 등급 분류 경계값
  const THRESHOLDS = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
  const LEVELS = ['S', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'];

  console.log(`[calculateRank] 중간값 - COMMITS_MEDIAN: ${COMMITS_MEDIAN}, PRS_MEDIAN: ${PRS_MEDIAN}, ISSUES_MEDIAN: ${ISSUES_MEDIAN}, STARS_MEDIAN: ${STARS_MEDIAN}`);
  console.log(`[calculateRank] 가중치 - COMMITS_WEIGHT: ${COMMITS_WEIGHT}, PRS_WEIGHT: ${PRS_WEIGHT}, ISSUES_WEIGHT: ${ISSUES_WEIGHT}, STARS_WEIGHT: ${STARS_WEIGHT}`);
  
  // 정규화된 값 계산
  const normalizedCommits = commits / COMMITS_MEDIAN;
  const normalizedPRs = prs / PRS_MEDIAN;
  const normalizedIssues = issues / ISSUES_MEDIAN;
  const normalizedStars = stars / STARS_MEDIAN;
  
  console.log(`[calculateRank] 정규화 값 - commits: ${normalizedCommits.toFixed(2)}, prs: ${normalizedPRs.toFixed(2)}, issues: ${normalizedIssues.toFixed(2)}, stars: ${normalizedStars.toFixed(2)}`);
  
  // 각 항목별 점수 계산
  const commitsScore = COMMITS_WEIGHT * calcExponentialCDF(normalizedCommits);
  const prsScore = PRS_WEIGHT * calcExponentialCDF(normalizedPRs);
  const issuesScore = ISSUES_WEIGHT * calcExponentialCDF(normalizedIssues);
  const starsScore = STARS_WEIGHT * calcLogNormalCDF(normalizedStars);
  
  console.log(`[calculateRank] 각 항목 점수 - commits: ${commitsScore.toFixed(2)}, prs: ${prsScore.toFixed(2)}, issues: ${issuesScore.toFixed(2)}, stars: ${starsScore.toFixed(2)}`);
  
  // 가중 평균 최종 점수 계산
  const totalScore = commitsScore + prsScore + issuesScore + starsScore;
  const score = totalScore / TOTAL_WEIGHT;
  
  console.log(`[calculateRank] 총점: ${totalScore.toFixed(2)}, 평균 점수: ${score.toFixed(2)}`);

  // 점수 값 범위 조정 (0~1 사이)
  const clampedScore = Math.max(0, Math.min(1, score));
  
  // 백분위 계산 (낮은 점수 = 높은 백분위)
  const percentile = (1 - clampedScore) * 100;
  
  console.log(`[calculateRank] 조정된 점수: ${clampedScore.toFixed(2)}, 백분위: ${percentile.toFixed(2)}`);

  // 등급 결정
  let level = LEVELS[LEVELS.length - 1]; // 기본값은 가장 낮은 등급
  for (let i = 0; i < THRESHOLDS.length; i++) {
    if (percentile <= THRESHOLDS[i]) {
      level = LEVELS[i];
      console.log(`[calculateRank] 임계값 ${THRESHOLDS[i]}보다 낮음, 레벨: ${LEVELS[i]}`);
      break;
    }
  }

  // 최종 결과 생성
  const result = {
    level,
    percentile: parseFloat((100 - percentile).toFixed(1)),
    score: formatScore(clampedScore * 100),
  };
  
  console.log(`[calculateRank] 최종 결과:`, result);
  
  return result;
}