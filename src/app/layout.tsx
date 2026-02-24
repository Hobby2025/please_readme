import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import '../styles/fonts.css';
import { ToastProvider } from '@/contexts/ToastContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Please Readme',
  description: 'GitHub 사용자명과 간단한 정보를 입력하면 멋진 GitHub 프로필 이미지를 생성합니다.',
  icons: {
    icon: '/icons/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/icons/site.webmanifest',
  openGraph: {
    type: 'website',
    url: 'https://please-readme.vercel.app/',
    title: 'Please Readme',
    description: 'GitHub 사용자명과 간단한 정보를 입력하면 멋진 GitHub 프로필 이미지를 생성합니다.',
    images: [{ url: 'https://please-readme.vercel.app/images/readme_tn.webp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Please Readme',
    description: 'GitHub 사용자명과 간단한 정보를 입력하면 멋진 GitHub 프로필 이미지를 생성합니다.',
    images: ['https://please-readme.vercel.app/images/readme_tn.webp'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
