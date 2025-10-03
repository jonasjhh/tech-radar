export type Phase = 'Observere' | 'Prove' | 'Bruke' | 'Unnga';
export type Category = 'Lang' | 'FW' | 'Lib' | 'Tool' | 'Plat' | 'DB' | 'Proto' | 'Format' | 'Infra';

export interface TechItem {
  name: string;
  phase: Phase;
  category?: Category;
}

export interface TechRadar {
  observere: TechItem[];
  prove: TechItem[];
  bruke: TechItem[];
  unnga: TechItem[];
}
