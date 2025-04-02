import { useState, useCallback } from 'react';
import { ImageService } from '../services/image';

const imageService = ImageService.getInstance();

export const useImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = useCallback(async (
    element: HTMLElement,
    options: {
      backgroundColor?: string;
      width?: number;
      height?: number;
      scale?: number;
    } = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      const dataUrl = await imageService.generateImage(element, options);
      return dataUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 생성에 실패했습니다.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadImage = useCallback(async (dataUrl: string, filename: string) => {
    try {
      await imageService.downloadImage(dataUrl, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 다운로드에 실패했습니다.');
    }
  }, []);

  return {
    loading,
    error,
    generateImage,
    downloadImage,
  };
}; 