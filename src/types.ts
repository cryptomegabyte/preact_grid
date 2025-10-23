export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export const generateMockData = (count: number): StockData[] => {
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'BABA', 'ORCL'];
  const data: StockData[] = [];

  for (let i = 0; i < count; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)] + (i % 10).toString();
    const price = Math.random() * 1000 + 10;
    const change = (Math.random() - 0.5) * 20;
    const changePercent = (change / price) * 100;
    const volume = Math.floor(Math.random() * 10000000) + 100000;
    const marketCap = price * volume;

    data.push({
      symbol,
      price: parseFloat(price.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume,
      marketCap: parseFloat(marketCap.toFixed(2)),
    });
  }

  return data;
};