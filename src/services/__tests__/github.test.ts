import { GitHubService } from '../github';
import { mockUserData, mockReposData } from '../../mocks/github';

// API 기본 URL 상수 정의
const GITHUB_API_BASE_URL = 'https://api.github.com';

describe('GitHubService', () => {
  let githubService: GitHubService;

  beforeEach(() => {
    githubService = GitHubService.getInstance();
    // fetch 모킹
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserData', () => {
    it('사용자 데이터를 가져옵니다', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData,
      });

      const data = await githubService.getUserData('testuser');
      expect(data).toEqual(mockUserData);
      expect(global.fetch).toHaveBeenCalledWith(
        `${GITHUB_API_BASE_URL}/users/testuser`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );
    });

    it('API 요청 실패 시 에러를 던집니다', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('GitHub API 요청 중 오류가 발생했습니다')
      );

      await expect(githubService.getUserData('testuser')).rejects.toThrow(
        'GitHub API 요청 중 오류가 발생했습니다'
      );
    });
  });

  describe('getUserRepos', () => {
    it('사용자의 저장소 목록을 가져옵니다', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockReposData),
      });

      const repos = await githubService.getUserRepos('testuser');
      expect(repos).toEqual(mockReposData);
      expect(global.fetch).toHaveBeenCalledWith(
        `${GITHUB_API_BASE_URL}/users/testuser/repos?sort=updated&per_page=100`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );
    });

    it('API 요청 실패 시 에러를 던집니다', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('GitHub API 요청 중 오류가 발생했습니다')
      );

      await expect(githubService.getUserRepos('testuser')).rejects.toThrow(
        'GitHub API 요청 중 오류가 발생했습니다'
      );
    });
  });

  describe('getUserStats', () => {
    it('사용자의 통계 정보를 가져옵니다', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUserData,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockReposData,
        });

      const stats = await githubService.getUserStats('testuser');
      
      expect(stats).toEqual({
        ...mockUserData,
        repos: mockReposData,
      });

      expect(global.fetch).toHaveBeenCalledWith(`${GITHUB_API_BASE_URL}/users/testuser`, expect.any(Object));
      expect(global.fetch).toHaveBeenCalledWith(`${GITHUB_API_BASE_URL}/users/testuser/repos?sort=updated&per_page=100`, expect.any(Object));
    });

    it('저장소 데이터 조회 실패 시 에러를 던집니다', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockUserData),
        })
        .mockRejectedValueOnce(
          new Error('GitHub API 요청 중 오류가 발생했습니다')
        );

      await expect(githubService.getUserStats('testuser')).rejects.toThrow(
        'GitHub API 요청 중 오류가 발생했습니다'
      );
    });
  });
}); 