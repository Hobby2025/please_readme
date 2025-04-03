import { Rank } from '@/utils/rankUtils';

export type Theme = 'light' | 'dark';

export interface GitHubStats {
  totalStars: number;
  avatarUrl: string;
  name: string;
  bio: string;
  location: string;
  company: string;
  twitterUsername: string;
  blog: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  currentYearCommits: number;
  totalPRs: number;
  totalIssues: number;
  rank: Rank;
}

export interface Profile {
  githubUsername: string;
  name: string;
  bio: string;
  skills: string[];
  backgroundImageUrl?: string;
  theme: Theme;
}

export interface ProfileFormProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  disabled?: boolean;
}

export interface ProfileCardProps {
  profile: Profile;
  stats: GitHubStats | null;
  loading: boolean;
  onDownload?: () => void;
}

export interface ProfilePreviewProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  onPreviewGenerated?: (generated: boolean) => void;
  onResetPreview?: () => void;
}

export interface ImageGenerationOptions {
  width: number;
  height: number;
  scale: number;
  backgroundColor: string;
  textColor: string;
} 