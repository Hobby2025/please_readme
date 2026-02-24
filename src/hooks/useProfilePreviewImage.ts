import { useState, useEffect, useCallback } from 'react';
import { CardTheme } from '@/types';

interface PreviewParams {
  username: string;
  theme: CardTheme;
  skills: string[];
  bio?: string;
  name?: string;
  fontFamily?: string;
}

interface UseProfilePreviewImageArgs {
  previewParams: PreviewParams | null;
  statsLoading: boolean;
  statsError: string | null;
  onImageLoadSuccess?: () => void;
}

export function useProfilePreviewImage({
  previewParams,
  statsLoading,
  statsError,
  onImageLoadSuccess,
}: UseProfilePreviewImageArgs) {
  const [imageUrl, setImageUrl] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (!previewParams || statsLoading || statsError) {
      setImageUrl('');
      setIsImageLoading(false);
      setImageError(null);
      return;
    }

    const dataObj: any = {
      username: previewParams.username,
      theme: previewParams.theme,
    };
    
    if (previewParams.skills.length > 0) dataObj.skills = previewParams.skills.join(',');
    if (previewParams.bio?.trim()) dataObj.bio = previewParams.bio;
    if (previewParams.name?.trim()) dataObj.name = previewParams.name;
    if (previewParams.fontFamily?.trim()) dataObj.fontFamily = previewParams.fontFamily;

    // JSON 객체를 Safe string으로 인코딩 후 Base64 변환 (Base64URL 스펙)
    let encodedData = btoa(encodeURIComponent(JSON.stringify(dataObj)));
    encodedData = encodedData.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const timestamp = Date.now();
    const url = `${baseUrl}/api/card?data=${encodedData}&nocache=true&t=${timestamp}`;
    
    setImageUrl(url);
    setIsImageLoading(true);
    setImageError(null);

  }, [previewParams, statsLoading, statsError]);

  const handleImageLoad = useCallback(() => {
    setIsImageLoading(false);
    setImageError(null);
    onImageLoadSuccess?.();
  }, [onImageLoadSuccess]);

  const handleImageError = useCallback(() => {
    setIsImageLoading(false);
    setImageError('미리보기 이미지를 불러오는데 실패했습니다. API 서버 상태를 확인하거나 잠시 후 다시 시도해주세요.');
  }, []);

  return {
    imageUrl,
    isImageLoading,
    imageError,
    handleImageLoad,
    handleImageError,
  };
} 