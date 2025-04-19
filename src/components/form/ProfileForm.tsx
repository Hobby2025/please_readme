import React from 'react';
import { Input } from '../ui/Input';
import { TechBadge } from '../ui/TechBadge';
import { Profile, ProfileFormProps } from '../../types/profile';
import { availableTechStacks } from '../../constants/techStacks';
import { Button } from '../ui/Button';
import { FaPencilAlt, FaImage, FaFont, FaGithubSquare, FaAcquisitionsIncorporated, FaFeatherAlt, FaTerminal } from 'react-icons/fa';
import { useRouter } from 'next/router';

// 사용 가능한 폰트 목록
const availableFonts = [
  { value: 'BookkMyungjo', label: '북크 명조' },
  { value: 'Pretendard', label: '프리텐다드' },
  { value: 'HSSanTokki2.0', label: 'HS산토끼체2.0' },
  { value: 'BMJUA_ttf', label: '배민 주아체'},
  { value: 'BMDOHYEON_ttf', label: '배민 도현체'},
];

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  setProfile,
  disabled = false,
  onGeneratePreview,
}) => {
  const router = useRouter();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
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

  // 폰트 변경 핸들러 추가
  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setProfile({ ...profile, fontFamily: value });
  };

  const handleClearSkills = () => {
    setProfile({ ...profile, skills: [] });
  };

  return (
    <div className="h-full bg-[#F2F2F2]/80 rounded-xl shadow-lg overflow-hidden flex flex-col border border-[#F2D479]">
      <div className="bg-[#F2DAAC] px-6 py-4 border-b border-[#F2D479]">
        <h2 className="text-lg font-medium text-[#F29F05] flex items-center">
          <FaPencilAlt className="h-5 w-5 mr-2 text-[#F2B705]" />
          프로필 정보 입력
        </h2>
      </div>

      <div className="flex-1 p-6 overflow-auto bg-white/50">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <h3 className="text-base font-semibold leading-6 text-[#F29F05]">기본 정보</h3>
            <div>
              <label htmlFor="githubUsername" className="text-base font-medium text-[#F2B705] mb-1 flex items-center">
                <FaGithubSquare className='h-4 mr-1' />
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
              <label htmlFor="name" className="text-base font-medium text-[#F2B705] mb-1 flex items-center">
                <FaAcquisitionsIncorporated className='h-4  mr-1' />
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
              <label htmlFor="bio" className="text-base font-medium text-[#F2B705] mb-1 flex items-center">
                <FaFeatherAlt className='h-4  mr-1' />
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
              <label className="text-base font-medium text-[#F2B705] mb-1 flex items-center">
                <FaFont className="h-4 mr-1" />
                폰트 스타일
              </label>
              <select
                id="fontFamily"
                name="fontFamily"
                value={profile.fontFamily || 'BookkMyungjo'}
                onChange={handleFontChange}
                disabled={disabled}
                className="block w-full rounded-md border border-[#F2D479] bg-white/70 py-2 px-3 shadow-sm focus:border-[#F2B705] focus:outline-none focus:ring-1 focus:ring-[#F29F05] text-sm"
              >
                {availableFonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-base font-medium text-[#F2B705] mb-1 flex items-center">
                <FaTerminal className='h-4 mr-1' />
                기술 스택
              </label>
              {profile.skills.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearSkills}
                  disabled={disabled}
                  className="text-xs rounded-md text-[#F29F05] border-[#F2D479] hover:bg-[#F2DAAC]/50"
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

            <div className="max-h-48 overflow-y-auto border border-[#F2D479] rounded-lg p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white/70">
              {availableTechStacks.map((tech) => (
                <label key={tech} className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-[#F2DAAC]/50 transition-colors">
                  <input
                    type="checkbox"
                    value={tech}
                    checked={profile.skills.includes(tech)}
                    onChange={handleSkillChange}
                    disabled={disabled}
                    className="rounded text-[#F2B705] focus:ring-[#F29F05]"
                  />
                  <span className="text-sm text-[#F29F05]">{tech}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#F2D479]">
            <Button
              type="button"
              onClick={onGeneratePreview}
              disabled={!profile.githubUsername || disabled}
              className="w-full bg-[#F29F05] hover:bg-[#F2B705] text-white"
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