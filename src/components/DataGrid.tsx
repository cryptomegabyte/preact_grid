import type { StockData } from '../types';

interface DataGridProps {
  data: StockData[];
}

const Row = ({ item }: { item: StockData }) => {
  const isPositive = item.change >= 0;

  return (
    <div className="row">
      <div className="cell symbol">{item.symbol}</div>
      <div className="cell price">${item.price.toFixed(2)}</div>
      <div className={`cell change ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '+' : ''}{item.change.toFixed(2)}
      </div>
      <div className={`cell change-percent ${isPositive ? 'positive' : 'negative'}`}>
        ({isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%)
      </div>
      <div className="cell volume">{item.volume.toLocaleString()}</div>
      <div className="cell market-cap">${(item.marketCap / 1e9).toFixed(2)}B</div>
    </div>
  );
};

export const DataGrid = ({ data }: DataGridProps) => {
  return (
    <div className="data-grid">
      <div className="header">
        <div className="cell symbol">Symbol</div>
        <div className="cell price">Price</div>
        <div className="cell change">Change</div>
        <div className="cell change-percent">Change %</div>
        <div className="cell volume">Volume</div>
        <div className="cell market-cap">Market Cap</div>
      </div>
      <div className="rows">
        {data.map((item, index) => (
          <Row key={index} item={item} />
        ))}
      </div>
    </div>
  );
};