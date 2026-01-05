import { NextRequest, NextResponse } from 'next/server';
import { searchCandidates } from '@/lib/tavily';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

const candidateSchema = z.object({
  candidates: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      imageUrl: z.string(),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: '주제를 입력해주세요' }, { status: 400 });
    }

    // Step 1: Tavily로 후보 검색
    console.log(`🔍 주제 "${topic}" 검색 중...`);
    const rawCandidates = await searchCandidates(topic, 16);

    // Step 2: Gemma로 중복 제거 및 정제
    console.log('🤖 AI로 데이터 정제 중...');
    const model = google('gemma-3-27b-it');

    const result = await streamObject({
      model,
      schema: candidateSchema,
      prompt: `다음은 "${topic}" 주제로 검색된 후보 목록입니다:

${JSON.stringify(rawCandidates, null, 2)}

위 데이터를 분석하여:
1. 중복 제거 (같은 인물/장소는 하나만)
2. 이름을 간결하게 정리
3. 설명을 40자 이내로 요약
4. 정확히 16개의 후보만 반환

결과를 JSON 형식으로 반환해주세요.`,
    });

    // Stream 결과를 반환
    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('생성 오류:', error);
    return NextResponse.json(
      { error: error.message || '월드컵 생성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
