'use client';

import { useState } from 'react';
import Image from 'next/image';
import TechBadge from './TechBadge';
import GithubCard from './GithubCard';
import { toast } from 'react-hot-toast';
import copy from 'copy-to-clipboard';
import { fetchGitHubStatsClient } from '@/utils/github-client';
import { GitHubStats } from '@/utils/github-stats';

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
    currentYearCommits: number;
    languages: { [key: string]: number };
  };
  backgroundImageUrl?: string;
}

interface ProfilePreviewProps {
  profile: ProfileData;
  setProfile?: React.Dispatch<React.SetStateAction<ProfileData>>;
  onPreviewGenerated?: (generated: boolean) => void;
  onResetPreview?: () => void;
}

export default function ProfilePreview({ profile, setProfile, onPreviewGenerated, onResetPreview }: ProfilePreviewProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<{type: string, success: boolean} | null>(null);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  
  // 이미지 생성 함수
  const generateImage = () => {
    // 입력된 사용자명이 없거나 공백만 있는 경우 처리
    const trimmedUsername = profile.username.trim();
    if (!trimmedUsername) {
      setError('GitHub 사용자명을 입력해주세요.');
      setDataLoaded(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // github-client의 클라이언트 함수를 사용하여 GitHub 통계 가져오기 
    fetchGitHubStatsClient(trimmedUsername)
      .then((data: GitHubStats) => {
        // GitHub 통계 데이터를 profile에 적용
        if (setProfile) {
          setProfile(prevProfile => ({
            ...prevProfile,
            githubStats: data
          }));
        } else {
          console.warn('setProfile 함수가 제공되지 않아 GitHub 통계를 업데이트할 수 없습니다.');
        }
        
        // 이미지 URL 생성
        const skills = profile.skills.join(',');
        
        // 실제 이미지 경로 대신 GitHub 통계 정보를 사용하여 가상 URL 생성
        const imageUrl = `/profile/${encodeURIComponent(trimmedUsername)}`;
        setImageUrl(imageUrl);
        setLoading(false);
        
        // 데이터 로드 완료 표시
        setDataLoaded(true);
        
        // 부모 컴포넌트에 미리보기 생성 상태 전달
        if (onPreviewGenerated) {
          onPreviewGenerated(true);
        }

        // API 엔드포인트 확인 - 실제 이미지 API가 없어 성공적으로 이미지를 로드하지 못함
        // 따라서 GitHub 프로필 이미지를 직접 표시
        const githubProfileUrl = data.avatar_url || `https://github.com/${trimmedUsername}.png`;
        const img = new window.Image();
        img.onload = () => {
          // GitHub 프로필 이미지가 로드되면 성공 처리
          setLoading(false);
        };
        img.onerror = () => {
          // 기본 이미지 URL 설정
          console.warn('GitHub 프로필 이미지 로드 실패, 기본 이미지 사용');
          setLoading(false);
        };
        img.src = githubProfileUrl;
      })
      .catch(err => {
        console.error('GitHub 통계 가져오기 실패:', err);
        setError(err.message || 'GitHub 사용자를 찾을 수 없거나 API 요청 제한에 도달했습니다. 사용자명이 정확한지 확인하거나 잠시 후 다시 시도해보세요.');
        setLoading(false);
        // 데이터 로드 실패
        setDataLoaded(false);
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
  
  const copyProfileCode = () => {
    if (!profile.username) {
      toast.error('사용자명을 입력해주세요.');
      return;
    }
    
    // API URL 생성
    const params = new URLSearchParams();
    params.append('username', profile.username);
    if (profile.name) params.append('name', profile.name);
    if (profile.bio) params.append('bio', profile.bio);
    params.append('theme', profile.theme);
    if (profile.skills.length > 0) params.append('skills', profile.skills.join(','));
    if (profile.backgroundImageUrl) params.append('background_image_url', profile.backgroundImageUrl);
    
    const apiUrl = `/api/profile-og?${params.toString()}`;
    
    // 마크다운 코드 생성
    const markdownCode = `![${profile.name || profile.username}'s GitHub Profile](${window.location.origin}${apiUrl})`;
    
    // 클립보드에 복사
    copy(markdownCode);
    setImageUrl(`${window.location.origin}${apiUrl}`);
    toast.success('마크다운 코드가 클립보드에 복사되었습니다!');
  };
  
  // 새 이미지 생성 버튼 클릭 시 호출
  const handleResetPreview = () => {
    setImageUrl('');
    setError(null);
    setDataLoaded(false);
    
    // 부모 컴포넌트에 미리보기 초기화 상태 전달
    if (onResetPreview) {
      onResetPreview();
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
      </div>
      
      <div className="flex-1 p-6 flex flex-col">
        {!dataLoaded ? (
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
                {profile.skills.length > 0 && (
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
                  className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#8B5CF6] hover:bg-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5CF6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {loading ? '생성 중...' : '이미지 생성하기'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-hidden p-4">
            <div className="flex flex-col items-center justify-center rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 p-6">
              <div className="flex justify-center mb-6">
                <h3 className="text-lg font-medium text-[#8B5CF6] dark:text-[#A78BFA]">
                  생성된 프로필 이미지
                </h3>
              </div>
              
              {/* GithubCard 컴포넌트 사용 */}
              <div className="w-full max-w-3xl mb-6 overflow-hidden">
                <GithubCard profile={profile} />
              </div>
              
              {/* 복사 버튼 */}
              <div className="flex justify-center mb-8">
                <button
                  onClick={copyProfileCode}
                  className="inline-flex items-center px-5 py-3 text-base font-medium rounded-md shadow-sm text-white bg-[#8B5CF6] hover:bg-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5CF6] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  GitHub 프로필 코드 복사
                </button>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={handleResetPreview}
                  className="inline-flex items-center px-3 py-1.5 border border-[#8B5CF6]/20 dark:border-[#8B5CF6]/30 text-xs font-medium rounded shadow-sm text-[#8B5CF6] dark:text-[#A78BFA] bg-white dark:bg-gray-800 hover:bg-[#8B5CF6]/5 dark:hover:bg-[#8B5CF6]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5CF6]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  새 이미지 생성
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}