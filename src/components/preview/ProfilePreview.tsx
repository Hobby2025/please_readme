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
    <div className="h-full flex flex-col bg-black/40 backdrop-blur-md rounded-none overflow-hidden border border-white/10 relative">
      <div className="border-b border-white/10 bg-white/5 px-6 py-4 flex items-center justify-between">
        <h2 className="text-sm font-black text-primary tracking-[0.3em] flex items-center uppercase">
          <span className="w-3 h-3 bg-primary mr-3 animate-pulse shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
          Preview // Output
        </h2>
        {isImageLoaded && (
          <div className="flex gap-3">
             <Button 
              size="sm" 
              variant="secondary"
              onClick={onCopyMarkdown}
              disabled={!previewParams?.username}
              className="font-black text-xs px-5 border border-primary/50"
            >
              <FaMarkdown className="mr-2 text-xl" />
              Copy Markdown
            </Button>
             <Button 
              size="sm" 
              variant="secondary"
              onClick={onCopyHtml}
              disabled={!previewParams?.username}
              className="font-black text-xs px-5 border border-primary/50"
            >
              <FaHtml5 className="mr-2 text-xl" />
              Copy HTML
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 h-full w-full p-10 flex flex-col justify-center bg-black/40">
        {statsLoading && (
          <div className="text-center mx-auto space-y-4">
            <Loading size="lg" className="text-primary" />
            <p className="text-primary font-black text-lg tracking-widest animate-pulse uppercase">Accessing Satellite Data...</p>
          </div>
        )}
        {statsError && !statsLoading && (
          <div className="mx-auto cyber-card p-6 border-red-500 bg-red-500/10">
            <ErrorMessage message={`[LINK_FAILURE]: ${statsError}`} className="text-red-500 font-black text-sm uppercase italic" />
          </div>
        )}

        {!statsLoading && !statsError && imageUrl && (
          <div className="flex justify-center items-center h-full w-full">
            {isImageLoading && (
              <div className="text-center p-12 min-h-[300px] flex flex-col justify-center items-center space-y-6">
                <Loading size="lg" className="text-primary" />
                <p className="text-white font-black text-lg tracking-[0.2em] uppercase">Synthesizing Visuals...</p>
              </div>
            )}
            {imageError && !isImageLoading && (
               <div className="p-12 min-h-[300px] flex flex-col justify-center items-center cyber-card border-red-500/30">
                 <ErrorMessage message={`[RENDER_ERROR]: ${imageError}`} className="text-red-500 font-bold uppercase" />
               </div>
            )}
            <div className="aspect-[50/49] relative shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
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
          <div className="text-center space-y-8 p-12 cyber-card border-white/5 bg-white/[0.02]">
            <p className="text-white text-lg sm:text-xl text-center mx-auto font-black leading-loose uppercase tracking-widest">
              Terminal is <span className="text-primary">Idle</span>.<br/>
              Awaiting <span className="text-secondary underline decoration-primary decoration-4 underline-offset-8">User Intelligence</span> Input.
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-1 h-1 bg-primary" />
              <div className="w-8 h-1 bg-white/10" />
              <div className="w-1 h-1 bg-primary" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 