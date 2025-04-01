/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        ridi: ['var(--font-noto-sans-kr)', 'var(--font-geist-sans)', 'Arial', 'sans-serif'],
        noto: ['var(--font-noto-sans-kr)', 'var(--font-geist-sans)', 'Arial', 'sans-serif']
      },
      colors: {
        // 필요한 경우 커스텀 색상 추가
      },
    },
  },
  plugins: [],
  darkMode: 'media', // 'media'(기본값) 또는 'class'
} 