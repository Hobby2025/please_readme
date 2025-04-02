import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileForm } from '../ProfileForm';

const mockProfile = {
  githubUsername: 'testuser',
  name: 'Test User',
  bio: 'Test Bio',
  skills: ['React', 'TypeScript'],
  backgroundImageUrl: 'https://example.com/image.jpg',
  theme: 'light' as const,
};

describe('ProfileForm 컴포넌트', () => {
  const mockSetProfile = jest.fn();

  beforeEach(() => {
    mockSetProfile.mockClear();
  });

  it('기본 필드들이 렌더링되어야 합니다', () => {
    render(<ProfileForm profile={mockProfile} setProfile={mockSetProfile} />);
    
    expect(screen.getByLabelText('GitHub 사용자명')).toBeInTheDocument();
    expect(screen.getByLabelText('이름')).toBeInTheDocument();
    expect(screen.getByLabelText('소개')).toBeInTheDocument();
    expect(screen.getByLabelText('배경 이미지 URL')).toBeInTheDocument();
  });

  it('기존 프로필 데이터가 필드에 표시되어야 합니다', () => {
    render(<ProfileForm profile={mockProfile} setProfile={mockSetProfile} />);
    
    expect(screen.getByLabelText('GitHub 사용자명')).toHaveValue(mockProfile.githubUsername);
    expect(screen.getByLabelText('이름')).toHaveValue(mockProfile.name);
    expect(screen.getByLabelText('소개')).toHaveValue(mockProfile.bio);
    expect(screen.getByLabelText('배경 이미지 URL')).toHaveValue(mockProfile.backgroundImageUrl);
  });

  it('기술 스택이 올바르게 표시되어야 합니다', () => {
    render(<ProfileForm profile={mockProfile} setProfile={mockSetProfile} />);
    
    mockProfile.skills.forEach(skill => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });

  it('새로운 기술 스택을 추가할 수 있어야 합니다', () => {
    render(<ProfileForm profile={mockProfile} setProfile={mockSetProfile} />);
    
    const input = screen.getByLabelText('기술 스택');
    fireEvent.change(input, { target: { value: 'Python' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockSetProfile).toHaveBeenCalledWith({
      ...mockProfile,
      skills: [...mockProfile.skills, 'Python'],
    });
  });

  it('기술 스택을 제거할 수 있어야 합니다', () => {
    render(<ProfileForm profile={mockProfile} setProfile={mockSetProfile} />);
    
    const removeButton = screen.getByRole('button', { name: /React 삭제/ });
    fireEvent.click(removeButton);
    
    expect(mockSetProfile).toHaveBeenCalledWith({
      ...mockProfile,
      skills: mockProfile.skills.filter(skill => skill !== 'React'),
    });
  });

  it('입력 필드 변경 시 setProfile이 호출되어야 합니다', () => {
    render(<ProfileForm profile={mockProfile} setProfile={mockSetProfile} />);
    
    const nameInput = screen.getByLabelText('이름');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    
    expect(mockSetProfile).toHaveBeenCalledWith({
      ...mockProfile,
      name: 'New Name',
    });
  });

  it('비활성화 상태일 때 입력이 불가능해야 합니다', () => {
    render(<ProfileForm profile={mockProfile} setProfile={mockSetProfile} disabled />);
    
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toBeDisabled();
    });

    const removeButtons = screen.queryAllByRole('button', { name: /삭제/ });
    expect(removeButtons).toHaveLength(0);
  });
}); 