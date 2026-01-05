/**
 * Tavily Search API 래퍼
 * 무료 티어: 월 1,000 요청
 */

interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  images?: string[];
}

interface TavilyResponse {
  results: TavilySearchResult[];
  images: string[];
}

export async function searchCandidates(
  topic: string,
  count: number = 16
): Promise<{ name: string; imageUrl: string; description: string }[]> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    throw new Error('TAVILY_API_KEY가 설정되지 않았습니다');
  }

  try {
    // Tavily Search API 호출
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: `${topic} top ${count} list with images`,
        search_depth: 'basic',
        include_images: true,
        include_answer: false,
        max_results: count,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API 오류: ${response.statusText}`);
    }

    const data: TavilyResponse = await response.json();

    // 결과를 후보자 형식으로 변환
    const candidates = data.results.slice(0, count).map((result, index) => ({
      name: result.title.split('-')[0].trim() || `후보 ${index + 1}`,
      description: result.content.slice(0, 100),
      imageUrl: data.images[index] || '/placeholder.jpg',
    }));

    return candidates;
  } catch (error) {
    console.error('Tavily 검색 오류:', error);
    throw error;
  }
}
