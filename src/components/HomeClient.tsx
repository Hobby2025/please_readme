'use client';

import React, { useState, useEffect } from 'react';
import { ProfileConfig } from '@/types';

export default function HomeClient() {
  // State for raw inputs
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  
  // State for debounced values used in API calls
  const [debouncedParams, setDebouncedParams] = useState({ username: '', title: '' });
  const [previewUrl, setPreviewUrl] = useState('');

  // Unified debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedParams({ username, title });
    }, 1000); // 1s debounce is sufficient and responsive

    return () => clearTimeout(timer);
  }, [username, title]);

  useEffect(() => {
    if (debouncedParams.username) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const titleParam = debouncedParams.title ? `&title=${encodeURIComponent(debouncedParams.title)}` : '';
      // Only include a timestamp if the user explicitly wants to refresh, 
      // otherwise rely on the debounced params to change the URL
      setPreviewUrl(`${baseUrl}/api/card?username=${debouncedParams.username}${titleParam}`);
    } else {
      setPreviewUrl('');
    }
  }, [debouncedParams]);

  return (
    <main className="max-h-[100svh] bg-black text-white p-10 font-mono">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <section className="w-full">
          <header className="border-b border-yellow-500 pb-5 mb-10">
             <h1 className="text-5xl font-black italic">PLEASE<span className="text-yellow-500 not-italic ml-2">README</span></h1>
             <p className="text-xs text-yellow-500/50 mt-2 tracking-widest uppercase">System Ready // Premium Profile Banner v4.1</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-yellow-500 uppercase tracking-tighter">Access ID</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="INPUT_GITHUB_USERNAME..."
                  className="bg-transparent border-b-2 border-white/20 p-2 text-xl outline-none focus:border-yellow-500 transition-all font-black"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-yellow-500 uppercase tracking-tighter">Custom Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="GITHUB ENGINEER"
                  className="bg-transparent border-b-2 border-white/20 p-2 text-xl outline-none focus:border-yellow-500 transition-all font-black text-white/80"
                />
              </div>

              <button 
                className="w-full h-16 bg-yellow-500 text-black font-black text-xl hover:bg-white transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                onClick={() => {
                  if (previewUrl) {
                    navigator.clipboard.writeText(`![${username}'s Premium Profile Banner](${previewUrl})`);
                    alert('Markdown copied to clipboard.');
                  }
                }}
              >
                  GENERATE_MARKDOWN
              </button>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 flex items-center justify-center italic text-white/40 text-sm">
              * Your professional GitHub profile is now available in a high-resolution banner format (1200x400) for your Readme header.
            </div>
          </div>
        </section>

        <section className="w-full">
           <div className="w-full aspect-[3/1] border-2 border-white/10 bg-white/5 flex items-center justify-center relative overflow-hidden group shadow-2xl">
              {previewUrl ? (
                <img src={previewUrl} className="w-full h-full object-contain" alt="Profile Banner Preview" />
              ) : (
                <div className="text-white/20 font-black text-2xl uppercase tracking-tighter animate-pulse text-center">
                  Terminal Idle.<br/>Awaiting Legendary Input.
                </div>
              )}
              <div className="absolute top-0 right-0 p-4">
                 <div className="w-3 h-3 bg-yellow-500 animate-ping rounded-full" />
              </div>
           </div>
        </section>

        <footer className="w-full pt-10 mt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[14px] text-white/30 tracking-[0.2em] uppercase font-bold">
          <div>
            © 2026 PLEASE README. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-8">
            <a 
              href="https://github.com/Stjoo0925/please_readme_v2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-yellow-500 transition-colors flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
              GITHUB_REPOSITORY
            </a>
            <span className="opacity-50">STATUS: PRODUCTION_STABLE</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
