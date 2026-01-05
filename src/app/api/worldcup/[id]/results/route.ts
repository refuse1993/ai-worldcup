import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * 월드컵 우승자 랭킹 조회
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 해당 월드컵의 모든 결과 조회 (우승자별 집계)
    const { data, error } = await supabase
      .from('results')
      .select('winner_name, winner_image')
      .eq('worldcup_id', id);

    if (error) {
      console.error('랭킹 조회 오류:', error);
      return NextResponse.json({ error: '랭킹을 가져올 수 없습니다' }, { status: 500 });
    }

    // 우승자별 카운트
    const rankings = (data || []).reduce((acc: any, result: any) => {
      const name = result.winner_name;
      if (!acc[name]) {
        acc[name] = {
          name,
          image: result.winner_image,
          count: 0,
        };
      }
      acc[name].count++;
      return acc;
    }, {});

    // 배열로 변환하고 정렬
    const sortedRankings = Object.values(rankings)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10); // Top 10

    return NextResponse.json({
      rankings: sortedRankings,
      totalPlays: data?.length || 0,
    });
  } catch (error: any) {
    console.error('랭킹 조회 오류:', error);
    return NextResponse.json(
      { error: error.message || '랭킹 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

/**
 * 우승자 결과 저장
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { winner_name, winner_image } = await req.json();

    // 결과 저장
    const { error } = await supabase
      .from('results')
      .insert({
        worldcup_id: id,
        winner_name,
        winner_image,
      });

    if (error) {
      console.error('결과 저장 오류:', error);
      return NextResponse.json({ error: '결과를 저장할 수 없습니다' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('결과 저장 오류:', error);
    return NextResponse.json(
      { error: error.message || '결과 저장 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
