import { GitHubUser, GitHubRepo } from '@/types/github';

export class GitHubService {
  private static instance: GitHubService;
  private readonly baseUrl = 'https://api.github.com';

  private constructor() {}

  public static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService();
    }
    return GitHubService.instance;
  }

  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('사용자를 찾을 수 없습니다');
        }
        throw new Error('GitHub API 요청 중 오류가 발생했습니다');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('GitHub API 요청 중 오류가 발생했습니다');
    }
  }

  public async getUserData(username: string): Promise<GitHubUser> {
    return this.fetchWithErrorHandling<GitHubUser>(`${this.baseUrl}/users/${username}`);
  }

  public async getUserRepos(username: string): Promise<GitHubRepo[]> {
    return this.fetchWithErrorHandling<GitHubRepo[]>(
      `${this.baseUrl}/users/${username}/repos?sort=updated&per_page=100`
    );
  }

  public async getUserStats(username: string): Promise<GitHubUser & { repos: GitHubRepo[] }> {
    const [userData, repos] = await Promise.all([
      this.getUserData(username),
      this.getUserRepos(username),
    ]);

    return {
      ...userData,
      repos,
    };
  }
} 