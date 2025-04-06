import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { TechBadge } from '../ui/TechBadge';
import { Profile, ProfileFormProps } from '../../types/profile';
import { availableTechStacks } from '../../constants/techStacks';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { FaSun, FaMoon, FaPencilAlt, FaImage } from 'react-icons/fa';
import { useRouter } from 'next/router';

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  setProfile,
  disabled = false,
  onGeneratePreview,
}) => {
  const router = useRouter();
  const [selectedImageName, setSelectedImageName] = useState<string>(() => {
    if (profile.backgroundImageUrl && profile.backgroundImageUrl.startsWith('/bg-image/')) {
      return profile.backgroundImageUrl.split('/').pop() || '';
    }
    return '';
  });
  
  const [opacity, setOpacity] = useState<number>(profile.backgroundOpacity || 0.5);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleThemeSelect = (theme: 'light' | 'dark') => {
    setProfile({ ...profile, theme: theme });
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setProfile({
      ...profile,
      skills:
        checked
          ? [...profile.skills, value]
          : profile.skills.filter((skill) => skill !== value),
    });
  };

  const handleClearSkills = () => {
    setProfile({ ...profile, skills: [] });
  };

  const handleBackgroundImageSelect = (imageName: string) => {
    if (!imageName) {
      // 이미지 선택 해제
      setProfile({ ...profile, backgroundImageUrl: '' });
      setSelectedImageName('');
    } else {
      // 이미지 선택
      const imageUrl = `/bg-image/${imageName}`;
      setProfile({ ...profile, backgroundImageUrl: imageUrl });
      setSelectedImageName(imageName);
    }
  };
  
  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = parseFloat(e.target.value);
    setOpacity(newOpacity);
    setProfile({ ...profile, backgroundOpacity: newOpacity });
  };

  return (
    <div className="h-full bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden flex flex-col">
      <div className="bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-[#8B5CF6] dark:text-[#A78BFA] flex items-center">
          <FaPencilAlt className="h-5 w-5 mr-2" />
          프로필 정보 입력
        </h2>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className='mb-4'>
            <div className="inline-flex rounded-md gap-3" role="group">
              <Button
                type="button"
                onClick={() => handleThemeSelect('light')}
                disabled={disabled}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-l-lg border border-gray-200 dark:border-gray-600 shadow-sm",
                  profile.theme === 'light'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500 z-10'
                    : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
                  disabled ? "opacity-50" : ""
                )}
              >
                <FaSun className="w-4 h-4 mr-2 inline-block" />
                라이트
              </Button>
              <Button
                type="button"
                onClick={() => handleThemeSelect('dark')}
                disabled={disabled}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-r-lg border border-l-0 border-gray-200 dark:border-gray-600 shadow-sm",
                  profile.theme === 'dark'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500 z-10'
                    : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
                  disabled ? "opacity-50" : ""
                )}
              >
                <FaMoon className="w-4 h-4 mr-2 inline-block" />
                다크
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold leading-6 text-gray-700 dark:text-gray-300">기본 정보</h3>
            <div>
              <label htmlFor="githubUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GitHub 사용자명
              </label>
              <Input
                id="githubUsername"
                name="githubUsername"
                value={profile.githubUsername}
                onChange={handleInputChange}
                disabled={disabled}
                placeholder="예: octocat"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                카드 제목
              </label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                disabled={disabled}
                placeholder="예: John Doe's Profile"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                소개
              </label>
              <Input
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                disabled={disabled}
                placeholder="간단한 자기소개"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                배경 이미지 선택
              </label>
              <div className="relative w-full overflow-hidden">
                <div className="flex overflow-x-auto pb-2 space-x-3" style={{ scrollbarWidth: 'thin' }}>
                  <div 
                    className={`flex-shrink-0 w-20 h-20 cursor-pointer border-2 rounded-md overflow-hidden flex items-center justify-center ${!profile.backgroundImageUrl ? 'border-[#8B5CF6] bg-gray-100 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-700'}`}
                    onClick={() => handleBackgroundImageSelect('')}
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-400">없음</span>
                  </div>
                  <div 
                    className={`flex-shrink-0 w-20 h-20 cursor-pointer border-2 rounded-md overflow-hidden ${selectedImageName === 'cat.png' ? 'border-[#8B5CF6]' : 'border-gray-200 dark:border-gray-700'}`}
                    onClick={() => handleBackgroundImageSelect('cat.png')}
                  >
                    <img src="/bg-image/cat.png" alt="Cat" className="w-full h-full object-cover" />
                  </div>
                  <div 
                    className={`flex-shrink-0 w-20 h-20 cursor-pointer border-2 rounded-md overflow-hidden ${selectedImageName === 'stars.png' ? 'border-[#8B5CF6]' : 'border-gray-200 dark:border-gray-700'}`}
                    onClick={() => handleBackgroundImageSelect('stars.png')}
                  >
                    <img src="/bg-image/stars.png" alt="Stars" className="w-full h-full object-cover" />
                  </div>
                  <div 
                    className={`flex-shrink-0 w-20 h-20 cursor-pointer border-2 rounded-md overflow-hidden ${selectedImageName === 'polygon.png' ? 'border-[#8B5CF6]' : 'border-gray-200 dark:border-gray-700'}`}
                    onClick={() => handleBackgroundImageSelect('polygon.png')}
                  >
                    <img src="/bg-image/polygon.png" alt="Polygon" className="w-full h-full object-cover" />
                  </div>
                  <div 
                    className={`flex-shrink-0 w-20 h-20 cursor-pointer border-2 rounded-md overflow-hidden ${selectedImageName === 'paw.png' ? 'border-[#8B5CF6]' : 'border-gray-200 dark:border-gray-700'}`}
                    onClick={() => handleBackgroundImageSelect('paw.png')}
                  >
                    <img src="/bg-image/paw.png" alt="Paw" className="w-full h-full object-cover" />
                  </div>
                  <div 
                    className={`flex-shrink-0 w-20 h-20 cursor-pointer border-2 rounded-md overflow-hidden ${selectedImageName === 'leaf.png' ? 'border-[#8B5CF6]' : 'border-gray-200 dark:border-gray-700'}`}
                    onClick={() => handleBackgroundImageSelect('leaf.png')}
                  >
                    <img src="/bg-image/leaf.png" alt="Leaf" className="w-full h-full object-cover" />
                  </div>
                  <div 
                    className={`flex-shrink-0 w-20 h-20 cursor-pointer border-2 rounded-md overflow-hidden ${selectedImageName === 'memphis.png' ? 'border-[#8B5CF6]' : 'border-gray-200 dark:border-gray-700'}`}
                    onClick={() => handleBackgroundImageSelect('memphis.png')}
                  >
                    <img src="/bg-image/memphis.png" alt="Memphis" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none"></div>
              </div>
              {selectedImageName ? (
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#8B5CF6] mr-1.5"></div>
                  <span>선택: {selectedImageName === '' ? '배경 없음' : selectedImageName}</span>
                </div>
              ) : (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <span>← 좌우로 스크롤하여 더 많은 배경 이미지를 확인하세요</span>
                </div>
              )}
              
              {profile.backgroundImageUrl && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="opacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      배경 투명도
                    </label>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{Math.round(opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    id="opacity"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={opacity}
                    onChange={handleOpacityChange}
                    disabled={disabled}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>투명</span>
                    <span>불투명</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold leading-6 text-gray-700 dark:text-gray-300">기술 스택</h3>
              {profile.skills.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearSkills}
                  disabled={disabled}
                  className="text-xs rounded-md"
                >
                  전체 해제
                </Button>
              )}
            </div>
            
            <div className="mb-3 flex flex-wrap gap-2 min-h-[30px]">
              {profile.skills.length > 0 ? (
                profile.skills.map((skill) => (
                  <TechBadge key={skill} tech={skill} />
                ))
              ) : (
                <p className="text-xs text-gray-500">선택된 스택이 없습니다.</p>
              )}
            </div>

            <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700/50 rounded-lg p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableTechStacks.map((tech) => (
                <label key={tech} className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors">
                  <input
                    type="checkbox"
                    value={tech}
                    checked={profile.skills.includes(tech)}
                    onChange={handleSkillChange}
                    disabled={disabled}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{tech}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              onClick={onGeneratePreview}
              disabled={!profile.githubUsername || disabled}
              className="w-full"
            >
              <FaImage className="w-4 h-4 mr-2" />
              카드 생성 / 업데이트
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 