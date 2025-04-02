import html2canvas from 'html2canvas';
import { ImageGenerationOptions, Profile, GitHubStats } from '../types/profile';

interface ImageOptions {
  backgroundColor?: string;
  width?: number;
  height?: number;
  scale?: number;
}

export class ImageService {
  private static instance: ImageService;

  private constructor() {}

  public static getInstance(): ImageService {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService();
    }
    return ImageService.instance;
  }

  public async captureElement(elementId: string): Promise<string> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('요소를 찾을 수 없습니다');
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      return canvas.toDataURL('image/png');
    } catch (error) {
      throw new Error('이미지 생성 중 오류가 발생했습니다');
    }
  }

  public async downloadImage(imageData: Blob | string, filename: string): Promise<void> {
    try {
      const link = document.createElement('a');
      
      if (imageData instanceof Blob) {
        const url = URL.createObjectURL(imageData);
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        link.href = imageData;
        link.download = filename;
        link.click();
      }
      
      link.remove();
    } catch (error) {
      console.error('이미지 다운로드 실패:', error);
      throw new Error('이미지 다운로드에 실패했습니다');
    }
  }

  static validateImageUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static async loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  public async generateProfileImage(
    profile: Profile,
    stats: GitHubStats,
    element?: HTMLElement | null
  ): Promise<string> {
    if (!element) {
       console.warn('generateProfileImage 호출 시 HTML 요소가 제공되지 않았습니다. 빈 이미지를 반환합니다.');
       return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; 
    }
    
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: profile.theme === 'dark' ? '#1F2937' : '#FFFFFF',
        scale: 2, // 고해상도 이미지 생성
        logging: false,
        useCORS: true, // 외부 이미지 로딩 허용
        allowTaint: true,
        foreignObjectRendering: true,
      });

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('이미지 생성 실패:', error);
      throw new Error('프로필 카드 이미지 생성에 실패했습니다.');
    }
  }

  private getTechColor(tech: string): string {
    const colors: Record<string, string> = {
      'React': '#61DAFB',
      'TypeScript': '#3178C6',
      'JavaScript': '#F7DF1E',
      'Python': '#3776AB',
      'Java': '#007396',
      'C++': '#00599C',
      'Go': '#00ADD8',
      'Rust': '#DEA584',
      'Kotlin': '#7F52FF',
      'Swift': '#FA7343',
      'Ruby': '#CC342D',
      'PHP': '#777BB4',
      'Node.js': '#339933',
      'Docker': '#2496ED',
      'Kubernetes': '#326CE5',
      'AWS': '#FF9900',
      'Azure': '#0078D4',
      'GCP': '#4285F4',
      'MongoDB': '#47A248',
      'PostgreSQL': '#336791',
      'MySQL': '#4479A1',
      'Redis': '#DC382D',
      'Elasticsearch': '#005571',
      'GraphQL': '#E10098',
      'REST': '#FF5733',
      'Git': '#F05032',
      'Linux': '#FCC624',
      'Django': '#092E20',
      'Flask': '#000000',
      'Spring': '#6DB33F',
      'Express': '#000000',
      'Next.js': '#000000',
      'Vue.js': '#4FC08D',
      'Angular': '#DD0031',
      'Svelte': '#FF3E00',
      'Tailwind CSS': '#38B2AC',
      'Bootstrap': '#7952B3',
      'Material-UI': '#007FFF',
      'Chakra UI': '#319795',
      'Redux': '#764ABC',
      'MobX': '#FF9955',
      'Jest': '#C21325',
      'Cypress': '#17202C',
      'Webpack': '#8DD6F9',
      'Babel': '#F9DC3E',
      'ESLint': '#4B32C3',
      'Prettier': '#F7B93E',
      'VS Code': '#007ACC',
      'IntelliJ': '#000000',
      'Figma': '#F24E1E',
      'Adobe XD': '#FF61F6',
      'Sketch': '#F7B500',
      'Invision': '#FF3366',
      'Zeplin': '#FDBD39',
      'Jira': '#0052CC',
      'Confluence': '#172B4D',
      'Slack': '#4A154B',
      'Discord': '#5865F2',
      'Telegram': '#0088CC',
      'WhatsApp': '#25D366',
      'Signal': '#3B76F4',
      'Zoom': '#2D8CFF',
      'Teams': '#464EB8',
      'Notion': '#000000',
      'Evernote': '#2DBE60',
      'Trello': '#026AA7',
      'Asana': '#F06A6A',
      'Basecamp': '#1D2D35',
      'Monday': '#FF385C',
      'Airtable': '#FF3366',
      'Miro': '#FF5A5F',
      'Lucidchart': '#F24D18',
      'Draw.io': '#F08705',
    };

    return colors[tech] || '#6B7280';
  }

  async generateImage(element: HTMLElement): Promise<Blob> {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(element);
      
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('이미지 생성에 실패했습니다'));
          }
        }, 'image/png');
      });
    } catch (error) {
      console.error('이미지 생성 실패:', error);
      throw new Error('이미지 생성에 실패했습니다');
    }
  }
} 