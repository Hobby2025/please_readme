export interface GitHubStats {
  username: string;
  name: string;
  bio: string | null;
  avatarUrl: string;
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  followers: number;
  topLanguages: string[];
  rank: {
    level: string;
    score: number;
  };
}

export interface ProfileConfig {
  bio?: string | null;
  username: string;
  name?: string;
}
