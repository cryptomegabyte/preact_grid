import { describe, it, expect } from 'vitest';
import { generateMockData } from '../types';

describe('generateMockData', () => {
  it('should generate the correct number of stock data items', () => {
    const count = 10;
    const data = generateMockData(count);
    expect(data).toHaveLength(count);
  });

  it('should generate valid stock data structure', () => {
    const data = generateMockData(1);
    const item = data[0];

    expect(item).toHaveProperty('symbol');
    expect(item).toHaveProperty('price');
    expect(item).toHaveProperty('change');
    expect(item).toHaveProperty('changePercent');
    expect(item).toHaveProperty('volume');
    expect(item).toHaveProperty('marketCap');

    expect(typeof item.symbol).toBe('string');
    expect(typeof item.price).toBe('number');
    expect(typeof item.change).toBe('number');
    expect(typeof item.changePercent).toBe('number');
    expect(typeof item.volume).toBe('number');
    expect(typeof item.marketCap).toBe('number');
  });

  it('should generate reasonable price values', () => {
    const data = generateMockData(100);
    data.forEach(item => {
      expect(item.price).toBeGreaterThan(0);
      expect(item.price).toBeLessThan(2000); // Based on our generation logic
    });
  });

  it('should generate symbols with base names', () => {
    const data = generateMockData(20);
    const symbols = data.map(item => item.symbol);

    // Check that symbols contain expected base names
    const hasExpectedSymbols = symbols.some(symbol =>
      ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'BABA', 'ORCL']
        .some(base => symbol.startsWith(base))
    );
    expect(hasExpectedSymbols).toBe(true);
  });

  it('should have reasonable market cap values', () => {
    const data = generateMockData(10);
    data.forEach(item => {
      // Market cap should be positive and reasonable
      expect(item.marketCap).toBeGreaterThan(0);
      expect(item.marketCap).toBeLessThan(1e12); // Less than 1 trillion
    });
  });
});