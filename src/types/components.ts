import React from 'react';
import { Profile, GitHubStats } from './profile'; // Profile, GitHubStats 임포트
import { CardTheme } from './styles'; // CardTheme import 추가

export interface ProfileFormProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  disabled?: boolean;
  onGeneratePreview: () => void;
}

export interface ThemeOption {
  label: string;
  value: CardTheme;
  icon: React.ComponentType<any>;
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
    theme: CardTheme;
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

// ProfileForm.tsx - availableFonts 타입
export interface FontOption {
  value: string;
  label: string;
}

// ProfileCardStatic.tsx - SimpleTechBadge Props 타입
export interface SimpleTechBadgeProps {
  tech: string;
}

// ProfileCardStatic.tsx - bgColors, textColors 타입
export type ColorMap = Record<string, string>;

// ProfileCardStatic.tsx - techNormalization 타입
export type TechNormalizationMap = Record<string, string>; 