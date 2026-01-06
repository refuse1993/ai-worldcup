import { NextRequest, NextResponse } from 'next/server';
import { getWikipediaInfo } from '@/lib/tavily';
import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

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

    // Step 1: AI로 주제 분석 및 검색 쿼리 최적화
    console.log(`🤖 AI로 주제 분석 중...`);
    const model = groq('llama-3.3-70b-versatile');

    const analysisResult = await generateText({
      model,
      prompt: `주제: "${topic}"

이 주제를 분석하고 다음 정보를 JSON 형식으로 출력하세요:

{
  "isLocationBased": true/false (맛집, 카페, 음식점, 장소, 여행지 등 물리적 위치가 있는 주제인지),
  "optimizedQuery": "웹 검색에 최적화된 검색어 (모호한 단어는 구체화, 최신 정보를 위해 연도 추가)"
}

JSON만 출력하세요 (다른 텍스트 없이):`,
    });

    let analysisText = analysisResult.text.trim();
    const analysisMatch = analysisText.match(/\{[\s\S]*\}/);
    if (analysisMatch) {
      analysisText = analysisMatch[0];
    }

    const { isLocationBased, optimizedQuery } = JSON.parse(analysisText);
    console.log(`📍 위치 기반: ${isLocationBased ? 'YES' : 'NO'}`);
    console.log(`🔍 최적화된 검색어: "${optimizedQuery}"`);

    // Step 2: Tavily로 검색
    const tavilyResponse = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query: optimizedQuery,
        search_depth: 'advanced',
        include_images: true,
        max_results: 10,
      }),
    });

    if (!tavilyResponse.ok) {
      throw new Error(`Tavily API 오류: ${tavilyResponse.statusText}`);
    }

    const tavilyData = await tavilyResponse.json();

    // Step 3: AI로 실제 이름 추출
    console.log('🤖 AI로 실제 이름 추출 중...');

    const extractionPrompt = isLocationBased
      ? `다음은 "${topic}" 주제로 검색된 웹 검색 결과입니다:

${tavilyData.results.map((r: any) => `제목: ${r.title}\n내용: ${r.content}`).join('\n\n---\n\n')}

위 검색 결과에서 실제 장소/음식점을 정확히 16개 추출하고, 각각에 대한 정보를 작성하세요.

중요:
- 실제 장소 이름만 추출 (기사 제목 X)
- 각 항목의 특징을 간결하게 설명 (30자 이내)
- 주소 정보 반드시 포함
- 중복 제거
- 정확히 16개

다음 형식의 JSON만 출력 (다른 텍스트 없이):
[
  {"name": "장소명", "description": "간단한 설명", "address": "주소"},
  {"name": "장소명2", "description": "간단한 설명2", "address": "주소2"}
]`
      : `다음은 "${topic}" 주제로 검색된 웹 검색 결과입니다:

${tavilyData.results.map((r: any) => `제목: ${r.title}\n내용: ${r.content}`).join('\n\n---\n\n')}

위 검색 결과에서 실제 작품/인물/항목을 정확히 16개 추출하고, 각각에 대한 간단한 설명(30자 이내)을 작성하세요.

중요:
- 기사 제목이 아닌, 실제 이름만 추출
- 각 항목의 특징을 간결하게 설명
- 중복 제거
- 정확히 16개

다음 형식의 JSON만 출력 (다른 텍스트 없이):
[
  {"name": "이름1", "description": "간단한 설명"},
  {"name": "이름2", "description": "간단한 설명"}
]`;

    const result = await generateText({
      model,
      prompt: extractionPrompt,
    });

    // JSON 파싱
    let jsonText = result.text.trim();
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const extractedItems: Array<{ name: string; description: string; address?: string }> = JSON.parse(jsonText);

    // Step 4: 각 이름마다 개별 이미지 검색
    console.log(`📷 각 항목의 이미지 검색 중... (${extractedItems.length}개)`);

    const candidates = await Promise.all(
      extractedItems.slice(0, 16).map(async (item) => {
        // 개별 Tavily 이미지 검색 (위치 기반은 실제 사진)
        const imageQuery = isLocationBased
          ? `${item.name} ${item.address || ''} 외관 내부 사진`
          : `${item.name} 공식 포스터 이미지`;

        const imageResponse = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: apiKey,
            query: imageQuery,
            include_images: true,
            max_results: 3,
          }),
        });

        const imageData = await imageResponse.json();

        // 네이버/다음 등 핫링킹 차단 도메인 필터링
        const blockedDomains = ['pstatic.net', 'kakaocdn.net', 'daumcdn.net'];
        const validImages = (imageData.images || []).filter((url: string) =>
          !blockedDomains.some(domain => url.includes(domain))
        );
        const tavilyImage = validImages[0];

        // Wikipedia 이미지 (fallback)
        const wikiInfo = await getWikipediaInfo(item.name);

        return {
          name: item.name,
          description: item.description, // AI가 생성한 설명 사용
          imageUrl:
            tavilyImage ||
            wikiInfo?.imageUrl ||
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="500"%3E%3Crect width="500" height="500" fill="%23' +
              Math.floor(Math.random() * 16777215).toString(16) +
              '"%3E%3C/rect%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle"%3E' +
              encodeURIComponent(item.name) +
              '%3C/text%3E%3C/svg%3E',
          ...(item.address && { address: item.address }), // 주소가 있으면 포함
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
