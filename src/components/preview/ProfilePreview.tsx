import React, { useRef, useEffect } from 'react';
import { ProfilePreviewProps } from '../../types/profile';
import { Button } from '../ui/Button';
import { TechBadge } from '../ui/TechBadge';
import { useImage } from '../../hooks/useImage';
import { useProfile } from '../../hooks/useProfile';

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  profile,
  setProfile,
  onPreviewGenerated,
  onResetPreview,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const { generateImage, loading: imageLoading, error: imageError } = useImage();
  const { fetchGitHubStats, loading: statsLoading, error: statsError } = useProfile();

  useEffect(() => {
    if (profile.username) {
      fetchGitHubStats(profile.username);
    }
  }, [profile.username, fetchGitHubStats]);

  const handleGenerateImage = async () => {
    if (!previewRef.current) return;

    try {
      await generateImage(previewRef.current, {
        backgroundColor: profile.theme === 'dark' ? '#1f2937' : '#ffffff',
      });
      onPreviewGenerated?.(true);
    } catch (error) {
      console.error('이미지 생성 실패:', error);
    }
  };

  const handleCopyCode = () => {
    const apiUrl = `/api/github-card?username=${encodeURIComponent(profile.username)}&theme=${profile.theme}&name=${encodeURIComponent(profile.name)}&bio=${encodeURIComponent(profile.bio)}&backgroundImageUrl=${encodeURIComponent(profile.backgroundImageUrl || '')}`;
    const markdownCode = `![GitHub Profile](${apiUrl})`;
    
    navigator.clipboard.writeText(markdownCode)
      .then(() => {
        // 성공 메시지 표시
      })
      .catch((error) => {
        console.error('코드 복사 실패:', error);
      });
  };

  const handleReset = () => {
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
          ) : (
            <div className="w-full max-w-2xl p-6 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {profile.name || profile.username}
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
                    {profile.githubStats.stars}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Stars</p>
                </div>
                <div className="text-center p-3 bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 rounded-lg">
                  <p className="text-2xl font-bold text-[#8B5CF6]">
                    {profile.githubStats.commits}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Commits</p>
                </div>
                <div className="text-center p-3 bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 rounded-lg">
                  <p className="text-2xl font-bold text-[#8B5CF6]">
                    {profile.githubStats.prs}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">PRs</p>
                </div>
                <div className="text-center p-3 bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 rounded-lg">
                  <p className="text-2xl font-bold text-[#8B5CF6]">
                    {profile.githubStats.issues}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Issues</p>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleGenerateImage}
                  isLoading={imageLoading}
                  disabled={!profile.username}
                >
                  이미지 생성하기
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCopyCode}
                  disabled={!profile.username}
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