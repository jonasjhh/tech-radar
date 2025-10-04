export type Phase = 'Observere' | 'Prove' | 'Bruke' | 'Unnga';
export type Category = 'Lang' | 'FW' | 'Lib' | 'Tool' | 'Plat' | 'DB' | 'Proto' | 'Format' | 'Infra';

export interface TechItem {
  name: string;
  phase: Phase;
  category?: Category;
  maturityScore: number; // 1-5: distance from center (1 = most mature, 5 = least mature)
  description?: string; // Optional explanation of what it is and/or maturity reasoning
}

export interface TechRadar {
  observere: TechItem[];
  prove: TechItem[];
  bruke: TechItem[];
  unnga: TechItem[];
}
