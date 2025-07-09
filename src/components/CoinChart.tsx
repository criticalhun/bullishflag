'use client';

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type CoinChartProps = {
  coinId: string;
  days?: string; // pl. "30"
};

export default function CoinChart({ coinId, days = "30" }: CoinChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/coin-history?symbol=${coinId}&days=${days}`)
      .then(res => res.json())
      .then(data => {
        const points = data.data?.quotes ?? [];
        setChartData({
          labels: points.map((p: any) => p.timestamp.slice(0, 10)),
          datasets: [{
            label: `${coinId} price`,
            data: points.map((p: any) => p.price),
            borderColor: "#3b82f6",
            backgroundColor: "#93c5fd",
            fill: false,
            tension: 0.3,
          }]
        });
        setLoading(false);
      });
  }, [coinId, days]);

  if (loading) return <div>Loading chart...</div>;
  if (!chartData) return <div>No chart data for this period!</div>;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
      <Line data={chartData} />
    </div>
  );
}
