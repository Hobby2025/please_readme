import { useState, useCallback } from 'react';
import { Profile, GitHubStats } from '../types/profile';
import { GitHubService } from '../services/github';
import { Rank } from '@/utils/rankUtils';

const initialGithubStats: GitHubStats = {
  totalStars: 0,
  avatarUrl: '',
  name: '',
  bio: '',
  location: '',
  company: '',
  twitterUsername: '',
  blog: '',
  email: '',
  createdAt: '',
  updatedAt: '',
  currentYearCommits: 0,
  totalPRs: 0,
  totalIssues: 0,
  rank: { level: '?', percentile: 0, score: 0 },
};

const initialProfile: Profile = {
  githubUsername: '',
  name: '',
  bio: '',
  skills: [],
  theme: 'dark',
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [githubStats, setGithubStats] = useState<GitHubStats>(initialGithubStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const fetchGitHubStats = useCallback(async () => {
    if (!profile.githubUsername) {
      setError('GitHub 사용자명을 입력해주세요.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const githubService = GitHubService.getInstance();
      const stats = await githubService.getUserStats(profile.githubUsername);
      setGithubStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'GitHub 통계를 가져오는데 실패했습니다.');
      setGithubStats({ ...initialGithubStats, rank: { level: '?', percentile: 0, score: 0 } });
    } finally {
      setLoading(false);
    }
  }, [profile.githubUsername]);

  const resetProfile = useCallback(() => {
    setProfile(initialProfile);
    setGithubStats(initialGithubStats);
    setError(null);
  }, []);

  return {
    profile,
    githubStats,
    loading,
    error,
    updateProfile,
    fetchGitHubStats,
    resetProfile,
  };
} 