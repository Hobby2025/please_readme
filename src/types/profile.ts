import { Rank } from '@/utils/rankUtils';

export type Theme = 'dark' | 'light';

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
  theme: Theme;
  backgroundImageUrl?: string;
  backgroundOpacity?: number;
  fontFamily?: string;
}

export interface ProfileFormProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  disabled?: boolean;
  onGeneratePreview: () => void;
}

export interface ProfileCardProps {
  profile: Profile;
  stats: GitHubStats | null;
  loading: boolean;
  onDownload?: () => void;
  currentYear?: number;
}

export interface ProfilePreviewProps {
  profileForFallback?: Profile;
  previewParams: {
    username: string;
    theme: Theme;
    skills: string[];
    bio?: string;
    name?: string;
    backgroundImageUrl?: string;
    backgroundOpacity?: number;
    fontFamily?: string;
  } | null;
  githubStats: GitHubStats | null;
  statsLoading: boolean;
  statsError: string | null;
  onImageLoadSuccess?: () => void;
  setProfile?: (profile: Profile) => void;
  isImageLoaded: boolean;
  onCopyMarkdown: () => void;
  onCopyHtml: () => void;
}

export interface ImageGenerationOptions {
  width: number;
  height: number;
  scale: number;
  backgroundColor: string;
  textColor: string;
}

export interface ThemeOption {
  label: string;
  value: Theme;
  icon: React.ComponentType<any>;
} 