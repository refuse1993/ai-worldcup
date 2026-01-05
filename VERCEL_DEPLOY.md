# 🚀 Vercel 배포 완벽 가이드

## ⚡ 빠른 배포 (5분)

### 1. GitHub에 코드 푸시

```bash
# Git 초기화
git init
git add .
git commit -m "AI 이상형 월드컵 초기 커밋"

# GitHub 리포지토리 생성 후
git remote add origin https://github.com/YOUR_USERNAME/ai-worldcup.git
git branch -M main
git push -u origin main
```

### 2. Vercel 배포

1. **Vercel 접속**
   - [vercel.com](https://vercel.com) 접속
   - "Continue with GitHub" 클릭

2. **프로젝트 Import**
   - "Add New" → "Project" 클릭
   - GitHub 리포지토리 선택 (ai-worldcup)
   - "Import" 클릭

3. **프로젝트 설정**
   ```
   Framework Preset: Next.js (자동 감지)
   Root Directory: ./
   Build Command: npm run build (자동)
   Output Directory: .next (자동)
   Install Command: npm install (자동)
   ```

4. **환경 변수 추가**

   "Environment Variables" 섹션에서 하나씩 추가:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Production, Preview |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhb...` | Production, Preview |
   | `GOOGLE_GENERATIVE_AI_API_KEY` | `AIza...` | Production, Preview |
   | `TAVILY_API_KEY` | `tvly-...` | Production, Preview |

   **중요**: 모든 변수를 **Production**과 **Preview** 환경 모두에 추가하세요!

5. **배포 시작**
   - "Deploy" 버튼 클릭
   - 2-3분 대기
   - 완료! 🎉

### 3. 배포 확인

배포 완료 후 제공되는 URL 접속:
```
https://your-project-name.vercel.app
```

테스트:
1. ✅ 메인 페이지 로딩
2. ✅ 주제 입력 → 월드컵 생성
3. ✅ AI 비교 설명 표시
4. ✅ 게임 완료 → 결과 표시

## 🔧 Vercel 최적화 설정

### Edge Runtime 활성화 (선택사항)

더 빠른 응답 속도를 원한다면:

```typescript
// src/app/api/generate/route.ts
export const runtime = 'edge'; // Edge Runtime 사용

// src/app/api/compare/route.ts
export const runtime = 'edge';
```

**장점**: 응답 속도 30-50% 향상
**단점**: 일부 Node.js API 사용 불가 (현재 코드는 호환됨)

### Vercel Analytics 활성화

```bash
npm install @vercel/analytics
```

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Analytics /> {/* 추가 */}
      </body>
    </html>
  );
}
```

### Speed Insights 추가

```bash
npm install @vercel/speed-insights
```

```typescript
// src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Analytics />
        <SpeedInsights /> {/* 추가 */}
      </body>
    </html>
  );
}
```

## 🌐 커스텀 도메인 연결

### 방법 1: Vercel 무료 도메인 사용

```
https://your-project.vercel.app
```

추가 설정 불필요, 바로 사용 가능!

### 방법 2: 커스텀 도메인 연결

1. **도메인 구매**
   - Namecheap, GoDaddy, Cloudflare 등
   - 예: `ai-worldcup.com` ($10/년)

2. **Vercel 설정**
   - 프로젝트 → Settings → Domains
   - 도메인 입력 (예: `ai-worldcup.com`)
   - "Add" 클릭

3. **DNS 설정**

   도메인 제공업체에서 다음 레코드 추가:

   | Type | Name | Value |
   |------|------|-------|
   | A | @ | `76.76.21.21` |
   | CNAME | www | `cname.vercel-dns.com` |

4. **SSL 자동 활성화**
   - Vercel이 자동으로 HTTPS 인증서 발급
   - 5-10분 후 완료

## 📊 모니터링 & 디버깅

### Vercel 대시보드

1. **Deployments**: 배포 이력
2. **Analytics**: 트래픽 분석
3. **Logs**: 실시간 로그
4. **Speed Insights**: 성능 측정

### 로그 확인

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 실시간 로그 보기
vercel logs your-project-name --follow
```

### 오류 디버깅

**배포 실패 시:**
```bash
# 로컬에서 빌드 테스트
npm run build

# 오류가 있다면 수정 후
git add .
git commit -m "Fix build error"
git push

# Vercel이 자동으로 재배포
```

**런타임 오류 시:**
- Vercel 대시보드 → Logs 확인
- Functions 탭에서 에러 로그 확인

## 🔐 환경 변수 관리

### 추가/수정

1. Vercel 대시보드 → Settings → Environment Variables
2. 변수 추가/수정
3. **Redeploy 필수!** (변경사항 적용)

### 로컬 개발용 환경 변수

```bash
# Vercel CLI로 환경 변수 다운로드
vercel env pull .env.local
```

### 환경별 분리

- **Production**: 실제 서비스 (vercel.app 또는 커스텀 도메인)
- **Preview**: PR 생성 시 자동 배포 (테스트용)
- **Development**: 로컬 개발

## 🚀 자동 배포 설정

### GitHub 푸시 → 자동 배포

기본적으로 활성화되어 있음:

```bash
# 코드 수정 후
git add .
git commit -m "Update feature"
git push

# → Vercel이 자동으로 배포 시작
```

### Preview 배포 (PR)

```bash
# 새 브랜치 생성
git checkout -b feature/new-ui

# 코드 수정 후 커밋
git add .
git commit -m "Add new UI"
git push origin feature/new-ui

# GitHub에서 PR 생성
# → Vercel이 Preview URL 자동 생성
#    예: https://ai-worldcup-git-feature-new-ui.vercel.app
```

## 💰 비용 관리

### 무료 티어 한도

| 항목 | 무료 한도 | 초과 시 |
|------|-----------|---------|
| Bandwidth | 100GB/월 | $40/TB |
| Build Minutes | 6,000분/월 | $0.01/분 |
| Serverless Functions | 100GB-시간 | $20/GB-시간 |
| Edge Functions | 500,000 요청 | $0.65/백만 |

### 비용 절감 팁

1. **이미지 최적화**
   - Next.js Image 컴포넌트 사용
   - WebP 포맷 사용
   - Lazy loading

2. **API 캐싱**
   ```typescript
   // 응답 캐싱
   export const revalidate = 3600; // 1시간 캐시
   ```

3. **Edge Functions 활용**
   ```typescript
   export const runtime = 'edge'; // 더 저렴
   ```

## 🐛 자주 발생하는 문제

### 1. 환경 변수 오류

**증상:**
```
Error: GOOGLE_GENERATIVE_AI_API_KEY is not defined
```

**해결:**
1. Vercel 대시보드 → Settings → Environment Variables 확인
2. 변수 추가 후 **Redeploy** 필수
3. "Deployments" → 최신 배포 → "Redeploy" 클릭

### 2. 빌드 타임아웃

**증상:**
```
Error: Command timed out after 600s
```

**해결:**
```json
// package.json
{
  "scripts": {
    "build": "next build --verbose"
  }
}
```

### 3. 이미지 로딩 오류

**증상:**
```
Error: Invalid src prop
```

**해결:**
```javascript
// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 모든 도메인 허용
      },
    ],
  },
};
```

### 4. API 라우트 404

**증상:**
```
404: This page could not be found
```

**해결:**
- 파일 경로 확인: `src/app/api/generate/route.ts`
- 파일명이 정확히 `route.ts`인지 확인
- 재배포

## 📈 성능 최적화

### Lighthouse 점수 목표

- Performance: **90+**
- Accessibility: **95+**
- Best Practices: **90+**
- SEO: **95+**

### 최적화 체크리스트

- [x] Next.js Image 컴포넌트 사용
- [x] Lazy loading 적용
- [x] 폰트 최적화 (next/font)
- [x] API 응답 캐싱
- [x] CDN 활용 (Vercel 자동)
- [ ] OG 이미지 추가
- [ ] sitemap.xml 생성
- [ ] robots.txt 설정

## 🎯 배포 후 체크리스트

### 즉시 확인

- [ ] 메인 페이지 로딩 (3초 이내)
- [ ] 주제 입력 → 월드컵 생성 성공
- [ ] AI 비교 설명 표시
- [ ] 게임 완료 → 결과 표시
- [ ] 모바일 반응형 확인

### 24시간 이내

- [ ] Google Search Console 등록
- [ ] Google Analytics 설정
- [ ] Vercel Analytics 확인
- [ ] 첫 트래픽 확인

### 1주일 이내

- [ ] SEO 최적화 (메타태그)
- [ ] OG 이미지 추가
- [ ] 소셜 미디어 공유 테스트
- [ ] 트래픽 100+ 확인

### 1개월 이내

- [ ] AdSense 신청 (일 1,000 PV 달성 후)
- [ ] 커스텀 도메인 연결
- [ ] 성능 최적화
- [ ] 사용자 피드백 수집

## 🎉 완료!

축하합니다! Vercel 배포가 완료되었습니다!

**배포 URL:**
```
https://your-project.vercel.app
```

**다음 단계:**
1. 🔗 URL 공유 (친구, 커뮤니티)
2. 📊 트래픽 모니터링
3. 💰 AdSense 준비 (일 1,000 PV 후)

**예상 타임라인:**
- 1주차: 100-500 PV/일
- 1개월: 1,000-5,000 PV/일
- 3개월: 10,000+ PV/일 (바이럴 성공 시)

행운을 빕니다! 🚀💰
