// src/lib/coinApi.ts
import axios from 'axios';

// Ez a függvény felel egyetlen coin adatainak lekéréséért a CMC-ről
export async function fetchCoinDetails(symbol: string) {
  const CMC_API_KEY = process.env.CMC_API_KEY;

  if (!CMC_API_KEY) {
    throw new Error('CMC API key not configured');
  }

  try {
    const response = await axios.get(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      {
        params: {
          symbol: symbol.toUpperCase(),
          convert: 'USD',
        },
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
        },
      }
    );

    const coinData = response.data.data[symbol.toUpperCase()];
    if (!coinData) {
      return null; // Visszaad null-t, ha a coin nem található
    }
    return coinData;
  } catch (error) {
    console.error(`Failed to fetch details for ${symbol}:`, error);
    return null;
  }
}