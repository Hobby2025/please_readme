/**
 * 현재 환경(로컬/Vercel)에 맞게 이미지 URL을 적절히 변환하는 유틸리티
 */

// 배경 이미지 경로를 환경에 맞게 변환하는 함수
export function getImageUrl(path: string): string {
  // 이미 절대 URL인 경우 그대로 반환
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Vercel 환경에서 로컬 이미지에 접근하기 위한 URL 구성
  if (typeof window === 'undefined' && process.env.VERCEL === '1') {
    // 서버 사이드에서 실행 중이고 Vercel 환경인 경우
    const vercelUrl = process.env.VERCEL_URL || '';
    if (vercelUrl) {
      return `https://${vercelUrl}${path}`;
    }
  }
  
  // 로컬 개발 환경 또는 클라이언트 사이드에서는 상대 경로 사용
  return path;
}

// 이미지 파일을 base64로 인코딩하는 유틸리티 함수들은 이곳에 추가할 수 있습니다. 