import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      rules: {
        // CSS 모듈과 관련된 규칙 제거
      }
    }
  }
};

export default nextConfig;
