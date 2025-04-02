import { IconType } from 'react-icons';
import {
  SiNodedotjs,
  SiLinux,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiMongodb,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiGo,
  SiRust,
  SiKotlin,
  SiSwift,
  SiAmazon,
  SiPostgresql,
  SiRedis,
  SiGraphql,
  SiVuedotjs,
  SiAngular,
  SiSharp,
  SiPhp,
  SiRuby,
  SiNextdotjs,
  SiTailwindcss,
  SiJest,
  SiHtml5,
  SiCss3,
  SiSass,
  SiFigma,
  SiSpringboot,
} from 'react-icons/si';
import { FaJava, FaQuestionCircle } from 'react-icons/fa';

// 기술 스택 정보 타입 정의
export interface TechInfo {
  icon: IconType;
  bg: string;
  text: string;
}

// 확장된 기술 스택 맵
export const techMap: Record<string, TechInfo> = {
  // 기존 스택
  'Node.js': { icon: SiNodedotjs, bg: 'bg-[#339933]', text: 'text-white' },
  'Linux': { icon: SiLinux, bg: 'bg-[#FCC624]', text: 'text-black' },
  'Docker': { icon: SiDocker, bg: 'bg-[#2496ED]', text: 'text-white' },
  'Kubernetes': { icon: SiKubernetes, bg: 'bg-[#326CE5]', text: 'text-white' },
  'Git': { icon: SiGit, bg: 'bg-[#F05032]', text: 'text-white' },
  'MongoDB': { icon: SiMongodb, bg: 'bg-[#47A248]', text: 'text-white' },
  'React': { icon: SiReact, bg: 'bg-[#61DAFB]', text: 'text-white' },
  'TypeScript': { icon: SiTypescript, bg: 'bg-[#3178C6]', text: 'text-white' },
  'JavaScript': { icon: SiJavascript, bg: 'bg-[#F7DF1E]', text: 'text-black' },
  'Python': { icon: SiPython, bg: 'bg-[#3776AB]', text: 'text-white' },
  'Java': { icon: FaJava, bg: 'bg-[#007396]', text: 'text-white' },
  'Go': { icon: SiGo, bg: 'bg-[#00ADD8]', text: 'text-white' },
  'Rust': { icon: SiRust, bg: 'bg-[#DEA584]', text: 'text-black' },
  'Kotlin': { icon: SiKotlin, bg: 'bg-[#7F52FF]', text: 'text-white' },
  'Swift': { icon: SiSwift, bg: 'bg-[#F05138]', text: 'text-white' },
  'AWS': { icon: SiAmazon, bg: 'bg-[#232F3E]', text: 'text-white' },
  'PostgreSQL': { icon: SiPostgresql, bg: 'bg-[#4169E1]', text: 'text-white' },
  'Redis': { icon: SiRedis, bg: 'bg-[#DC382D]', text: 'text-white' },
  'GraphQL': { icon: SiGraphql, bg: 'bg-[#E10098]', text: 'text-white' },
  
  // 추가된 스택
  'Vue.js': { icon: SiVuedotjs, bg: 'bg-[#4FC08D]', text: 'text-white' },
  'Angular': { icon: SiAngular, bg: 'bg-[#DD0031]', text: 'text-white' },
  'C#': { icon: SiSharp, bg: 'bg-[#512BD4]', text: 'text-white' },
  'PHP': { icon: SiPhp, bg: 'bg-[#777BB4]', text: 'text-white' },
  'Ruby': { icon: SiRuby, bg: 'bg-[#CC342D]', text: 'text-white' },
  'Next.js': { icon: SiNextdotjs, bg: 'bg-[#000000]', text: 'text-white' },
  'Tailwind CSS': { icon: SiTailwindcss, bg: 'bg-[#06B6D4]', text: 'text-white' },
  'Jest': { icon: SiJest, bg: 'bg-[#C21325]', text: 'text-white' },
  'HTML5': { icon: SiHtml5, bg: 'bg-[#E34F26]', text: 'text-white' },
  'CSS3': { icon: SiCss3, bg: 'bg-[#1572B6]', text: 'text-white' },
  'Sass': { icon: SiSass, bg: 'bg-[#CC6699]', text: 'text-white' },
  'Figma': { icon: SiFigma, bg: 'bg-[#F24E1E]', text: 'text-white' },
  'Spring Boot': { icon: SiSpringboot, bg: 'bg-[#6DB33F]', text: 'text-white' },

  // 기타 (필요시 추가)
  'REST API': { icon: FaQuestionCircle, bg: 'bg-gray-400', text: 'text-white' }, 
  'CI/CD': { icon: FaQuestionCircle, bg: 'bg-gray-400', text: 'text-white' },
  '테스트': { icon: FaQuestionCircle, bg: 'bg-gray-400', text: 'text-white' },

  // 기본값
  'default': { icon: FaQuestionCircle, bg: 'bg-gray-400', text: 'text-white' },
};

// 선택 가능한 기술 스택 목록 (techMap의 키들을 사용)
export const availableTechStacks = Object.keys(techMap).filter(
  (key) => key !== 'default' && key !== 'REST API' && key !== 'CI/CD' && key !== '테스트' // 기본값 및 일반 용어 제외
).sort(); // 가나다순 정렬 