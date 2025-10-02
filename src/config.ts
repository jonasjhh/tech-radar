export interface PhaseConfig {
  key: 'observere' | 'prøve' | 'bruke' | 'avvikle';
  title: string;
  color: string;
  startAngle: number;
  endAngle: number;
}

export const PHASE_CONFIGS: PhaseConfig[] = [
  { key: 'observere', title: 'Observere', color: '#3b82f6', startAngle: Math.PI, endAngle: 3 * Math.PI / 2 },
  { key: 'prøve', title: 'Prøve', color: '#eab308', startAngle: 3 * Math.PI / 2, endAngle: 2 * Math.PI },
  { key: 'bruke', title: 'Bruke', color: '#10b981', startAngle: 0, endAngle: Math.PI / 2 },
  { key: 'avvikle', title: 'Avvikle', color: '#ef4444', startAngle: Math.PI / 2, endAngle: Math.PI },
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
  font: '12px sans-serif',
  padding: 6,
  height: 16,
  borderRadius: 4,
  backgroundColor: 'white',
  textColor: '#1f2937',
  lineWidth: 2,
} as const;

export const TITLE_CONFIG = {
  font: 'bold 18px sans-serif',
  radiusMultiplier: Math.sqrt(2),
} as const;

export const COLLISION_CONFIG = {
  maxAttempts: 50,
  randomAngleRange: 0.3,
} as const;
