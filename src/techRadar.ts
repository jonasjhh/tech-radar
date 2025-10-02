export type Phase = 'Observere' | 'Prøve' | 'Bruke' | 'Avvikle';

export interface TechItem {
  name: string;
  phase: Phase;
}

export interface TechRadar {
  observere: TechItem[];
  prøve: TechItem[];
  bruke: TechItem[];
  avvikle: TechItem[];
}

export function parseRadarData(content: string): TechRadar {
  const radar: TechRadar = {
    observere: [],
    prøve: [],
    bruke: [],
    avvikle: [],
  };

  const lines = content.split('\n');
  let currentPhase: Phase | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) continue;

    // Check if line is a phase header (starts with #)
    if (trimmed.startsWith('#')) {
      const phaseText = trimmed.substring(1).trim();
      if (phaseText === 'Observere') currentPhase = 'Observere';
      else if (phaseText === 'Prøve') currentPhase = 'Prøve';
      else if (phaseText === 'Bruke') currentPhase = 'Bruke';
      else if (phaseText === 'Avvikle') currentPhase = 'Avvikle';
      continue;
    }

    // If we have a current phase and the line starts with -, add the item
    if (currentPhase && trimmed.startsWith('-')) {
      const name = trimmed.substring(1).trim();
      if (name) {
        const item: TechItem = { name, phase: currentPhase };
        const phaseKey = currentPhase.toLowerCase() as keyof TechRadar;
        radar[phaseKey].push(item);
      }
    }
  }

  return radar;
}
