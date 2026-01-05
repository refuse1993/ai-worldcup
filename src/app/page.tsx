'use client';

import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 animate-fade-in">
        {/* 헤더 */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI 이상형 월드컵
            </h1>
          </div>
          <p className="text-xl text-gray-300">
            주제만 입력하면 AI가 자동으로 만들어주는 차세대 월드컵
          </p>
        </div>

        {/* 입력 영역 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-200">
              어떤 주제로 월드컵을 만들까요?
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="예: 2024 최고의 K-POP 여자 아이돌"
              className="w-full px-6 py-4 text-lg rounded-xl bg-white/5 border-2 border-white/10 focus:border-purple-400 focus:outline-none text-white placeholder-gray-400 transition-all"
              disabled={isGenerating}
            />

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5 animate-pulse" />
                  AI가 월드컵을 만들고 있어요...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  월드컵 생성하기
                </span>
              )}
            </button>
          </div>

          {/* 트렌딩 주제 */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-pink-400" />
              <span className="text-sm font-medium text-gray-300">인기 주제</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-all border border-white/10 hover:border-white/20"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 인기 월드컵 */}
        {popularWorldcups.length > 0 && (
          <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🔥 인기 월드컵
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {popularWorldcups.map((wc) => (
                <button
                  key={wc.id}
                  onClick={() => router.push(`/game?id=${wc.id}`)}
                  className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-purple-400/50 transition-all text-left group"
                >
                  <div className="flex-1">
                    <div className="font-medium text-white group-hover:text-purple-300 transition-colors">
                      {wc.topic}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      👥 {wc.plays.toLocaleString()}회 플레이
                    </div>
                  </div>
                  <Sparkles className="w-5 h-5 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 특징 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {[
            { icon: '🔍', title: 'AI 자동 검색', desc: 'Tavily가 실시간 수집' },
            { icon: '🤖', title: 'AI 해설', desc: 'Gemma가 비교 분석' },
            { icon: '🚀', title: '100% 무료', desc: '광고 수익으로 운영' },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <div className="font-bold text-white mb-1">{feature.title}</div>
              <div className="text-sm text-gray-400">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
