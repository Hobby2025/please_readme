'use client';

import { useMemo, useState, useEffect } from 'react';
import TechBadge from './TechBadge';
import Image from 'next/image';
import { calculateRank, type GitHubStats, type RankInfo } from '@/utils/github-stats';

interface ProfileData {
  username: string;
  name: string;
  bio: string;
  skills: string[];
  theme: 'light' | 'dark';
  backgroundImageUrl?: string;
  githubStats: GitHubStats;
}

interface GithubCardProps {
  profile: ProfileData;
}

export default function GithubCard({ profile }: GithubCardProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // 한국어 형식으로 연월일 표시
    setCurrentTime(`${year}. ${month}. ${day}`);
  }, []);
  
  // 기여도에 따른 랭크 계산 및 테마 색상 정의
  const rank = useMemo(() => {
    return calculateRank(profile.githubStats);
  }, [profile.githubStats]);

  const isDark = profile.theme === 'dark';
  
  // 기본 아바타 이미지 URL
  const defaultAvatarUrl = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
  
  return (
    <div 
      className={`w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg relative ${isDark ? 'text-white' : 'text-gray-800'}`}
    >
      {/* 카드 헤더 */}
      <div className={`w-full p-6 relative z-20 ${rank.headerBg} text-white`}>
        <div className="flex items-center space-x-4">
          {/* 아바타 */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-2" style={{ borderColor: rank.accentColor }}>
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
          </div>
          
          {/* 이름 및 아이디 */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{profile.name || (profile.username ? `${profile.username}'s GitHub` : 'GitHub Status')}</h1>
            {profile.username && (
              <a 
                href={`https://github.com/${profile.username}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm hover:underline"
                style={{ color: rank.accentColor }}
              >
                @{profile.username}
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* 카드 바디 - 배경 이미지 영역 */}
      <div className="relative">
        {/* 배경 이미지 (있는 경우에만) */}
        {profile.backgroundImageUrl && (
          <div className="absolute inset-0 w-full h-full z-0" style={{ 
            backgroundImage: `url(${profile.backgroundImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}></div>
        )}
        
        {/* 배경 오버레이 (사용자 이미지가 있을 경우에만) */}
        {profile.backgroundImageUrl && (
          <div className="absolute inset-0 w-full h-full z-10" style={{ 
            backgroundColor: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.6)'
          }}></div>
        )}

        {/* 카드 내용 */}
        <div className={`p-6 relative z-20 ${profile.backgroundImageUrl ? '' : (isDark ? 'bg-gray-800' : 'bg-white')}`}>
          {/* 자기소개 */}
          {profile.bio && (
            <div className={`mb-8 p-5 rounded-lg relative ${isDark ? 'bg-gray-700/90 text-white' : 'bg-gray-100/90 text-gray-800'}`} style={{ border: `2px solid ${rank.mainColor}` }}>
              <div className="absolute top-3 left-3 text-2xl opacity-60" style={{ color: rank.accentColor }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="italic pl-8 pr-4 py-1 font-medium text-center">
                {profile.bio}
              </p>
              <div className="absolute bottom-3 right-3 text-2xl opacity-60 transform rotate-180" style={{ color: rank.accentColor }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
            </div>
          )}

          {/* 기술 스택 */}
          {profile.skills.length > 0 && (
            <div className="mb-8">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/90 text-white' : 'bg-gray-100/90 text-gray-800'}`} style={{ border: `2px solid ${rank.mainColor}` }}>
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ color: rank.accentColor }}>
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-xl font-semibold ml-2" style={{ color: rank.accentColor }}>Stacks</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map(skill => (
                    <TechBadge key={skill} tech={skill} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 구분선 */}
          {profile.bio && profile.bio.trim() !== '' && Array.isArray(profile.skills) && profile.skills.length > 0 && (
            <div className="my-6 flex items-center justify-center">
              <div className="flex items-center space-x-2 w-full">
                <div 
                  className="h-0.5 flex-1 rounded"
                  style={{  backgroundColor: rank.accentColor }}
                />
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: rank.accentColor }}
                    />
                  ))}
                </div>
                <div 
                  className="h-0.5 flex-1 rounded"
                  style={{  backgroundColor: rank.accentColor }}
                />
              </div>
            </div>
          )}

          {/* GitHub 통계 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/90 text-white' : 'bg-gray-100/90 text-gray-800'}`} style={{ borderLeft: `4px solid ${rank.mainColor}` }}>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Commits | {new Date().getFullYear()}</span>
                <span className="font-bold text-xl" style={{ color: rank.highlightColor }}>{profile.githubStats?.currentYearCommits || 0}</span>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/90 text-white' : 'bg-gray-100/90 text-gray-800'}`} style={{ borderLeft: `4px solid ${rank.mainColor}` }}>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total PRs</span>
                <span className="font-bold text-xl" style={{ color: rank.highlightColor }}>{profile.githubStats?.prs || 0}</span>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/90 text-white' : 'bg-gray-100/90 text-gray-800'}`} style={{ borderLeft: `4px solid ${rank.mainColor}` }}>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Issues</span>
                <span className="font-bold text-xl" style={{ color: rank.highlightColor }}>{profile.githubStats?.issues || 0}</span>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/90 text-white' : 'bg-gray-100/90 text-gray-800'}`} style={{ borderLeft: `4px solid ${rank.mainColor}` }}>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Stars</span>
                <span className="font-bold text-xl" style={{ color: rank.highlightColor }}>{profile.githubStats?.stars || 0}</span>
              </div>
            </div>
          </div>
          
          {/* 랭크 표시 */}
          <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-700/90 text-white' : 'bg-gray-100/90 text-gray-800'}`} style={{ borderLeft: `4px solid ${rank.mainColor}` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg font-bold mr-2">{rank.emoji}</span>
                <span className="font-medium" style={{ color: rank.highlightColor }}>Rank : {rank.name}</span>
              </div>
              <div className="text-sm">
                Contributions | {new Date().getFullYear()} : <span className="font-semibold" style={{ color: rank.highlightColor }}>{profile.githubStats?.contributions || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 카드 푸터 */}
      <div className={`flex justify-between px-6 py-4 relative z-20 ${rank.headerBg} text-white text-xs text-center`}>
        <span className="text-xs">{currentTime}</span>
        <span className="text-xs">created by Please Readme</span>
      </div>
    </div>
  );
} 