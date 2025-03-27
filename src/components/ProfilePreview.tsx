'use client';

import { useState } from 'react';
import Image from 'next/image';
import TechBadge from './TechBadge';

interface ProfileData {
  username: string;
  name: string;
  bio: string;
  skills: string[];
  theme: 'light' | 'dark';
  githubStats: {
    stars: number;
    commits: number;
    prs: number;
    issues: number;
    contributions: number;
    languages: { [key: string]: number };
  };
}

interface ProfilePreviewProps {
  profile: ProfileData;
}

export default function ProfilePreview({ profile }: ProfilePreviewProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<{type: string, success: boolean} | null>(null);
  
  // 이미지 생성 함수
  const generateImage = () => {
    // 입력된 사용자명이 없거나 공백만 있는 경우 처리
    const trimmedUsername = profile.username.trim();
    if (!trimmedUsername) {
      setError('GitHub 사용자명을 입력해주세요.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // GitHub API 호출
    fetch(`/api/github/username?username=${encodeURIComponent(trimmedUsername)}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('GitHub API 요청 실패');
        }
        return res.json();
      })
      .then(() => {
        // data 변수가 사용되지 않으므로 매개변수에서 제거
        // 이미지 URL 생성
        const skills = profile.skills.join(',');
        const url = `/api/image?username=${encodeURIComponent(trimmedUsername)}&name=${encodeURIComponent(profile.name)}&bio=${encodeURIComponent(profile.bio)}&skills=${encodeURIComponent(skills)}&theme=${profile.theme}`;
        
        // 이미지 로드 테스트
        const img = new window.Image();
        img.onload = () => {
          setImageUrl(url);
          setLoading(false);
        };
        img.onerror = () => {
          setImageUrl(url);
          setError('이미지 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          setLoading(false);
        };
        img.src = url;
      })
      .catch(err => {
        console.error('GitHub 통계 가져오기 실패:', err);
        setError('GitHub 사용자를 찾을 수 없거나 API 요청 제한에 도달했습니다. 사용자명이 정확한지 확인하거나 잠시 후 다시 시도해보세요.');
        setLoading(false);
      });
  };
  
  const handleCopy = (type: string, content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setCopySuccess({ type, success: true });
        setTimeout(() => setCopySuccess(null), 2000);
      })
      .catch(err => {
        console.error(`${type} 복사 실패:`, err);
        setCopySuccess({ type, success: false });
        setTimeout(() => setCopySuccess(null), 2000);
      });
  };
  
  const copyImageUrl = () => {
    if (imageUrl) {
      // 이미지의 절대 URL 생성
      const absoluteUrl = `${window.location.origin}${imageUrl}`;
      handleCopy('URL', absoluteUrl);
    }
  };
  
  const copyMarkdown = () => {
    if (imageUrl) {
      // 이미지의 절대 URL 생성
      const absoluteUrl = `${window.location.origin}${imageUrl}`;
      
      // 마크다운 형식으로 이미지 태그 생성
      const markdown = `![${profile.name || profile.username}의 GitHub 프로필](${absoluteUrl})`;
      handleCopy('마크다운', markdown);
    }
  };

  const copyHtml = () => {
    if (imageUrl) {
      // 이미지의 절대 URL 생성
      const absoluteUrl = `${window.location.origin}${imageUrl}`;
      
      // HTML 이미지 태그 생성
      const html = `<img src="${absoluteUrl}" alt="${profile.name || profile.username}의 GitHub 프로필" width="1000" height="500" />`;
      handleCopy('HTML', html);
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 px-6 py-4 flex items-center justify-between rounded-t-xl">
        <h2 className="text-xl font-medium text-[#8B5CF6] dark:text-[#A78BFA] flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          프로필 이미지 미리보기
        </h2>
        
        {copySuccess && (
          <div className={`ml-auto mr-2 py-1 px-3 text-xs font-medium rounded-full transition-all ${copySuccess.success ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
            {copySuccess.success 
              ? `${copySuccess.type} 복사됨!` 
              : `${copySuccess.type} 복사 실패`
            }
          </div>
        )}

        {imageUrl && (
          <div className="flex gap-2">
            <button
              onClick={copyImageUrl}
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-[#8B5CF6] bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 dark:bg-[#8B5CF6]/20 dark:text-[#A78BFA] dark:hover:bg-[#8B5CF6]/30 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5CF6]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              URL
            </button>
            <button
              onClick={copyMarkdown}
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-[#8B5CF6] bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 dark:bg-[#8B5CF6]/20 dark:text-[#A78BFA] dark:hover:bg-[#8B5CF6]/30 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5CF6]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              마크다운
            </button>
            <button
              onClick={copyHtml}
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-[#8B5CF6] bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 dark:bg-[#8B5CF6]/20 dark:text-[#A78BFA] dark:hover:bg-[#8B5CF6]/30 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5CF6]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              HTML
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[#8B5CF6]/10 dark:border-[#8B5CF6]/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-[#8B5CF6] dark:border-t-[#A78BFA] rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">이미지를 생성하는 중...</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">잠시만 기다려주세요</p>
            </div>
          ) : error ? (
            <div className="w-full max-w-md py-8 px-4">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">오류가 발생했습니다</h3>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                {imageUrl && (
                  <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 overflow-hidden">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">기본 이미지를 사용하여 계속 진행합니다:</p>
                    <Image 
                      src={imageUrl} 
                      alt="기본 GitHub 프로필" 
                      className="max-w-full h-auto rounded"
                      width={1000}
                      height={500}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : imageUrl ? (
            <div className="w-full h-full relative flex items-center justify-center">
              <Image 
                src={imageUrl} 
                alt={`${profile.name || profile.username}의 GitHub 프로필`} 
                className="max-w-full max-h-[400px] h-auto rounded-lg shadow-md"
                width={1000}
                height={500}
              />
              <div className="absolute bottom-2 right-2 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded text-xs text-gray-500 dark:text-gray-400 backdrop-blur-sm">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 max-w-md">
              <div className="w-20 h-20 bg-[#8B5CF6]/20 dark:bg-[#8B5CF6]/30 rounded-full flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#8B5CF6] dark:text-[#A78BFA]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#8B5CF6] dark:text-[#A78BFA] mb-2">이미지 미리보기</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                정보를 입력하고 아래 버튼을 클릭하여 GitHub 프로필 이미지를 생성하세요
              </p>
              {/* 스킬 미리보기 */}
              {!imageUrl && profile.skills.length > 0 && (
                <div className="mt-4 w-full max-w-md">
                  <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">기술 스택 미리보기:</h4>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {profile.skills.map(skill => (
                      <TechBadge 
                        key={skill} 
                        tech={skill} 
                      />
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={generateImage}
                disabled={loading || !profile.username.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#8B5CF6] hover:bg-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5CF6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                이미지 생성하기
              </button>
            </div>
          )}
        </div>

        {imageUrl && (
          <div className="mt-5 p-4 bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="flex items-center text-sm font-medium text-[#8B5CF6] dark:text-[#A78BFA] mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#8B5CF6]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  GitHub 프로필에 적용하는 방법
                </h3>
                <ol className="ml-6 mt-1 text-xs text-gray-600 dark:text-gray-400 list-decimal space-y-1">
                  <li>위 버튼을 클릭하여 원하는 형식의 코드를 복사하세요</li>
                  <li>복사한 코드를 GitHub 프로필 README.md 파일에 붙여넣으세요</li>
                </ol>
              </div>
              <button
                onClick={() => {
                  setImageUrl('');
                  setError(null);
                }}
                className="inline-flex items-center px-3 py-1.5 border border-[#8B5CF6]/20 dark:border-[#8B5CF6]/30 text-xs font-medium rounded shadow-sm text-[#8B5CF6] dark:text-[#A78BFA] bg-white dark:bg-gray-800 hover:bg-[#8B5CF6]/5 dark:hover:bg-[#8B5CF6]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5CF6]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                새 이미지 생성
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 