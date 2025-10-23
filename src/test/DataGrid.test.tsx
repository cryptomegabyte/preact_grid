import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
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

    // Check for positive change styling - find the change cell
    const changeCell = document.querySelector('.change.positive');
    expect(changeCell).toBeInTheDocument();
    expect(changeCell?.textContent).toBe('▲+5.00');
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

    // Check for negative change styling - find the change cell
    const changeCell = document.querySelector('.change.negative');
    expect(changeCell).toBeInTheDocument();
    expect(changeCell?.textContent).toBe('▼-3.00');
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

  it('should display up arrows for positive changes', () => {
    const mockData = [{
      symbol: 'TEST',
      price: 100,
      change: 5,
      changePercent: 5,
      volume: 1000000,
      marketCap: 100000000
    }];
    render(<DataGrid data={mockData} />);

    // Check for up arrows in both change columns
    const changeCell = document.querySelector('.change.positive');
    const changePercentCell = document.querySelector('.change-percent.positive');

    expect(changeCell?.textContent).toBe('▲+5.00');
    expect(changePercentCell?.textContent).toBe('▲(+5.00%)');
  });

  it('should display down arrows for negative changes', () => {
    const mockData = [{
      symbol: 'TEST',
      price: 100,
      change: -3,
      changePercent: -3,
      volume: 1000000,
      marketCap: 100000000
    }];
    render(<DataGrid data={mockData} />);

    // Check for down arrows in both change columns
    const changeCell = document.querySelector('.change.negative');
    const changePercentCell = document.querySelector('.change-percent.negative');

    expect(changeCell?.textContent).toBe('▼-3.00');
    expect(changePercentCell?.textContent).toBe('▼(-3.00%)');
  });

  it('should style arrows with correct classes', () => {
    const mockData = [{
      symbol: 'TEST',
      price: 100,
      change: 5,
      changePercent: 5,
      volume: 1000000,
      marketCap: 100000000
    }];
    render(<DataGrid data={mockData} />);

    // Check that arrows have the arrow class
    const arrows = document.querySelectorAll('.arrow');
    expect(arrows).toHaveLength(2); // One for change, one for change-percent

    arrows.forEach(arrow => {
      expect(arrow).toHaveClass('arrow');
      expect(arrow.textContent).toBe('▲');
    });
  });

  it('should render search input and stats', () => {
    const mockData = generateMockData(3);
    render(<DataGrid data={mockData} />);

    // Check for search input
    const searchInput = screen.getByPlaceholderText('Search by symbol...');
    expect(searchInput).toBeInTheDocument();

    // Check for stats display
    expect(screen.getByText('Showing 3 of 3 stocks')).toBeInTheDocument();
  });

  it('should filter data based on search term', () => {
    const mockData = [
      { symbol: 'AAPL', price: 150, change: 5, changePercent: 3.33, volume: 1000000, marketCap: 2500000000000 },
      { symbol: 'GOOGL', price: 2800, change: -10, changePercent: -0.35, volume: 500000, marketCap: 1800000000000 },
      { symbol: 'MSFT', price: 300, change: 2, changePercent: 0.67, volume: 800000, marketCap: 2200000000000 }
    ];
    render(<DataGrid data={mockData} />);

    const searchInput = screen.getByPlaceholderText('Search by symbol...');

    // Filter for AAPL
    fireEvent.change(searchInput, { target: { value: 'AAPL' } });

    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.queryByText('GOOGL')).not.toBeInTheDocument();
    expect(screen.queryByText('MSFT')).not.toBeInTheDocument();
    expect(screen.getByText('Showing 1 of 3 stocks')).toBeInTheDocument();
  });

  it('should sort data when clicking column headers', () => {
    const mockData = [
      { symbol: 'AAPL', price: 150, change: 5, changePercent: 3.33, volume: 1000000, marketCap: 2500000000000 },
      { symbol: 'GOOGL', price: 2800, change: -10, changePercent: -0.35, volume: 500000, marketCap: 1800000000000 },
      { symbol: 'MSFT', price: 300, change: 2, changePercent: 0.67, volume: 800000, marketCap: 2200000000000 }
    ];
    render(<DataGrid data={mockData} />);

    // Click symbol header to sort ascending
    const symbolHeader = screen.getByText('Symbol');
    fireEvent.click(symbolHeader);

    // Check that first row is AAPL (alphabetical order)
    const rows = document.querySelectorAll('.row');
    expect(rows[0].textContent).toContain('AAPL');
    expect(rows[1].textContent).toContain('GOOGL');
    expect(rows[2].textContent).toContain('MSFT');
  });

  it('should toggle sort direction on repeated clicks', () => {
    const mockData = [
      { symbol: 'AAPL', price: 150, change: 5, changePercent: 3.33, volume: 1000000, marketCap: 2500000000000 },
      { symbol: 'GOOGL', price: 2800, change: -10, changePercent: -0.35, volume: 500000, marketCap: 1800000000000 },
      { symbol: 'MSFT', price: 300, change: 2, changePercent: 0.67, volume: 800000, marketCap: 2200000000000 }
    ];
    render(<DataGrid data={mockData} />);

    const symbolHeader = screen.getByText('Symbol');

    // First click - ascending
    fireEvent.click(symbolHeader);
    let rows = document.querySelectorAll('.row');
    expect(rows[0].textContent).toContain('AAPL');

    // Second click - descending
    fireEvent.click(symbolHeader);
    rows = document.querySelectorAll('.row');
    expect(rows[0].textContent).toContain('MSFT');
  });

  it('should handle row selection', () => {
    const mockData = generateMockData(3);
    render(<DataGrid data={mockData} />);

    // Find checkboxes in rows
    const checkboxes = document.querySelectorAll('.row input[type="checkbox"]');
    expect(checkboxes).toHaveLength(3);

    // Select first row
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();

    // Check stats show selection
    expect(screen.getByText('Showing 3 of 3 stocks • 1 selected')).toBeInTheDocument();
  });

  it('should handle select all functionality', () => {
    const mockData = generateMockData(3);
    render(<DataGrid data={mockData} />);

    // Find header checkbox
    const headerCheckbox = document.querySelector('.header input[type="checkbox"]') as HTMLInputElement;

    // Select all
    fireEvent.click(headerCheckbox);
    const rowCheckboxes = document.querySelectorAll('.row input[type="checkbox"]');
    rowCheckboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked();
    });
    expect(screen.getByText('Showing 3 of 3 stocks • 3 selected')).toBeInTheDocument();

    // Deselect all
    fireEvent.click(headerCheckbox);
    rowCheckboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
    expect(screen.getByText('Showing 3 of 3 stocks')).toBeInTheDocument();
  });

  it('should apply selected styling to selected rows', () => {
    const mockData = generateMockData(1);
    render(<DataGrid data={mockData} />);

    const checkbox = document.querySelector('.row input[type="checkbox"]') as HTMLInputElement;
    const row = document.querySelector('.row');

    // Initially not selected
    expect(row).not.toHaveClass('selected');

    // Select row
    fireEvent.click(checkbox);
    expect(row).toHaveClass('selected');
  });
});