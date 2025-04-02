import { render, screen, fireEvent } from '@testing-library/react';
import ProfileCard from '../ProfileCard';
import { GitHubStats } from '@/types/profile';

describe('ProfileCard 컴포넌트', () => {
  const mockProfile = {
    githubUsername: 'testuser',
    name: 'Test User',
    bio: 'Test Bio',
    skills: ['React', 'TypeScript', 'Python'],
    backgroundImageUrl: 'https://example.com/image.jpg',
    theme: 'light' as const,
  };

  const mockStats: GitHubStats = {
    followers: 100,
    following: 50,
    publicRepos: 30,
    totalStars: 500,
    contributions: 1000,
    avatarUrl: 'https://avatars.githubusercontent.com/u/123456?v=4',
    name: 'Test User',
    bio: 'Test Bio',
    location: 'Seoul, Korea',
    company: 'Test Company',
    twitterUsername: 'testuser',
    blog: 'https://testuser.dev',
    email: 'test@example.com',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  it('프로필 정보가 올바르게 렌더링되어야 합니다', () => {
    render(<ProfileCard profile={mockProfile} stats={mockStats} loading={false} />);
    
    expect(screen.getByText(mockProfile.name)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.bio)).toBeInTheDocument();
    expect(screen.getByText(`@${mockProfile.githubUsername}`)).toBeInTheDocument();
  });

  it('GitHub 통계가 올바르게 표시되어야 합니다', () => {
    render(<ProfileCard profile={mockProfile} stats={mockStats} loading={false} />);
    
    expect(screen.getByText(mockStats.followers.toString())).toBeInTheDocument();
    expect(screen.getByText('팔로워')).toBeInTheDocument();
    expect(screen.getByText(mockStats.following.toString())).toBeInTheDocument();
    expect(screen.getByText('팔로잉')).toBeInTheDocument();
    expect(screen.getByText(mockStats.publicRepos.toString())).toBeInTheDocument();
    expect(screen.getByText('저장소')).toBeInTheDocument();
    expect(screen.getByText(mockStats.totalStars.toString())).toBeInTheDocument();
    expect(screen.getByText('스타')).toBeInTheDocument();
  });

  it('기술 스택이 올바르게 표시되어야 합니다', () => {
    render(<ProfileCard profile={mockProfile} stats={mockStats} loading={false} />);
    
    mockProfile.skills.forEach(skill => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });

  it('배경 이미지가 올바르게 표시되어야 합니다', () => {
    render(<ProfileCard profile={mockProfile} stats={mockStats} loading={false} />);
    
    const backgroundImage = screen.getByRole('img', { name: 'Background' });
    expect(backgroundImage).toHaveAttribute('src', mockProfile.backgroundImageUrl);
  });

  it('다크 모드에서 올바른 스타일이 적용되어야 합니다', () => {
    const darkProfile = { ...mockProfile, theme: 'dark' as const };
    render(<ProfileCard profile={darkProfile} stats={mockStats} loading={false} />);
    
    expect(screen.getByText(mockProfile.name)).toHaveClass('dark:text-white');
    expect(screen.getByText(mockProfile.bio)).toHaveClass('dark:text-gray-300');
  });

  it('이미지 다운로드 버튼이 클릭되면 다운로드 함수가 호출되어야 합니다', () => {
    const mockDownload = jest.fn();
    render(<ProfileCard profile={mockProfile} stats={mockStats} loading={false} onDownload={mockDownload} />);
    
    const downloadButton = screen.getByRole('button', { name: /다운로드/i });
    fireEvent.click(downloadButton);
    
    expect(mockDownload).toHaveBeenCalledTimes(1);
  });

  it('GitHub 프로필 링크가 올바른 URL을 가리켜야 합니다', () => {
    render(<ProfileCard profile={mockProfile} stats={mockStats} loading={false} />);
    
    const profileLink = screen.getByRole('link', { name: /GitHub 프로필/i });
    expect(profileLink).toHaveAttribute('href', `https://github.com/${mockProfile.githubUsername}`);
  });
}); 