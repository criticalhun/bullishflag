import { NextRequest, NextResponse } from 'next/server';
import { searchWeb } from '@/lib/searchWeb';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const lower = (prompt || '').toLowerCase();

    // If user is looking for news
    if (lower.includes('news')) {
      const newsResults = await searchWeb(prompt);
      if (newsResults.length > 0) {
        return NextResponse.json({ answer: newsResults });
      }
      return NextResponse.json({ answer: "No relevant news found." });
    }

    // If user asks for price, btc, coins, top, etc.
    if (
      lower.includes('price') ||
      lower.includes('btc') ||
      lower.includes('bitcoin') ||
      lower.includes('coin') ||
      lower.includes('top')
    ) {
      return NextResponse.json({
        answer: "You can see all current prices, top coins, and performance in the table above. Select any timeframe or list size for more details!"
      });
    }

    // Default fallback – answer only about crypto/markets
    return NextResponse.json({
      answer: "I can help with cryptocurrencies, prices, news, and market data. Try asking questions like 'bitcoin news', 'ethereum price', or 'top coins 7d'."
    });
  } catch {
    return NextResponse.json(
      { error: 'API error', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
