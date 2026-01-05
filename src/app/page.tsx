'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Zap,
  Search,
  Bot,
  Rocket,
  Crown,
  Users,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AdBannerHorizontal, AdInFeed } from '@/components/AdBanner';

interface PopularWorldcup {
  id: string;
  topic: string;
  plays: number;
  created_at: string;
}

export default function HomePage() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [popularWorldcups, setPopularWorldcups] = useState<PopularWorldcup[]>([]);
  const router = useRouter();

  // 인기 월드컵 불러오기
  useEffect(() => {
    fetch('/api/worldcup/popular?limit=6')
      .then(res => res.json())
      .then(data => setPopularWorldcups(data.worldcups || []))
      .catch(console.error);
  }, []);

  const trendingTopics = [
    '2026 최고의 K-POP 여자 아이돌',
    '서울 최고의 가성비 오마카세',
    '역대 최고의 넷플릭스 한국 드라마',
    '2026 올해의 게임',
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('주제를 입력해주세요!');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error('월드컵 생성 실패');
      }

      const data = await response.json();

      // Supabase에 저장
      const saveResponse = await fetch('/api/worldcup/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          candidates: data.candidates,
        }),
      });

      const { id } = await saveResponse.json();

      // localStorage에도 저장
      localStorage.setItem('worldcup', JSON.stringify({
        id,
        topic,
        candidates: data.candidates,
      }));

      // 게임 페이지로 이동 (공유 가능한 URL)
      router.push(`/game?id=${id}`);
    } catch (error) {
      console.error('생성 오류:', error);
      alert('월드컵 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-950/20 via-transparent to-accent-950/20 pointer-events-none" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 py-12">
        <div className="max-w-4xl w-full space-y-8 animate-fade-in">
          {/* 헤더 */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="w-14 h-14 text-yellow-400 animate-float" />
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tight">
              <span className="text-gradient-brand">AI 이상형</span>
              <br />
              <span className="text-gradient-accent">월드컵</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-2xl mx-auto">
              주제만 입력하면 AI가 자동으로 만들어주는{' '}
              <span className="text-brand-400 font-bold">차세대 월드컵</span>
            </p>
          </div>

          {/* 광고 배너 */}
          {/* <AdBannerHorizontal /> */}

          {/* 입력 영역 */}
          <div className="card card-hover p-8 md:p-10">
            <div className="space-y-6">
              <label className="block text-xl font-semibold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-brand-400" />
                어떤 주제로 월드컵을 만들까요?
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="예: 2026 최고의 K-POP 여자 아이돌"
                className="w-full px-6 py-5 text-lg rounded-xl glass-strong
                         focus:border-brand-500 focus:ring-2 focus:ring-brand-500/50 focus:outline-none
                         text-white placeholder-slate-400 transition-all"
                disabled={isGenerating}
              />

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full btn-primary py-5 text-lg font-bold flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <Zap className="w-6 h-6 animate-pulse" />
                    AI가 월드컵을 만들고 있어요...
                  </>
                ) : (
                  <>
                    <Rocket className="w-6 h-6" />
                    월드컵 생성하기
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* 트렌딩 주제 */}
            <div className="mt-8 pt-8 border-t border-slate-700/50">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-accent-400" />
                <span className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                  인기 주제
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className="px-4 py-2.5 glass hover:glass-strong rounded-xl text-sm text-slate-300 hover:text-white
                             transition-all hover:scale-105 active:scale-95 border border-slate-700/30 hover:border-brand-500/50"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 인피드 광고 */}
          {/* {popularWorldcups.length > 0 && <AdInFeed />} */}

          {/* 인기 월드컵 */}
          {popularWorldcups.length > 0 && (
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Users className="w-7 h-7 text-accent-400" />
                인기 월드컵
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularWorldcups.map((wc) => (
                  <button
                    key={wc.id}
                    onClick={() => router.push(`/game?id=${wc.id}`)}
                    className="flex items-center justify-between p-5 glass hover:glass-strong rounded-xl
                             border border-slate-700/30 hover:border-brand-500/50 transition-all text-left group
                             hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-white group-hover:text-brand-300 transition-colors mb-1">
                        {wc.topic}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {wc.plays.toLocaleString()}회 플레이
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-brand-400 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 특징 */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                color: 'text-brand-400',
                title: 'AI 자동 검색',
                desc: 'Tavily가 실시간으로 최적의 후보를 수집합니다',
              },
              {
                icon: Bot,
                color: 'text-accent-400',
                title: 'AI 해설',
                desc: 'Gemma가 각 대결마다 재치있는 비교 분석을 제공합니다',
              },
              {
                icon: Rocket,
                color: 'text-yellow-400',
                title: '100% 무료',
                desc: '광고 수익으로 운영되는 완전 무료 서비스입니다',
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="card card-hover p-6 text-center group"
                >
                  <Icon className={`w-12 h-12 ${feature.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
                  <div className="font-bold text-white mb-2 text-lg">{feature.title}</div>
                  <div className="text-sm text-slate-400 leading-relaxed">{feature.desc}</div>
                </div>
              );
            })}
          </div> */}

          {/* 하단 광고 */}
          {/* <AdBannerHorizontal /> */}
        </div>
      </div>
    </main>
  );
}
