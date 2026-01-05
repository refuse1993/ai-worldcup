'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  adSlot?: string;
  adFormat?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  fullWidthResponsive?: boolean;
}

export default function AdBanner({
  adSlot = '1234567890',
  adFormat = 'auto',
  fullWidthResponsive = true,
}: AdBannerProps) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!adsenseId) return;

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense 로드 오류:', error);
    }
  }, [adsenseId]);

  // AdSense ID가 없으면 placeholder 표시
  if (!adsenseId) {
    return (
      <div className="my-4 flex justify-center">
        <div className="w-full max-w-5xl h-24 glass rounded-xl flex items-center justify-center">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Advertisement</span>
        </div>
      </div>
    );
  }

  return (
    <div className="my-4 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={`ca-pub-${adsenseId}`}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
}

// 배너 광고 (상단/하단)
export function AdBannerHorizontal({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full flex justify-center py-4 ${className}`}>
      <div className="max-w-5xl w-full">
        <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-sm rounded-xl border border-slate-600/20 p-4 shadow-lg">
          <div className="text-xs text-slate-400 mb-2 text-center tracking-wider">ADVERTISEMENT</div>
          <AdBanner adSlot="1234567890" adFormat="auto" fullWidthResponsive />
        </div>
      </div>
    </div>
  );
}

// 인피드 광고 (콘텐츠 사이)
export function AdInFeed({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full ${className}`}>
      <div className="bg-gradient-to-br from-slate-800/30 to-slate-700/30 backdrop-blur-sm rounded-2xl border border-slate-600/20 p-6 shadow-lg">
        <div className="text-xs text-slate-400 mb-3 text-center font-medium tracking-wide">Sponsored</div>
        <AdBanner adSlot="1357924680" adFormat="auto" fullWidthResponsive />
      </div>
    </div>
  );
}
