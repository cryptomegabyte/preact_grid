import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { DataGrid } from '../components/DataGrid';
import { generateMockData } from '../types';

describe('DataGrid', () => {
  it('should render the data grid with header', () => {
    const mockData = generateMockData(5);
    render(<DataGrid data={mockData} />);

    // Check if header cells are present
    expect(screen.getByText('Symbol')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Change')).toBeInTheDocument();
    expect(screen.getByText('Change %')).toBeInTheDocument();
    expect(screen.getByText('Volume')).toBeInTheDocument();
    expect(screen.getByText('Market Cap')).toBeInTheDocument();
  });

  it('should render the correct number of data rows', () => {
    const mockData = generateMockData(3);
    render(<DataGrid data={mockData} />);

    // Should have 3 rows of data
    const rows = document.querySelectorAll('.row');
    expect(rows).toHaveLength(3);
  });

  it('should display stock data correctly', () => {
    const mockData = generateMockData(1);
    const stock = mockData[0];
    render(<DataGrid data={mockData} />);

    // Check if the stock symbol is displayed
    expect(screen.getByText(stock.symbol)).toBeInTheDocument();

    // Check if price is displayed (formatted)
    expect(screen.getByText(`$${stock.price.toFixed(2)}`)).toBeInTheDocument();
  });

  it('should apply correct CSS classes for positive changes', () => {
    const mockData = [{
      symbol: 'TEST',
      price: 100,
      change: 5,
      changePercent: 5,
      volume: 1000000,
      marketCap: 100000000
    }];
    render(<DataGrid data={mockData} />);

    // Check for positive change styling
    const changeElement = screen.getByText('+5.00');
    expect(changeElement).toHaveClass('positive');
  });

  it('should apply correct CSS classes for negative changes', () => {
    const mockData = [{
      symbol: 'TEST',
      price: 100,
      change: -3,
      changePercent: -3,
      volume: 1000000,
      marketCap: 100000000
    }];
    render(<DataGrid data={mockData} />);

    // Check for negative change styling
    const changeElement = screen.getByText('-3.00');
    expect(changeElement).toHaveClass('negative');
  });

  it('should format volume with commas', () => {
    const mockData = [{
      symbol: 'TEST',
      price: 100,
      change: 0,
      changePercent: 0,
      volume: 1234567,
      marketCap: 100000000
    }];
    render(<DataGrid data={mockData} />);

    expect(screen.getByText('1,234,567')).toBeInTheDocument();
  });

  it('should format market cap in billions', () => {
    const mockData = [{
      symbol: 'TEST',
      price: 100,
      change: 0,
      changePercent: 0,
      volume: 1000000,
      marketCap: 5000000000 // 5 billion
    }];
    render(<DataGrid data={mockData} />);

    expect(screen.getByText('$5.00B')).toBeInTheDocument();
  });

  it('should handle empty data array', () => {
    render(<DataGrid data={[]} />);

    // Header should still be present
    expect(screen.getByText('Symbol')).toBeInTheDocument();

    // No rows should be present
    const rows = document.querySelectorAll('.row');
    expect(rows).toHaveLength(0);
  });
});