# Preact Financial Data Grid

A high-throughput financial data grid built with Preact, designed for displaying large datasets with real-time updates, similar to those used in hedge funds and trading platforms.

## Features

- **High Performance**: Built with Preact for fast rendering
- **Real-time Updates**: Simulated live data updates every second
- **Large Dataset Support**: Handles 1000+ rows efficiently
- **Professional Styling**: Dark theme with color-coded changes
- **Scrollable Grid**: Smooth scrolling through data
- **Responsive Design**: Adapts to different screen sizes with progressive column hiding

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

## Responsive Design

The data grid is fully responsive and adapts to different screen sizes:

- **Desktop (>1024px)**: All columns visible with full layout
- **Tablet (768px-1024px)**: Market cap column hidden, smaller fonts
- **Mobile (<768px)**: Volume and market cap columns hidden, horizontal scrolling enabled
- **Small Mobile (<480px)**: Compact layout with minimal padding and smaller fonts

## Project Structure

- `src/App.tsx` - Main application component
- `src/components/DataGrid.tsx` - The data grid component
- `src/types.ts` - TypeScript interfaces and mock data generation
- `src/app.css` - Styling for the grid
- `src/test/` - Unit tests for components and utilities

## Technologies Used

- **Preact**: Lightweight React alternative
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety
- **Vitest**: Fast unit testing framework
- **Testing Library**: Component testing utilities
- **CSS**: Custom styling for professional look

## Future Enhancements

- Virtual scrolling for even larger datasets
- Sorting and filtering capabilities
- WebSocket integration for real data feeds
- Advanced charting components
