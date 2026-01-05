import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 이상형 월드컵 - 주제만 입력하면 AI가 자동 생성",
  description: "AI가 실시간으로 검색하고 비교 설명까지 해주는 차세대 이상형 월드컵",
  keywords: ["이상형 월드컵", "AI 월드컵", "자동 생성", "K-POP", "맛집", "게임"],
  openGraph: {
    title: "AI 이상형 월드컵",
    description: "주제만 입력하면 AI가 자동으로 만들어주는 이상형 월드컵",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 이상형 월드컵",
    description: "주제만 입력하면 AI가 자동으로 만들어주는 이상형 월드컵",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Vercel Analytics */}
        <script
          defer
          src="/_vercel/insights/script.js"
          data-endpoint="/_vercel/insights"
        />
      </head>
      <body className="antialiased min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {children}
      </body>
    </html>
  );
}
