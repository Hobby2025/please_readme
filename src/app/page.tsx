'use client';

import { useState } from 'react';
import ProfileForm from '@/components/ProfileForm';
import ProfilePreview from '@/components/ProfilePreview';
import GithubCard from '@/components/GithubCard';
import '../types';

interface ProfileData {
  username: string;
  name: string;
  bio: string;
  skills: string[];
  theme: 'light' | 'dark';
  backgroundImageUrl?: string;
  githubStats: {
    stars: number;
    commits: number;
    prs: number;
    issues: number;
    contributions: number;
    currentYearCommits: number;
    languages: { [key: string]: number };
  };
}

export default function Home() {
  const [profile, setProfile] = useState<ProfileData>({
    username: '',
    name: '',
    bio: '',
    skills: [],
    theme: 'light',
    backgroundImageUrl: '',
    githubStats: {
      stars: 0,
      commits: 0,
      prs: 0,
      issues: 0,
      contributions: 0,
      currentYearCommits: 0,
      languages: {}
    }
  });
  
  // 프로필 미리보기 상태를 추가
  const [isPreviewGenerated, setIsPreviewGenerated] = useState<boolean>(false);

  // 미리보기가 생성되었을 때 호출되는 함수
  const handlePreviewGenerated = (generated: boolean) => {
    setIsPreviewGenerated(generated);
  };
  
  // 새 이미지 생성 버튼 클릭 시 호출되는 함수
  const handleResetPreview = () => {
    setIsPreviewGenerated(false);
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-6xl">
        {/* 헤더 */}
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

        {/* 메인 콘텐츠 영역 */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* 왼쪽 컬럼 - 폼 */}
          <div className="w-full lg:w-5/12 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden">
            <ProfileForm 
              profile={profile} 
              setProfile={setProfile} 
              disabled={isPreviewGenerated}
            />
          </div>
          
          {/* 오른쪽 컬럼 - 프로필 미리보기 */}
          <div className="w-full lg:w-7/12 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden">
            <ProfilePreview 
              profile={profile} 
              setProfile={setProfile} 
              onPreviewGenerated={handlePreviewGenerated}
              onResetPreview={handleResetPreview}
            />
          </div>
        </div>
        
        {/* 푸터 */}
        <footer className="mt-8 pt-4 border-t border-[#8B5CF6]/20 dark:border-[#8B5CF6]/10 text-center text-gray-600 dark:text-gray-400">
          <div className="flex justify-center space-x-4 mb-2">
            <a href="https://github.com/Hobby2025/please_readme" target="_blank" rel="noopener noreferrer" 
              className="text-[#8B5CF6] hover:text-[#7C3AED] dark:text-[#A78BFA] dark:hover:text-[#C4B5FD]">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Please Readme by Hobby2025</p>
        </footer>
      </div>
    </main>
  );
}

