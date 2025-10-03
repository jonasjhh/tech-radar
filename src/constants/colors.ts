/**
 * Radar Theme Configuration
 * Defines colors and gradient for a radar
 */

export interface RadarTheme {
  phaseColors: {
    observere: string;
    prove: string;
    bruke: string;
    unnga: string;
  };
  gradient: string;
}

// Default theme - Blue, Yellow, Green, Red with chrome gradient
export const DEFAULT_THEME: RadarTheme = {
  phaseColors: {
    observere: '#3498db',  // Blue
    prove: '#f39c12',      // Yellow
    bruke: '#27ae60',      // Green
    unnga: '#e74c3c',      // Red
  },
  gradient: 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 25%, #d0d0d0 50%, #f0f0f0 75%, #c0c0c0 100%)',
};

// DA Tech Radar theme - Original Pantone colors with teal/gray gradient
export const DA_THEME: RadarTheme = {
  phaseColors: {
    observere: '#9AB8B7',  // Soft Aqua Gray (PANTONE 5503 CP)
    prove: '#F2A68F',      // Warm Pink (PANTONE 487)
    bruke: '#4D6463',      // Deep Teal (PANTONE 5545 CP)
    unnga: '#F27E55',      // Orange (PANTONE 164 CP)
  },
  gradient: 'linear-gradient(135deg, #ACBBC6 0%, #4F6A7E 100%)',
};

// UI Colors
export const COLORS = {
  white: '#FFFFFF',
  black: '#000000',
} as const;
