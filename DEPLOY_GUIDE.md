# 🚀 배포 완전 정복 가이드

## 📋 배포 전 체크리스트

- [ ] Supabase 프로젝트 생성 완료
- [ ] Google AI API 키 발급 완료
- [ ] Tavily API 키 발급 완료
- [ ] `.env.local` 설정 완료
- [ ] 로컬 테스트 성공 (`npm run dev`)
- [ ] GitHub 리포지토리 생성 완료

## 🎯 단계별 배포 가이드

### Step 1: GitHub에 코드 푸시

```bash
# Git 초기화 (새 프로젝트인 경우)
git init
git add .
git commit -m "Initial commit: AI 이상형 월드컵"

# GitHub 리포지토리 생성 후
git remote add origin https://github.com/your-username/ai-worldcup.git
git branch -M main
git push -u origin main
```

### Step 2: Vercel 배포

1. **Vercel 로그인**
   - [vercel.com](https://vercel.com) 접속
   - GitHub 계정으로 로그인

2. **프로젝트 Import**
   - "New Project" 클릭
   - GitHub 리포지토리 선택
   - "Import" 클릭

3. **환경 변수 설정**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
   TAVILY_API_KEY=your_tavily_key
   ```

4. **배포 시작**
   - "Deploy" 클릭
   - 2-3분 대기
   - 완료! 🎉

### Step 3: 커스텀 도메인 연결 (선택사항)

1. **도메인 구매**
   - Namecheap, GoDaddy 등에서 구매
   - 또는 Vercel 도메인 사용 (무료)

2. **Vercel 설정**
   - Settings → Domains
   - 도메인 입력 → Add
   - DNS 설정 지시 따르기

3. **SSL 자동 설정**
   - Vercel이 자동으로 HTTPS 설정
   - 5분 후 완료

## 💰 무료 티어 한도 관리

### Vercel (무료)
- **대역폭**: 100GB/월
- **빌드 시간**: 6,000분/월
- **서버리스 함수 실행**: 100GB-시간/월

**초과 시**: 유료 플랜 전환 ($20/월)

### Supabase (무료)
- **DB 용량**: 500MB
- **행 수**: 50,000개
- **월간 대역폭**: 2GB

**초과 시**: Pro 플랜 ($25/월)

### Google AI (Gemma)
- **무료 티어**: 분당 15 요청
- **일일 한도**: 1,500 요청

**초과 시**: 요청 제한 (다음날 초기화)

### Tavily Search
- **무료 티어**: 월 1,000 검색
- **초과 시**: 유료 플랜 ($30/월, 3,000 검색)

## 📊 트래픽 폭발 시나리오

### 시나리오 1: 일 1만 PV (초기)
- **비용**: $0
- **수익**: AdSense 승인 후 예상 $1-5/일

### 시나리오 2: 일 10만 PV (바이럴)
- **Vercel**: $0 (무료 티어 충분)
- **Supabase**: $25/월 (Pro 플랜)
- **Tavily**: $30/월 (API 호출 증가)
- **총 비용**: $55/월
- **예상 수익**: AdSense $50-200/일

### 시나리오 3: 일 100만 PV (대박)
- **Vercel**: $20/월 (Pro 플랜)
- **Supabase**: $599/월 (Team 플랜)
- **Tavily**: API 요청 줄이기 (캐싱)
- **총 비용**: $649/월
- **예상 수익**: AdSense $500-2,000/일

## 🎯 비용 최적화 전략

### 1. API 호출 캐싱
```typescript
// localStorage에 검색 결과 캐싱
const cacheKey = `worldcup_${topic}`;
const cached = localStorage.getItem(cacheKey);
if (cached && Date.now() - cached.timestamp < 86400000) {
  // 24시간 이내면 캐시 사용
  return cached.data;
}
```

### 2. 이미지 최적화
```typescript
// Next.js Image 컴포넌트 사용
<Image
  src={imageUrl}
  width={400}
  height={400}
  quality={75} // 기본 75% 품질
  loading="lazy" // 지연 로딩
/>
```

### 3. Tavily 요청 줄이기
```typescript
// 동일 주제 재검색 방지
// Supabase에 검색 결과 저장
await supabase.from('worldcups').insert({
  topic,
  candidates,
});

// 다음번에는 DB에서 가져오기
const { data } = await supabase
  .from('worldcups')
  .select('*')
  .eq('topic', topic)
  .single();
```

## 🔥 SEO 최적화

### 1. 메타태그 추가
```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: 'AI 이상형 월드컵 - 무료 자동 생성',
  description: '주제만 입력하면 AI가 자동으로 만들어주는 이상형 월드컵',
  keywords: ['이상형 월드컵', 'AI', 'K-POP', '맛집'],
  openGraph: {
    title: 'AI 이상형 월드컵',
    description: 'AI가 만들어주는 이상형 월드컵',
    images: ['/og-image.png'],
  },
};
```

### 2. sitemap.xml 생성
```typescript
// src/app/sitemap.ts
export default function sitemap() {
  return [
    {
      url: 'https://your-domain.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];
}
```

### 3. robots.txt
```typescript
// src/app/robots.ts
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://your-domain.com/sitemap.xml',
  };
}
```

## 📈 AdSense 최적화

### 광고 배치 전략

1. **메인 페이지**: 상단 배너 (횡형)
2. **게임 중**: 라운드 전환 시 전면 광고
3. **결과 페이지**: 하단 + 사이드바 광고

### 예상 수익

| 일 PV | 클릭률 | 일 수익 | 월 수익 |
|-------|--------|---------|---------|
| 1,000 | 1% | $1-2 | $30-60 |
| 10,000 | 1.5% | $10-20 | $300-600 |
| 100,000 | 2% | $100-200 | $3,000-6,000 |

## 🚀 트래픽 폭발 대비

### 1. CDN 활성화
- Vercel은 자동으로 전세계 CDN 배포
- 추가 설정 불필요

### 2. DB 인덱싱
```sql
-- 이미 supabase-schema.sql에 포함됨
create index worldcups_created_at_idx on worldcups(created_at desc);
```

### 3. Rate Limiting
```typescript
// API 라우트에 rate limiting 추가
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});
```

## 🎯 마케팅 전략

### 1. 소셜 미디어
- Twitter: #이상형월드컵 #AI월드컵
- Instagram: 결과 공유 이미지
- 커뮤니티: 디시인사이드, 에브리타임

### 2. SEO 키워드
- "2024 K-POP 이상형 월드컵"
- "AI 자동 월드컵 생성"
- "무료 이상형 월드컵"

### 3. 바이럴 루프
```
유저 A: 월드컵 생성
  ↓
결과 공유 → 친구들이 클릭
  ↓
친구 B: "나도 만들어보기"
  ↓
무한 반복! 📈
```

## 🔧 문제 해결

### 배포 실패
```bash
# Vercel 빌드 오류 시
npm run build

# 로컬에서 빌드 성공하는지 확인
```

### API 한도 초과
```
Error: Too many requests
```
**해결**: 캐싱 추가 또는 유료 플랜 전환

### 이미지 로딩 느림
**해결**:
1. Next.js Image 컴포넌트 사용
2. CDN 이미지 사용
3. Placeholder 추가

## 🎉 축하합니다!

배포가 완료되었습니다! 이제 트래픽만 모으면 됩니다.

**다음 단계:**
1. ✅ Google Search Console 등록
2. ✅ Google Analytics 설정
3. ✅ AdSense 신청 (일 1,000 PV 후)
4. ✅ 소셜 미디어 마케팅

**예상 타임라인:**
- 1주차: 일 100-500 PV
- 1개월: 일 1,000-5,000 PV
- 3개월: 일 10,000+ PV (바이럴 시)

행운을 빕니다! 🚀
