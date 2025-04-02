import { ImageService } from '../image';
import html2canvas from 'html2canvas';

jest.mock('html2canvas');

describe('ImageService', () => {
  let imageService: ImageService;
  let mockElement: HTMLElement;
  let mockLink: { href: string; download: string; click: jest.Mock; remove: jest.Mock };

  beforeEach(() => {
    imageService = ImageService.getInstance();
    mockElement = document.createElement('div');
    mockElement.id = 'profile-card';
    document.body.appendChild(mockElement);

    mockLink = {
      href: '',
      download: '',
      click: jest.fn(),
      remove: jest.fn(),
    };

    global.URL.createObjectURL = jest.fn(() => 'blob:test');
    global.URL.revokeObjectURL = jest.fn();

    document.createElement = jest.fn().mockReturnValue(mockLink);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });

  afterEach(() => {
    document.body.removeChild(mockElement);
    jest.clearAllMocks();
  });

  describe('captureElement', () => {
    it('요소를 이미지로 캡처합니다', async () => {
      const mockCanvas = document.createElement('canvas');
      const mockToDataURL = jest.fn().mockReturnValue('data:image/png;base64,test');
      mockCanvas.toDataURL = mockToDataURL;

      (html2canvas as jest.Mock).mockResolvedValue(mockCanvas);

      const result = await imageService.captureElement('profile-card');

      expect(html2canvas).toHaveBeenCalledWith(mockElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      expect(mockToDataURL).toHaveBeenCalledWith('image/png');
      expect(result).toBe('data:image/png;base64,test');
    });

    it('요소를 찾을 수 없을 때 에러를 던집니다', async () => {
      await expect(imageService.captureElement('nonexistent')).rejects.toThrow(
        '요소를 찾을 수 없습니다'
      );
    });

    it('캡처 실패 시 에러를 던집니다', async () => {
      (html2canvas as jest.Mock).mockRejectedValue(new Error('Capture failed'));

      await expect(imageService.captureElement('profile-card')).rejects.toThrow(
        '이미지 생성 중 오류가 발생했습니다'
      );
    });
  });

  describe('downloadImage', () => {
    it('이미지를 다운로드합니다', async () => {
      const blob = new Blob(['test'], { type: 'image/png' });
      await imageService.downloadImage(blob, 'profile.png');

      expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
      expect(mockLink.href).toBe('blob:test');
      expect(mockLink.download).toBe('profile.png');
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.remove).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test');
    });

    it('다운로드 실패 시 에러를 던집니다', async () => {
      const error = new Error('다운로드 실패');
      mockLink.click.mockImplementation(() => {
        throw error;
      });

      const blob = new Blob(['test'], { type: 'image/png' });
      await expect(imageService.downloadImage(blob, 'profile.png')).rejects.toThrow('이미지 다운로드에 실패했습니다');
    });
  });
}); 