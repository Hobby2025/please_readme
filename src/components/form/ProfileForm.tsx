import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TechBadge } from '../ui/TechBadge';
import { Profile, ProfileFormProps, ThemeOption, FontOption, CardTheme } from '@/types';
import { availableTechStacks } from '../../constants/techStacks';
import { FaPencilAlt, FaImage, FaFont, FaGithubSquare, FaAcquisitionsIncorporated, FaFeatherAlt, FaTerminal, FaMoon, FaSun } from 'react-icons/fa';
import ThemeTooltip from '../ui/ThemeTooltip';
import FontPreview from '../ui/FontPreview';
import { FiMoon, FiSun, FiStar, FiFeather } from 'react-icons/fi';
import { useProfileForm } from '@/hooks/useProfileForm';

// 사용 가능한 폰트 목록 (타입 적용)
const availableFonts: FontOption[] = [
  { value: 'BookkMyungjo', label: '북크 명조' },
  { value: 'Pretendard', label: '프리텐다드' },
  { value: 'HSSanTokki2.0', label: 'HS산토끼체2.0' },
  { value: 'BMJUA_ttf', label: '배민 주아체'},
  { value: 'BMDOHYEON_ttf', label: '배민 도현체'},
];

// 테마 옵션 목록 업데이트 (CardTheme 사용)
const themeOptions: ThemeOption[] = [
  { value: 'default', label: 'Default', icon: FiMoon }, // Dark 테마
  { value: 'pastel', label: 'Pastel', icon: FiSun }, // Light 테마
  { value: 'cosmic', label: 'Cosmic', icon: FiStar }, // Cosmic 테마 (임시 아이콘)
  { value: 'mineral', label: 'Mineral', icon: FiFeather }, // Mineral 테마 (임시 아이콘)
];

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  setProfile,
  disabled = false,
  onGeneratePreview,
}) => {
  // useProfileForm 훅 사용
  const {
    handleInputChange,
    handleSkillChange,
    handleFontChange,
    handleThemeChange,
    handleClearSkills,
  } = useProfileForm({ profile, setProfile });

  return (
    <div className="h-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden flex flex-col border border-brand-light">
      <div className="bg-brand-light/40 px-6 py-4 border-b border-brand-light">
        <h2 className="text-lg font-bold text-primary flex items-center">
          <FaPencilAlt className="h-5 w-5 mr-2 text-brand-orange" />
          프로필 정보 입력
        </h2>
      </div>

      <div className="flex-1 p-6 overflow-auto bg-white/30">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <h3 className="text-base font-bold leading-6 text-primary">기본 정보</h3>
            <div>
              <label htmlFor="githubUsername" className="text-sm font-bold text-brand-orange mb-1.5 flex items-center">
                <FaGithubSquare className='h-4 w-4 mr-1.5' />
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
              <label htmlFor="name" className="text-sm font-bold text-brand-orange mb-1.5 flex items-center">
                <FaAcquisitionsIncorporated className='h-4 w-4 mr-1.5' />
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
              <label htmlFor="bio" className="text-sm font-bold text-brand-orange mb-1.5 flex items-center">
                <FaFeatherAlt className='h-4 w-4 mr-1.5' />
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
            
            {/* 폰트 선택 필드 추가 */}
            <div>
              <label className="text-sm font-bold text-brand-orange mb-1.5 flex items-center">
                <FaFont className="h-4 w-4 mr-1.5" />
                폰트 스타일
              </label>
              <select
                id="fontFamily"
                name="fontFamily"
                value={profile.fontFamily || 'BookkMyungjo'}
                onChange={handleFontChange}
                disabled={disabled}
                className="block w-full rounded-lg border border-brand-light bg-white/70 py-2.5 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
              >
                {availableFonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
              
              {/* 폰트 미리보기 추가 */}
              <FontPreview fontFamily={profile.fontFamily || 'BookkMyungjo'} />
            </div>
            
            {/* 테마 선택 필드 수정 */}
            <div>
              <label className="text-sm font-bold text-brand-orange mb-1.5 flex items-center">
                <FaTerminal className="h-4 w-4 mr-1.5" />
                카드 테마
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = profile.theme === option.value;
                  return (
                    <ThemeTooltip key={option.value} cardTheme={option.value}>
                      <button
                        type="button"
                        onClick={() => handleThemeChange(option.value)}
                        disabled={disabled}
                        className={`flex items-center justify-center px-4 py-2 rounded-lg border text-sm transition-all font-bold ${
                          isSelected
                            ? 'border-primary bg-primary text-white shadow-md scale-105'
                            : 'border-brand-light bg-white/70 text-brand-orange hover:bg-brand-light/20'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-1.5" />
                        {option.label}
                      </button>
                    </ThemeTooltip>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-brand-orange mb-1.5 flex items-center">
                <FaTerminal className='h-4 w-4 mr-1.5' />
                기술 스택
              </label>
              {profile.skills.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearSkills}
                  disabled={disabled}
                  className="text-xs rounded-lg text-primary border-brand-light hover:bg-brand-light/30 font-bold"
                >
                  전체 해제
                </Button>
              )}
            </div>
            
            <div className="mb-3 flex flex-wrap gap-2 min-h-[30px]">
              {profile.skills.length > 0 ? (
                profile.skills.map((skill: string) => (
                  <TechBadge key={skill} tech={skill} />
                ))
              ) : (
                <p className="text-xs text-gray-500">선택된 스택이 없습니다.</p>
              )}
            </div>

            <div className="max-h-48 overflow-y-auto border border-brand-light rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/50 backdrop-blur-sm">
              {availableTechStacks.map((tech) => (
                <label key={tech} className="flex items-center space-x-2.5 cursor-pointer p-2 rounded-lg hover:bg-brand-light/30 transition-all group">
                  <input
                    type="checkbox"
                    value={tech}
                    checked={profile.skills.includes(tech)}
                    onChange={handleSkillChange}
                    disabled={disabled}
                    className="w-4 h-4 rounded border-brand-light text-primary focus:ring-primary transition-all cursor-pointer"
                  />
                  <span className="text-sm text-primary font-bold group-hover:scale-105 transition-all">{tech}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-brand-light">
            <Button
              type="button"
              variant="default"
              onClick={onGeneratePreview}
              disabled={!profile.githubUsername || disabled}
              className="w-full shadow-lg"
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