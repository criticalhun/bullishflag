// src/components/PerformanceChart.tsx
'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

type ChartDataItem = {
  name: string;
  value: number;
};

interface PerformanceChartProps {
  data: ChartDataItem[];
  rangeLabel: string;
}

export default function PerformanceChart({ data, rangeLabel }: PerformanceChartProps) {
  return (
    <div className="w-full h-64 mb-6">
      <h2 className="text-xl font-semibold mb-2 text-center">
        Top 10 Performance over {rangeLabel}
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip formatter={(val: number) => `${val.toFixed(2)}%`} />
          <Bar dataKey="value" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
