'use client';

import { useState, useEffect } from 'react';
import { ProfileFormProps } from '../types';

export default function ProfileForm({ profile, setProfile }: ProfileFormProps) {
  const [newSkill, setNewSkill] = useState<string>('');
  
  // username이 변경될 때 표시 이름의 기본값 설정
  useEffect(() => {
    if (profile.username && !profile.name) {
      setProfile(prev => ({
        ...prev,
        name: `${profile.username}'s GitHub Status`
      }));
    }
  }, [profile.username, profile.name, setProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // username 필드의 경우 앞뒤 공백 제거
    if (name === 'username') {
      setProfile({ ...profile, [name]: value.trim() });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  // username input의 blur 이벤트 처리
  const handleUsernameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // 입력값의 앞뒤 공백 제거
    const trimmedValue = e.target.value.trim();
    setProfile({ ...profile, username: trimmedValue });
    
    // username이 있고 name이 비어있는 경우 기본값 설정
    if (trimmedValue && !profile.name) {
      setProfile(prev => ({
        ...prev,
        username: trimmedValue,
        name: `${trimmedValue}'s GitHub Status`
      }));
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    
    // 중복 스킬 체크
    if (profile.skills.includes(newSkill.trim())) {
      alert('이미 추가된 기술입니다.');
      return;
    }
    
    setProfile({
      ...profile,
      skills: [...profile.skills, newSkill.trim()]
    });
    setNewSkill('');
  };
  
  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };
  
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      theme: e.target.value as 'light' | 'dark'
    });
  };
  
  // 사용자명 유효성 확인
  const validateUsername = () => {
    return profile.username.trim().length > 0;
  };
  
  return (
    <div className="h-full">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-6 py-4">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          프로필 정보 입력
        </h2>
      </div>
      
      <div className="p-6 space-y-5">
        {/* GitHub 사용자명 */}
        <div className="space-y-1">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            GitHub 사용자명 <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.489.5.092.682-.217.682-.481 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.917.678 1.852 0 1.335-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.16 22 16.416 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              id="username"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
              onBlur={handleUsernameBlur}
              placeholder="GitHub 사용자명 (필수)"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg"
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>
              유효한 GitHub 사용자명을 입력하세요. (예: sexy_developer)<br />
              GitHub API는 요청 제한이 있어 짧은 시간 내에 여러 사용자를 검색하면 오류가 발생할 수 있습니다.
            </span>
          </p>
        </div>
        
        {/* 이름 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            표시 이름
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              placeholder="표시될 이름 (기본값: username's GitHub Status)"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg"
            />
          </div>
        </div>
        
        {/* 소개 */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            자기소개
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleInputChange}
              placeholder="당신을 소개하는 몇 마디를 입력하세요."
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg"
            />
          </div>
        </div>
        
        {/* 기술 스택 */}
        <div className="space-y-2">
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            기술 스택
          </label>
          <div className="relative flex mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              id="newSkill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="예: JavaScript, React, Python"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-l-lg"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(e);
                }
              }}
            />
            <button
              onClick={handleAddSkill}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              추가
            </button>
          </div>
          
          {/* 스킬 태그 표시 */}
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.skills.length > 0 ? (
              profile.skills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex rounded-full items-center py-1 pl-3 pr-1 text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 transition-all"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="flex-shrink-0 ml-1 h-5 w-5 rounded-full inline-flex items-center justify-center text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none transition-colors"
                  >
                    <span className="sr-only">제거</span>
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </span>
              ))
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                기술 스택을 추가하면 여기에 표시됩니다.
              </p>
            )}
          </div>
        </div>
        
        {/* 테마 선택 */}
        <div className="pt-2">
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">테마</span>
          
          <div className="grid grid-cols-2 gap-4 mt-1">
            <label className={`relative flex p-3 bg-white dark:bg-gray-900 border rounded-lg cursor-pointer transition ${profile.theme === 'light' ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' : 'border-gray-300 dark:border-gray-700'}`}>
              <input
                type="radio"
                name="theme"
                value="light"
                checked={profile.theme === 'light'}
                onChange={handleThemeChange}
                className="sr-only"
              />
              <div className="flex items-center">
                <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-md p-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">라이트 모드</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">밝은 배경</p>
                </div>
              </div>
            </label>
            <label className={`relative flex p-3 bg-white dark:bg-gray-900 border rounded-lg cursor-pointer transition ${profile.theme === 'dark' ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' : 'border-gray-300 dark:border-gray-700'}`}>
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={profile.theme === 'dark'}
                onChange={handleThemeChange}
                className="sr-only"
              />
              <div className="flex items-center">
                <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-md p-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">다크 모드</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">어두운 배경</p>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 