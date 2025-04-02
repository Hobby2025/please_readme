import { GitHubUser, GitHubRepo } from '@/types/github';

interface ProfileData extends GitHubUser {
  repos: GitHubRepo[];
}

export class ProfileService {
  private static instance: ProfileService;
  private readonly storageKeyPrefix = 'profile_';

  private constructor() {}

  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  public saveProfile(username: string, data: ProfileData): void {
    try {
      localStorage.setItem(
        `${this.storageKeyPrefix}${username}`,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('프로필 저장 실패:', error);
    }
  }

  public getProfile(username: string): ProfileData | null {
    try {
      const data = localStorage.getItem(`${this.storageKeyPrefix}${username}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('프로필 조회 실패:', error);
      return null;
    }
  }

  public deleteProfile(username: string): void {
    try {
      localStorage.removeItem(`${this.storageKeyPrefix}${username}`);
    } catch (error) {
      console.error('프로필 삭제 실패:', error);
    }
  }

  public getAllProfiles(): { [key: string]: ProfileData } {
    try {
      const profiles: { [key: string]: ProfileData } = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.storageKeyPrefix)) {
          const username = key.slice(this.storageKeyPrefix.length);
          const data = this.getProfile(username);
          if (data) {
            profiles[username] = data;
          }
        }
      }
      return profiles;
    } catch (error) {
      console.error('프로필 목록 조회 실패:', error);
      return {};
    }
  }
} 