import { useRef, useState, useEffect } from 'react';
import { ProfileForm } from '../components/form/ProfileForm';
import { ProfilePreview } from '../components/preview/ProfilePreview';
import { Button } from '../components/ui/Button';
import { useProfile } from '../hooks/useProfile';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { FaMarkdown } from 'react-icons/fa';
import { Loading } from '../components/ui/Loading';
import { Profile, Theme } from '@/types/profile';

export default function Home() {
  const {
    profile,
    githubStats,
    loading,
    error,
    updateProfile,
    fetchGitHubStats,
    resetProfile,
  } = useProfile();

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [previewParams, setPreviewParams] = useState<{
    username: string;
    theme: Theme;
    skills: string[];
    bio?: string;
    name?: string;
    backgroundImageUrl?: string;
    backgroundOpacity?: number;
  } | null>(null);

  const handleImageLoadSuccess = () => {
    setIsImageLoaded(true);
  };

  const handleGeneratePreview = async () => {
    if (!profile.githubUsername || profile.githubUsername.trim() === '') {
      alert('GitHub 사용자명을 입력해주세요.');
      return;
    }
    
    setIsImageLoaded(false);
    
    try {
      await fetchGitHubStats(); 
      
      setPreviewParams({ 
        username: profile.githubUsername,
        theme: profile.theme,
        skills: profile.skills,
        bio: profile.bio,
        name: profile.name,
        backgroundImageUrl: profile.backgroundImageUrl,
        backgroundOpacity: profile.backgroundOpacity,
      });
      
    } catch (err) {
      console.error('Preview generation failed during stats fetch:', err);
    }
  };

  const handleCopyMarkdown = () => {
    if (!previewParams?.username) return;
    
    const params = new URLSearchParams();
    params.set('username', previewParams.username);
    params.set('theme', previewParams.theme);
    
    // 필수 아닌 매개변수는 값이 있을 때만 추가
    if (previewParams.skills.length > 0) params.set('skills', previewParams.skills.join(','));
    if (previewParams.bio && previewParams.bio.trim() !== '') params.set('bio', previewParams.bio);
    if (previewParams.name && previewParams.name.trim() !== '') params.set('name', previewParams.name);
    
    // 배경 이미지가 선택된 경우만 추가
    if (previewParams.backgroundImageUrl && 
        previewParams.backgroundImageUrl.trim() !== '' && 
        previewParams.backgroundImageUrl !== '/bg-image/' && 
        previewParams.backgroundImageUrl !== '/bg-image') {
      params.set('bg', previewParams.backgroundImageUrl);
      
      // 투명도가 기본값(0.5)이 아닌 경우만 추가
      if (previewParams.backgroundOpacity !== undefined && 
          previewParams.backgroundOpacity !== 0.5) {
        params.set('opacity', previewParams.backgroundOpacity.toString());
      }
    }

    // 환경 변수에서 API 기본 URL 가져오기 (fallback 추가)
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const url = `${baseUrl}/api/card?${params.toString()}`;
    
    const markdownCode = `![${previewParams.name || previewParams.username}'s GitHub Profile](${url})`;
    
    navigator.clipboard.writeText(markdownCode)
      .then(() => {
        alert('마크다운 코드가 클립보드에 복사되었습니다!');
      })
      .catch((error) => {
        console.error('코드 복사 실패:', error);
        alert('코드 복사에 실패했습니다.');
      });
  };

  const subtlePatternStyle = {
    backgroundColor: '#ffffff', // white base
    // Grid pattern using Font-4 color (F2DAAC) with low opacity
    backgroundImage: `
      linear-gradient(to right, rgba(242, 218, 172, 0.2) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(242, 218, 172, 0.2) 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px' // Grid cell size
  };

  return (
    <div 
      className="min-h-screen"
      style={subtlePatternStyle}
    >
      <div className="container mx-auto px-4 py-8">
        <header className="mb-6 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-[#F29F05] mb-2 font-ridi">
            Please Readme
          </h1>
          <p className="text-sm text-[#F2B705] max-w-xl mx-auto sparkle">
            GitHub 사용자명과 간단한 정보를 입력하면 <span className="font-bold text-[#F29F05]">멋진 GitHub 프로필 이미지</span>를 생성합니다.
          </p>
        </header>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        <div className="bg-[#F2F2F2]/80 rounded-xl shadow-lg overflow-hidden mb-8 border border-[#F2DAAC]">
          <div className="bg-[#F2DAAC] px-6 py-4 border-b border-[#F2D479]">
            <h2 className="text-lg font-medium text-[#F29F05] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#F2B705]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              사용 방법
            </h2>
          </div>
          
          <div className="p-6 bg-white/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/70 rounded-lg p-5 flex flex-col items-center text-center border border-[#F2DAAC]/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="w-10 h-10 rounded-full bg-[#F2B705] flex items-center justify-center text-white mb-4 ring-2 ring-[#F2D479]">
                  <span className="text-lg font-bold">1</span>
                </div>
                <h3 className="text-base font-semibold text-[#F29F05] mb-2">정보 입력</h3>
                <p className="text-sm text-gray-700">
                  GitHub 사용자명(필수)과 표시 이름, 자기소개, 기술 스택 등을 왼쪽 폼에 입력합니다.
                </p>
              </div>
              
              <div className="bg-white/70 rounded-lg p-5 flex flex-col items-center text-center border border-[#F2DAAC]/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="w-10 h-10 rounded-full bg-[#F2B705] flex items-center justify-center text-white mb-4 ring-2 ring-[#F2D479]">
                  <span className="text-lg font-bold">2</span>
                </div>
                <h3 className="text-base font-semibold text-[#F29F05] mb-2">카드 생성</h3>
                <p className="text-sm text-gray-700">
                  폼 하단의 '카드 생성 / 업데이트' 버튼을 클릭하면 GitHub 통계를 가져와 오른쪽 영역에 미리보기 이미지를 생성합니다.
                </p>
              </div>
              
              <div className="bg-white/70 rounded-lg p-5 flex flex-col items-center text-center border border-[#F2DAAC]/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="w-10 h-10 rounded-full bg-[#F2B705] flex items-center justify-center text-white mb-4 ring-2 ring-[#F2D479]">
                  <span className="text-lg font-bold">3</span>
                </div>
                <h3 className="text-base font-semibold text-[#F29F05] mb-2">GitHub에 적용</h3>
                <p className="text-sm text-gray-700">
                  미리보기 상단의 '마크다운 복사' 버튼으로 코드를 복사하여 GitHub 프로필 README.md 파일에 붙여넣습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ProfileForm
              profile={profile}
              setProfile={updateProfile}
              disabled={loading}
              onGeneratePreview={handleGeneratePreview}
            />
          </div>

          <div className="space-y-4">
            <ProfilePreview
              profileForFallback={profile}
              previewParams={previewParams}
              githubStats={githubStats}
              statsLoading={loading}
              statsError={error}
              onImageLoadSuccess={handleImageLoadSuccess}
              isImageLoaded={isImageLoaded}
              onCopyMarkdown={handleCopyMarkdown}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 