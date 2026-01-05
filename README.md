# 🏆 AI 이상형 월드컵

AI가 실시간으로 검색하고 비교 설명까지 해주는 차세대 이상형 월드컵

## 🎯 핵심 기능

1. **AI 검색 기반 자동 생성**: 주제만 입력하면 Tavily가 후보 16명 자동 수집
2. **실시간 AI 해설**: Gemini가 각 대결마다 비교 분석 제공
3. **바이럴 최적화**: 결과 공유 → 친구도 만들기 → 무한 루프
4. **광고 수익 극대화**: 높은 PV + 체류시간 = AdSense 최적화

## 💰 비용 (100% 무료)

- Vercel 호스팅: $0
- Supabase DB: $0 (500MB)
- Gemma 3-27B: $0 (Gemini API 무료 티어)
- Tavily 검색: $0 (월 1,000회)

## 🚀 빠른 시작

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.local.example .env.local
# → .env.local 파일에 API 키 입력

# 개발 서버 실행
npm run dev
```

## 📊 Supabase 스키마 설정

```sql
-- worldcups 테이블
create table worldcups (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  candidates jsonb not null,
  plays integer default 0,
  created_at timestamp with time zone default now()
);

-- results 테이블
create table results (
  id uuid primary key default gen_random_uuid(),
  worldcup_id uuid references worldcups(id),
  winner_name text not null,
  winner_image text,
  created_at timestamp with time zone default now()
);
```

## 🎨 사용 예시

1. 주제 입력: "2024 최고의 K-POP 여자 아이돌"
2. AI가 16명 검색 + 이미지 수집 (3초)
3. 토너먼트 시작 (16강 → 8강 → 4강 → 결승)
4. 각 대결마다 AI가 비교 설명
5. 우승자 결과 + 공유 버튼

## 📈 수익화 전략

- **Step 1**: 트래픽 확보 (바이럴 공유 기능)
- **Step 2**: Google AdSense 승인 (일 1,000 PV 이상)
- **Step 3**: 광고 최적화 (대결마다 배너 노출)
- **Step 4**: 트렌드 키워드 선점 (실시간 검색 활용)

## 🛠 기술 스택

- **Frontend**: Next.js 14 (App Router), Framer Motion
- **AI**: Gemma 3-27B (via Gemini API)
- **Search**: Tavily AI Search
- **Database**: Supabase
- **Hosting**: Vercel
- **Ads**: Google AdSense
