import { createMocks } from 'node-mocks-http';
import handler from '../stats';
// import { GitHubService } from '@/services/github'; // 경로 수정 및 jest.mock 내부에서 사용

// mock 함수 변수 제거
// const mockGetUserStats = jest.fn();

// GitHubService 및 getInstance 모킹 (내부에서 jest.fn() 사용)
jest.mock('@/services/github', () => ({
  GitHubService: {
    getInstance: jest.fn().mockReturnValue({
      getUserStats: jest.fn(), // 여기서 직접 jest.fn() 호출
    }),
  },
}));

// 모킹된 함수에 접근하기 위한 방법 수정
import { GitHubService } from '@/services/github';
const mockGetUserStats = GitHubService.getInstance().getUserStats as jest.Mock;

describe('GitHub 통계 API', () => {
  beforeEach(() => {
    // jest.clearAllMocks(); 대신 mock 함수 기록만 초기화
    mockGetUserStats.mockClear();
  });

  it('GET 요청이 아닌 경우 405 에러를 반환해야 합니다', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      query: { username: 'testuser' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      message: '허용되지 않는 메서드입니다.',
    });
  });

  it('username이 없는 경우 400 에러를 반환해야 합니다', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'username이 필요합니다.',
    });
  });

  it('유효한 username으로 요청 시 통계를 반환해야 합니다', async () => {
    const mockStats = {
      followers: 100,
      following: 50,
      publicRepos: 30,
      totalStars: 500,
    };
    mockGetUserStats.mockResolvedValue(mockStats);

    const { req, res } = createMocks({
      method: 'GET',
      query: { username: 'testuser' },
    });

    await handler(req, res);

    expect(mockGetUserStats).toHaveBeenCalledWith('testuser');
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(mockStats);
  });

  it('에러 발생 시 500 에러를 반환해야 합니다', async () => {
    const errorMessage = 'GitHub 통계를 가져오는데 실패했습니다.';
    const apiError = new Error('API 호출 실패');
    mockGetUserStats.mockRejectedValue(apiError);

    const { req, res } = createMocks({
      method: 'GET',
      query: { username: 'testuser' },
    });

    await handler(req, res);

    expect(mockGetUserStats).toHaveBeenCalledWith('testuser');
    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      message: errorMessage,
      error: apiError.message,
    });
  });
}); 