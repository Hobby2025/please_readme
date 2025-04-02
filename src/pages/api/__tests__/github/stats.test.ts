import { createMocks } from 'node-mocks-http';
import handler from '../../github/stats';
import { GitHubService } from '../../../../services/github';

jest.mock('../../../../services/github');

describe('GitHub Stats API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET 요청이 아닌 경우 405 에러를 반환해야 합니다', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      query: { username: 'test' },
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

  it('GitHub 통계를 성공적으로 가져와야 합니다', async () => {
    const mockStats = {
      stars: 100,
      commits: 50,
      prs: 20,
      issues: 10,
    };

    (GitHubService.getInstance as jest.Mock).mockReturnValue({
      getUserStats: jest.fn().mockResolvedValue(mockStats),
    });

    const { req, res } = createMocks({
      method: 'GET',
      query: { username: 'test' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(mockStats);
  });

  it('GitHub API 호출 실패 시 500 에러를 반환해야 합니다', async () => {
    const error = new Error('API 호출 실패');

    (GitHubService.getInstance as jest.Mock).mockReturnValue({
      getUserStats: jest.fn().mockRejectedValue(error),
    });

    const { req, res } = createMocks({
      method: 'GET',
      query: { username: 'test' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'GitHub 통계를 가져오는데 실패했습니다.',
      error: error.message,
    });
  });
}); 