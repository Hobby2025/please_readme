import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Component {...pageProps} />
    </div>
  );
} 