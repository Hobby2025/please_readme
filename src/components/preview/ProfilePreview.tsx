import React, { useRef, useEffect, useState } from 'react';
import { ProfilePreviewProps, Profile, Theme } from '../../types/profile';
import { Button } from '../ui/Button';
import { FaMarkdown } from 'react-icons/fa';
import { Loading } from '../ui/Loading';
import { ErrorMessage } from '../ui/ErrorMessage';

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  profileForFallback,
  previewParams,
  githubStats,
  statsLoading,
  statsError,
  onImageLoadSuccess,
  isImageLoaded,
  onCopyMarkdown,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (!previewParams || statsLoading || statsError) {
      setImageUrl('');
      setIsImageLoading(false);
      setImageError(null);
      return;
    }

    const params = new URLSearchParams();
    params.set('username', previewParams.username);
    params.set('theme', previewParams.theme);
    if (previewParams.skills.length > 0) params.set('skills', previewParams.skills.join(','));
    if (previewParams.bio) params.set('bio', previewParams.bio);
    if (previewParams.name) params.set('name', previewParams.name);
    if (previewParams.backgroundImageUrl) params.set('bg', previewParams.backgroundImageUrl);
    params.set('t', Date.now().toString());

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const url = `${baseUrl}/api/card?${params.toString()}`;
    
    setImageUrl(url);
    setIsImageLoading(true);
    setImageError(null);

  }, [previewParams, statsLoading, statsError]);

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(null);
    onImageLoadSuccess?.();
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError('미리보기 이미지를 불러오는데 실패했습니다. API 서버 상태를 확인하거나 잠시 후 다시 시도해주세요.');
  };

  return (
    <div className="h-full flex flex-col bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 px-6 py-4 flex items-center justify-between">
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
        {isImageLoaded && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCopyMarkdown}
            disabled={!previewParams?.username}
          >
            <FaMarkdown className="mr-2" />
            마크다운 복사
          </Button>
        )}
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-b-xl min-h-[300px]">
        {statsLoading && (
          <div className="text-center">
            <Loading size="lg" className="mb-2" />
            <p className="text-gray-600 dark:text-gray-300">GitHub 통계 로딩 중...</p>
          </div>
        )}
        {statsError && !statsLoading && (
           <ErrorMessage message={`GitHub 통계 로딩 실패: ${statsError}`} />
        )}

        {!statsLoading && !statsError && imageUrl && (
          <div className="w-full flex flex-col items-center justify-center">
            {isImageLoading && (
              <div className="text-center">
                <Loading size="lg" className="mb-2" />
                <p className="text-gray-600 dark:text-gray-300">미리보기 이미지 로딩 중...</p>
              </div>
            )}
            {imageError && !isImageLoading && (
               <ErrorMessage message={imageError} />
            )}
            <img 
              src={imageUrl} 
              alt={`${previewParams?.username || '...'}'s Profile Card Preview`}
              onLoad={handleImageLoad} 
              onError={handleImageError} 
              className={`max-w-full h-auto rounded-lg shadow-md ${isImageLoading || imageError ? 'hidden' : 'block'}`}
            />
          </div>
        )}
        {!previewParams && !statsLoading && !statsError && (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            왼쪽 폼에 정보를 입력하고<br/>'카드 생성 / 업데이트' 버튼을 눌러<br/>미리보기를 확인하세요.
          </p>
        )}
      </div>
    </div>
  );
}; 