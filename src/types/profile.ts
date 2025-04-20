import { Rank } from '@/utils/rankUtils';
import { CardTheme } from '@/types';

export interface GitHubStats {
  totalStars: number;
  avatarUrl: string;
  name: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  twitterUsername: string | null;
  blog: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
  currentYearCommits: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  rank: Rank;
}

export interface Profile {
  githubUsername: string;
  name?: string;
  bio?: string;
  skills: string[];
  theme: CardTheme;
  backgroundImageUrl?: string;
  backgroundOpacity?: number;
  fontFamily?: string;
}

export interface ImageGenerationOptions {
  width: number;
  height: number;
  scale: number;
  backgroundColor: string;
  textColor: string;
} 