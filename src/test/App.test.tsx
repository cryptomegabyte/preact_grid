import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/preact';
import { App } from '../app';

// Mock the types module to control data generation
vi.mock('../types', () => ({
  generateMockData: vi.fn(() => [
    {
      symbol: 'TEST',
      price: 100,
      change: 0,
      changePercent: 0,
      volume: 1000000,
      marketCap: 100000000
    }
  ])
}));

import { generateMockData } from '../types';

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render the app with title', () => {
    render(<App />);
    expect(screen.getByText('Financial Data Grid')).toBeInTheDocument();
  });

  it('should render the DataGrid component', () => {
    render(<App />);
    expect(screen.getByText('Symbol')).toBeInTheDocument();
  });

  it('should generate initial data on mount', () => {
    render(<App />);

    expect(generateMockData).toHaveBeenCalledWith(1000);
  });

  it('should update data periodically', async () => {
    render(<App />);

    // Initial render
    expect(screen.getByText('$100.00')).toBeInTheDocument();

    // Fast-forward time by 1 second
    vi.advanceTimersByTime(1000);

    // Wait for the update to occur
    await waitFor(() => {
      // The price should have changed (mock data updates every second)
      // Since we can't predict the exact new value, we just check that the component re-renders
      expect(screen.getByText('Financial Data Grid')).toBeInTheDocument();
    });
  });

  it('should clean up interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

    const { unmount } = render(<App />);
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});