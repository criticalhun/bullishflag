// src/lib/searchWeb.ts

export interface SearchResult {
  title: string;
  snippet: string;
}

export async function searchWeb(query: string): Promise<SearchResult[]> {
  const API_KEY = process.env.SERPAPI_KEY;
  if (!API_KEY) {
    throw new Error("Missing SERPAPI_KEY in environment");
  }

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google");
  url.searchParams.set("q", query);
  url.searchParams.set("api_key", API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Search API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const organic = data.organic_results;
  if (!Array.isArray(organic)) {
    return [];
  }

  // Definiáljuk, mit várunk a találatokból
  type RawResult = { title: unknown; snippet: unknown };

  return (organic as RawResult[])
    .slice(0, 3)
    .map((r) => ({
      title: typeof r.title === "string" ? r.title : String(r.title),
      snippet:
        typeof r.snippet === "string" ? r.snippet : String(r.snippet),
    }));
}
