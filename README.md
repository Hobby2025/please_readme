# GitHub 프로필 이미지 생성기

이 프로젝트는 GitHub 프로필용 이미지를 SVG 형식으로 생성하는 웹 애플리케이션입니다. 사용자의 GitHub 정보와 기술 스택을 조합하여 시각적으로 매력적인 프로필 카드를 생성합니다.

## 주요 기능

- GitHub 사용자 정보 (사용자명, 이름, 자기소개) 입력
- 기술 스택 추가 및 표시
- 라이트/다크 테마 선택
- GitHub 통계 데이터 포함한 프로필 카드 생성
- 마크다운 코드 생성 및 복사

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

## 사용 방법

1. GitHub 사용자명과 프로필 정보를 입력합니다.
2. 기술 스택을 추가합니다.
3. 테마를 선택합니다.
4. "이미지 생성하기" 버튼을 클릭하여 GitHub 프로필 이미지를 생성합니다.
5. "GitHub 프로필 코드 복사" 버튼을 클릭하여 마크다운 코드를 복사합니다.
6. 복사한 코드를 GitHub 프로필 README.md 파일에 붙여넣습니다.

## API 사용법

SVG 기반 GitHub 프로필 카드는 다음 엔드포인트를 통해 직접 사용할 수 있습니다:

```
https://please-readme.vercel.app/api/github-stats?username=YOUR_USERNAME&theme=dark|light
```

### 매개변수

- `username` (필수): GitHub 사용자명
- `theme`: `dark` 또는 `light` (기본값: `light`)
- `hide_border`: `true` 또는 `false` (기본값: `false`)
- `hide_title`: `true` 또는 `false` (기본값: `false`)
- `show_icons`: 아이콘 표시 여부 (true|false)
- `t`: 캐시 무효화를 위한 타임스탬프 값 (선택 사항)

## 기술 스택

- Next.js
- React
- TypeScript
- Tailwind CSS
- SVG
- GitHub API
- Edge Runtime

## GitHub 프로필 README 설정 방법

GitHub 프로필 README를 설정하려면:

1. GitHub에서 자신의 사용자명과 동일한 이름의 새 저장소를 생성합니다.
2. 저장소를 공개(Public)로 설정합니다.
3. README.md 파일을 초기화하는 옵션을 선택합니다.
4. 생성된 README.md 파일에 이 애플리케이션을 통해 생성한 마크다운 코드를 붙여넣습니다.
5. 변경사항을 커밋하면 프로필 페이지에 이미지가 표시됩니다.

## 최근 변경사항

- HTML/Canvas 기반 이미지 생성에서 SVG 기반으로 전환하여 GitHub README 호환성 개선
- 기존 디자인을 유지하면서 SVG 형식으로 제공하여 가독성과 로딩 속도 향상
- 서버리스 환경에서 더 안정적으로 동작하도록 최적화

## 라이선스

MIT
