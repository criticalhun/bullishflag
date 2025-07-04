'use client';

import { useEffect, useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import ChatWithAI from '@/components/ChatWithAI';   // <<< EZT ADD HOZZÁ

type Coin = {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
      percent_change_24h: number;
      percent_change_7d?: number;
      percent_change_30d?: number;
      percent_change_90d?: number;
    };
  };
};

const timeOptions = [
  { label: '24 Hours', value: '24h' },
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
];

const limitOptions = [100, 500, 1000, 2000, 5000] as const;

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [limit, setLimit] = useState<number>(100);
  const [time, setTime] = useState('24h');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/cryptos?limit=${limit}&time=${time}`)
      .then((res) => res.json())
      .then((data) => {
        setCoins(data.data || []);
        setLoading(false);
      });
  }, [limit, time]);

  const getPercentageChange = (coin: Coin) => {
    switch (time) {
      case '7d': return coin.quote.USD.percent_change_7d;
      case '30d': return coin.quote.USD.percent_change_30d;
      case '90d': return coin.quote.USD.percent_change_90d;
      default: return coin.quote.USD.percent_change_24h;
    }
  };

  // Csak a top 10-t jelenítjük meg
  const topCoins = coins
    .sort((a, b) => (getPercentageChange(b) ?? 0) - (getPercentageChange(a) ?? 0))
    .slice(0, 10);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center w-full">
          BullishFlag.xyz – Top Performing Coins
        </h1>
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <label className="text-sm">
          Limit:
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="ml-2 p-1 border rounded dark:bg-black dark:border-gray-600"
          >
            {limitOptions.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          Timeframe:
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="ml-2 p-1 border rounded dark:bg-black dark:border-gray-600"
          >
            {timeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className="text-blue-500 text-center">Loading data...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm sm:text-base border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-left">
                <th className="p-2">#</th>
                <th className="p-2">Coin</th>
                <th className="p-2">Price (USD)</th>
                <th className="p-2">% Change ({time})</th>
              </tr>
            </thead>
            <tbody>
              {topCoins.map((coin, i) => (
                <tr key={coin.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2 font-semibold">{coin.name} ({coin.symbol})</td>
                  <td className="p-2">${coin.quote.USD.price.toFixed(2)}</td>
                  <td className={`p-2 ${getPercentageChange(coin)! >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {getPercentageChange(coin)?.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ITT HÍVD MEG AZ AI CHAT KOMPONENST */}
      <ChatWithAI />
    </main>
  );
}
