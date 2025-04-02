import { createMocks } from 'node-mocks-http';
import handler from '../generate';
// import { ImageService } from '@/services/image'; // 경로 수정 및 jest.mock 내부에서 사용

// mock 함수 변수 제거
// const mockGenerateProfileImage = jest.fn();

// ImageService 및 getInstance 모킹 (내부에서 jest.fn() 사용)
jest.mock('@/services/image', () => ({
  ImageService: {
    getInstance: jest.fn().mockReturnValue({
      generateProfileImage: jest.fn(), // 여기서 직접 jest.fn() 호출
    }),
  },
}));

// 모킹된 함수에 접근하기 위한 방법 수정
import { ImageService } from '@/services/image';
const mockGenerateProfileImage = ImageService.getInstance().generateProfileImage as jest.Mock;

describe('이미지 생성 API', () => {
  beforeEach(() => {
    // jest.clearAllMocks(); 대신 mock 함수 기록만 초기화
    mockGenerateProfileImage.mockClear(); 
  });

  it('POST 요청이 아닌 경우 405 에러를 반환해야 합니다', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      body: {
        profile: { githubUsername: 'testuser' },
        stats: { followers: 100 },
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      message: '허용되지 않는 메서드입니다.',
    });
  });

  it('profile이나 stats가 없는 경우 400 에러를 반환해야 합니다', async () => {
    const mockProfile = {
      githubUsername: 'testuser',
      name: 'Test User',
      bio: 'Test Bio',
      skills: ['React', 'TypeScript'],
      theme: 'light' as const, // 타입 명시 추가
    };
    const mockStats = {
      followers: 100,
      following: 50,
      publicRepos: 30,
      totalStars: 500,
      // GitHubStats에 필요한 나머지 필드 추가 (실제 API 핸들러 로직에 따라 필요할 수 있음)
      contributions: 1000,
      avatarUrl: 'https://avatar.url',
      name: 'Test User', // 중복되지만 명시
      bio: 'Test Bio', // 중복되지만 명시
      location: '', company: '', twitterUsername: '', blog: '', email: '', createdAt: '', updatedAt: ''
    };

    // Test case 1: Missing profile
    const { req, res } = createMocks({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { stats: mockStats }, // Only stats
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    // Verify the expected message for missing data
    expect(JSON.parse(res._getData())).toEqual({
      message: '프로필과 통계 정보가 필요합니다.',
    });

    // Test case 2: Missing stats
    const { req: req2, res: res2 } = createMocks({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { profile: mockProfile }, // Only profile
    });
    await handler(req2, res2);
    expect(res2._getStatusCode()).toBe(400);
    // Verify the expected message for missing data
    expect(JSON.parse(res2._getData())).toEqual({
      message: '프로필과 통계 정보가 필요합니다.',
    });

    // Test case 3: Missing both
    const { req: req3, res: res3 } = createMocks({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {}, // Both missing
    });
    await handler(req3, res3);
    expect(res3._getStatusCode()).toBe(400);
    // Verify the expected message for missing data
    expect(JSON.parse(res3._getData())).toEqual({
      message: '프로필과 통계 정보가 필요합니다.',
    });
  });

  it('유효한 데이터로 요청 시 이미지 URL을 반환해야 합니다', async () => {
    const mockImageUrl = 'https://example.com/image.png';
    const mockProfile = {
      githubUsername: 'testuser',
      name: 'Test User',
      bio: 'Test Bio',
      skills: ['React', 'TypeScript'],
      theme: 'light' as const, // 타입 명시 추가
    };
    const mockStats = {
      followers: 100,
      following: 50,
      publicRepos: 30,
      totalStars: 500,
      // GitHubStats에 필요한 나머지 필드 추가 (실제 API 핸들러 로직에 따라 필요할 수 있음)
      contributions: 1000,
      avatarUrl: 'https://avatar.url',
      name: 'Test User', // 중복되지만 명시
      bio: 'Test Bio', // 중복되지만 명시
      location: '', company: '', twitterUsername: '', blog: '', email: '', createdAt: '', updatedAt: ''
    };
    // generateProfileImage 모킹: 성공 시 mockImageUrl 반환
    mockGenerateProfileImage.mockResolvedValue(mockImageUrl); 

    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        profile: mockProfile,
        stats: mockStats,
      },
    });

    await handler(req, res);

    // API 핸들러가 200을 반환하고, 서비스 함수가 호출되었는지 확인
    expect(res._getStatusCode()).toBe(200); 
    expect(mockGenerateProfileImage).toHaveBeenCalledWith(mockProfile, mockStats); 
    expect(JSON.parse(res._getData())).toEqual({ imageUrl: mockImageUrl });
  });

  it('에러 발생 시 500 에러를 반환해야 합니다', async () => {
    const apiError = new Error('Internal Server Error'); // 실제 던져지는 에러 메시지
    mockGenerateProfileImage.mockRejectedValue(apiError);

    const mockProfile = { githubUsername: 'testuser', name:'', bio:'', skills:[], theme: 'light' as const };
    const mockStats: any = { followers: 100 };

    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        profile: mockProfile,
        stats: mockStats, 
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(mockGenerateProfileImage).toHaveBeenCalledWith(mockProfile, mockStats);
    // API 핸들러의 catch 블록이 반환하는 실제 메시지 검증
    expect(JSON.parse(res._getData())).toEqual({ message: apiError.message }); 
  });
}); 