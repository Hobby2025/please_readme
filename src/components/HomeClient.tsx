'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ProfileForm } from '../components/form/ProfileForm';
import { ProfilePreview } from '../components/preview/ProfilePreview';
import { useProfile } from '../hooks/useProfile';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Profile, CardTheme } from '@/types';
import { useToast } from '@/contexts/ToastContext';

export default function HomeClient() {
  const { showToast } = useToast();

  // 개발자 도구 커스텀 (필요 시 유지)
  const [hasLogged, setHasLogged] = useState(false);
  useEffect(() => {
    if (!hasLogged && typeof window !== 'undefined') {
      console.log('%cPlease Readme - Happy Coding!', 'color: #F2B705; font-size: 14px; font-weight: bold;');
      setHasLogged(true);
    }
  }, [hasLogged]);

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
    theme: CardTheme;
    skills: string[];
    bio?: string;
    name?: string;
    backgroundImageUrl?: string;
    backgroundOpacity?: number;
    fontFamily?: string;
  } | null>(null);

  const handleImageLoadSuccess = () => {
    setIsImageLoaded(true);
  };

  const handleGeneratePreview = async () => {
    if (!profile.githubUsername || profile.githubUsername.trim() === '') {
      showToast('GitHub 사용자명을 입력해주세요.', 'error');
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
        fontFamily: profile.fontFamily,
      });
      
    } catch (err) {
      console.error('Preview generation failed:', err);
    }
  };

  const generateUrl = () => {
    if (!previewParams?.username) return '';

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const timestamp = Date.now();
    
    // 단순화 렌더링 적용 (옵션 직렬화 무시, username 파라미터만 전달)
    return `${baseUrl}/api/card?username=${previewParams.username}&nocache=true&t=${timestamp}`;
  };

  const handleCopyMarkdown = () => {
    const url = generateUrl();
    if (!url) return;
    
    const markdownCode = `<div align="center">\n  <img src="${url}" width="600" alt="${previewParams?.name || previewParams?.username}'s GitHub Profile">\n</div>`;
    
    navigator.clipboard.writeText(markdownCode)
      .then(() => showToast('마크다운 코드가 복사되었습니다!', 'success'))
      .catch(() => showToast('코드 복사에 실패했습니다.', 'error'));
  };

  const handleCopyHtml = () => {
    const url = generateUrl();
    if (!url) return;
    
    const htmlCode = `<div align="center">\n  <img src="${url}" width="600" loading="eager" fetchpriority="high" alt="${previewParams?.name || previewParams?.username}'s GitHub Profile">\n</div>`;
    
    navigator.clipboard.writeText(htmlCode)
      .then(() => showToast('HTML 코드가 복사되었습니다!', 'success'))
      .catch(() => showToast('코드 복사에 실패했습니다.', 'error'));
  };

  const cyberPatternStyle = {
    backgroundColor: '#000000',
    backgroundImage: `
      linear-gradient(rgba(255, 0, 229, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 0, 229, 0.05) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px'
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen text-white selection:bg-primary selection:text-white cyber-grid-animate" style={cyberPatternStyle}>
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <header className="mb-6 flex flex-col md:flex-row justify-between items-end gap-3 border-b border-primary pb-3 relative">
          <div className="absolute -top-6 left-0 text-[12px] font-black text-primary/30 tracking-[0.3em] uppercase">SYSTEM_IDENTIFIER: PR-2025-V3</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase leading-none">
            Please<span className="text-primary not-italic ml-4">Readme</span>
          </h1>
        </header>

        {error && (
          <div className="mb-4 cyber-card p-3 border-red-500 bg-red-500/10 text-red-500 font-black text-xs uppercase">
            [ERROR]: {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: Form */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
            <div className="cyber-card p-0 border-white/10 bg-black/60 shadow-lg relative overflow-hidden">
              <div className="p-6">
                <ProfileForm
                  profile={profile}
                  setProfile={updateProfile}
                  onGeneratePreview={handleGeneratePreview}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Right Side: Preview (Sticky) */}
          <div className="lg:col-span-12 xl:col-span-7 lg:sticky lg:top-10 flex flex-col gap-6">
            <div className="cyber-card p-0 border-white/10 bg-[#050505] shadow-2xl relative min-h-[950px] flex flex-col items-center pt-8 overflow-hidden">
              <div className="origin-top">
                <ProfilePreview
                  profileForFallback={profile}
                  previewParams={previewParams}
                  githubStats={githubStats}
                  statsLoading={loading}
                  statsError={error}
                  onImageLoadSuccess={handleImageLoadSuccess}
                  isImageLoaded={isImageLoaded}
                  onCopyMarkdown={handleCopyMarkdown}
                  onCopyHtml={handleCopyHtml}
                />
              </div>
            </div>
          </div>
        </div>

        <footer className='mt-6 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 hover:opacity-100 transition-opacity'>
          <div className="flex items-center gap-4">

             <p className='text-[14px] font-black tracking-widest uppercase'>© {currentYear} Hobby2025 // All Rights Reserved.</p>
          </div>
          <a href="https://github.com/Hobby2025/please_readme" target="_blank" rel="noopener noreferrer" className="group">
            <svg className="h-6 w-6 text-white group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
        </footer>
      </div>
    </div>
  );
}
