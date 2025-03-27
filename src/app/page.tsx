'use client';

import { useState } from 'react';
import ProfileForm from '../components/ProfileForm';
import ProfilePreview from '../components/ProfilePreview';
import { ProfileData } from '../types';

export default function Home() {
  const [profile, setProfile] = useState<ProfileData>({
    username: '',
    name: '',
    bio: '',
    skills: [],
    theme: 'light',
  });

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-6xl">
        {/* 헤더 */}
        <header className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            GitHub 프로필 이미지 생성기
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            GitHub 사용자명과 간단한 정보를 입력하면 멋진 GitHub 프로필 이미지를 생성합니다.
          </p>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* 왼쪽 컬럼 - 폼 */}
          <div className="w-full lg:w-5/12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <ProfileForm profile={profile} setProfile={setProfile} />
          </div>
          
          {/* 오른쪽 컬럼 - 미리보기 */}
          <div className="w-full lg:w-7/12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <ProfilePreview profile={profile} />
          </div>
        </div>

        {/* 사용 방법 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              사용 방법
            </h2>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mb-3">
                  <span className="text-sm font-medium">1</span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">정보 입력</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  GitHub 사용자명(필수)과 표시 이름, 자기소개, 기술 스택 등을 입력합니다.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mb-3">
                  <span className="text-sm font-medium">2</span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">이미지 생성</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  '이미지 생성하기' 버튼을 클릭하여 프로필 이미지를 생성합니다.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mb-3">
                  <span className="text-sm font-medium">3</span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">GitHub에 적용</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  생성된 이미지 URL, 마크다운 또는 HTML 코드를 복사하여 GitHub 프로필 README.md 파일에 붙여넣습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 푸터 */}
        <footer className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400">
          <div className="flex justify-center space-x-4 mb-2">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <span className="sr-only">GitHub</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} GitHub 프로필 이미지 생성기</p>
        </footer>
      </div>
    </main>
  );
}
