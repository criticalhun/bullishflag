'use client';

import { useEffect, useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import PerformanceChart from '@/components/PerformanceChart';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import ChatWithAI from '@/components/ChatWithAI';
import { Separator } from "@/components/ui/separator"

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
] as const;

const limitOptions = [100, 500, 1000, 2000, 5000] as const;

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [limit, setLimit] = useState<number>(100);
  const [time, setTime] = useState<typeof timeOptions[number]['value']>('24h');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/cryptos?limit=${limit}&time=${time}`)
      .then(res => res.json())
      .then(data => {
        setCoins(data.data || []);
        setLoading(false);
      });
  }, [limit, time]);

  const getPercentageChange = (coin: Coin) => {
    switch (time) {
      case '7d':  return coin.quote.USD.percent_change_7d;
      case '30d': return coin.quote.USD.percent_change_30d;
      case '90d': return coin.quote.USD.percent_change_90d;
      default:    return coin.quote.USD.percent_change_24h;
    }
  };

  // Top 10 sorted by selected timeframe
  const topCoins = coins
    .sort((a, b) => (getPercentageChange(b) ?? 0) - (getPercentageChange(a) ?? 0))
    .slice(0, 10);

  // Chart adat a PerformanceChart számára
  const chartData = topCoins.map(coin => ({
    name: coin.symbol,
    value: getPercentageChange(coin) ?? 0,
  }));

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
        {/* LIMIT SELECT (shadcn-ui) */}
        <div className="text-sm flex items-center">
          <span className="mr-2">Limit:</span>
          <Select value={limit.toString()} onValueChange={val => setLimit(Number(val))}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select limit" />
            </SelectTrigger>
            <SelectContent>
              {limitOptions.map(n => (
                <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* TIMEFRAME SELECT (shadcn-ui) */}
        <div className="text-sm flex items-center">
          <span className="mr-2">Timeframe:</span>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* PERFORMANCE CHART (opcionális, ha van ilyen komponens) */}
      <PerformanceChart data={chartData} rangeLabel={time} />

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

      {/* AI Chat box */}
      <ChatWithAI />
    </main>
  );
}
