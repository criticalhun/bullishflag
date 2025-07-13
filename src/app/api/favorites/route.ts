// src/app/api/favorites/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // JAVÍTÁS ITT: Az új, központi helyről importálunk
import prisma from '@/lib/prisma';

// GET: Lekéri a felhasználó kedvenceit
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      // Ha nincs bejelentkezve, üres tömböt adunk vissza
      return NextResponse.json([]);
    }

    const favorites = await prisma.favoriteCoin.findMany({
      where: { userId: session.user.id },
      select: { coinId: true }, // Csak a coin ID-kat adjuk vissza
    });

    // A .map() biztosítja, hogy a válasz egy stringekből álló tömb legyen
    return NextResponse.json(favorites.map(fav => fav.coinId));

  } catch (error) {
    console.error("Favorites GET Error:", error);
    // Hiba esetén is egy üres tömböt adunk vissza, hogy a frontend ne törjön el
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

    const existingFavorite = await prisma.favoriteCoin.findUnique({
      where: {
        userId_coinId: { userId, coinId },
      },
    });

    if (existingFavorite) {
      await prisma.favoriteCoin.delete({
        where: { id: existingFavorite.id },
      });
      return NextResponse.json({ message: 'Favorite removed' });
    } else {
      await prisma.favoriteCoin.create({
        data: { userId, coinId, symbol },
      });
      return NextResponse.json({ message: 'Favorite added' });
    }
  } catch (error) {
    console.error("Favorites POST Error:", error);
    return NextResponse.json({ error: 'Failed to update favorite' }, { status: 500 });
  }
}