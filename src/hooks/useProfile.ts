import { useState, useCallback } from 'react';
import { ProfileData, GitHubStats } from '../types/profile';
import { GitHubService } from '../services/github';

const initialProfile: ProfileData = {
  username: '',
  name: '',
  bio: '',
  skills: [],
  theme: 'light',
  githubStats: {
    stars: 0,
    commits: 0,
    prs: 0,
    issues: 0,
    contributions: 0,
    currentYearCommits: 0,
    languages: {},
  },
};

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback((updates: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const fetchGitHubStats = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const stats = await GitHubService.getStats(username);
      updateProfile({ githubStats: stats });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'GitHub 통계를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [updateProfile]);

  const resetProfile = useCallback(() => {
    setProfile(initialProfile);
    setError(null);
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    fetchGitHubStats,
    resetProfile,
  };
} 