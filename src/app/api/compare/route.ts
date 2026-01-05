import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

/**
 * AI 비교 설명 API
 * 두 후보를 비교하여 실시간 스트리밍 설명 제공
 */
export async function POST(req: NextRequest) {
  try {
    const { candidate1, candidate2, topic } = await req.json();

    const model = google('gemma-3-27b-it');

    const result = await streamText({
      model,
      prompt: `당신은 재치있고 공정한 월드컵 해설자입니다.

주제: ${topic}

대결:
- ${candidate1.name}: ${candidate1.description}
VS
- ${candidate2.name}: ${candidate2.description}

두 후보를 **30자 이내**로 비교 분석해주세요.
형식: "${candidate1.name}은 [특징], ${candidate2.name}은 [특징]"

예시:
- "장원영은 우아한 비주얼, 카리나는 카리스마 넘치는 무대장악력"
- "스시조 마사는 정통 에도마에, 스시 사이토는 혁신적인 창작 스타일"`,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('비교 설명 오류:', error);
    return NextResponse.json(
      { error: error.message || '비교 설명 생성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
