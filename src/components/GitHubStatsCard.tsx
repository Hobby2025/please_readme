import { Star, GitCommit, GitPullRequest, AlertCircle, Activity } from 'lucide-react';

interface GitHubStats {
  stars: number;
  commits: number;
  prs: number;
  issues: number;
  contributions: number;
  currentYearCommits: number;
  languages: { [key: string]: number };
}

interface GitHubStatsCardProps {
  stats: GitHubStats;
}

export default function GitHubStatsCard({ stats }: GitHubStatsCardProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">GitHub 통계</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Star className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">총 스타</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.stars}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <GitCommit className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{currentYear}년 커밋</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.currentYearCommits}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <GitPullRequest className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">총 PR</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.prs}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">총 이슈</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.issues}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Activity className="w-5 h-5 text-purple-500" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">기여도</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.contributions}</p>
          </div>
        </div>
      </div>
      
      {Object.keys(stats.languages).length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">주요 언어</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.languages)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([lang, count]) => (
                <span
                  key={lang}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                >
                  {lang} ({count})
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
} 