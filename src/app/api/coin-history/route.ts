// src/app/api/coin-history/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const coinId = (searchParams.get('symbol') || 'bitcoin').toLowerCase();
  const days = searchParams.get('days') || '30'; // 1, 7, 30, 90, max, stb.

  // CoinGecko endpoint:
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`;

  try {
    const response = await fetch(url);

    // Ha nem sikeres a fetch vagy hibás választ kapunk
    if (!response.ok) {
      return NextResponse.json({ error: 'CoinGecko API error', status: response.status }, { status: 502 });
    }

    const data = await response.json();

    // Ha a válaszban nincs prices mező (pl. nem létező coinId)
    if (!data.prices) {
      return NextResponse.json({ error: 'No chart data from CoinGecko', data: { quotes: [] } });
    }

    // Átalakítás a chart komponenshez (opcionális)
    const quotes = (data.prices || []).map(
      ([timestamp, price]: [number, number]) => ({
        timestamp: new Date(timestamp).toISOString(),
        price,
      })
    );

    return NextResponse.json({ data: { quotes } });

  } catch (err) {
    return NextResponse.json({ error: 'Server error', message: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
