// src/app/api/favorites/details/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import axios from 'axios';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // 1. Lekérjük a kedvenc coinok ID-jait az adatbázisból
  const favoriteRecords = await prisma.favoriteCoin.findMany({
    where: { userId: session.user.id },
    select: { coinId: true },
  });

  const favoriteIds = favoriteRecords.map(fav => fav.coinId);

  if (favoriteIds.length === 0) {
    return NextResponse.json({ data: [] });
  }

  // 2. A CoinMarketCap API-tól lekérjük a kedvenc coinok részletes, aktuális adatait
  try {
    const response = await axios.get(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      {
        params: {
          id: favoriteIds.join(','),
          convert: 'USD',
        },
        headers: {
          'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        },
      }
    );
    
    const favoriteCoinsData = Object.values(response.data.data);
    return NextResponse.json({ data: favoriteCoinsData });

  } catch (error) {
    console.error("CMC API error on favorites lookup:", error);
    return NextResponse.json({ error: 'Failed to fetch favorite coin details' }, { status: 500 });
  }
}