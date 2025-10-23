# Preact Financial Data Grid

A high-throughput financial data grid built with Preact, designed for displaying large datasets with real-time updates, similar to those used in hedge funds and trading platforms.

## Features

- **High Performance**: Built with Preact for fast rendering
- **Real-time Updates**: Simulated live data updates every second
- **Large Dataset Support**: Handles 1000+ rows efficiently
- **Professional Styling**: Modern dark theme with gradient backgrounds and glowing effects
- **Interactive Sorting**: Click column headers to sort data (ascending/descending/no sort)
- **Search & Filtering**: Real-time symbol search with instant filtering
- **Row Selection**: Individual and bulk row selection with visual feedback
- **Column Resizing**: Drag resize handles to adjust column widths
- **Column Reordering**: Drag and drop columns to rearrange the grid layout
- **Responsive Design**: Adapts to different screen sizes with progressive column hiding
- **Smooth Animations**: Subtle hover effects and loading animations
- **Visual Indicators**: Up/down arrows (▲▼) for price change direction
- **Custom Scrollbars**: Styled scrollbars for better UX

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

### Running the App

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Running Tests

Run the test suite:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

## Interactive Features

### Sorting

- Click any column header to sort data
- Three-state sorting: ascending → descending → no sort
- Visual sort indicators show current sort state

### Search & Filtering

- Real-time search by stock symbol
- Instant filtering as you type
- Shows filtered count in the stats bar

### Row Selection

- Individual row selection with checkboxes
- Select-all functionality in the header
- Selected row count displayed in stats
- Visual highlighting of selected rows

### Column Management

- **Resizing**: Drag the edge of column headers to resize
- **Reordering**: Drag and drop column headers to rearrange
- Responsive behavior maintains usability across devices

## Project Structure

- `src/App.tsx` - Main application component
- `src/components/DataGrid.tsx` - Interactive data grid component with sorting, filtering, and selection
- `src/types.ts` - TypeScript interfaces and mock data generation
- `src/app.css` - Comprehensive styling for the grid and responsive design
- `src/test/` - Comprehensive unit tests covering all features (sorting, filtering, selection, etc.)

## Technologies Used

- **Preact**: Lightweight React alternative for high performance
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety and better developer experience
- **Vitest**: Fast unit testing framework
- **Testing Library**: Component testing utilities
- **CSS**: Modern styling with gradients, animations, and responsive design

## Future Enhancements

- Virtual scrolling for handling 10,000+ rows efficiently
- WebSocket integration for real-time market data feeds
- Advanced filtering with multiple criteria (price ranges, volume thresholds)
- Export functionality (CSV, PDF)
- Column pinning and freezing
- Advanced charting integration
- Keyboard navigation and accessibility improvements
- Data persistence and user preferences
