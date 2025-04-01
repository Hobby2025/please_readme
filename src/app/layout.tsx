import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Noto_Sans_KR } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Please Readme",
  description: "GitHub 사용자명과 간단한 정보를 입력하면 멋진 GitHub 프로필 이미지를 생성합니다.",
  icons: {
    icon: [
      { url: 'icons/favicon.ico' },
      { url: 'icons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: 'icons/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: 'icons/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: 'icons/apple-touch-icon.png' },
    ],
  },
  manifest: 'icons/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable} font-noto min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
