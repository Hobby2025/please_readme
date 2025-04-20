import { ColorMap } from '@/types';

// SimpleTechBadge 및 ImageService에서 사용될 색상 정의 통합
const bgColors: ColorMap = {
  'React': '#61DAFB',
  'TypeScript': '#3178C6',
  'JavaScript': '#F7DF1E',
  'Next.js': '#000000',
  'Node.js': '#339933',
  'Python': '#3776AB',
  'Java': '#007396',
  'Go': '#00ADD8',
  'CSS': '#1572B6',
  'HTML': '#E34F26',
  'TailwindCSS': '#06B6D4',
  'MySQL': '#4479A1',
  'PostgreSQL': '#4169E1',
  'MongoDB': '#47A248',
  'Express': '#000000',
  'GraphQL': '#E10098',
  'Redux': '#764ABC',
  'Git': '#F05032',
  'Docker': '#2496ED',
  'Kubernetes': '#326CE5',
  'AWS': '#232F3E',
  'Vue.js': '#4FC08D',
  'Angular': '#DD0031',
  'Linux': '#FCC624',
  'Rust': '#DEA584',
  'Kotlin': '#7F52FF',
  'Swift': '#F05138',
  'Redis': '#DC382D',
  'C#': '#512BD4',
  'PHP': '#777BB4',
  'Ruby': '#CC342D',
  'Sass': '#CC6699',
  'Figma': '#F24E1E',
  'Spring': '#6DB33F',
  'C++': '#00599C',
  'Django': '#092E20',
  'Flask': '#000000',
  'GCP': '#4285F4',
  'Azure': '#0078D4',
  'Bootstrap': '#7952B3',
  'Svelte': '#FF3E00',
  'MobX': '#FF9955',
  'Cypress': '#17202C',
  'GitHub': '#181717',
  'GitLab': '#FC6D26',
  'Jira': '#0052CC',
  'REST API': '#FF6C37',
  'CI/CD': '#D33833',
  '테스트': '#4E9BCD',
  // ImageService의 색상 정의도 필요한 경우 여기에 통합
  'default': '#6B7280' // 기본값 (ImageService의 것과 다를 수 있음, 확인 필요)
};

const textColors: ColorMap = {
  'JavaScript': '#000000',
  'Linux': '#000000',
  'Rust': '#000000',
  // ImageService의 정의와 비교하여 필요한 경우 추가
  'default': '#FFFFFF'
};

interface TechColor {
  background: string;
  text: string;
}

export function getTechColor(tech: string): TechColor {
  const background = bgColors[tech] || bgColors['default'];
  const text = textColors[tech] || textColors['default'];
  return { background, text };
}

export function darkenColor(color: string, amount: number = 15): string {
  if (color.startsWith('#')) {
    try {
      let r = parseInt(color.slice(1, 3), 16);
      let g = parseInt(color.slice(3, 5), 16);
      let b = parseInt(color.slice(5, 7), 16);
      
      r = Math.max(0, r - amount);
      g = Math.max(0, g - amount);
      b = Math.max(0, b - amount);
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    } catch (e) {
      console.error(`Invalid color format for darkenColor: ${color}`, e);
      return color; // 유효하지 않은 형식이면 원본 반환
    }
  } 
  // HEX 형식이 아닌 경우 처리 (예: rgb, rgba)
  // 간단하게 원본 색상을 반환하거나, 필요시 더 정교한 로직 추가
  return color;
} 