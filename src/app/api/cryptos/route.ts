import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const CMC_API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get('limit') || '100';
  // Ha a time paramétert nem használja a CMC API, nem kell külön változóban.

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
  } catch (err) {
    // Az 'err' típusa legyen unknown, és csak ha Error, akkor van .message
    let message = 'API Error';
    if (err && typeof err === 'object' && 'message' in err) {
      message = (err as { message?: string }).message || message;
    }
    return NextResponse.json({ error: 'API Error', message }, { status: 500 });
  }
}
