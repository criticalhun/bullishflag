'use client';

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart.js modulok regisztrálása
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Típusok definiálása a jobb típusbiztonság érdekében
interface CoinChartProps {
  coinId: string;
  days?: string;
}

// Definiáljuk, hogy milyen adatpontokat várunk a chart-hoz
interface ChartPoint {
  time: string;
  price: number;
}

// Definiáljuk a CoinGecko API válaszának egy részét
interface ApiPricePoint {
  prices: [number, number][];
}

export default function CoinChart({ coinId, days = '30' }: CoinChartProps) {
  // A chartData állapotát is pontosan tipizáljuk
  const [chartData, setChartData] = useState<ChartData<'line', number[], string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coinId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    fetch(`/api/coin-history?symbol=${coinId}&days=${days}`)
      .then((res) => res.json())
      .then((apiResponse: ApiPricePoint) => {
        // A válaszból kinyerjük a pontokat
        const points: ChartPoint[] = (apiResponse.prices || []).map(
          (p: [number, number]) => ({
            time: new Date(p[0]).toLocaleDateString(), // Időbélyegből dátum
            price: p[1], // Ár
          })
        );

        if (points.length === 0) {
          setChartData(null);
        } else {
          setChartData({
            labels: points.map((p) => p.time),
            datasets: [
              {
                label: `${coinId.toUpperCase()} Price (USD)`,
                data: points.map((p) => p.price),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.3,
              },
            ],
          });
        }
      })
      .catch((error) => {
        console.error('Failed to load chart data:', error);
        setChartData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [coinId, days]);

  if (loading) return <div className="text-center py-10">Loading chart...</div>;
  if (!chartData) return <div className="text-center py-10 text-gray-400">No chart data available for this period.</div>;

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <Line data={chartData} />
    </div>
  );
}