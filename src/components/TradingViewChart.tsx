// src/components/TradingViewChart.tsx
'use client';

interface TradingViewChartProps {
  symbol: string;
}

const TradingViewChart = ({ symbol }: TradingViewChartProps) => {
  // A TradingView a szimbólumot és a párt (pl. USDT) várja. 
  // A legtöbb nagy tőzsde (pl. BINANCE, COINBASE) felismeri ezt a formátumot.
  const tradingViewSymbol = `${symbol.toUpperCase()}USDT`;

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden">
      <iframe
        src={`https://s.tradingview.com/widgetembed/?frame_id=tradingview_95a91&symbol=${tradingViewSymbol}&interval=1D&theme=dark`}
        className="w-full h-full"
        title="TradingView Chart"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default TradingViewChart;