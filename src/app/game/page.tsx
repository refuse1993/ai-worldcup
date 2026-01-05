'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Home, Share2, Bot, Sparkles, Zap } from 'lucide-react';
import Image from 'next/image';
import { AdBannerHorizontal } from '@/components/AdBanner';

interface Candidate {
  name: string;
  description: string;
  imageUrl: string;
}

interface Match {
  candidate1: Candidate;
  candidate2: Candidate;
}

export default function GamePage() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [currentRound, setCurrentRound] = useState<Candidate[]>([]);
  const [nextRound, setNextRound] = useState<Candidate[]>([]);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [matchIndex, setMatchIndex] = useState(0);
  const [roundName, setRoundName] = useState('16강');
  const [aiComment, setAiComment] = useState('');
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [winner, setWinner] = useState<Candidate | null>(null);

  useEffect(() => {
    const loadWorldcup = async () => {
      // URL에서 ID 가져오기 (공유 링크)
      const params = new URLSearchParams(window.location.search);
      const worldcupId = params.get('id');

      if (worldcupId) {
        // 공유된 월드컵 불러오기
        try {
          const response = await fetch(`/api/worldcup/${worldcupId}`);
          const data = await response.json();

          setTopic(data.topic);
          setAllCandidates(data.candidates);
          setCurrentRound(data.candidates);
          setupMatch(data.candidates, 0);
          return;
        } catch (error) {
          console.error('월드컵 로드 오류:', error);
        }
      }

      // localStorage에서 데이터 가져오기 (fallback)
      const data = localStorage.getItem('worldcup');
      if (!data) {
        router.push('/');
        return;
      }

      const { topic: t, candidates } = JSON.parse(data);
      setTopic(t);
      setAllCandidates(candidates);
      setCurrentRound(candidates);
      setupMatch(candidates, 0);
    };

    loadWorldcup();
  }, [router]);

  const setupMatch = (candidates: Candidate[], index: number) => {
    if (index >= candidates.length) {
      // 다음 라운드로
      if (nextRound.length === 1) {
        // 우승자 결정
        setWinner(nextRound[0]);
      } else {
        // 다음 라운드 시작
        const newRoundName = getRoundName(nextRound.length);
        setRoundName(newRoundName);
        setCurrentRound(nextRound);
        setNextRound([]);
        setMatchIndex(0);
        setupMatch(nextRound, 0);
      }
      return;
    }

    const match = {
      candidate1: candidates[index],
      candidate2: candidates[index + 1],
    };
    setCurrentMatch(match);
    setMatchIndex(index);

    // AI 비교 설명 가져오기
    fetchAIComment(match.candidate1, match.candidate2);
  };

  const fetchAIComment = async (c1: Candidate, c2: Candidate) => {
    setIsLoadingComment(true);
    setAiComment('');

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate1: c1, candidate2: c2, topic }),
      });

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setAiComment((prev) => prev + chunk);
      }
    } catch (error) {
      console.error('AI 코멘트 오류:', error);
      setAiComment('두 후보 모두 훌륭한 선택입니다!');
    } finally {
      setIsLoadingComment(false);
    }
  };

  const handleSelect = (selected: Candidate) => {
    setNextRound([...nextRound, selected]);

    // 다음 매치
    setTimeout(() => {
      setupMatch(currentRound, matchIndex + 2);
    }, 300);
  };

  const getRoundName = (count: number): string => {
    if (count === 16) return '16강';
    if (count === 8) return '8강';
    if (count === 4) return '준결승';
    if (count === 2) return '결승';
    return '우승';
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `${topic} - 내 선택은 ${winner?.name}! 🏆`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'AI 이상형 월드컵', text, url });
      } catch (error) {
        console.log('공유 취소됨');
      }
    } else {
      // 클립보드 복사
      navigator.clipboard.writeText(url);
      alert('링크가 복사되었습니다! 친구들에게 공유해보세요 🎉');
    }
  };

  if (winner) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-950/20 via-transparent to-amber-950/20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-3xl w-full space-y-8"
          >
            <div className="text-center space-y-4">
              <Trophy className="w-28 h-28 text-yellow-400 mx-auto animate-bounce drop-shadow-2xl" />
              <h1 className="text-6xl md:text-7xl font-black text-gradient-winner">
                우승자
              </h1>
            </div>

            {/* 광고 배너 */}
            <AdBannerHorizontal />

            <div className="card p-10">
              <div className="relative w-80 h-80 mx-auto mb-8 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-yellow-400/50">
                <Image
                  src={winner.imageUrl}
                  alt={winner.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="text-center space-y-4">
                <h2 className="text-5xl font-black text-white drop-shadow-lg">{winner.name}</h2>
                <p className="text-xl text-slate-300 max-w-lg mx-auto">{winner.description}</p>

                <div className="glass-strong rounded-xl p-6 max-w-md mx-auto">
                  <div className="text-sm font-bold text-brand-300 mb-2">{topic}</div>
                  <div className="text-slate-400 flex items-center justify-center gap-2">
                    <Trophy className="w-4 h-4" />
                    16명 중 최종 우승!
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={handleShare}
                className="btn-primary px-10 py-4 text-lg flex items-center gap-3"
              >
                <Share2 className="w-5 h-5" />
                친구에게 공유하기
              </button>

              <button
                onClick={() => router.push('/')}
                className="btn-secondary px-10 py-4 text-lg flex items-center gap-3"
              >
                <Home className="w-5 h-5" />
                새로 만들기
              </button>
            </div>

            <div className="text-center">
              <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                친구들에게 공유하고 그들의 선택을 확인해보세요!
              </p>
            </div>

            {/* 하단 광고 */}
            <AdBannerHorizontal />
          </motion.div>
        </div>
      </main>
    );
  }

  if (!currentMatch) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-300">
          <Zap className="w-6 h-6 animate-pulse text-brand-400" />
          <span className="text-xl font-medium">로딩 중...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-950/20 via-transparent to-accent-950/20 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 py-8">
        <div className="max-w-7xl w-full space-y-6">
          {/* 헤더 */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-black text-gradient-brand">
              {topic}
            </h1>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <span className="px-6 py-2.5 glass-strong rounded-xl font-bold text-brand-300 text-lg">
                {roundName}
              </span>
              <span className="text-slate-400 text-sm">
                {matchIndex / 2 + 1} / {currentRound.length / 2}
              </span>
            </div>
          </div>

          {/* AI 코멘트 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-accent-400" />
              <span className="text-sm font-bold text-accent-300 uppercase tracking-wide">
                AI 해설
              </span>
            </div>
            <div className="text-white font-medium text-center min-h-[3rem] flex items-center justify-center">
              {isLoadingComment ? (
                <span className="flex items-center gap-2 text-slate-400">
                  <Zap className="w-4 h-4 animate-pulse" />
                  분석 중...
                </span>
              ) : (
                <p className="text-lg leading-relaxed">
                  {aiComment || '대결이 시작됩니다!'}
                </p>
              )}
            </div>
          </motion.div>

          {/* 대결 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative">
            <AnimatePresence mode="wait">
              {[currentMatch.candidate1, currentMatch.candidate2].map((candidate, idx) => (
                <motion.button
                  key={`${candidate.name}-${matchIndex}`}
                  initial={{ opacity: 0, x: idx === 0 ? -100 : 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(candidate)}
                  className="group relative card card-hover overflow-hidden shadow-2xl"
                >
                  <div className="relative w-full aspect-square">
                    <Image
                      src={candidate.imageUrl}
                      alt={candidate.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 text-left">
                    <h3 className="text-3xl font-black text-white mb-3 drop-shadow-2xl">
                      {candidate.name}
                    </h3>
                    <p className="text-slate-200 text-base drop-shadow-lg leading-relaxed">
                      {candidate.description}
                    </p>
                  </div>

                  <div className="absolute top-6 right-6 glass-strong text-white px-5 py-2.5 rounded-xl font-bold text-sm opacity-0 group-hover:opacity-100 transition-all group-hover:scale-110 shadow-lg">
                    선택하기
                  </div>

                  {/* 호버 효과 */}
                  <div className="absolute inset-0 border-4 border-brand-500/0 group-hover:border-brand-500/50 rounded-2xl transition-all pointer-events-none" />
                </motion.button>
              ))}
            </AnimatePresence>

            {/* VS 표시 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
              <div className="text-7xl font-black text-white/10 drop-shadow-2xl">
                VS
              </div>
            </div>
          </div>

          {/* 광고 배너 */}
          <AdBannerHorizontal />
        </div>
      </div>
    </main>
  );
}
