import { NextRequest, NextResponse } from 'next/server';
import { searchWeb } from '@/lib/searchWeb';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    // Példa: AI válasz + web keresés
    let newsResults: { title: string; link: string; snippet: string }[] = [];
    if (prompt && prompt.toLowerCase().includes('news')) {
      newsResults = await searchWeb(prompt);
    }

    return NextResponse.json({ answer: newsResults });
  } catch {
    return NextResponse.json(
      { error: 'API error', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
