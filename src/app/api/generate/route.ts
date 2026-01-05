import { NextRequest, NextResponse } from 'next/server';
import { searchCandidates } from '@/lib/tavily';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

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

    const result = await generateText({
      model,
      prompt: `다음은 "${topic}" 주제로 검색된 후보 목록입니다:

${JSON.stringify(rawCandidates, null, 2)}

위 데이터를 분석하여:
1. 중복 제거 (같은 인물/장소는 하나만)
2. 이름을 간결하게 정리
3. 설명을 40자 이내로 요약
4. 정확히 16개의 후보만 반환

반드시 아래 형식의 유효한 JSON만 출력하세요 (다른 텍스트 없이):
{
  "candidates": [
    {
      "name": "후보 이름",
      "description": "간단한 설명 (40자 이내)",
      "imageUrl": "이미지 URL"
    }
  ]
}`,
    });

    // JSON 파싱
    const text = result.text.trim();

    // JSON 추출 (코드 블록이나 다른 텍스트가 있을 수 있음)
    let jsonText = text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const parsed = JSON.parse(jsonText);

    // 16개 후보 검증
    if (!parsed.candidates || parsed.candidates.length !== 16) {
      throw new Error('16개의 후보가 생성되지 않았습니다');
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('생성 오류:', error);
    return NextResponse.json(
      { error: error.message || '월드컵 생성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
