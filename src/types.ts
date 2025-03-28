// GitHub 프로필 이미지 생성기에 필요한 타입 정의

export interface ProfileData {
  username: string;
  name: string;
  bio: string;
  skills: string[];
  theme: 'light' | 'dark';
}

// MarkdownGenerator에서 사용되는 확장된 프로필 정보
export interface ProfileInfo extends ProfileData {
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

export interface GitHubStats {
  stars: number;
  commits: number;
  prs: number;
  issues: number;
  contributions: number;
  currentYearCommits: number;
  languages: { [key: string]: number };
  avatar_url?: string;
}

// GitHub API 응답 타입 정의 추가
export interface GithubApiResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
} 