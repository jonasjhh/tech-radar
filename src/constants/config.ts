import { DEFAULT_THEME, COLORS, RadarTheme } from './colors';

export interface PhaseConfig {
  key: 'observere' | 'prove' | 'bruke' | 'unnga';
  title: string;
  description: string;
  color: string;
  startAngle: number;
  endAngle: number;
}

export function getPhaseConfigs(phaseColors?: RadarTheme['phaseColors']): PhaseConfig[] {
  const colors = phaseColors || DEFAULT_THEME.phaseColors;
  return [
    {
      key: 'observere',
      title: 'Observere',
      description: 'Teknologier vi følger med på og utforsker. Disse er interessante, men vi har ikke besluttet å ta i bruk ennå.',
      color: colors.observere,
      startAngle: Math.PI,
      endAngle: 3 * Math.PI / 2
    },
    {
      key: 'prove',
      title: 'Prøve',
      description: 'Teknologier vi aktivt eksperimenterer med i pilotprosjekter eller begrensede sammenhenger for å evaluere nytte og modenhet.',
      color: colors.prove,
      startAngle: 3 * Math.PI / 2,
      endAngle: 2 * Math.PI
    },
    {
      key: 'bruke',
      title: 'Bruke',
      description: 'Teknologier som er godkjent og anbefalt for bruk i produksjon. Disse er stabile, velprøvde og støttes aktivt.',
      color: colors.bruke,
      startAngle: 0,
      endAngle: Math.PI / 2
    },
    {
      key: 'unnga',
      title: 'Unngå',
      description: 'Teknologier vi faser ut, har evaluert og forkastet, eller aktivt unngår. Nye prosjekter bør ikke bruke disse.',
      color: colors.unnga,
      startAngle: Math.PI / 2,
      endAngle: Math.PI
    },
  ];
}

// Export default configs for backward compatibility
export const PHASE_CONFIGS = getPhaseConfigs();

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
