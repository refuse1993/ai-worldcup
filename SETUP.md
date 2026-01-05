# 🚀 빠른 시작 가이드

## 1️⃣ 프로젝트 클론 및 설치

```bash
# Git 클론 (또는 프로젝트 폴더로 이동)
cd worldcup

# 의존성 설치
npm install
```

## 2️⃣ Supabase 설정 (무료)

### 2-1. Supabase 계정 생성
1. [Supabase](https://supabase.com) 접속
2. "Start your project" 클릭
3. GitHub로 로그인
4. 새 프로젝트 생성

### 2-2. 데이터베이스 스키마 생성
1. Supabase 대시보드 → SQL Editor
2. `supabase-schema.sql` 파일 내용 복사
3. SQL Editor에 붙여넣기 → 실행 (RUN)

### 2-3. API 키 복사
1. Settings → API
2. `URL` 복사 → `NEXT_PUBLIC_SUPABASE_URL`
3. `anon public` 키 복사 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3️⃣ Google AI (Gemma) 설정 (무료)

### 3-1. API 키 발급
1. [Google AI Studio](https://aistudio.google.com/apikey) 접속
2. "Create API Key" 클릭
3. API 키 복사 → `GOOGLE_GENERATIVE_AI_API_KEY`

**무료 티어 한도:**
- 분당 15 요청
- 일일 1,500 요청
- 월간 무료 (충분함!)

## 4️⃣ Tavily 검색 설정 (무료)

### 4-1. API 키 발급
1. [Tavily](https://tavily.com) 접속
2. 회원가입 후 대시보드 이동
3. API 키 복사 → `TAVILY_API_KEY`

**무료 티어 한도:**
- 월 1,000 검색
- 트래픽이 많아지면 유료 전환 검토

## 5️⃣ 환경 변수 설정

```bash
# .env.local 파일 생성
cp .env.local.example .env.local
```

`.env.local` 파일 편집:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Google AI (Gemma)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key

# Tavily Search
TAVILY_API_KEY=your_tavily_key
```

## 6️⃣ 로컬 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 7️⃣ Vercel 배포 (무료)

### 7-1. Vercel 계정 연결
1. [Vercel](https://vercel.com) 접속
2. GitHub 계정으로 로그인
3. "New Project" 클릭

### 7-2. 프로젝트 import
1. GitHub 리포지토리 선택
2. Framework Preset: **Next.js** (자동 선택됨)
3. Root Directory: `./` (기본값)

### 7-3. 환경 변수 설정
1. "Environment Variables" 섹션
2. `.env.local`의 모든 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GOOGLE_GENERATIVE_AI_API_KEY`
   - `TAVILY_API_KEY`

### 7-4. 배포
"Deploy" 버튼 클릭 → 3분 후 완성! 🎉

배포 URL: `https://your-project.vercel.app`

## 8️⃣ Google AdSense 신청 (트래픽 발생 후)

### 조건
- 일 1,000 PV 이상
- 독자적인 콘텐츠
- 6개월 이상 운영

### 신청 방법
1. [Google AdSense](https://www.google.com/adsense) 접속
2. 사이트 URL 등록
3. 승인 대기 (1-2주)
4. 승인 후 광고 코드 삽입

## 🎯 트러블슈팅

### 문제: Tavily API 오류
```
Error: Tavily API key not found
```

**해결:**
`.env.local`에 `TAVILY_API_KEY` 추가 확인

### 문제: Gemma API 오류
```
Error: Google Generative AI API key not found
```

**해결:**
1. Google AI Studio에서 API 키 재발급
2. `.env.local` 파일 재시작

### 문제: 이미지 로딩 오류

**해결:**
`next.config.mjs`의 `remotePatterns` 확인

## 📊 성능 모니터링

### Vercel Analytics (무료)
1. Vercel 대시보드 → Analytics 탭
2. 자동으로 PV, 속도 측정
3. 일 500,000 이벤트까지 무료

### Supabase 모니터링
1. Supabase 대시보드 → Database → Usage
2. 500MB까지 무료
3. 50,000 rows까지 무료

## 🚀 다음 단계

1. **SEO 최적화**: `metadata` 커스터마이징
2. **소셜 공유**: Open Graph 이미지 추가
3. **PWA**: 모바일 앱처럼 설치 가능
4. **AdSense**: 트래픽 확보 후 수익화

축하합니다! 🎉 이제 AI 이상형 월드컵이 운영됩니다!
