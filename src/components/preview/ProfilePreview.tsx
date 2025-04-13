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
    <div className="h-full flex flex-col bg-[#F2F2F2]/80 rounded-xl shadow-lg overflow-hidden border border-[#F2DAAC]">
      <div className="border-b border-[#F2D479] bg-[#F2DAAC] px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-medium text-[#F29F05] flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-[#F2B705]"
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
            size="sm" 
            onClick={onCopyMarkdown}
            disabled={!previewParams?.username}
            className="bg-[#F2B705] text-white hover:bg-[#F29F05]"
          >
            <FaMarkdown className="mr-2" />
            마크다운 복사
          </Button>
        )}
      </div>

      <div className="flex-1 h-full w-full p-2 flex flex-col justify-center bg-white/50 border border-[#F2DAAC]/50 rounded-b-xl">
        {statsLoading && (
          <div className="text-center mx-auto">
            <Loading size="lg" className="mb-2 text-[#F2B705]" />
            <p className="text-[#F29F05]">GitHub 통계 로딩 중...</p>
          </div>
        )}
        {statsError && !statsLoading && (
           <div className="mx-auto">
             <ErrorMessage message={`GitHub 통계 로딩 실패: ${statsError}`} className="text-red-700" />
           </div>
        )}

        {!statsLoading && !statsError && imageUrl && (
          <div className="flex justify-center items-center h-full w-full">
            {isImageLoading && (
              <div className="text-center p-10 min-h-[200px] flex flex-col justify-center items-center">
                <Loading size="lg" className="mb-2 text-[#F2B705]" />
                <p className="text-[#F29F05]">미리보기 이미지 로딩 중...</p>
              </div>
            )}
            {imageError && !isImageLoading && (
               <div className="p-10 min-h-[200px] flex flex-col justify-center items-center">
                 <ErrorMessage message={imageError} className="text-red-700" />
               </div>
            )}
            <div className="aspect-[10/8] relative">
              <img 
                src={imageUrl} 
                alt={`${previewParams?.username || '...'}'s Profile Card Preview`}
                onLoad={handleImageLoad} 
                onError={handleImageError} 
                className={`w-full h-full object-contain ${isImageLoading || imageError ? 'hidden' : 'block'}`}
              />
            </div>
          </div>
        )}
        {!previewParams && !statsLoading && !statsError && (
          <p className="text-[#F29F05] text-center mx-auto">
            왼쪽 폼에 정보를 입력하고<br/>'카드 생성 / 업데이트' 버튼을 눌러<br/>미리보기를 확인하세요.
          </p>
        )}
      </div>
    </div>
  );
}; 