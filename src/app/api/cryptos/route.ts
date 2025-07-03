import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const CMC_API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const time = searchParams.get('time') || '24h';
  const limit = searchParams.get('limit') || '100';

  const headers = {
    'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY!,
  };

  try {
    const response = await axios.get(CMC_API_URL, {
      headers,
      params: {
        start: 1,
        limit,
        convert: 'USD',
        sort: 'market_cap',
        sort_dir: 'desc',
      },
    });

    return NextResponse.json(response.data);
  } catch (err: any) {
    return NextResponse.json({ error: 'API Error', message: err.message }, { status: 500 });
  }
}
