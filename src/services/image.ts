import html2canvas from 'html2canvas';
import { ImageGenerationOptions, Profile, GitHubStats } from '@/types';

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
        backgroundColor: profile.theme === 'default' ? '#1F2937' : '#FFFFFF',
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