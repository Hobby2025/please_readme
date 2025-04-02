import React from 'react';
import { Input } from '../ui/Input';
import { TechBadge } from '../ui/TechBadge';
import { Profile } from '../../types/profile';
import { availableTechStacks } from '../../constants/techStacks';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { FaSun, FaMoon, FaPencilAlt } from 'react-icons/fa';

interface ProfileFormProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  disabled?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  setProfile,
  disabled = false,
}) => {
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

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-[#8B5CF6] dark:text-[#A78BFA] flex items-center">
          <FaPencilAlt className="h-5 w-5 mr-2" />
          프로필 정보 입력
        </h2>
      </div>

      <div className="p-6">
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
              <label htmlFor="backgroundImageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                배경 이미지 URL (선택)
              </label>
              <Input
                id="backgroundImageUrl"
                name="backgroundImageUrl"
                value={profile.backgroundImageUrl || ''}
                onChange={handleInputChange}
                disabled={disabled}
                placeholder="https://..."
              />
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
        </form>
      </div>
    </div>
  );
}; 