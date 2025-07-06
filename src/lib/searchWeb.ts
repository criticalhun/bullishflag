// src/lib/searchWeb.ts

export interface SearchResult {
  title: string;
  snippet: string;
}

export async function searchWeb(query: string): Promise<SearchResult[]> {
  const API_KEY = process.env.SERPAPI_KEY!;
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
  // Vegyük az első 3 organikus találatot
  const results = (data.organic_results || [])
    .slice(0, 3)
    .map((r: any) => ({
      title: r.title,
      snippet: r.snippet,
    }));

  return results;
}
