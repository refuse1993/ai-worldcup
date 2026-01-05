'use client';

import { useEffect } from 'react';

/**
 * Google AdSense 광고 배너 컴포넌트
 *
 * 사용법:
 * 1. AdSense 승인 후 광고 코드 받기
 * 2. .env.local에 NEXT_PUBLIC_ADSENSE_ID 추가
 * 3. 원하는 페이지에 <AdBanner /> 삽입
 */

interface AdBannerProps {
  /**
   * 광고 슬롯 ID (AdSense에서 생성)
   * 예: "1234567890"
   */
  adSlot?: string;

  /**
   * 광고 형식
   * - auto: 반응형 (추천)
   * - horizontal: 가로형
   * - vertical: 세로형
   * - rectangle: 사각형
   */
  adFormat?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';

  /**
   * 전체 너비 사용 여부
   */
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

  // AdSense ID가 없으면 표시하지 않음
  if (!adsenseId) {
    return null;
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

/**
 * 사용 예시:
 *
 * // 1. 메인 페이지 상단
 * <AdBanner adSlot="1234567890" />
 *
 * // 2. 게임 페이지 중간 (라운드 전환 시)
 * <AdBanner adSlot="9876543210" adFormat="horizontal" />
 *
 * // 3. 결과 페이지 하단
 * <AdBanner adSlot="1122334455" adFormat="rectangle" />
 */
