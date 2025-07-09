// src/app/coins/[slug]/page.tsx

import DexScreenerChart from '@/components/DexScreenerChart';
import TradingViewChart from '@/components/TradingViewChart'; // << ÚJ IMPORT
import { notFound } from 'next/navigation';

// Ez a funkció felel az adatok lekéréséért a szerveroldalon
async function getCoinDetails(symbol: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/api/coin-details?symbol=${symbol}`, {
      next: { revalidate: 600 }, // 10 perces gyorsítótár
    });

    if (!res.ok) {
      return null;
    }

    const jsonResponse = await res.json();
    return jsonResponse.data;
  } catch (error) {
    console.error('Failed to fetch coin details:', error);
    return null;
  }
}

// A komponens, ami megjeleníti az oldalt
export default async function CoinDetailPage({ params }: { params: { slug: string } }) {
  const symbol = params.slug.toUpperCase();
  const coin = await getCoinDetails(symbol);

  if (!coin) {
    notFound();
  }

  // Keressük meg a kontraktcímet. Az Ethereum láncot részesítjük előnyben.
  const platform = coin.platform;
  const pairAddress = platform?.token_address;

  const quote = coin.quote.USD;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center space-x-4 mb-8">
        <h1 className="text-4xl font-bold">{coin.name}</h1>
        <span className="text-2xl text-gray-400">({coin.symbol})</span>
        <span className="text-sm bg-gray-700 text-gray-200 px-2 py-1 rounded-md">
          Rank #{coin.cmc_rank}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Price</p>
          <p className="text-2xl font-semibold">${quote.price.toFixed(4)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Market Cap</p>
          <p className="text-2xl font-semibold">${quote.market_cap.toLocaleString('en-US')}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">24h Volume</p>
          <p className="text-2xl font-semibold">${quote.volume_24h.toLocaleString('en-US')}</p>
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Live Chart</h2>
        
        {/* === EZ A RÉSZ VÁLTOZOTT === */}
        {pairAddress ? (
          // Ha van kontraktcím, a DexScreener chart jön
          <DexScreenerChart pairAddress={pairAddress} />
        ) : (
          // Ha nincs, a TradingView chartot használjuk fallback-ként
          <TradingViewChart symbol={coin.symbol} />
        )}
        
      </div>
    </div>
  );
}