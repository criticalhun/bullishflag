// src/app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { searchWeb } from '@/lib/searchWeb';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  // SYSTEM üzenet a prompt stílusához – csak címsorokat várunk
  const systemMessage = {
    role: 'system',
    content: `
You are CryptoBot, an AI assistant specialized in cryptocurrencies.
When asked for “news headlines,” you must return exactly the titles of the top web search results, each as an item, without extra commentary or price stats.
`.trim(),
  };

  try {
    // 1. Lekérjük a keresési eredményeket (például a SerpAPI-t használva)
    const newsResults = await searchWeb(prompt);

    // 2. Visszaadjuk őket a frontendnek egy answer kulcs alatt – TÖMBBEN!
    // Példa:
    // [{ title: "Bitcoin breaks $100K", link: "https://news.com/article" }, ...]
    return NextResponse.json({ answer: newsResults });
  } catch (err) {
    let message = 'API error';
    if (err && typeof err === 'object' && 'message' in err) {
      message = (err as { message?: string }).message || message;
    }
    return NextResponse.json({ error: 'API error', message }, { status: 500 });
  }
}
