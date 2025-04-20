export function validateImageUrl(url: string): boolean {
  try {
    new URL(url);
    // 추가 검증: http 또는 https 프로토콜 확인 등
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return false;
    }
    // 간단한 이미지 확장자 확인 (완벽하지 않음)
    // const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
    // if (!imageExtensions.some(ext => url.toLowerCase().endsWith(ext))) {
    //   return false;
    // }
    return true;
  } catch {
    return false;
  }
} 