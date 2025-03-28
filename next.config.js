/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      rules: {
        // CSS 모듈과 관련된 규칙 제거
      }
    },
    // 실험적 기능 추가
    typedRoutes: false,
    serverComponentsExternalPackages: ['canvas']
  },
  eslint: {
    // 경고만 표시하고 빌드는 계속 진행
    ignoreDuringBuilds: true
  },
  typescript: {
    // 타입 검사 오류가 있어도 빌드 진행
    ignoreBuildErrors: true
  },
  // 빌드 시 경고 숨기기
  output: 'standalone',
  // 동적 경로 처리 방식
  trailingSlash: false
};

module.exports = nextConfig; 