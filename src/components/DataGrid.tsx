import { useState, useMemo, useCallback, useEffect } from 'preact/hooks';
import type { StockData } from '../types';

interface DataGridProps {
  data: StockData[];
}

type SortDirection = 'asc' | 'desc' | null;
type ColumnKey = keyof StockData;

interface ColumnConfig {
  key: ColumnKey;
  label: string;
  sortable: boolean;
  filterable: boolean;
  width: number;
  type: 'string' | 'number' | 'currency' | 'percentage';
}

const COLUMNS: ColumnConfig[] = [
  { key: 'symbol', label: 'Symbol', sortable: true, filterable: true, width: 80, type: 'string' },
  { key: 'price', label: 'Price', sortable: true, filterable: false, width: 80, type: 'currency' },
  { key: 'change', label: 'Change', sortable: true, filterable: false, width: 80, type: 'currency' },
  { key: 'changePercent', label: 'Change %', sortable: true, filterable: false, width: 80, type: 'percentage' },
  { key: 'volume', label: 'Volume', sortable: true, filterable: false, width: 80, type: 'number' },
  { key: 'marketCap', label: 'Market Cap', sortable: true, filterable: false, width: 80, type: 'currency' },
];

const Row = ({
  item,
  isSelected,
  onSelect,
  columnWidths
}: {
  item: StockData;
  isSelected: boolean;
  onSelect: (symbol: string) => void;
  columnWidths: Record<string, number>;
}) => {
  const isPositive = item.change >= 0;
  const arrow = isPositive ? '▲' : '▼';

  return (
    <div className={`row ${isSelected ? 'selected' : ''}`}>
      <div className="cell select">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(item.symbol)}
        />
      </div>
      <div className="cell symbol" style={{ width: columnWidths.symbol }}>{item.symbol}</div>
      <div className="cell price" style={{ width: columnWidths.price }}>${item.price.toFixed(2)}</div>
      <div className={`cell change ${isPositive ? 'positive' : 'negative'}`} style={{ width: columnWidths.change }}>
        <span className="arrow">{arrow}</span>
        {isPositive ? '+' : ''}{item.change.toFixed(2)}
      </div>
      <div className={`cell change-percent ${isPositive ? 'positive' : 'negative'}`} style={{ width: columnWidths.changePercent }}>
        <span className="arrow">{arrow}</span>
        ({isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%)
      </div>
      <div className="cell volume" style={{ width: columnWidths.volume }}>{item.volume.toLocaleString()}</div>
      <div className="cell market-cap" style={{ width: columnWidths.marketCap }}>${(item.marketCap / 1e9).toFixed(2)}B</div>
    </div>
  );
};

export const DataGrid = ({ data }: DataGridProps) => {
  const [sortColumn, setSortColumn] = useState<ColumnKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() =>
    COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: col.width }), {})
  );
  const [columnOrder, setColumnOrder] = useState<ColumnKey[]>(COLUMNS.map(col => col.key));

  const [resizingColumn, setResizingColumn] = useState<ColumnKey | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const [draggedColumn, setDraggedColumn] = useState<ColumnKey | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ColumnKey | null>(null);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  // Filtering logic
  const filteredData = useMemo(() => {
    return sortedData.filter(item =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedData, searchTerm]);

  const handleSort = useCallback((column: ColumnKey) => {
    if (sortColumn === column) {
      setSortDirection(current =>
        current === 'asc' ? 'desc' : current === 'desc' ? null : 'asc'
      );
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn]);

  const handleRowSelect = useCallback((symbol: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(symbol)) {
        newSet.delete(symbol);
      } else {
        newSet.add(symbol);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map(item => item.symbol)));
    }
  }, [selectedRows.size, filteredData]);

  // Column resizing handlers
  const handleResizeStart = useCallback((e: Event, column: ColumnKey) => {
    e.preventDefault();
    const mouseEvent = e as MouseEvent;
    setResizingColumn(column);
    setStartX(mouseEvent.clientX);
    setStartWidth(columnWidths[column]);
  }, [columnWidths]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizingColumn) return;

    const diff = e.clientX - startX;
    const newWidth = Math.max(50, startWidth + diff);
    setColumnWidths(prev => ({ ...prev, [resizingColumn]: newWidth }));
  }, [resizingColumn, startX, startWidth]);

  const handleResizeEnd = useCallback(() => {
    setResizingColumn(null);
  }, []);

  // Column drag and drop handlers
  const handleDragStart = useCallback((e: Event, column: ColumnKey) => {
    const dragEvent = e as DragEvent;
    setDraggedColumn(column);
    dragEvent.dataTransfer!.effectAllowed = 'move';
    dragEvent.dataTransfer!.setData('text/html', column);
  }, []);

  const handleDragOver = useCallback((e: Event, column: ColumnKey) => {
    const dragEvent = e as DragEvent;
    dragEvent.preventDefault();
    dragEvent.dataTransfer!.dropEffect = 'move';
    setDragOverColumn(column);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback((e: Event, targetColumn: ColumnKey) => {
    const dragEvent = e as DragEvent;
    dragEvent.preventDefault();

    if (!draggedColumn || draggedColumn === targetColumn) return;

    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);
    const targetIndex = newOrder.indexOf(targetColumn);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);

    setColumnOrder(newOrder);
    setDraggedColumn(null);
    setDragOverColumn(null);
  }, [draggedColumn, columnOrder]);

  // Add global mouse event listeners for resizing
  useEffect(() => {
    if (resizingColumn) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizingColumn, handleResizeMove, handleResizeEnd]);

  const getSortIcon = (column: ColumnKey) => {
    if (sortColumn !== column) return '↕️';
    return sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : '↕️';
  };

  return (
    <div className="data-grid-container">
      {/* Search and Filter Controls */}
      <div className="controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
            className="search-input"
          />
        </div>
        <div className="stats">
          Showing {filteredData.length} of {data.length} stocks
          {selectedRows.size > 0 && ` • ${selectedRows.size} selected`}
        </div>
      </div>

      <div className="data-grid">
        <div className="header">
          <div className="cell select">
            <input
              type="checkbox"
              checked={selectedRows.size === filteredData.length && filteredData.length > 0}
              onChange={handleSelectAll}
            />
          </div>
          {columnOrder.map(columnKey => {
            const column = COLUMNS.find(col => col.key === columnKey)!;
            return (
              <div
                key={column.key}
                className={`cell ${column.key} ${sortColumn === column.key ? 'sorting' : ''} ${dragOverColumn === column.key ? 'drag-over' : ''}`}
                style={{ width: columnWidths[column.key] }}
                onClick={() => column.sortable && handleSort(column.key)}
                draggable
                onDragStart={(e) => handleDragStart(e, column.key)}
                onDragOver={(e) => handleDragOver(e, column.key)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e, column.key)}
              >
                {column.label}
                {column.sortable && <span className="sort-icon">{getSortIcon(column.key)}</span>}
                <div
                  className="resize-handle"
                  onMouseDown={(e) => handleResizeStart(e, column.key)}
                />
              </div>
            );
          })}
        </div>
        <div className="rows">
          {filteredData.map((item) => (
            <Row
              key={item.symbol}
              item={item}
              isSelected={selectedRows.has(item.symbol)}
              onSelect={handleRowSelect}
              columnWidths={columnWidths}
            />
          ))}
        </div>
      </div>
    </div>
  );
};