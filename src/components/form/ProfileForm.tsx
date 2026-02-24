import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TechBadge } from '../ui/TechBadge';
import { Profile, ProfileFormProps, ThemeOption, FontOption, CardTheme } from '@/types';
import { availableTechStacks } from '../../constants/techStacks';
import { FaPencilAlt, FaImage, FaFont, FaGithubSquare, FaAcquisitionsIncorporated, FaFeatherAlt, FaTerminal, FaMoon, FaSun } from 'react-icons/fa';
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
    <div className="h-full bg-transparent flex flex-col relative">
      <div className="flex-1 overflow-auto">
        <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-5 bg-primary" />
              <h3 className="text-base font-black text-white tracking-[0.2em] uppercase">Core identity</h3>
            </div>
            <div>
              <Input
                label="GitHub Access ID"
                id="githubUsername"
                name="githubUsername"
                value={profile.githubUsername}
                onChange={handleInputChange}
                disabled={disabled}
                placeholder="INPUT_USERNAME..."
                // leftIcon={<FaGithubSquare className='h-5 w-5' />}
                className="text-base"
              />
            </div>

            <div>
              <Input
                label="Protocol Alias"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                disabled={disabled}
                placeholder="INPUT_ALIAS..."
                // leftIcon={<FaAcquisitionsIncorporated className='h-5 w-5' />}
                className="text-base"
              />
            </div>

            <div>
              <Input
                label="Identity Narrative"
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                disabled={disabled}
                placeholder="INPUT_BIO..."
                // leftIcon={<FaFeatherAlt className='h-5 w-5' />}
                className="text-base"
              />
            </div>
            
            <div>
              <label className="text-sm font-black text-primary tracking-widest uppercase mb-3 block">
                Typography Matrix
              </label>
              <select
                id="fontFamily"
                name="fontFamily"
                value={profile.fontFamily || 'BookkMyungjo'}
                onChange={handleFontChange}
                disabled={disabled}
                className="block w-full rounded-none border-b-2 border-white/20 bg-black py-4 px-4 text-white focus:border-primary shadow-none outline-none text-base transition-all uppercase font-black"
              >
                {availableFonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
              <FontPreview fontFamily={profile.fontFamily || 'BMJUA_ttf'} />
            </div>
            
            <div>
               <label className="text-sm font-black text-primary tracking-widest uppercase mb-5 block">
                Visual Aesthetic
              </label>
              <div className="flex flex-wrap gap-4 mt-1">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = profile.theme === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleThemeChange(option.value)}
                      disabled={disabled}
                      className={`flex items-center justify-center px-4 py-3 border text-xs transition-all font-black tracking-widest uppercase ${
                        isSelected
                          ? 'border-primary bg-primary text-black shadow-[0_0_20px_rgba(255,215,0,0.4)]'
                          : 'border-white/20 bg-white/5 text-white/80 hover:border-primary hover:text-primary'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-white/10 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-5 bg-primary" />
                <h3 className="text-base font-black text-white tracking-[0.2em] uppercase">Technical Stack</h3>
              </div>
              {profile.skills.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearSkills}
                  disabled={disabled}
                  className="text-xs font-black text-primary hover:text-white transition-colors uppercase tracking-widest"
                >
                  [ PURGE_SYTEM ]
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 min-h-[60px] p-6 bg-white/[0.03] border border-white/10 italic">
              {profile.skills.length > 0 ? (
                profile.skills.map((skill: string) => (
                  <TechBadge key={skill} tech={skill} />
                ))
              ) : (
                <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-bold">Awaiting sector selection ...</p>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto border border-white/10 p-8 grid grid-cols-2 sm:grid-cols-3 gap-6 bg-black/60 shadow-inner scrollbar-thin scrollbar-thumb-primary">
              {availableTechStacks.map((tech) => (
                <label key={tech} className="flex items-center space-x-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    value={tech}
                    checked={profile.skills.includes(tech)}
                    onChange={handleSkillChange}
                    disabled={disabled}
                    className="w-4 h-4 rounded-none border-white/30 bg-transparent text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-white/70 font-black group-hover:text-primary uppercase tracking-tighter transition-colors">{tech}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-12">
            <Button
              type="button"
              variant="default"
              onClick={onGeneratePreview}
              disabled={!profile.githubUsername || disabled}
              className="w-full h-20 text-xl text-black hover:text-black shadow-[0_0_30px_rgba(255,215,0,0.3)]"
            >
              GENERATE_README
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 