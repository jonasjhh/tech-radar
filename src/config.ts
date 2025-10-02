import { SEMANTIC_COLORS, COLORS } from './colors';

export interface PhaseConfig {
  key: 'observere' | 'prøve' | 'bruke' | 'avvikle';
  title: string;
  color: string;
  startAngle: number;
  endAngle: number;
}

export const PHASE_CONFIGS: PhaseConfig[] = [
  { key: 'observere', title: 'Observere', color: SEMANTIC_COLORS.phase.observere, startAngle: Math.PI, endAngle: 3 * Math.PI / 2 },
  { key: 'prøve', title: 'Prøve', color: SEMANTIC_COLORS.phase.prøve, startAngle: 3 * Math.PI / 2, endAngle: 2 * Math.PI },
  { key: 'bruke', title: 'Bruke', color: SEMANTIC_COLORS.phase.bruke, startAngle: 0, endAngle: Math.PI / 2 },
  { key: 'avvikle', title: 'Avvikle', color: SEMANTIC_COLORS.phase.avvikle, startAngle: Math.PI / 2, endAngle: Math.PI },
];

export const CANVAS_CONFIG = {
  maxWidth: 1400,
  sizeMultiplier: 0.8,
  radiusMultiplier: 0.42,
  radiusSpreadMultiplier: 0.7,
  radiusOffsetMultiplier: 0.15,
  angleSpreadMultiplier: 0.8,
  angleOffsetMultiplier: 0.1,
} as const;

export const LABEL_CONFIG = {
  font: 'bold 11px sans-serif',
  padding: 8,
  height: 14,
  borderRadius: 6,
  backgroundColor: COLORS.white,
  textColor: COLORS.black,
  lineWidth: 2,
  shadowBlur: 4,
  shadowColor: 'rgba(16, 2, 0, 0.15)',
} as const;

export const TITLE_CONFIG = {
  font: 'bold 18px sans-serif',
  radiusMultiplier: Math.sqrt(2),
} as const;

export const COLLISION_CONFIG = {
  maxAttempts: 50,
  randomAngleRange: 0.3,
} as const;
