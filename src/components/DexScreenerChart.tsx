// src/components/DexScreenerChart.tsx
'use client';

interface DexScreenerChartProps {
  pairAddress: string;
}

const DexScreenerChart = ({ pairAddress }: DexScreenerChartProps) => {
  // A DexScreener beágyazási URL-je. A 'pairAddress' a token kontraktcíme.
  // A 'ethereum' láncot adjuk meg alapértelmezetten, de ezt később dinamikussá tehetjük.
  const chartUrl = `https://dexscreener.com/ethereum/${pairAddress}?embed=1&theme=dark&ma=1&info=1`;

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden">
      <iframe
        src={chartUrl}
        className="w-full h-full"
        title="DexScreener Chart"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default DexScreenerChart;
