import { useState, useRef } from 'react';
import { Profile, GitHubStats } from '../types/profile';
import { ImageService } from '../services/image';
import { ProfileForm } from '../components/form/ProfileForm';
import ProfileCard from '../components/ProfileCard/ProfileCard';
import { Button } from '../components/ui/Button';

const defaultProfile: Profile = {
  githubUsername: '',
  name: '',
  bio: '',
  skills: [],
  backgroundImageUrl: undefined,
  theme: 'light',
};

export default function Home() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);

  const handleProfileChange = (newProfile: Profile) => {
    setProfile(newProfile);
    setError(null);
  };

  const handleFetchStats = async () => {
    if (!profile.githubUsername) {
      setError('GitHub 사용자명을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/github/stats?username=${profile.githubUsername}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      const stats = await response.json();
      setStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'GitHub 통계를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!stats || !profileCardRef.current) {
      setError('먼저 GitHub 통계를 가져와주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/image/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile, stats }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      const { imageUrl } = await response.json();
      setProfile(prev => ({ ...prev, backgroundImageUrl: imageUrl }));

      // 이미지 다운로드
      const imageService = ImageService.getInstance();
      await imageService.downloadImage(imageUrl, `${profile.githubUsername}-profile.png`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-6 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-[#8B5CF6] dark:text-[#A78BFA] mb-2 font-ridi drop-shadow-md">
            Please Readme
          </h1>
          <p className="text-sm text-gray-700 dark:text-gray-300 max-w-xl mx-auto sparkle">
            GitHub 사용자명과 간단한 정보를 입력하면 <span className="font-bold text-[#8B5CF6] dark:text-[#A78BFA]">멋진 GitHub 프로필 이미지</span>를 생성합니다.
          </p>
        </header>

        {/* 사용 방법 */}
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-[#8B5CF6] dark:text-[#A78BFA] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#8B5CF6]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              사용 방법
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 rounded-lg p-5 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/20 dark:bg-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] dark:text-[#A78BFA] mb-4">
                  <span className="text-sm font-medium">1</span>
                </div>
                <h3 className="text-sm font-medium text-[#8B5CF6] dark:text-[#A78BFA] mb-2">정보 입력</h3>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  GitHub 사용자명(필수)과 표시 이름, 자기소개, 기술 스택 등을 입력합니다.
                </p>
              </div>
              
              <div className="bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 rounded-lg p-5 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/20 dark:bg-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] dark:text-[#A78BFA] mb-4">
                  <span className="text-sm font-medium">2</span>
                </div>
                <h3 className="text-sm font-medium text-[#8B5CF6] dark:text-[#A78BFA] mb-2">이미지 생성</h3>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  &apos;이미지 생성하기&apos; 버튼을 클릭하여 프로필 이미지를 생성합니다.
                </p>
              </div>
              
              <div className="bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 rounded-lg p-5 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/20 dark:bg-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] dark:text-[#A78BFA] mb-4">
                  <span className="text-sm font-medium">3</span>
                </div>
                <h3 className="text-sm font-medium text-[#8B5CF6] dark:text-[#A78BFA] mb-2">GitHub에 적용</h3>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  생성된 이미지 URL, 마크다운 또는 HTML 코드를 복사하여 GitHub 프로필 README.md 파일에 붙여넣습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ProfileForm
              profile={profile}
              setProfile={handleProfileChange}
              disabled={loading}
            />

            <div className="flex gap-4">
              <Button
                onClick={handleFetchStats}
                isLoading={loading}
                disabled={!profile.githubUsername}
              >
                GitHub 통계 가져오기
              </Button>

              <Button
                onClick={handleGenerateImage}
                isLoading={loading}
                disabled={!stats}
                variant="secondary"
              >
                이미지 생성하기
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div ref={profileCardRef}>
              <ProfileCard
                profile={profile}
                stats={stats}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 