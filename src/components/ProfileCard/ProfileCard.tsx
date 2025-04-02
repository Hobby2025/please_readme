import React from 'react';
import { Profile, GitHubStats } from '../../types/profile';
import { TechBadge } from '../ui/TechBadge';
import Image from 'next/image';

interface ProfileCardProps {
  profile: Profile;
  stats: GitHubStats | null;
  loading: boolean;
  onDownload?: () => void;
}

export default function ProfileCard({ profile, stats, loading, onDownload }: ProfileCardProps) {
  if (loading) {
    return (
      <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${
      profile.theme === 'dark' ? 'dark' : ''
    }`}>
      {profile.backgroundImageUrl && (
        <div className="relative h-48">
          <Image
            src={profile.backgroundImageUrl}
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {stats?.avatarUrl && (
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
              <Image
                src={stats.avatarUrl}
                alt={profile.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.name || stats?.name || '이름 없음'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              @{profile.githubUsername}
            </p>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {profile.bio || stats?.bio || '소개가 없습니다.'}
        </p>

        {profile.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.skills.map((skill) => (
              <TechBadge key={skill} tech={skill} />
            ))}
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.followers}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                팔로워
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.following}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                팔로잉
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.publicRepos}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                저장소
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalStars}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                스타
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 flex justify-between items-center">
        {onDownload && (
          <button
            onClick={onDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            aria-label="다운로드"
          >
            다운로드
          </button>
        )}
      </div>
    </div>
  );
} 