import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * 인기 월드컵 목록 (재생 횟수 순)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const { data, error } = await supabase
      .from('worldcups')
      .select('id, topic, plays, created_at')
      .order('plays', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return NextResponse.json({ worldcups: data || [] });
  } catch (error: any) {
    console.error('인기 월드컵 조회 오류:', error);
    return NextResponse.json(
      { error: error.message || '조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
