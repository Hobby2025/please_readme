import { ProfileService } from '../profile';
import { mockUserData } from '@/mocks/github';

describe('ProfileService', () => {
  let profileService: ProfileService;
  const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
      getItem(key: string) {
        return store[key] || null;
      },
      setItem(key: string, value: string) {
        store[key] = value.toString();
      },
      removeItem(key: string) {
        delete store[key];
      },
      clear() {
        store = {};
      },
      key(index: number): string | null {
        return Object.keys(store)[index] || null;
      },
      get length() {
        return Object.keys(store).length;
      }
    };
  })();

  beforeEach(() => {
    localStorageMock.clear();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true
    });
    jest.spyOn(localStorageMock, 'getItem');
    jest.spyOn(localStorageMock, 'setItem');
    jest.spyOn(localStorageMock, 'removeItem');
    jest.spyOn(localStorageMock, 'clear');

    profileService = ProfileService.getInstance();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('saveProfile', () => {
    it('프로필 데이터를 저장합니다', () => {
      const profileData = { ...mockUserData, repos: [] };
      profileService.saveProfile('testuser', profileData);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'profile_testuser',
        JSON.stringify(profileData)
      );
    });

    it('이미 존재하는 프로필을 덮어씁니다', () => {
      const initialData = { ...mockUserData, repos: [] };
      const newData = { ...mockUserData, name: 'Updated Name', repos: [] };

      profileService.saveProfile('testuser', initialData);
      profileService.saveProfile('testuser', newData);

      expect(localStorageMock.setItem).toHaveBeenLastCalledWith(
        'profile_testuser',
        JSON.stringify(newData)
      );
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
    });
  });

  describe('getProfile', () => {
    it('저장된 프로필 데이터를 조회합니다', () => {
      const profileData = { ...mockUserData, repos: [] };
      localStorageMock.setItem('profile_testuser', JSON.stringify(profileData));

      const result = profileService.getProfile('testuser');

      expect(result).toEqual(profileData);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('profile_testuser');
    });

    it('저장된 프로필이 없을 경우 null을 반환합니다', () => {
      const result = profileService.getProfile('nonexistent');
      expect(result).toBeNull();
    });

    it('잘못된 JSON 데이터가 저장된 경우 null을 반환합니다', () => {
      localStorageMock.setItem('profile_testuser', 'invalid json');
      const result = profileService.getProfile('testuser');
      expect(result).toBeNull();
    });
  });

  describe('deleteProfile', () => {
    it('프로필 데이터를 삭제합니다', () => {
      localStorageMock.setItem('profile_testuser', JSON.stringify({}));
      profileService.deleteProfile('testuser');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('profile_testuser');
      expect(localStorageMock.getItem('profile_testuser')).toBeNull();
    });

    it('존재하지 않는 프로필 삭제 시도 시 에러를 던지지 않습니다', () => {
      expect(() => {
        profileService.deleteProfile('nonexistent');
      }).not.toThrow();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('profile_nonexistent');
    });
  });

  describe('getAllProfiles', () => {
    it('모든 저장된 프로필을 조회합니다', () => {
      const profiles = {
        user1: { ...mockUserData, repos: [] },
        user2: { ...mockUserData, login: 'user2', repos: [] }
      };

      localStorageMock.setItem('profile_user1', JSON.stringify(profiles.user1));
      localStorageMock.setItem('profile_user2', JSON.stringify(profiles.user2));
      localStorageMock.setItem('other_key', 'some value');

      const result = profileService.getAllProfiles();
      expect(result).toEqual(profiles);
    });

    it('저장된 프로필이 없을 경우 빈 객체를 반환합니다', () => {
      const result = profileService.getAllProfiles();
      expect(result).toEqual({});
    });
  });
}); 