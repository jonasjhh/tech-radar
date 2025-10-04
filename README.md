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

Technologies are defined in radar data files using this format:

```
# Phase Name
- Technology Name [Category] (MaturityScore) - Optional description
```

**Categories:** `Lang`, `FW`, `Lib`, `Tool`, `Plat`, `DB`, `Proto`, `Format`, `Infra`

**Maturity Scores:** 1-5 (1 = most mature/stable, 5 = experimental)

**Example:**
```
# Bruke
- TypeScript [Lang] (1) - Typed superset of JavaScript that compiles to plain JavaScript
- React [Lib] (1) - JavaScript library for building user interfaces with component-based architecture
- Docker [Tool] (1) - Platform for developing, shipping, and running applications in containers
```

## Creating a New Tech Radar

Adding a new radar is a 3-step process:

### 1. Create the radar data file

Create a new file in `src/data/`:

```typescript
// src/data/yourRadarName.ts
import { RadarConfig } from '../radarConfig';

export const yourRadarName: RadarConfig = {
  id: 'your-radar-id',           // Used in URL: tech-radar/#your-radar-id
  name: 'Your Radar Display Name', // Shown in dropdown
  data: `# Observere
- Rust [Lang] (1) - Systems programming language with memory safety
- Go [Lang] (1) - Statically typed compiled language for simplicity

# Prøve
- Deno [Lang] (3) - Secure JavaScript and TypeScript runtime

# Bruke
- TypeScript [Lang] (1) - Typed superset of JavaScript
- React [Lib] (1) - Component-based UI library

# Unngå
- jQuery [Lib] (1) - DOM manipulation library obsoleted by modern JavaScript
`
};
```

**Optional: Add custom theme colors**
```typescript
export const yourRadarName: RadarConfig = {
  id: 'your-radar-id',
  name: 'Your Radar',
  theme: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    phaseColors: {
      observere: '#9AB8B7',
      prove: '#F2A68F',
      bruke: '#4D6463',
      unnga: '#F27E55'
    }
  },
  data: `...`
};
```

### 2. Register the radar

Add your radar to `src/radarConfig.ts`:

```typescript
import { yourRadarName } from './data/yourRadarName';

export const radarConfigs: RadarConfig[] = [
  techRadar2025,
  daRadar,
  yourRadarName,  // ← Add your radar here
];
```

### 3. Build

```bash
pnpm build
```

**That's it!** Your radar is now available at:
- URL: `tech-radar/#your-radar-id`
- Appears in the dropdown selector
- Fully bookmarkable and shareable

## Technology Stack

- TypeScript
- Canvas API for visualization
- Chart.js
- Jest for testing
- ESBuild for bundling
- ESLint for code quality
