import { NextRequest, NextResponse } from 'next/server';
import { getWikipediaInfo } from '@/lib/tavily';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: '주제를 입력해주세요' }, { status: 400 });
    }

    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      throw new Error('TAVILY_API_KEY가 설정되지 않았습니다');
    }

    // Step 1: Tavily로 검색
    console.log(`🔍 주제 "${topic}" 검색 중...`);
    const tavilyResponse = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query: `${topic} 제목 목록 리스트`,
        search_depth: 'advanced',
        max_results: 10,
      }),
    });

    if (!tavilyResponse.ok) {
      throw new Error(`Tavily API 오류: ${tavilyResponse.statusText}`);
    }

    const tavilyData = await tavilyResponse.json();

    // Step 2: Gemini 2.5 Flash Lite로 실제 이름 추출
    console.log('🤖 AI로 실제 이름 추출 중...');
    const model = google('gemini-2.5-flash-lite');

    const result = await generateText({
      model,
      prompt: `다음은 "${topic}" 주제로 검색된 웹 검색 결과입니다:

${tavilyData.results.map((r: any) => `제목: ${r.title}\n내용: ${r.content}`).join('\n\n---\n\n')}

위 검색 결과에서 실제 작품/인물/항목의 이름을 정확히 16개 추출하세요.

중요:
- 기사 제목이 아닌, 실제 이름만 추출
- 예: "Top 15 Korean Dramas" ❌ → "오징어 게임", "더 글로리" ✅
- 중복 제거
- 정확히 16개

다음 형식의 JSON만 출력 (다른 텍스트 없이):
["이름1", "이름2", "이름3", ...]`,
    });

    // JSON 파싱
    let jsonText = result.text.trim();
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const names: string[] = JSON.parse(jsonText);

    // Step 3: Wikipedia로 이미지/설명 가져오기
    console.log(`📷 Wikipedia에서 정보 가져오는 중... (${names.length}개)`);
    const candidates = await Promise.all(
      names.slice(0, 16).map(async (name: string) => {
        const wikiInfo = await getWikipediaInfo(name);
        return {
          name,
          description: wikiInfo?.description?.slice(0, 100) || `${topic} 관련`,
          imageUrl:
            wikiInfo?.imageUrl ||
            `https://via.placeholder.com/500?text=${encodeURIComponent(name)}`,
        };
      })
    );

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
