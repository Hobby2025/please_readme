/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'cdn.pixabay.com', 'localhost', 'vercel.app'],
    unoptimized: true, // @vercel/og에서 사용할 이미지 최적화 비활성화
  },
  // 서버리스 함수 메모리 제한 증가
  experimental: {
    serverMemoryLimit: 512 // MB
  },
  // 환경 변수를 클라이언트에 전달
  env: {
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL || 'localhost:3000',
    VERCEL_URL: process.env.VERCEL_URL || 'localhost:3000',
  },
};

module.exports = nextConfig; 