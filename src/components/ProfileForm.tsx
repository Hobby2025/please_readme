'use client';

import { useState, useEffect } from 'react';
import TechBadge from './TechBadge';

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

interface ProfileFormProps {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
  disabled?: boolean;
}

export default function ProfileForm({ profile, setProfile, disabled = false }: ProfileFormProps) {
  const [newSkill, setNewSkill] = useState<string>('');
  const [draggedSkill, setDraggedSkill] = useState<string | null>(null);
  const [showSkillOptions, setShowSkillOptions] = useState<boolean>(false);
  
  // 인기 있는 기술 스택 목록
  const popularSkills = [
    // 프론트엔드
    'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 
    'HTML', 'CSS', 'Sass/SCSS', 'TailwindCSS', 'Bootstrap', 'jQuery',
    // 백엔드
    'Node.js', 'Express', 'NestJS', 'Django', 'Flask', 'Ruby on Rails', 'Spring Boot',
    'PHP', 'Laravel', 'ASP.NET', 
    // 프로그래밍 언어
    'Python', 'Java', 'C#', 'C++', 'C', 'Go', 'Rust', 'Ruby', 'Kotlin', 'Swift',
    // 데이터베이스
    'MongoDB', 'MySQL', 'PostgreSQL', 'SQLite', 'Redis', 'Firebase', 'Oracle', 'MS SQL',
    // 모바일
    'React Native', 'Flutter', 'iOS', 'Android', 'Xamarin',
    // 기타
    'GraphQL', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git'
  ];
  
  // username이 변경될 때 표시 이름의 기본값 설정
  useEffect(() => {
    if (profile.username && !profile.name) {
      // 앞뒤 공백 제거하고 기본값 설정
      const trimmedUsername = profile.username.trim();
      if (trimmedUsername) {
        setProfile(prev => ({
          ...prev,
          name: `${trimmedUsername}'s GitHub Status`
        }));
      }
    }
  }, [profile.username, profile.name, setProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // username 필드의 경우 앞뒤 공백 제거하고 업데이트
    if (name === 'username') {
      const trimmedValue = value.trim();
      
      // username이 비어있으면 name도 비우기
      if (!trimmedValue) {
        setProfile({
          ...profile,
          username: '',
          name: ''
        });
      } else {
        setProfile({ ...profile, username: trimmedValue });
        
        // username이 변경되고 name이 비어있거나 이전 자동 생성된 name이면 자동 업데이트
        if (!profile.name || profile.name === `${profile.username}'s GitHub Status`) {
          setProfile(prev => ({
            ...prev,
            username: trimmedValue,
            name: `${trimmedValue}'s GitHub Status`
          }));
        }
      }
    } else if (name === 'name') {
      // 이름 입력 처리 - 값이 없으면 빈 문자열로 명시적 설정
      if (!value.trim()) {
        // 값을 완전히 지웠을 때 빈 문자열로 설정
        setProfile({ ...profile, name: '' });
      } else {
        // 일반적인 이름 변경
        setProfile({ ...profile, name: value });
      }
    } else {
      // 다른 필드 처리
      setProfile({ ...profile, [name]: value });
    }
  };

  // username input의 blur 이벤트 처리
  const handleUsernameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // 입력값의 앞뒤 공백 제거
    const trimmedValue = e.target.value.trim();
    
    // 값이 비어있으면 username과 name 모두 비우기
    if (!trimmedValue) {
      setProfile(prev => ({
        ...prev,
        username: '',
        name: ''
      }));
      return;
    }
    
    // 값이 변경됐을 때만 업데이트
    if (trimmedValue !== profile.username) {
      setProfile(prev => ({
        ...prev,
        username: trimmedValue
      }));
      
      // username이 있고 name이 비어있거나 이전 자동 생성된 name이면 자동 업데이트
      if (!profile.name || profile.name === `${profile.username}'s GitHub Status`) {
        setProfile(prev => ({
          ...prev,
          username: trimmedValue,
          name: `${trimmedValue}'s GitHub Status`
        }));
      }
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
  
  // 기존 위/아래 이동 핸들러 대신 드래그 앤 드롭 핸들러 구현
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, skill: string) => {
    setDraggedSkill(skill);
    e.currentTarget.classList.add('opacity-50');
    // 드래그 이미지 설정
    if (e.dataTransfer.setDragImage) {
      e.dataTransfer.setDragImage(e.currentTarget, 20, 20);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-purple-100', 'dark:bg-purple-900/30');
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-purple-100', 'dark:bg-purple-900/30');
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetSkill: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-purple-100', 'dark:bg-purple-900/30');
    
    if (!draggedSkill || draggedSkill === targetSkill) return;
    
    const dragIndex = profile.skills.indexOf(draggedSkill);
    const dropIndex = profile.skills.indexOf(targetSkill);
    
    const newSkills = [...profile.skills];
    newSkills.splice(dragIndex, 1); // 드래그된 항목 제거
    newSkills.splice(dropIndex, 0, draggedSkill); // 새 위치에 삽입
    
    setProfile({
      ...profile,
      skills: newSkills
    });
  };
  
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedSkill(null);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      theme: e.target.value as 'light' | 'dark'
    });
  };

  const handleAddSkillFromOptions = (skill: string) => {
    // 중복 체크
    if (profile.skills.includes(skill)) {
      alert('이미 추가된 기술입니다.');
      return;
    }
    
    setProfile({
      ...profile,
      skills: [...profile.skills, skill]
    });
    
    setShowSkillOptions(false); // 기술 추가 후 옵션 창 닫기
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <div className="border-b border-purple-200 dark:border-purple-800 bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 px-6 py-4 rounded-t-xl">
        <h2 className="text-xl font-medium text-[#8B5CF6] dark:text-[#A78BFA] flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          프로필 정보 입력
        </h2>
      </div>
      
      <div className={`p-6 space-y-6 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* 기본 정보 섹션 */}
        <div className="pb-4 mb-2 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#8B5CF6]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            기본 정보
          </h3>
          
          {/* GitHub 사용자명 */}
          <div className="space-y-1 mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              GitHub 사용자명 
              <span className="ml-1 text-red-500 text-xs font-bold bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded-full">필수</span>
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
                className="shadow-sm focus:ring-[#8B5CF6] focus:border-[#8B5CF6] block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#8B5CF6] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>
                유효한 GitHub 사용자명을 입력하세요. (예: sexy_developer)
              </span>
            </p>
          </div>
          
          {/* 이름 */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              카드 표시 이름
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
                className="shadow-sm focus:ring-[#8B5CF6] focus:border-[#8B5CF6] block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg"
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
                className="shadow-sm focus:ring-[#8B5CF6] focus:border-[#8B5CF6] block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg"
              />
            </div>
          </div>
        </div>
        
        {/* 시각적 설정 섹션 */}
        <div className="pb-4 mb-2 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#8B5CF6]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
            </svg>
            디자인 설정
          </h3>
        
          {/* 배경 이미지 URL */}
          <div className="mb-4">
            <label htmlFor="backgroundImageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              배경 이미지 URL
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="backgroundImageUrl"
                name="backgroundImageUrl"
                value={profile.backgroundImageUrl || ''}
                onChange={handleInputChange}
                placeholder="카드 배경에 사용할 이미지 URL을 입력하세요."
                className="shadow-sm focus:ring-[#8B5CF6] focus:border-[#8B5CF6] block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg"
              />
            </div>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#8B5CF6] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>
                선택 사항: 카드 배경으로 사용할 이미지의 URL을 입력하세요.
              </span>
            </p>
            <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>
                주의: 저작권에 문제가 없는 이미지를 사용해주세요. 무료 이미지 사이트(Unsplash, Pexels 등)나 직접 촬영한 이미지를 권장합니다.
              </span>
            </p>
          </div>
          
          {/* 테마 선택 */}
          <div className="pt-2">
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">테마</span>
            
            <div className="grid grid-cols-2 gap-4 mt-1">
              <label className={`relative flex p-3 bg-white dark:bg-gray-900 border rounded-lg cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-800 ${profile.theme === 'light' ? 'border-[#8B5CF6] ring-2 ring-[#8B5CF6]/20 dark:ring-[#8B5CF6]/30' : 'border-gray-300 dark:border-gray-700'}`}>
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={profile.theme === 'light'}
                  onChange={handleThemeChange}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className="flex items-center justify-center bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 rounded-md p-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8B5CF6]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">라이트 모드</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">밝은 배경</p>
                  </div>
                </div>
              </label>
              <label className={`relative flex p-3 bg-white dark:bg-gray-900 border rounded-lg cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-800 ${profile.theme === 'dark' ? 'border-[#8B5CF6] ring-2 ring-[#8B5CF6]/20 dark:ring-[#8B5CF6]/30' : 'border-gray-300 dark:border-gray-700'}`}>
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={profile.theme === 'dark'}
                  onChange={handleThemeChange}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className="flex items-center justify-center bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 rounded-md p-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8B5CF6]" viewBox="0 0 20 20" fill="currentColor">
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
        
        {/* 기술 스택 섹션 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#8B5CF6]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            기술 스택
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
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
                  className="shadow-sm focus:ring-[#8B5CF6] focus:border-[#8B5CF6] block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(e);
                    }
                  }}
                />
              </div>
              <button
                onClick={handleAddSkill}
                className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[#8B5CF6] hover:bg-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5CF6] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                추가
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSkillOptions(!showSkillOptions)}
                  className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5CF6] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  인기 스택
                </button>
                
                {showSkillOptions && (
                  <div className="absolute right-0 bottom-full mb-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                    <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400">인기 기술 스택</h4>
                    </div>
                    <ul className="py-1 max-h-60 overflow-y-auto">
                      {popularSkills.map(skill => (
                        <li key={skill}>
                          <button
                            onClick={() => handleAddSkillFromOptions(skill)}
                            className={`w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 ${
                              profile.skills.includes(skill) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={profile.skills.includes(skill)}
                          >
                            {skill}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* 스킬 태그 표시 */}
            <div className="mt-3 flex flex-wrap gap-4 bg-gray-50 dark:bg-gray-800/40 border border-purple-200 dark:border-purple-900 rounded-lg p-3 min-h-[80px]">
              {profile.skills.length > 0 ? (
                profile.skills.map((skill) => (
                  <div 
                    key={skill} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, skill)}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, skill)}
                    onDragEnd={handleDragEnd}
                    className="flex items-center cursor-move transition-all duration-200 ease-in-out origin-left -m-1"
                  >
                    <div className="flex items-center bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <div className="px-1 py-0.5 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </div>
                      <TechBadge 
                        tech={skill} 
                        onRemove={handleRemoveSkill} 
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic w-full text-center py-4">
                  기술 스택을 추가하면 여기에 표시됩니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {disabled && (
        <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-center text-sm font-medium text-purple-800 dark:text-purple-300">
          미리보기가 생성되었습니다. 수정하려면 '새 이미지 생성' 버튼을 클릭하세요.
        </div>
      )}
    </div>
  );
} 