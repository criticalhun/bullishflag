'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Star } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import PerformanceChart from '@/components/PerformanceChart';
import {
Select,
SelectTrigger,
SelectValue,
SelectContent,
SelectItem,
} from '@/components/ui/select';
import ChatWithAI from '@/components/ChatWithAI';
import LoginButton from '@/components/LoginButton';

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
const { data: session } = useSession();
const [coins, setCoins] = useState<Coin[]>([]);
const [favorites, setFavorites] = useState<string[]>([]);
const [limit, setLimit] = useState<number>(100);
const [time, setTime] = useState<typeof timeOptions[number]['value']>('24h');
const [loading, setLoading] = useState(false);

const fetchCoins = useCallback((showLoading: boolean) => {
if (showLoading) setLoading(true);
fetch(`/api/cryptos?limit=${limit}&time=${time}`)
.then((res) => res.json())
.then((data) => setCoins(data.data || []))
.finally(() => {
if (showLoading) setLoading(false);
});
}, [limit, time]);

useEffect(() => {
fetchCoins(true);
}, [fetchCoins]);

useEffect(() => {
const intervalId = setInterval(() => {
fetchCoins(false);
}, 60000);
return () => clearInterval(intervalId);
}, [fetchCoins]);

useEffect(() => {
if (session?.user) {
fetch('/api/favorites')
.then(res => res.json())
.then((favs) => {
if (Array.isArray(favs)) {
setFavorites(favs);
} else {
setFavorites([]);
}
})
.catch(console.error);
} else {
setFavorites([]);
}
}, [session]);

const handleFavoriteToggle = async (coinId: number, symbol: string) => {
if (!session) {
alert("Please sign in to add favorites.");
return;
}
const coinIdStr = String(coinId);

const newFavorites = favorites.includes(coinIdStr)
? favorites.filter(id => id !== coinIdStr)
: [...favorites, coinIdStr];
setFavorites(newFavorites);

await fetch('/api/favorites', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ coinId: coinIdStr, symbol }),
});
};

const getPercentageChange = (coin: Coin) => {
switch (time) {
case '7d': return coin.quote.USD.percent_change_7d;
case '30d': return coin.quote.USD.percent_change_30d;
case '90d': return coin.quote.USD.percent_change_90d;
default: return coin.quote.USD.percent_change_24h;
}
};

const topCoins = coins
.sort((a, b) => (getPercentageChange(b) ?? 0) - (getPercentageChange(a) ?? 0))
.slice(0, 10);

const chartData = topCoins.map((coin) => ({
name: coin.symbol,
value: getPercentageChange(coin) ?? 0,
}));

return (
<main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
<div className="w-full flex justify-end items-center gap-4 mb-4">
<LoginButton />
<ThemeToggle />
</div>

<h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
BullishFlag.xyz – Top Performing Coins
</h1>

<div className="flex flex-wrap gap-4 justify-center mb-6">
<div className="text-sm flex items-center">
<span className="mr-2">Limit:</span>
<Select
value={limit.toString()}
onValueChange={(val) => setLimit(Number(val))}
>
<SelectTrigger className="w-32">
<SelectValue placeholder="Select limit" />
</SelectTrigger>
<SelectContent>
{limitOptions.map((n) => (
<SelectItem key={n} value={n.toString()}>{n}</SelectItem>
))}
</SelectContent>
</Select>
</div>
<div className="text-sm flex items-center">
<span className="mr-2">Timeframe:</span>
<Select
value={time}
onValueChange={(val) => setTime(val as typeof time)}
>
<SelectTrigger className="w-36">
<SelectValue placeholder="Select timeframe" />
</SelectTrigger>
<SelectContent>
{timeOptions.map((opt) => (
<SelectItem key={opt.value} value={opt.value}>
{opt.label}
</SelectItem>
))}
</SelectContent>
</Select>
</div>
</div>

<PerformanceChart data={chartData} rangeLabel={time} />

{loading ? (
<p className="text-blue-500 text-center">Loading data...</p>
) : (
<div className="overflow-x-auto">
<table className="min-w-full text-sm sm:text-base border-collapse">
<thead>
<tr className="bg-gray-100 dark:bg-gray-800 text-left">
{/* --- JAVÍTÁS ITT: A "Fav" fejléc most már egy link --- */}
{session && (
<th className="p-2 w-12">
<Link href="/favorites" className="hover:underline">
Fav
</Link>
</th>
)}
<th className="p-2">#</th>
<th className="p-2">Coin</th>
<th className="p-2">Price (USD)</th>
<th className="p-2">% Change ({time})</th>
</tr>
</thead>
<tbody>
{topCoins.map((coin, i) => {
const isFavorite = Array.isArray(favorites) && favorites.includes(String(coin.id));
return (
<tr key={coin.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
{session && (
<td className="p-2 text-center">
<button onClick={() => handleFavoriteToggle(coin.id, coin.symbol)}>
<Star
className={`cursor-pointer transition-colors ${
isFavorite ? "text-yellow-400" : "text-gray-500 hover:text-yellow-300"
}`}
fill={isFavorite ? "currentColor" : "none"}
/>
</button>
</td>
)}
<td className="p-2">{i + 1}</td>
<td className="p-2 font-semibold">
<Link
href={`/coins/${coin.symbol.toLowerCase()}`}
className="text-blue-600 hover:underline"
>
{coin.name} ({coin.symbol})
</Link>
</td>
<td className="p-2">${coin.quote.USD.price.toFixed(2)}</td>
<td className={`p-2 ${getPercentageChange(coin)! >= 0 ? 'text-green-500' : 'text-red-500'}`}>
{getPercentageChange(coin)?.toFixed(2)}%
</td>
</tr>
);
})}
</tbody>
</table>
</div>
)}

<ChatWithAI topCoins={topCoins} />
</main>
);
}
