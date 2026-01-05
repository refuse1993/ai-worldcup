import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * 저장된 월드컵 불러오기 (공유 링크용)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 월드컵 조회
    const { data, error } = await supabase
      .from('worldcups')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: '월드컵을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 재생 횟수 증가
    await supabase.rpc('increment_plays', { worldcup_uuid: id });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('월드컵 조회 오류:', error);
    return NextResponse.json(
      { error: error.message || '조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
