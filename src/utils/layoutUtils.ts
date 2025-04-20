export const calculateCardHeight = (skillsCount: number, fontFamily?: string): number => {
  const SKILLS_PER_ROW = 4;
  
  // 폰트에 따른 기본 높이 설정
  const BASE_HEIGHT = (fontFamily === 'BookkMyungjo' || fontFamily === 'BMJUA_ttf') ? 780 : 820;
  const ROW_HEIGHT = 40;
  
  const skillRows = Math.ceil(skillsCount / SKILLS_PER_ROW);
  return BASE_HEIGHT + (Math.max(0, skillRows - 1) * ROW_HEIGHT);
}; 