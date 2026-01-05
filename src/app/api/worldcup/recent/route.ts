import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * 최근 생성된 월드컵 목록
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const { data, error } = await supabase
      .from('worldcups')
      .select('id, topic, plays, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return NextResponse.json({ worldcups: data || [] });
  } catch (error: any) {
    console.error('최근 월드컵 조회 오류:', error);
    return NextResponse.json(
      { error: error.message || '조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
