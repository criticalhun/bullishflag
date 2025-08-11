// src/app/coins/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DexScreenerChart from '@/components/DexScreenerChart';
import TradingViewChart from '@/components/TradingViewChart';

// Ez a típus leírja, milyen adatokat várunk a coinról.
// Igazítsd a valós API válaszodhoz, ha szükséges.
type CoinDetails = {
  name: string;
  symbol: string;
  cmc_rank: number;
  platform?: {
    token_address: string;
  };
  quote: {
    USD: {
      price: number;
      market_cap: number;
      volume_24h: number;
    };
  };
};

export default function CoinDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const [coin, setCoin] = useState<CoinDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetch(`/api/coin-details?symbol=${slug}`)
        .then(res => res.json())
        .then(data => {
          setCoin(data.data || null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return <div className="text-center py-10">Loading coin data...</div>;
  }

  if (!coin) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="text-blue-500 hover:underline">
            &larr; Back to Main Page
          </Link>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Coin Not Found</h1>
          <p className="text-gray-500 mt-2">The coin you are looking for could not be found.</p>
        </div>
      </main>
    );
  }

  const pairAddress = coin.platform?.token_address;
  const quote = coin.quote.USD;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to Main Page
        </Link>
      </div>

      <div className="flex items-center space-x-4 mb-8">
        <h1 className="text-4xl font-bold">{coin.name}</h1>
        <span className="text-2xl text-gray-400">({coin.symbol})</span>
        <span className="text-sm bg-gray-700 text-gray-200 px-2 py-1 rounded-md">
          Rank #{coin.cmc_rank}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-md">
          <p className="text-gray-400 text-sm">Price</p>
          <p className="text-2xl font-semibold">${quote.price.toFixed(4)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-md">
          <p className="text-gray-400 text-sm">Market Cap</p>
          <p className="text-2xl font-semibold">${quote.market_cap.toLocaleString('en-US')}</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-md">
          <p className="text-gray-400 text-sm">24h Volume</p>
          <p className="text-2xl font-semibold">${quote.volume_24h.toLocaleString('en-US')}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Live Chart</h2>
        {pairAddress ? (
          <DexScreenerChart pairAddress={pairAddress} />
        ) : (
          <TradingViewChart symbol={coin.symbol} />
        )}
      </div>
    </main>
  );
}