import React, { useRef, useEffect } from 'react';
import { ProfilePreviewProps, GitHubStats } from '../../types/profile';
import { Button } from '../ui/Button';
import { TechBadge } from '../ui/TechBadge';
import { useImage } from '../../hooks/useImage';
import { useProfile } from '../../hooks/useProfile';
import { Rank } from '@/utils/rankUtils';

const rankLevelColorMapping: Record<string, string> = {
  'S': 'text-purple-600 dark:text-purple-400',
  'A+': 'text-blue-600 dark:text-blue-400',
  'A': 'text-blue-500 dark:text-blue-300',
  'A-': 'text-sky-600 dark:text-sky-400',
  'B+': 'text-green-600 dark:text-green-400',
  'B': 'text-green-500 dark:text-green-300',
  'B-': 'text-lime-600 dark:text-lime-400',
  'C+': 'text-yellow-600 dark:text-yellow-400',
  'C': 'text-yellow-500 dark:text-yellow-300',
  '?': 'text-gray-500 dark:text-gray-400', 
};

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  profile,
  onPreviewGenerated,
  onResetPreview,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const { generateImage, loading: imageLoading, error: imageError } = useImage();
  const {
    githubStats,
    fetchGitHubStats,
    loading: statsLoading,
    error: statsError,
    updateProfile,
    resetProfile,
  } = useProfile();

  useEffect(() => {
    if (profile.githubUsername) {
      fetchGitHubStats();
    }
  }, [profile.githubUsername, fetchGitHubStats]);

  const handleGenerateImage = async () => {
    if (!previewRef.current) return;

    try {
      const generatedImageBlob = await generateImage(previewRef.current, {
        backgroundColor: profile.theme === 'dark' ? '#1f2937' : '#ffffff',
      });
      
      if (generatedImageBlob instanceof Blob) { 
          const imageUrl = URL.createObjectURL(generatedImageBlob);
          updateProfile({ backgroundImageUrl: imageUrl });
      } else {
           console.warn('generateImage did not return a Blob as expected.');
      }
      
      onPreviewGenerated?.(true);
    } catch (error) {
      console.error('이미지 생성 실패:', error);
    }
  };

  const handleCopyCode = () => {
    const apiUrl = `/api/github-card?username=${encodeURIComponent(profile.githubUsername)}&theme=${profile.theme}&name=${encodeURIComponent(profile.name)}&bio=${encodeURIComponent(profile.bio)}&backgroundImageUrl=${encodeURIComponent(profile.backgroundImageUrl || '')}`;
    const markdownCode = `![GitHub Profile](${apiUrl})`;
    
    navigator.clipboard.writeText(markdownCode)
      .then(() => {
        alert('마크다운 코드가 복사되었습니다.');
      })
      .catch((error) => {
        console.error('코드 복사 실패:', error);
        alert('코드 복사에 실패했습니다.');
      });
  };

  const handleReset = () => {
    resetProfile();
    onResetPreview?.();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 px-6 py-4 flex items-center justify-between rounded-t-xl">
        <h2 className="text-xl font-medium text-[#8B5CF6] dark:text-[#A78BFA] flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-[#8B5CF6]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          프로필 이미지 미리보기
        </h2>
      </div>

      <div className="flex-1 p-6 flex flex-col">
        <div
          ref={previewRef}
          className={`flex-1 flex flex-col items-center justify-center p-4 bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${
            profile.backgroundImageUrl ? 'bg-cover bg-center' : ''
          }`}
          style={
            profile.backgroundImageUrl
              ? { backgroundImage: `url(${profile.backgroundImageUrl})` }
              : undefined
          }
        >
          {statsLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[#8B5CF6]/10 dark:border-[#8B5CF6]/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-[#8B5CF6] dark:border-t-[#A78BFA] rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
                GitHub 통계를 가져오는 중...
              </p>
            </div>
          ) : statsError ? (
            <div className="flex flex-col items-center justify-center py-8 text-red-600">
              <p>GitHub 통계 로딩 실패:</p>
              <p className="text-sm">{statsError}</p>
            </div>
          ) : (
            <div className="w-full max-w-2xl p-6 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {profile.name || profile.githubUsername}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">{profile.bio}</p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {profile.skills.map((skill) => (
                  <TechBadge key={skill} tech={skill} />
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 rounded-lg">
                  <p className="text-2xl font-bold text-[#8B5CF6]">
                    {githubStats.totalStars ?? '-'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">총 스타</p>
                </div>
                <div className="text-center p-3 bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 rounded-lg">
                  <p className="text-2xl font-bold text-[#8B5CF6]">
                    {githubStats.currentYearCommits ?? '-'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">올해 커밋</p>
                </div>
                <div className="text-center p-3 bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 rounded-lg">
                  <p className="text-2xl font-bold text-[#8B5CF6]">
                    {githubStats.totalPRs ?? '-'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">총 PR</p>
                </div>
                <div className="text-center p-3 bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 rounded-lg">
                  <p className="text-2xl font-bold text-[#8B5CF6]">
                    {githubStats.totalIssues ?? '-'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">총 이슈</p>
                </div>
              </div>

              <div className="text-center mb-6">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">랭크:</span>
                {githubStats.rank && (
                  <span className={`text-2xl font-bold ${rankLevelColorMapping[githubStats.rank.level] ?? 'text-gray-500 dark:text-gray-400'}`}>
                    {githubStats.rank.level}
                  </span>
                )}
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleGenerateImage}
                  isLoading={imageLoading}
                  disabled={!profile.githubUsername || imageLoading}
                >
                  이미지 생성하기
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCopyCode}
                  disabled={!profile.githubUsername}
                >
                  코드 복사
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleReset}
                  size="sm"
                >
                  새로 만들기
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 