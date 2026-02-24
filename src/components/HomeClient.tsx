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
    
    const dataObj: any = {
      username: previewParams.username,
      theme: previewParams.theme,
    };
    
    if (previewParams.skills.length > 0) dataObj.skills = previewParams.skills.join(',');
    if (previewParams.bio?.trim()) dataObj.bio = previewParams.bio;
    if (previewParams.name?.trim()) dataObj.name = previewParams.name;
    
    if (previewParams.backgroundImageUrl?.trim() && 
        !['/bg-image/', '/bg-image'].includes(previewParams.backgroundImageUrl)) {
      dataObj.bg = previewParams.backgroundImageUrl;
      if (previewParams.backgroundOpacity !== undefined && previewParams.backgroundOpacity !== 0.5) {
        dataObj.opacity = previewParams.backgroundOpacity.toString();
      }
    }

    if (previewParams.fontFamily?.trim()) {
      dataObj.fontFamily = previewParams.fontFamily;
    }

    // JSON 객체를 Safe string으로 인코딩 후 Base64 변환 (Base64URL 스펙)
    let encodedData = window.btoa(encodeURIComponent(JSON.stringify(dataObj)));
    encodedData = encodedData.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    return `${baseUrl}/api/card?data=${encodedData}`;
  };

  const handleCopyMarkdown = () => {
    const url = generateUrl();
    if (!url) return;
    
    const markdownCode = `<img src="${url}" width="500" alt="${previewParams?.name || previewParams?.username}'s GitHub Profile">`;
    
    navigator.clipboard.writeText(markdownCode)
      .then(() => showToast('마크다운 코드가 복사되었습니다!', 'success'))
      .catch(() => showToast('코드 복사에 실패했습니다.', 'error'));
  };

  const handleCopyHtml = () => {
    const url = generateUrl();
    if (!url) return;
    
    const htmlCode = `<img src="${url}" width="500" loading="eager" fetchpriority="high" alt="${previewParams?.name || previewParams?.username}'s GitHub Profile">`;
    
    navigator.clipboard.writeText(htmlCode)
      .then(() => showToast('HTML 코드가 복사되었습니다!', 'success'))
      .catch(() => showToast('코드 복사에 실패했습니다.', 'error'));
  };

  const subtlePatternStyle = {
    backgroundColor: '#ffffff',
    backgroundImage: `
      linear-gradient(to right, rgba(242, 218, 172, 0.2) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(242, 218, 172, 0.2) 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px'
  };

  return (
    <div className="min-h-screen" style={subtlePatternStyle}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-6 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-primary mb-2 font-ridi tracking-tight">
            Please Readme
          </h1>
          <p className="text-sm font-medium text-brand-orange max-w-xl mx-auto sparkle">
            GitHub 사용자명과 간단한 정보를 입력하면 <span className="font-bold text-primary">멋진 GitHub 프로필 이미지</span>를 생성합니다.
          </p>
        </header>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden mb-10 border border-brand-light">
          <div className="bg-brand-light/40 px-6 py-4 border-b border-brand-light">
            <h2 className="text-lg font-bold text-primary flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-brand-orange" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              사용 방법
            </h2>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: 1, title: '정보 입력', desc: 'GitHub 사용자명(필수)과 표시 이름, 자기소개, 기술 스택 등을 왼쪽 폼에 입력합니다.' },
                { step: 2, title: '카드 생성', desc: '폼 하단의 \'카드 생성 / 업데이트\' 버튼을 클릭하면 GitHub 통계를 가져와 미리보기 이미지를 생성합니다.' },
                { step: 3, title: 'GitHub에 적용', desc: '미리보기 상단의 \'코드 복사\' 버튼으로 HTML 코드를 복사하여 README.md에 붙여넣습니다.' }
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-xl p-6 flex flex-col items-center text-center border border-brand-light/30 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mb-4 shadow-md ring-4 ring-brand-light/50">
                    <span className="text-xl font-bold">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProfileForm
            profile={profile}
            setProfile={updateProfile}
            disabled={loading}
            onGeneratePreview={handleGeneratePreview}
          />
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

        <footer className='flex flex-row justify-between mt-12 border-t border-brand-light pt-6'>
          <p className='text-brand-orange text-xs sm:text-sm font-medium'>© 2025 Hobby2025. All rights reserved.</p>
          <a href="https://github.com/Hobby2025/please_readme" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:text-primary transition-all hover:scale-110">
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
        </footer>
      </div>
    </div>
  );
}
