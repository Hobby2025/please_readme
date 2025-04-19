import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Head>
        <title>Please Readme</title>
        <meta name="description" content="GitHub 사용자명과 간단한 정보를 입력하면 멋진 GitHub 프로필 이미지를 생성합니다." />
        <link rel="icon" href="/icons/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://please-readme.vercel.app/" />
        <meta property="og:title" content="Please Readme" />
        <meta property="og:description" content="GitHub 사용자명과 간단한 정보를 입력하면 멋진 GitHub 프로필 이미지를 생성합니다." />
        <meta property="og:image" content="https://please-readme.vercel.app/images/readme_tn.webp" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://please-readme.vercel.app/" />
        <meta property="twitter:title" content="Please Readme" />
        <meta property="twitter:description" content="GitHub 사용자명과 간단한 정보를 입력하면 멋진 GitHub 프로필 이미지를 생성합니다." />
        <meta property="twitter:image" content="https://please-readme.vercel.app/images/readme_tn.webp" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
} 