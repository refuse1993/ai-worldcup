import { NextRequest, NextResponse } from 'next/server';
import { searchCandidates } from '@/lib/tavily';

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: '주제를 입력해주세요' }, { status: 400 });
    }

    // Tavily로 후보 검색 (이미 중복 제거 및 정제됨)
    console.log(`🔍 주제 "${topic}" 검색 중...`);
    const candidates = await searchCandidates(topic, 16);

    console.log(`✅ 후보 생성 완료 (${candidates.length}개)`);

    return NextResponse.json({ candidates });
  } catch (error: any) {
    console.error('생성 오류:', error);
    return NextResponse.json(
      { error: error.message || '월드컵 생성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
