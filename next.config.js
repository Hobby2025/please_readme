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
  },
  // 외부 패키지 설정 (Next.js 15.2.4에서 이동됨)
  serverExternalPackages: ['canvas'],
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
  trailingSlash: false,
  // next/image 컴포넌트의 이미지 호스트 설정
  images: {
    domains: ['github.com', 'avatars.githubusercontent.com', 'github.githubassets.com', 'please-readme.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'please-readme.vercel.app',
        port: '',
        pathname: '/api/profile/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/profile',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Accept',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 