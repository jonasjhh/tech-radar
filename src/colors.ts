/**
 * Official Color Palette
 * Based on Pantone color system
 */

export const COLORS = {
  // Pinks and Oranges
  lightPink: '#FFD6CA',      // PANTONE 7422 CP
  warmPink: '#F2A68F',       // PANTONE 487
  orange: '#F27E55',         // PANTONE 164 CP

  // Gray Blues
  lightGrayBlue: '#DEE4E8',  // PANTONE 649 CP
  mediumGrayBlue: '#ACBBC6', // PANTONE 5435 CP
  darkGrayBlue: '#4F6A7E',   // PANTONE 5405 CP

  // Teals
  lightTealGray: '#E6EDED',  // PANTONE 7541 CP
  softTeal: '#CDDBDB',       // PANTONE 621 CP
  deepTeal: '#4D6463',       // PANTONE 5545 CP

  // Blues and Grays
  darkBlueGray: '#354754',   // PANTONE 7546 CP
  softAquaGray: '#9AB8B7',   // PANTONE 5503 CP

  // Neutrals
  black: '#100200',          // PANTONE Black 6
  white: '#FFFFFF',          // White
} as const;

// Semantic color assignments
export const SEMANTIC_COLORS = {
  text: {
    primary: COLORS.black,
    secondary: COLORS.darkBlueGray,
    light: COLORS.mediumGrayBlue,
  },
  background: {
    primary: COLORS.white,
    secondary: COLORS.lightTealGray,
    accent: COLORS.lightGrayBlue,
  },
  phase: {
    observere: COLORS.softAquaGray,   // Soft Aqua Gray
    prøve: COLORS.warmPink,           // Warm Pink
    bruke: COLORS.deepTeal,           // Deep Teal
    avvikle: COLORS.orange,           // Orange
  },
} as const;
