import React, { useCallback } from 'react';
import { Profile, CardTheme } from '@/types';

interface UseProfileFormArgs {
  profile: Profile;
  setProfile: (profile: Profile) => void;
}

export function useProfileForm({ profile, setProfile }: UseProfileFormArgs) {
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  }, [profile, setProfile]);

  const handleSkillChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setProfile({
      ...profile,
      skills:
        checked
          ? [...profile.skills, value]
          : profile.skills.filter((skill) => skill !== value),
    });
  }, [profile, setProfile]);

  const handleFontChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setProfile({ ...profile, fontFamily: value });
  }, [profile, setProfile]);

  const handleThemeChange = useCallback((theme: CardTheme) => {
    setProfile({ ...profile, theme });
  }, [profile, setProfile]);

  const handleClearSkills = useCallback(() => {
    setProfile({ ...profile, skills: [] });
  }, [profile, setProfile]);

  return {
    handleInputChange,
    handleSkillChange,
    handleFontChange,
    handleThemeChange,
    handleClearSkills,
  };
} 