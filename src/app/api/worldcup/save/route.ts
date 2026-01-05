import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * 생성된 월드컵을 Supabase에 저장
 * → Tavily API 재호출 방지
 * → 공유 가능
 */
export async function POST(req: NextRequest) {
  try {
    const { topic, candidates } = await req.json();

    if (!topic || !candidates || candidates.length === 0) {
      return NextResponse.json(
        { error: '주제와 후보가 필요합니다' },
        { status: 400 }
      );
    }

    // 동일 주제가 이미 있는지 확인 (중복 방지)
    const { data: existing } = await supabase
      .from('worldcups')
      .select('id')
      .eq('topic', topic)
      .single();

    if (existing) {
      // 이미 있으면 기존 ID 반환
      return NextResponse.json({ id: existing.id, created: false });
    }

    // 새로 저장
    const { data, error } = await supabase
      .from('worldcups')
      .insert({
        topic,
        candidates,
        plays: 0,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ id: data.id, created: true });
  } catch (error: any) {
    console.error('월드컵 저장 오류:', error);
    return NextResponse.json(
      { error: error.message || '저장 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
