// Auto-import all radar configurations
import { daRadar } from './data/daRadarData';
import { techRadar2025 } from './data/techRadar2025';
import { RadarTheme } from './constants/colors';

export interface RadarConfig {
  id: string;
  name: string;
  data: string;
  theme?: RadarTheme;
}

// Radars are automatically registered when imported
// To add a new radar: Create a new file exporting a RadarConfig, then import it here
export const radarConfigs: RadarConfig[] = [
  techRadar2025,
  daRadar,
];

export function getRadarById(id: string): RadarConfig | undefined {
  return radarConfigs.find(config => config.id === id);
}
