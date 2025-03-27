import React from 'react';

export interface GitHubStats {
  stars: number;
  commits: number;
  prs: number;
  issues: number;
  contributions: number;
  languages: { [key: string]: number };
  avatar_url?: string;
}

export interface ProfileData {
  username: string;
  name: string;
  bio: string;
  skills: string[];
  theme: 'light' | 'dark';
  githubStats: GitHubStats;
}

export interface GithubApiResponse {
  success: boolean;
  message: string;
}

export interface ProfileInfo {
  username: string;
  name: string;
  bio: string;
  skills: string[];
  theme?: string;
  lightTheme?: string;
  darkTheme?: string;
  useDarkLightMode?: boolean;
  useCustomCode?: boolean;
  customCode?: string;
  links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
    other?: string;
  };
}

export interface ProfileFormProps {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
}

export interface ProfilePreviewProps {
  profile: ProfileData;
} 