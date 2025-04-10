# GitHub 프로필 카드 생성기

GitHub 프로필 정보와 활동 통계를 기반으로 커스터마이징 가능한 이미지 카드를 생성하는 웹 애플리케이션입니다. Vercel OG Image Generation을 사용하여 서버사이드에서 이미지를 생성합니다.

## 기능

- GitHub 사용자 정보 및 활동 통계 (커밋, 스타, PR, 이슈) 표시
- 프로필 정보 (이름, 소개) 커스터마이징
- 기술 스택 목록 표시
- 테마 선택 (라이트/다크)
- 배경 이미지 및 투명도 커스터마이징
- API 엔드포인트를 통한 프로필 카드 이미지 생성 (`/api/card?username=...`)
- 생성된 이미지 미리보기 및 URL 제공

## 기술 스택

- Next.js
- React
- TypeScript
- Tailwind CSS
- `@vercel/og` (Satori) for Image Generation
- GitHub API

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
```

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

## 라이선스

MIT

현재 깃허브 camo 이슈로 잠정 중단중
