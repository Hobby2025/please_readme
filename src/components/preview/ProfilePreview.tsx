import React from 'react';
import { Profile, GitHubStats, ProfilePreviewProps } from '@/types';
import { Button } from '../ui/Button';
import { FaMarkdown, FaHtml5, FaCode } from 'react-icons/fa';
import { Loading } from '../ui/Loading';
import { ErrorMessage } from '../ui/ErrorMessage';
import ProfileCardStatic from '../ProfileCard/ProfileCardStatic';
import { useProfilePreviewImage } from '@/hooks/useProfilePreviewImage';

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  profileForFallback,
  previewParams,
  githubStats,
  statsLoading,
  statsError,
  onImageLoadSuccess,
  isImageLoaded,
  onCopyMarkdown,
  onCopyHtml,
}) => {
  const {
    imageUrl,
    isImageLoading,
    imageError,
    handleImageLoad,
    handleImageError,
  } = useProfilePreviewImage({ previewParams, statsLoading, statsError, onImageLoadSuccess });

  return (
    <div className="h-full flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-brand-light">
      <div className="border-b border-brand-light bg-brand-light/40 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-brand-orange"
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
          <div className="flex gap-2">
             <Button 
              size="sm" 
              variant="secondary"
              onClick={onCopyHtml}
              disabled={!previewParams?.username}
              className="font-bold shadow-md"
            >
              <FaCode className="mr-2" />
              코드 복사
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 h-full w-full p-6 flex flex-col justify-center bg-white/30 rounded-b-2xl">
        {statsLoading && (
          <div className="text-center mx-auto">
            <Loading size="lg" className="mb-3 text-brand-yellow" />
            <p className="text-primary font-bold">GitHub 통계 로딩 중...</p>
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
                <Loading size="lg" className="mb-3 text-brand-yellow" />
                <p className="text-primary font-bold">미리보기 이미지 로딩 중...</p>
              </div>
            )}
            {imageError && !isImageLoading && (
               <div className="p-10 min-h-[200px] flex flex-col justify-center items-center">
                 <ErrorMessage message={imageError} className="text-red-700" />
               </div>
            )}
            <div className="aspect-[50/49] relative">
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
          <p className="text-primary text-center mx-auto font-bold leading-relaxed">
            왼쪽 폼에 정보를 입력하고<br/>
            <span className="text-brand-orange">&apos;카드 생성 / 업데이트&apos;</span> 버튼을 눌러<br/>
            미리보기를 확인하세요.
          </p>
        )}
      </div>
    </div>
  );
}; 