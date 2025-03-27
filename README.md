# GitHub 프로필 이미지 생성기

이 프로젝트는 GitHub 프로필용 이미지를 생성하는 웹 애플리케이션입니다. 사용자의 GitHub 정보와 기술 스택을 조합하여 시각적으로 매력적인 이미지를 생성합니다.

## 주요 기능

- GitHub 사용자 정보 (사용자명, 이름, 자기소개) 입력
- 기술 스택 추가 및 표시
- 라이트/다크 테마 선택
- GitHub 기여도 그래프 표시
- 프로필 이미지 생성 및 URL 복사
- 마크다운 및 HTML 코드 생성

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
4. 생성된 이미지를 확인하고 URL, 마크다운 또는 HTML 코드를 복사합니다.
5. 복사한 코드를 GitHub 프로필 README.md 파일에 붙여넣습니다.

## 기술 스택

- Next.js
- React
- TypeScript
- Tailwind CSS
- Canvas API
- GitHub API

## GitHub 프로필 README 설정 방법

GitHub 프로필 README를 설정하려면:

1. GitHub에서 자신의 사용자명과 동일한 이름의 새 저장소를 생성합니다.
2. 저장소를 공개(Public)로 설정합니다.
3. README.md 파일을 초기화하는 옵션을 선택합니다.
4. 생성된 README.md 파일에 이 애플리케이션을 통해 생성한 마크다운 코드를 붙여넣습니다.
5. 변경사항을 커밋하면 프로필 페이지에 이미지가 표시됩니다.

## 라이선스

MIT
