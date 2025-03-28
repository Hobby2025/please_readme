'use client';

import { useMemo, useState, useEffect } from 'react';
import TechBadge from './TechBadge';
import Image from 'next/image';

interface ProfileData {
  username: string;
  name: string;
  bio: string;
  skills: string[];
  theme: 'light' | 'dark';
  githubStats: {
    stars: number;
    commits: number;
    prs: number;
    issues: number;
    contributions: number;
    currentYearCommits: number;
    languages: { [key: string]: number };
  };
}

interface GithubCardProps {
  profile: ProfileData;
}

export default function GithubCard({ profile }: GithubCardProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  
  useEffect(() => {
    // 클라이언트 사이드에서만 시간을 설정
    setCurrentTime(new Date().toLocaleString('ko-KR'));
  }, []);
  
  // 기여도에 따른 랭크 계산
  const rank = useMemo(() => {
    const contributions = profile.githubStats?.contributions || 0;
    
    if (contributions >= 1000) return { name: '다이아몬드', color: '#B9F2FF', emoji: '💎' };
    if (contributions >= 500) return { name: '플래티넘', color: '#E5E4E2', emoji: '🥇' };
    if (contributions >= 200) return { name: '골드', color: '#FFD700', emoji: '🏆' };
    if (contributions >= 100) return { name: '실버', color: '#C0C0C0', emoji: '🥈' };
    return { name: '브론즈', color: '#CD7F32', emoji: '🥉' };
  }, [profile.githubStats?.contributions]);

  const isDark = profile.theme === 'dark';
  
  // 기본 아바타 이미지 URL
  const defaultAvatarUrl = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
  
  return (
    <div className={`w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      {/* 카드 헤더 */}
      <div className={`w-full p-6 ${isDark ? 'bg-gray-900' : 'bg-[#8B5CF6]/10'}`}>
        <div className="flex items-center space-x-4">
          {/* 아바타 */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-4 border-violet-400">
              {profile.username ? (
                <Image 
                  src={`https://github.com/${profile.username}.png`} 
                  alt={`${profile.username}의 GitHub 아바타`}
                  width={80}
                  height={80}
                  className="object-cover"
                  onError={(e) => {
                    // 에러 시 기본 아바타로 대체
                    e.currentTarget.src = defaultAvatarUrl;
                  }}
                />
              ) : (
                <Image 
                  src={defaultAvatarUrl}
                  alt="기본 GitHub 아바타"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              )}
            </div>
            {/* 랭크 배지 */}
            <div 
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: rank.color }}
            >
              {rank.emoji}
            </div>
          </div>
          
          {/* 이름 및 아이디 */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile.name || (profile.username ? `${profile.username}'s GitHub` : 'GitHub Status')}</h1>
            {profile.username && (
              <a 
                href={`https://github.com/${profile.username}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-violet-500 hover:underline"
              >
                @{profile.username}
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* 카드 바디 */}
      <div className="p-6">
        {/* 자기소개 */}
        {profile.bio && (
          <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className="italic">{profile.bio}</p>
          </div>
        )}
        
        {/* GitHub 통계 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm">커밋 (올해)</span>
              <span className="font-bold text-xl text-violet-500">{profile.githubStats?.currentYearCommits || 0}</span>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm">PR</span>
              <span className="font-bold text-xl text-violet-500">{profile.githubStats?.prs || 0}</span>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm">이슈</span>
              <span className="font-bold text-xl text-violet-500">{profile.githubStats?.issues || 0}</span>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm">기여도</span>
              <span className="font-bold text-xl text-violet-500">{profile.githubStats?.contributions || 0}</span>
            </div>
          </div>
        </div>
        
        {/* 랭크 표시 */}
        <div className={`mb-6 p-4 rounded-lg text-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg font-bold">{rank.emoji} {rank.name} 등급</span>
          </div>
          <div className="mt-2 text-sm">
            기여도 점수: {profile.githubStats?.contributions || 0}
          </div>
        </div>
        
        {/* 기술 스택 */}
        {profile.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">기술 스택</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(skill => (
                <TechBadge key={skill} tech={skill} />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* 카드 푸터 */}
      <div className={`px-6 py-4 ${isDark ? 'bg-gray-900 text-gray-400' : 'bg-[#8B5CF6]/10 text-gray-500'} text-xs text-center`}>
        마지막 업데이트: {currentTime}
      </div>
    </div>
  );
} 