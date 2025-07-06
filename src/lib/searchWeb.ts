// src/lib/searchWeb.ts
export async function searchWeb(query: string): Promise<{ title: string, link: string }[]> {
  const API_KEY = process.env.SERPAPI_KEY!;
  const params = new URLSearchParams({
    q: query,
    api_key: API_KEY,
    engine: "google",
    hl: "en",
    num: "5" // max találat
  });

  const res = await fetch(`https://serpapi.com/search.json?${params}`);
  if (!res.ok) throw new Error("SerpAPI request failed");

  const data = await res.json();

  // Google hírekből, vagy sima találatból keresünk cím+link párokat
  const results: { title: string, link: string }[] = [];

  // Először Google News találatok
  if (data.news_results && Array.isArray(data.news_results)) {
    for (const n of data.news_results) {
      results.push({
        title: n.title,
        link: n.link
      });
    }
  }

  // Ha nincsenek news_results, próbáljunk sima találatokat
  if (results.length === 0 && data.organic_results && Array.isArray(data.organic_results)) {
    for (const n of data.organic_results) {
      results.push({
        title: n.title,
        link: n.link
      });
    }
  }

  return results;
}
