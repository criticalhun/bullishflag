// src/app/coins/[slug]/page.tsx
import { notFound } from 'next/navigation';
import CoinDetailView from '@/components/CoinDetailView';

async function getCoinDetails(symbol: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/api/coin-details?symbol=${symbol}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const jsonResponse = await res.json();
    return jsonResponse.data;
  } catch (error) {
    console.error('Failed to fetch coin details:', error);
    return null;
  }
}

export default async function CoinDetailPage({ params }: { params: { slug: string } }) {
  const symbol = params.slug.toUpperCase();
  const coin = await getCoinDetails(symbol);

  if (!coin) {
    notFound();
  }

  return <CoinDetailView coin={coin} />;
}