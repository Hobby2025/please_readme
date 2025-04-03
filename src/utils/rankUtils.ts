// src/utils/rankUtils.ts

function calcExponentialCDF(x: number): number {
    // Handle potential division by zero or negative inputs if necessary
    if (x <= 0) return 0;
    return 1 - 2 ** -x;
  }
  
  function calcLogNormalCDF(x: number): number {
    // Handle potential division by zero or negative inputs if necessary
    if (x <= 0) return 0;
    return x / (1 + x);
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
    // Constants from the provided logic (adjust MEDIAN/WEIGHT if needed)
    // Assuming all_commits is false as we use currentYearCommits
    const COMMITS_MEDIAN = 250;
    const COMMITS_WEIGHT = 2;
    const PRS_MEDIAN = 50;
    const PRS_WEIGHT = 3;
    const ISSUES_MEDIAN = 25;
    const ISSUES_WEIGHT = 1;
    const STARS_MEDIAN = 50;
    const STARS_WEIGHT = 4;
    // Reviews and Followers are excluded
    // const REVIEWS_MEDIAN = 2;
    // const REVIEWS_WEIGHT = 1;
    // const FOLLOWERS_MEDIAN = 10;
    // const FOLLOWERS_WEIGHT = 1;
  
    // Adjust total weight based on included metrics
    const TOTAL_WEIGHT = COMMITS_WEIGHT + PRS_WEIGHT + ISSUES_WEIGHT + STARS_WEIGHT;
  
    // Ensure weights sum up correctly if adjusted later
    if (TOTAL_WEIGHT === 0) {
        return { level: '?', percentile: 0, score: 0 }; // Avoid division by zero
    }
  
    const THRESHOLDS = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
    const LEVELS = ['S', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'];
  
    // Calculate score based on available metrics
    const score =
      (COMMITS_WEIGHT * calcExponentialCDF(commits / COMMITS_MEDIAN) +
        PRS_WEIGHT * calcExponentialCDF(prs / PRS_MEDIAN) +
        ISSUES_WEIGHT * calcExponentialCDF(issues / ISSUES_MEDIAN) +
        STARS_WEIGHT * calcLogNormalCDF(stars / STARS_MEDIAN)) /
      TOTAL_WEIGHT;
  
    // Ensure score is between 0 and 1
    const clampedScore = Math.max(0, Math.min(1, score));
  
    const percentile = (1 - clampedScore) * 100;
  
    // Find the corresponding level
    let level = LEVELS[LEVELS.length - 1]; // Default to the lowest level
    for (let i = 0; i < THRESHOLDS.length; i++) {
      if (percentile <= THRESHOLDS[i]) {
        level = LEVELS[i];
        break;
      }
    }
  
    return {
      level,
      // Percentile calculation seems inverted in original logic (lower rank = higher percentile?), adjust if needed
      // Using 100 - percentile to match intuitive expectation (higher score -> higher percentile)
      percentile: parseFloat((100 - percentile).toFixed(1)),
      score: formatScore(clampedScore * 100),
    };
  }