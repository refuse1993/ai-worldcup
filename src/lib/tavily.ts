/**
 * Tavily Search + Wikipedia Image API
 * 정확한 이미지 매칭을 위해 Wikipedia 통합
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

interface WikipediaPage {
  pageid: number;
  title: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  description?: string;
  extract?: string;
}

/**
 * Wikipedia에서 이미지와 설명 가져오기 (최적화: 타임아웃 5초)
 */
export async function getWikipediaInfo(name: string): Promise<{
  imageUrl: string;
  description: string;
} | null> {
  try {
    // 타임아웃 5초
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    // 한국어 Wikipedia만 시도 (영어 시도 제거로 시간 절약)
    const response = await fetch(
      `https://ko.wikipedia.org/w/api.php?` +
        new URLSearchParams({
          action: 'query',
          format: 'json',
          prop: 'pageimages|extracts',
          titles: name,
          pithumbsize: '500',
          exintro: 'true',
          explaintext: 'true',
          exsentences: '1',
          origin: '*',
        }),
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    if (!response.ok) return null;

    const data = await response.json();
    const pages = data.query?.pages;

    if (!pages) return null;

    const page: WikipediaPage = Object.values(pages)[0] as WikipediaPage;

    // 페이지가 없거나 이미지가 없으면 null 반환
    if (page.pageid === -1 || !page.thumbnail) {
      return null;
    }

    return {
      imageUrl: page.thumbnail.source,
      description: page.extract || `${name} 관련 정보`,
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error(`Wikipedia 타임아웃 (${name})`);
    }
    return null;
  }
}

/**
 * 배치 단위로 병렬 처리 (Netlify 타임아웃 대비)
 */
async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 5
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }

  return results;
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
    console.log(`🔍 주제 "${topic}" 검색 중...`);

    // Tavily로 후보 이름 + 이미지 검색
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: `${topic} top ${count * 2} list ranking`,
        search_depth: 'basic',
        include_images: true, // Tavily 이미지를 fallback으로 사용
        include_answer: false,
        max_results: count * 2,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API 오류: ${response.statusText}`);
    }

    const data: TavilyResponse = await response.json();

    // 이름 추출 및 중복 제거
    const uniqueNames = new Set<string>();
    const namesList: { name: string; tavilyImage?: string }[] = [];

    for (let i = 0; i < data.results.length; i++) {
      const result = data.results[i];
      const name = result.title.split(/[-–|]/)[0].trim();
      const normalizedName = name.toLowerCase().replace(/\s+/g, '');

      if (!uniqueNames.has(normalizedName) && name.length > 1 && name.length < 50) {
        uniqueNames.add(normalizedName);
        namesList.push({
          name,
          tavilyImage: data.images[i], // Tavily 이미지 저장
        });

        if (namesList.length >= count) break;
      }
    }

    console.log(`📷 Wikipedia에서 이미지 가져오는 중... (${namesList.length}개)`);

    // Wikipedia에서 이미지 가져오기 (5개씩 배치)
    const candidates = await processBatch(
      namesList,
      async ({ name, tavilyImage }) => {
        const wikiInfo = await getWikipediaInfo(name);

        return {
          name,
          description: wikiInfo?.description?.slice(0, 100) || `${topic} 관련`,
          // Wikipedia 이미지 우선, 없으면 Tavily 이미지 사용
          imageUrl: wikiInfo?.imageUrl || tavilyImage || 'https://via.placeholder.com/500?text=' + encodeURIComponent(name),
        };
      },
      5 // 5개씩 배치 처리
    );

    console.log(`✅ 후보 생성 완료 (${candidates.length}개)`);

    // placeholder 제외하고 반환
    const validCandidates = candidates.filter(c => c.imageUrl && !c.imageUrl.includes('placeholder'));

    // 부족하면 placeholder 포함
    if (validCandidates.length < count) {
      return [...validCandidates, ...candidates.filter(c => c.imageUrl.includes('placeholder'))].slice(0, count);
    }

    return validCandidates.slice(0, count);
  } catch (error) {
    console.error('후보 검색 오류:', error);
    throw error;
  }
}
