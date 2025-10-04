import { Phase, Category, TechRadar, TechItem } from '../models/TechRadar';

export function parseRadarData(content: string): TechRadar {
  const radar: TechRadar = {
    observere: [],
    prove: [],
    bruke: [],
    unnga: [],
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
      else if (phaseText === 'Prøve') currentPhase = 'Prove';
      else if (phaseText === 'Bruke') currentPhase = 'Bruke';
      else if (phaseText === 'Unngå') currentPhase = 'Unnga';
      continue;
    }

    // If we have a current phase and the line starts with -, add the item
    if (currentPhase && trimmed.startsWith('-')) {
      const content = trimmed.substring(1).trim();
      if (content) {
        // Parse format: "Name [Category] (maturityScore) - Description"
        // Match name (non-greedy up to [), then optional [Category], then optional (score), then optional - description
        const fullMatch = content.match(/^(.+?)\s*\[([^\]]+)\]\s*\((\d+)\)\s*(?:-\s*(.+))?$/);
        let name: string;
        let category: Category | undefined;
        let maturityScore: number | undefined;
        let description: string | undefined;

        if (fullMatch) {
          name = fullMatch[1].trim();
          category = fullMatch[2].trim() as Category;
          maturityScore = parseInt(fullMatch[3], 10);
          if (fullMatch[4]) {
            description = fullMatch[4].trim();
          }
        } else {
          // Fallback for entries without proper format
          name = content;
        }

        const item: TechItem = { name, phase: currentPhase, category, maturityScore: maturityScore!, description };
        const phaseKey = currentPhase.toLowerCase() as keyof TechRadar;
        radar[phaseKey].push(item);
      }
    }
  }

  return radar;
}
