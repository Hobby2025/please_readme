import { ProfileInfo } from '../types';

export function generateMarkdown(profile: ProfileInfo): string {
  if (profile.useCustomCode && profile.customCode) {
    return profile.customCode;
  }

  let markdown = '';
  
  // 프로필 헤더 - 다크모드/라이트모드 대응
  if (profile.useDarkLightMode) {
    markdown += `<div align="center">\n`;
    markdown += `  <picture>\n`;
    markdown += `    <source media="(prefers-color-scheme: dark)" srcset="/api/profile?name=${encodeURIComponent(profile.name)}&bio=${encodeURIComponent(profile.bio)}&theme=${profile.darkTheme || 'dark'}">\n`;
    markdown += `    <source media="(prefers-color-scheme: light)" srcset="/api/profile?name=${encodeURIComponent(profile.name)}&bio=${encodeURIComponent(profile.bio)}&theme=${profile.lightTheme || 'light'}">\n`;
    markdown += `    <img alt="${profile.name}의 GitHub 프로필" src="/api/profile?name=${encodeURIComponent(profile.name)}&bio=${encodeURIComponent(profile.bio)}&theme=${profile.lightTheme || 'light'}">\n`;
    markdown += `  </picture>\n`;
    markdown += `</div>\n\n`;
  } else {
    // 단일 테마
    markdown += `<div align="center">\n`;
    markdown += `  <img src="/api/profile?name=${encodeURIComponent(profile.name)}&bio=${encodeURIComponent(profile.bio)}&theme=${profile.theme || 'default'}" alt="${profile.name}의 GitHub 프로필" />\n`;
    markdown += `</div>\n\n`;
  }

  // 헤더 텍스트
  markdown += `# 안녕하세요, ${profile.name}입니다! 👋\n\n`;

  // 자기소개
  if (profile.bio) {
    markdown += `${profile.bio}\n\n`;
  }

  // 스킬 목록
  if (profile.skills.length > 0) {
    markdown += '## 기술 스택\n\n';
    
    // 스킬 배지 형태로 표시
    markdown += '<div align="center">\n\n';
    profile.skills.forEach(skill => {
      const formattedSkill = skill.toLowerCase().trim();
      markdown += `<img src="https://img.shields.io/badge/${formattedSkill}-${getSkillColor(formattedSkill)}?style=for-the-badge&logo=${formattedSkill}&logoColor=white" alt="${skill}" />\n`;
    });
    markdown += '\n</div>\n\n';
  }

  // 링크
  const links = [];
  if (profile.links.github) {
    links.push(`[<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />](${profile.links.github})`);
  }
  if (profile.links.linkedin) {
    links.push(`[<img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />](${profile.links.linkedin})`);
  }
  if (profile.links.twitter) {
    links.push(`[<img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" />](${profile.links.twitter})`);
  }
  if (profile.links.portfolio) {
    links.push(`[<img src="https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white" />](${profile.links.portfolio})`);
  }
  if (profile.links.other) {
    links.push(`[<img src="https://img.shields.io/badge/Website-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" />](${profile.links.other})`);
  }

  if (links.length > 0) {
    markdown += '## 연락처\n\n';
    markdown += '<div align="center">\n\n';
    markdown += links.join(' ');
    markdown += '\n\n</div>\n\n';
  }

  // GitHub 통계 - 다크모드/라이트모드 대응
  markdown += '## GitHub 통계\n\n';
  markdown += `<div align="center">\n`;
  markdown += `  <picture>\n`;
  markdown += `    <source media="(prefers-color-scheme: dark)" srcset="https://github-readme-stats.vercel.app/api?username=${profile.username}&show_icons=true&theme=dark">\n`;
  markdown += `    <source media="(prefers-color-scheme: light)" srcset="https://github-readme-stats.vercel.app/api?username=${profile.username}&show_icons=true&theme=default">\n`;
  markdown += `    <img src="https://github-readme-stats.vercel.app/api?username=${profile.username}&show_icons=true&theme=default" alt="GitHub 통계">\n`;
  markdown += `  </picture>\n`;
  markdown += `</div>\n\n`;
  
  // 방문자 수 뱃지
  markdown += `<div align="center">\n\n`;
  markdown += `![방문자 수](https://visitor-badge.laobi.icu/badge?page_id=${profile.username}.${profile.username})\n\n`;
  markdown += `</div>\n\n`;
  
  return markdown;
}

function getSkillColor(skill: string): string {
  const skillColors: Record<string, string> = {
    javascript: 'F7DF1E',
    typescript: '3178C6',
    react: '61DAFB',
    vue: '4FC08D',
    angular: 'DD0031',
    node: '339933',
    express: '000000',
    python: '3776AB',
    java: '007396',
    spring: '6DB33F',
    csharp: '239120',
    dotnet: '512BD4',
    php: '777BB4',
    laravel: 'FF2D20',
    go: '00ADD8',
    ruby: 'CC342D',
    swift: 'FA7343',
    kotlin: '7F52FF',
    flutter: '02569B',
    dart: '0175C2',
    html: 'E34F26',
    css: '1572B6',
    sass: 'CC6699',
    tailwind: '06B6D4',
    bootstrap: '7952B3',
    materialui: '0081CB',
    docker: '2496ED',
    kubernetes: '326CE5',
    aws: '232F3E',
    azure: '0078D4',
    gcp: '4285F4',
    firebase: 'FFCA28',
    mongodb: '47A248',
    mysql: '4479A1',
    postgresql: '4169E1',
    redis: 'DC382D',
    graphql: 'E10098',
    git: 'F05032',
    figma: 'F24E1E',
    sketch: 'F7B500',
    linux: 'FCC624',
    nginx: '009639',
    jenkins: 'D24939',
    rust: '000000',
    cpp: '00599C',
    c: 'A8B9CC'
  };
  
  return skillColors[skill] || '3a3a3a'; // 기본 색상
} 