import { useState, useEffect } from 'preact/hooks';
import { DataGrid } from './components/DataGrid';
import { generateMockData, type StockData } from './types';
import './app.css';

export function App() {
  const [data, setData] = useState<StockData[]>([]);

  useEffect(() => {
    // Generate initial data
    setData(generateMockData(1000));

    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(prevData =>
        prevData.map(item => ({
          ...item,
          price: item.price + (Math.random() - 0.5) * 2,
          change: item.change + (Math.random() - 0.5) * 0.5,
          changePercent: ((item.change + (Math.random() - 0.5) * 0.5) / item.price) * 100,
        }))
      );
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="app">
      <h1>Financial Data Grid</h1>
      <DataGrid data={data} />
    </div>
  );
}
