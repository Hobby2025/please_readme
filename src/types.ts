// GitHub 프로필 이미지 생성기에 필요한 타입 정의

export interface ProfileData {
  username: string;
  name: string;
  bio: string;
  skills: string[];
  theme: 'light' | 'dark';
}

export interface ProfileFormProps {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
}

export interface ProfilePreviewProps {
  profile: ProfileData;
}

export interface GitHubStats {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  avatar_url: string;
} 