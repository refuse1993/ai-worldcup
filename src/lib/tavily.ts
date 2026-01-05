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
 * Wikipedia에서 이미지와 설명 가져오기
 */
async function getWikipediaInfo(name: string): Promise<{
  imageUrl: string;
  description: string;
} | null> {
  try {
    // 한국어 Wikipedia API 호출
    const response = await fetch(
      `https://ko.wikipedia.org/w/api.php?` +
        new URLSearchParams({
          action: 'query',
          format: 'json',
          prop: 'pageimages|pageterms|extracts',
          titles: name,
          pithumbsize: '500',
          exintro: 'true',
          explaintext: 'true',
          exsentences: '2',
          origin: '*',
        })
    );

    if (!response.ok) return null;

    const data = await response.json();
    const pages = data.query?.pages;

    if (!pages) return null;

    const page: WikipediaPage = Object.values(pages)[0] as WikipediaPage;

    if (page.pageid === -1) {
      // 한국어 없으면 영어로 시도
      const enResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?` +
          new URLSearchParams({
            action: 'query',
            format: 'json',
            prop: 'pageimages|pageterms|extracts',
            titles: name,
            pithumbsize: '500',
            exintro: 'true',
            explaintext: 'true',
            exsentences: '2',
            origin: '*',
          })
      );

      if (!enResponse.ok) return null;

      const enData = await enResponse.json();
      const enPages = enData.query?.pages;

      if (!enPages) return null;

      const enPage: WikipediaPage = Object.values(enPages)[0] as WikipediaPage;

      return {
        imageUrl: enPage.thumbnail?.source || '',
        description: enPage.extract || enPage.description || '',
      };
    }

    return {
      imageUrl: page.thumbnail?.source || '',
      description: page.extract || page.description || '',
    };
  } catch (error) {
    console.error(`Wikipedia 정보 가져오기 실패 (${name}):`, error);
    return null;
  }
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
    // Tavily로 후보 이름 검색
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: `${topic} top ${count * 2} list ranking`, // 중복 대비 2배 검색
        search_depth: 'basic',
        include_images: false,
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
    const namesList: string[] = [];

    for (const result of data.results) {
      const name = result.title.split(/[-–|]/)[0].trim();

      // 중복 체크 (대소문자 무시)
      const normalizedName = name.toLowerCase().replace(/\s+/g, '');

      if (!uniqueNames.has(normalizedName) && name.length > 1 && name.length < 50) {
        uniqueNames.add(normalizedName);
        namesList.push(name);

        if (namesList.length >= count) break;
      }
    }

    // Wikipedia에서 이미지와 설명 가져오기
    const candidates = await Promise.all(
      namesList.map(async (name) => {
        const wikiInfo = await getWikipediaInfo(name);

        return {
          name,
          description: wikiInfo?.description?.slice(0, 100) || `${topic} 관련 후보`,
          imageUrl: wikiInfo?.imageUrl || 'https://via.placeholder.com/500?text=' + encodeURIComponent(name),
        };
      })
    );

    // 이미지가 있는 후보만 필터링
    const validCandidates = candidates.filter(c => c.imageUrl && !c.imageUrl.includes('placeholder'));

    // 부족하면 placeholder 포함
    if (validCandidates.length < count) {
      return [...validCandidates, ...candidates.slice(validCandidates.length)].slice(0, count);
    }

    return validCandidates.slice(0, count);
  } catch (error) {
    console.error('후보 검색 오류:', error);
    throw error;
  }
}
