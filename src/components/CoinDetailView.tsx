// src/components/CoinDetailView.tsx
'use client';

import DexScreenerChart from '@/components/DexScreenerChart';
import TradingViewChart from '@/components/TradingViewChart';

// Típusok definiálása a 'coin' prop-hoz
interface Platform {
  token_address: string;
}

interface Quote {
  price: number;
  market_cap: number;
  volume_24h: number;
}

interface CoinData {
  name: string;
  symbol: string;
  cmc_rank: number;
  platform?: Platform;
  quote: {
    USD: Quote;
  };
}

export default function CoinDetailView({ coin }: { coin: CoinData }) {
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
        {pairAddress ? (
          <DexScreenerChart pairAddress={pairAddress} />
        ) : (
          <TradingViewChart symbol={coin.symbol} />
        )}
      </div>
    </div>
  );
}