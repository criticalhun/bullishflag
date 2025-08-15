// src/app/api/favorites/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle';
import { favoriteCoins } from '@/lib/schema';
import { and, eq } from 'drizzle-orm';

// GET: Lekéri a felhasználó kedvenceit
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json([]);
    }
    
    // Kedvencek lekérdezése (Drizzle szintaxis)
    const favorites = await db.select({ 
      coinId: favoriteCoins.coinId 
    }).from(favoriteCoins).where(eq(favoriteCoins.userId, session.user.id));

    return NextResponse.json(favorites.map(fav => fav.coinId));

  } catch (error) {
    console.error("Favorites GET Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST: Hozzáad/eltávolít egy kedvencet
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { coinId, symbol } = await req.json();

    if (!coinId || !symbol) {
      return NextResponse.json({ error: 'Missing coinId or symbol' }, { status: 400 });
    }

    const userId = session.user.id;
    
    // Ellenőrizzük, létezik-e már a kedvenc (Drizzle szintaxis)
    const existingFavorite = await db.query.favoriteCoins.findFirst({
        where: and(eq(favoriteCoins.userId, userId), eq(favoriteCoins.coinId, coinId)),
    });

    if (existingFavorite) {
      // Ha létezik, töröljük (Drizzle szintaxis)
      await db.delete(favoriteCoins).where(eq(favoriteCoins.id, existingFavorite.id));
      return NextResponse.json({ message: 'Favorite removed' });
    } else {
      // Ha nem létezik, hozzáadjuk (Drizzle szintaxis)
      await db.insert(favoriteCoins).values({
        id: crypto.randomUUID(), // Drizzle nem generál ID-t
        userId,
        coinId,
        symbol,
      });
      return NextResponse.json({ message: 'Favorite added' });
    }
  } catch (error) {
    console.error("Favorites POST Error:", error);
    return NextResponse.json({ error: 'Failed to update favorite' }, { status: 500 });
  }
}