// src/app/api/coin-details/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol parameter is required' },
      { status: 400 }
    );
  }

  const CMC_API_KEY = process.env.CMC_API_KEY;

  if (!CMC_API_KEY) {
    return NextResponse.json(
      { error: 'CMC API key not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await axios.get(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      {
        params: {
          symbol: symbol.toUpperCase(), // Fontos, hogy nagybetűs legyen
          convert: 'USD',
        },
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
        },
      }
    );

    // A válaszban a kért szimbólum adatait keressük
    const coinData = response.data.data[symbol.toUpperCase()];

    if (!coinData) {
        return NextResponse.json({ error: 'Coin not found' }, { status: 404 });
    }

    return NextResponse.json({ data: coinData });

  } catch (err) {
    console.error('CMC API Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch data from CoinMarketCap' },
      { status: 500 }
    );
  }
}
