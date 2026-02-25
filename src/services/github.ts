import { Octokit } from '@octokit/rest';
import { GitHubStats } from '../types';

export class GitHubService {
  private static instance: GitHubService;
  private octokit: Octokit;
  // Simple in-memory cache to prevent redundant search API calls
  private statsCache: Map<string, { stats: GitHubStats; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
  }

  public static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService();
    }
    return GitHubService.instance;
  }

  public async getStats(username: string): Promise<GitHubStats> {
    // Return cached data if available and fresh
    const cached = this.statsCache.get(username);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.stats;
    }

    const token = process.env.GITHUB_TOKEN;
    
    // Create octokit instance within the request to ensure environment variables are fresh
    const octokit = new Octokit({
      auth: token,
      request: {
        timeout: 5000, // 5 second timeout for requests
      }
    });

    try {
      const { data: user } = await octokit.users.getByUsername({ username });
      
      // Optimization: Fetch only the first 100 repositories to calculate stars
      // Most users don't have > 100 public repos with significant stars
      const { data: repos } = await octokit.repos.listForUser({
        username,
        per_page: 100,
        sort: 'updated'
      });

      const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
      
      // Calculate top languages from repos
      const languageMap: Record<string, number> = {};
      repos.forEach(repo => {
        if (repo.language) {
          languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
        }
      });
      const topLanguages = Object.entries(languageMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([lang]) => lang);
      
      // Fetch search data for commits, PRs, and Issues with safe fallbacks
      // Search API can be flaky or slow, so we provide default values if it fails
      const fetchSafeCount = async (promise: Promise<any>) => {
        try {
          const result = await promise;
          return result.data.total_count || 0;
        } catch (err: any) {
          // Silent 403 Forbidden (Secondary rate limit or Search API restriction)
          if (err.status === 403) {
            return 0;
          }
          // Silent rate limit exceeded
          if (err.message?.includes('rate limit exceeded')) {
             return 0; 
          }
          console.warn(`Search API error: ${err.message || String(err)}`);
          return 0;
        }
      };

      const [totalCommits, totalPRs, totalIssues] = await Promise.all([
        fetchSafeCount(octokit.search.commits({ q: `author:${username}`, per_page: 1 })),
        fetchSafeCount(octokit.search.issuesAndPullRequests({ q: `author:${username} type:pr`, per_page: 1 })),
        fetchSafeCount(octokit.search.issuesAndPullRequests({ q: `author:${username} type:issue`, per_page: 1 })),
      ]);

      // Ultra-Conservative Ranking logic: Prioritizes Stars(50) and PRs(20). 
      // S+ rank is truly prestigious, requiring significant impact.
      const score = (totalStars * 50) + (totalPRs * 20) + (totalIssues * 5) + (totalCommits * 0.01);
      
      let level = 'C';
      if (score >= 100000) level = 'S+';
      else if (score >= 50000) level = 'S';
      else if (score >= 20000) level = 'A+';
      else if (score >= 10000) level = 'A';
      else if (score >= 5000) level = 'B+';
      else if (score >= 2000) level = 'B';
      else if (score >= 1000) level = 'C+';

      const stats = {
        username: user.login,
        name: user.name || user.login,
        bio: user.bio,
        avatarUrl: user.avatar_url,
        totalStars,
        totalCommits,
        totalPRs,
        totalIssues,
        followers: user.followers || 0,
        topLanguages,
        nodeId: user.node_id,
        createdAt: user.created_at,
        rank: { level, score }
      };

      // Save to cache
      this.statsCache.set(username, { stats, timestamp: Date.now() });

      return stats;
    } catch (e: any) {
      console.error(`GitHub API error: ${e.message}`);
      throw new Error(`Failed to fetch GitHub data: ${e.message}`);
    }
  }
}
