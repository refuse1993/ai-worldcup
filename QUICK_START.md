# ⚡ 로컬 테스트 빠른 시작

## 1️⃣ 의존성 설치 (1분)

```bash
cd /Users/brownkim/Documents/worldcup
npm install
```

## 2️⃣ 환경 변수 설정 (5분)

### A. .env.local 파일 생성

```bash
cp .env.local.example .env.local
```

### B. API 키 발급 및 입력

#### 🔹 Supabase (필수)

1. [supabase.com](https://supabase.com) 접속
2. "Start your project" → GitHub 로그인
3. "New Project" 클릭
   - Name: `ai-worldcup`
   - Database Password: 아무거나 (저장 필요없음)
   - Region: `Northeast Asia (Seoul)`
4. 프로젝트 생성 대기 (1-2분)
5. **SQL Editor** 클릭 → 새 쿼리
6. `supabase-schema.sql` 내용 복사 → 붙여넣기 → **RUN** 클릭
7. Settings → API 클릭
   - **URL** 복사 → `.env.local`의 `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** 키 복사 → `.env.local`의 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### 🔹 Google AI (필수)

1. [aistudio.google.com/apikey](https://aistudio.google.com/apikey) 접속
2. Google 계정 로그인
3. "Create API Key" 클릭
4. API 키 복사 → `.env.local`의 `GOOGLE_GENERATIVE_AI_API_KEY`

**무료 한도**: 분당 15 요청 (테스트에 충분)

#### 🔹 Tavily (필수)

1. [tavily.com](https://tavily.com) 접속
2. 회원가입 (GitHub 또는 이메일)
3. Dashboard → API Keys
4. API 키 복사 → `.env.local`의 `TAVILY_API_KEY`

**무료 한도**: 월 1,000회 (테스트에 충분)

### C. .env.local 최종 확인

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=AIza...

# Tavily Search
TAVILY_API_KEY=tvly-...
```

## 3️⃣ 개발 서버 실행 (10초)

```bash
npm run dev
```

**출력:**
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

## 4️⃣ 브라우저에서 테스트

### 주소창에 입력:
```
http://localhost:3000
```

### 테스트 시나리오 1: 새 월드컵 생성

1. **메인 페이지 확인**
   - ✅ 화면이 보이나요?
   - ✅ "AI 이상형 월드컵" 제목 표시?

2. **주제 입력**
   ```
   2024 최고의 K-POP 여자 아이돌
   ```

3. **"월드컵 생성하기" 클릭**
   - ⏳ "AI가 월드컵을 만들고 있어요..." 표시
   - ⏱️ 3-5초 대기
   - ✅ 게임 페이지로 자동 이동

4. **게임 진행**
   - ✅ 16강: 2명씩 대결 화면 표시?
   - ✅ AI 해설: "장원영은 우아한 비주얼, 카리나는..." 표시?
   - 👆 한 명 클릭
   - ✅ 다음 대결로 자동 넘어감?

5. **결과 확인**
   - 🏆 우승자 표시?
   - ✅ "친구에게 공유하기" 버튼 보임?
   - ✅ "새로 만들기" 버튼 보임?

### 테스트 시나리오 2: 공유 링크 테스트

1. **URL 복사**
   ```
   http://localhost:3000/game?id=xxxxx
   ```

2. **새 탭에서 열기**
   - ✅ 동일한 월드컵 로드?
   - ✅ 같은 16명 후보?

3. **메인 페이지로 이동**
   ```
   http://localhost:3000
   ```
   - ✅ "🔥 인기 월드컵" 섹션에 방금 만든 것 표시?
   - ✅ 재생 횟수 "1회" 표시?

## 🐛 문제 해결

### 문제 1: "Port 3000 is already in use"

**해결:**
```bash
# 포트 변경
npm run dev -- -p 3001
```

### 문제 2: "Module not found"

**해결:**
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
npm install
```

### 문제 3: API 키 오류

**증상:**
```
Error: GOOGLE_GENERATIVE_AI_API_KEY is not defined
```

**해결:**
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. API 키 앞뒤 공백 제거
3. 개발 서버 재시작 (`Ctrl+C` → `npm run dev`)

### 문제 4: Supabase 연결 오류

**증상:**
```
Error: Invalid Supabase URL
```

**해결:**
1. Supabase 프로젝트가 활성화되었는지 확인
2. URL이 `https://`로 시작하는지 확인
3. `supabase-schema.sql` 실행했는지 확인

### 문제 5: Tavily 검색 오류

**증상:**
```
Error: Tavily API key not found
```

**해결:**
1. Tavily 계정 활성화 확인
2. API 키 복사 시 전체 문자열 복사 확인
3. 키가 `tvly-`로 시작하는지 확인

### 문제 6: 이미지 로딩 안됨

**증상:**
- 후보 이미지가 깨진 아이콘으로 표시

**해결:**
- 정상입니다! Tavily가 찾은 이미지 URL이 유효하지 않을 수 있음
- 다른 주제로 다시 시도

## 📊 성능 체크

### 정상 작동 시:

| 단계 | 예상 시간 |
|------|----------|
| 주제 입력 → 생성 시작 | 즉시 |
| AI 후보 수집 | 2-3초 |
| 게임 페이지 로드 | 1초 |
| AI 비교 설명 | 1-2초 |
| 클릭 → 다음 대결 | 즉시 |

### 느린 경우:

- **Tavily API**: 3-5초 (정상)
- **Gemma API**: 2-4초 (정상)
- 그 이상이면 네트워크 확인

## 🎯 다음 단계

모든 테스트 통과하면:

1. ✅ GitHub에 푸시
2. ✅ Vercel 배포
3. ✅ 실제 서비스 시작

**축하합니다! 로컬 테스트 완료! 🎉**
