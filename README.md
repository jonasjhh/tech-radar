# Tech Radar

A visual technology radar for tracking and categorizing technologies across different adoption phases. Built with TypeScript and Canvas API.

## What it does

Tech Radar visualizes technologies in four phases:
- **Observere** (Observe) - Technologies to watch and learn about
- **Prøve** (Try) - Technologies to experiment with
- **Bruke** (Use) - Technologies actively used in production
- **Avvikle** (Retire) - Technologies being phased out

The app displays technologies both as an interactive radar chart and as organized lists.

## Prerequisites

**Important: This project uses pnpm, not npm.**

Install pnpm if you haven't already:
```bash
npm install -g pnpm
```

## Getting Started

### Install dependencies
```bash
pnpm install
```

### Development
Run the development server:
```bash
pnpm dev
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Build
```bash
pnpm build
```

### Testing
```bash
# Run tests once
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### Linting
```bash
# Check for issues
pnpm lint

# Auto-fix issues
pnpm lint:fix
```

## Project Structure

```
src/
├── __tests__/        # Test files
├── components/       # UI components (RadarChart, RadarList)
├── constants/        # Configuration and colors
├── data/            # Static data (radarData.ts)
├── models/          # Domain models and types
├── utils/           # Utility functions
└── main.ts          # Application entry point
```

## Adding Technologies

Edit `src/data/radarData.ts` using this format:

```
# Phase Name
- Technology Name [Category]
```

Available categories: `Lang`, `FW`, `Lib`, `Tool`, `Plat`, `DB`, `Proto`, `Format`, `Infra`

Example:
```
# Bruke
- TypeScript [Lang]
- React [Lib]
- Docker [Tool]
```

## Technology Stack

- TypeScript
- Canvas API for visualization
- Chart.js
- Jest for testing
- ESBuild for bundling
- ESLint for code quality
