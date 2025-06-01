/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['avatars.githubusercontent.com', 'cdn.pixabay.com', 'localhost', 'vercel.app', 'raw.githubusercontent.com', 'github.com', 'user-attachments.github.com'],
    unoptimized: true, // @vercel/og에서 사용할 이미지 최적화 비활성화
  },
  // 서버리스 함수 메모리 제한 증가
  experimental: {
    serverMemoryLimit: 512, // MB
    largePageDataBytes: 512 * 1000, // 512KB -> 내부 props 크기 제한 증가
  },
  // 환경 변수를 클라이언트에 전달
  env: {
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL || 'localhost:3000',
    VERCEL_URL: process.env.VERCEL_URL || 'localhost:3000',
  },
  // Vercel API 타임아웃 설정
  serverRuntimeConfig: {
    maxDuration: 60, // API 요청 최대 시간을 60초로 설정
  },
};

module.exports = nextConfig; 