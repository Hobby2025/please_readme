import React from 'react';

interface FontPreviewProps {
  fontFamily: string;
}

const FontPreview: React.FC<FontPreviewProps> = ({ fontFamily }) => {
  // 한글 예시 문구
  const previewText = "안녕하세요, 멋진 GitHub 프로필을 만들어보세요!";
  
  // 영문 예시 문구
  const previewTextEn = "Hello, Let's make a great GitHub profile!";
  
  // 숫자와 특수문자 예시
  const previewTextNum = "1234567890 !@#$%^&*()";
  
  // 폰트 이름 표시
  const fontDisplayName = () => {
    switch (fontFamily) {
      case 'BookkMyungjo':
        return '북크 명조';
      case 'Pretendard':
        return '프리텐다드';
      case 'HSSanTokki2.0':
        return 'HS산토끼체2.0';
      case 'BMJUA_ttf':
        return '배민 주아체';
      case 'BMDOHYEON_ttf':
        return '배민 도현체';
      default:
        return fontFamily;
    }
  };
  
  // CSS에 적용할 실제 폰트 이름 매핑
  const getCssFontFamily = () => {
    switch (fontFamily) {
      case 'BookkMyungjo':
        return 'BookkMyungjo';
      case 'Pretendard':
        return 'Pretendard';
      case 'HSSanTokki2.0':
        return 'HSSanTokki';
      case 'BMJUA_ttf':
        return 'BMJUA';
      case 'BMDOHYEON_ttf':
        return 'BMDOHYEON';
      default:
        return fontFamily;
    }
  };

  return (
    <div className="mt-3 p-3 border border-[#F2D479] rounded-md bg-white/80">
      <div className="text-sm font-medium text-gray-700 mb-2">
        {fontDisplayName()} 미리보기
      </div>
      <div 
        className="text-[#F29F05] text-base mb-1"
        style={{ fontFamily: getCssFontFamily() }}
      >
        {previewText}
      </div>
      <div 
        className="text-[#F29F05] text-sm mb-1"
        style={{ fontFamily: getCssFontFamily() }}
      >
        {previewTextEn}
      </div>
      <div 
        className="text-[#F29F05] text-sm"
        style={{ fontFamily: getCssFontFamily() }}
      >
        {previewTextNum}
      </div>
    </div>
  );
};

export default FontPreview; 