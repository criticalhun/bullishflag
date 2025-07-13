// src/app/favorites/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react'; // ÚJ IMPORT
import { Star } from 'lucide-react'; // ÚJ IMPORT

// A Coin típust újrahasznosítjuk
type Coin = {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
      percent_change_24h: number;
    };
  };
};

export default function FavoritesPage() {
  const { data: session } = useSession(); // ÚJ: Session adatok lekérése
  const [favoriteCoins, setFavoriteCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  // ÚJ: Funkció a kedvencek eltávolításához
  const handleUnfavorite = async (coinId: number, symbol: string) => {
    // Optimista frissítés: Azonnal eltávolítjuk a coin-t a listából a jobb UI élményért
    setFavoriteCoins(prevFavorites => prevFavorites.filter(coin => coin.id !== coinId));

    // API hívás a háttérben, ami törli az adatbázisból
    await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coinId: String(coinId), symbol }),
    });
  };

  useEffect(() => {
    // Csak akkor töltjük be a kedvenceket, ha a felhasználó be van jelentkezve
    if (session?.user) {
      setLoading(true);
      fetch('/api/favorites/details')
        .then(res => res.json())
        .then(data => {
          setFavoriteCoins(data.data || []);
        })
        .finally(() => setLoading(false));
    } else {
      // Ha a felhasználó nincs bejelentkezve, kiürítjük a listát és leállítjuk a töltést
      setFavoriteCoins([]);
      setLoading(false);
    }
  }, [session]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to Main List
        </Link>
      </div>
      
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
        My Favorite Coins
      </h1>

      {loading ? (
        <p className="text-blue-500 text-center">Loading your favorites...</p>
      ) : !session ? (
        <p className="text-center text-gray-500">Please <Link href="/api/auth/signin" className="text-blue-500 hover:underline">sign in</Link> to see your favorites.</p>
      ) : favoriteCoins.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm sm:text-base border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-left">
                <th className="p-2 w-12">Fav</th> {/* ÚJ OSZLOP */}
                <th className="p-2">#</th>
                <th className="p-2">Coin</th>
                <th className="p-2">Price (USD)</th>
                <th className="p-2">% Change (24h)</th>
              </tr>
            </thead>
            <tbody>
              {favoriteCoins
                .sort((a, b) => b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h)
                .map((coin, i) => (
                  <tr key={coin.id} className="border-b dark:border-gray-700 hover:bg-gray-800">
                    {/* ÚJ: Csillag ikon a kedvencek eltávolításához */}
                    <td className="p-2 text-center">
                      <button onClick={() => handleUnfavorite(coin.id, coin.symbol)}>
                        <Star
                          className="cursor-pointer transition-colors text-yellow-400"
                          fill="currentColor"
                        />
                      </button>
                    </td>
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2 font-semibold">
                      <Link href={`/coins/${coin.symbol.toLowerCase()}`} className="text-blue-600 hover:underline">
                        {coin.name} ({coin.symbol})
                      </Link>
                    </td>
                    <td className="p-2">${coin.quote.USD.price.toFixed(2)}</td>
                    <td className={`p-2 ${coin.quote.USD.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {coin.quote.USD.percent_change_24h.toFixed(2)}%
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">You haven't added any coins to your favorites yet.</p>
      )}
    </main>
  );
}
