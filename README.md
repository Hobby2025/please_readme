# GitHub 프로필 카드 생성기

GitHub 프로필 정보와 활동 통계를 기반으로 커스터마이징 가능한 이미지 카드를 생성하는 웹 애플리케이션입니다. Vercel OG Image Generation을 사용하여 서버사이드에서 이미지를 생성합니다.

## 기능

- GitHub 사용자 정보 및 활동 통계 (커밋, 스타, PR, 이슈) 표시
- 프로필 정보 (이름, 소개) 커스터마이징
- 기술 스택 목록 표시
- 왜곡 없는 이미지 표시
- API 엔드포인트를 통한 프로필 카드 이미지 생성 (`/api/card?username=...`)
- 생성된 이미지 미리보기 및 마크다운 코드 복사 기능

## 기술 스택

- `Next.js`
- `React`
- `TypeScript`
- `Tailwind CSS`
- `@vercel/og` (Satori) for Image Generation
- `GitHub API`

## 시작하기

1. 저장소 클론
```bash
git clone https://github.com/yourusername/github-profile-card-generator.git
cd github-profile-card-generator
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm run dev
```

4. 브라우저에서 확인
```
http://localhost:3000
```

## 환경 변수

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```
GITHUB_TOKEN=your_github_token
NEXT_PUBLIC_API_BASE_URL=your_deployment_url (e.g., http://localhost:3000 for development)
```

## 프로필 카드 사용법

1. 웹 애플리케이션에서 GitHub 사용자명과 기타 정보를 입력합니다.
2. '카드 생성 / 업데이트' 버튼을 클릭하여 카드를 생성합니다.
3. '마크다운 복사' 버튼을 사용하여 마크다운 코드를 복사합니다.
4. GitHub 프로필 README.md에 코드를 붙여넣어 카드를 표시합니다.

## 카드 사양

- **지원 기술 스택**: React, TypeScript, JavaScript, Python, Java 등 다양한 기술 스택 아이콘 지원
- **랭크 표시**: GitHub 활동에 따른 랭크 시스템 (S, A+, A, A-, B+, B, B-, C+, C)

## 최근 업데이트

- 프로필 카드 디자인 개선 (더 큰 아이콘 및 텍스트)
- 이미지 표시 문제 해결 (종횡비 유지하여 왜곡 방지)
- 기술 스택 배지 시각적 개선

## 버전 관리

커밋 메시지에 따라 자동으로 버전이 업데이트됩니다:

1. **일반 업데이트** (z 증가)
   - 일반적인 커밋
   - 예: `fix: 버그 수정`

2. **마이너 업데이트** (y 증가)
   - 커밋 메시지에 `#minor` 포함
   - 예: `feat: 새로운 기능 추가 #minor`

3. **메이저 업데이트** (x 증가)
   - 커밋 메시지에 `#major` 포함
   - 예: `feat: 주요 기능 변경 #major`

4. **버전 업데이트 제외**
   - 커밋 메시지에 `#noversion` 포함

## 알려진 이슈
- 프로필폼에서 선택한 기술스텍이 공백으로 입력되는 상태
- 기술 스택의 줄 수가 늘어나면 카드 하단이 짤리는 상태
- 캐시가 갱신될때 새로고침을 해야 이미지가 보이는 현상

## 라이선스

MIT
