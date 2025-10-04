import { parseRadarData } from '../utils/techRadar';

describe('parseRadarData', () => {
  it('should parse tech radar data with categories and maturity scores', () => {
    const content = `# Observere
- Rust [Lang] (1)
- Deno [Lang] (3)

# Prøve
- TypeScript [Lang] (2)

# Bruke
- JavaScript [Lang] (1)
- React [Lib] (1)

# Unngå
- jQuery [Lib] (1)`;

    const result = parseRadarData(content);

    expect(result.observere).toHaveLength(2);
    expect(result.observere[0]).toMatchObject({
      name: 'Rust',
      phase: 'Observere',
      category: 'Lang',
      maturityScore: 1
    });
    expect(result.observere[1]).toMatchObject({
      name: 'Deno',
      phase: 'Observere',
      category: 'Lang',
      maturityScore: 3
    });

    expect(result.prove).toHaveLength(1);
    expect(result.prove[0]).toMatchObject({
      name: 'TypeScript',
      phase: 'Prove',
      category: 'Lang',
      maturityScore: 2
    });
  });

  it('should handle empty lines', () => {
    const content = `# Observere

- Rust

- Deno

# Prøve
- TypeScript`;

    const result = parseRadarData(content);

    expect(result.observere).toHaveLength(2);
    expect(result.prove).toHaveLength(1);
  });

  it('should handle empty phases', () => {
    const content = `# Observere

# Prøve
- TypeScript

# Bruke

# Unngå`;

    const result = parseRadarData(content);

    expect(result.observere).toHaveLength(0);
    expect(result.prove).toHaveLength(1);
    expect(result.bruke).toHaveLength(0);
    expect(result.unnga).toHaveLength(0);
  });

  it('should trim whitespace from item names', () => {
    const content = `# Observere
-    Rust
-  Deno  `;

    const result = parseRadarData(content);

    expect(result.observere[0].name).toBe('Rust');
    expect(result.observere[1].name).toBe('Deno');
  });

  it('should handle empty content', () => {
    const result = parseRadarData('');

    expect(result.observere).toHaveLength(0);
    expect(result.prove).toHaveLength(0);
    expect(result.bruke).toHaveLength(0);
    expect(result.unnga).toHaveLength(0);
  });

  it('should ignore lines without phase context', () => {
    const content = `- Orphan item
# Observere
- Rust`;

    const result = parseRadarData(content);

    expect(result.observere).toHaveLength(1);
    expect(result.observere[0].name).toBe('Rust');
  });

  it('should handle all four Norwegian phases', () => {
    const content = `# Observere
- Item1 [Tool] (1)
# Prøve
- Item2 [Tool] (2)
# Bruke
- Item3 [Tool] (1)
# Unngå
- Item4 [Tool] (1)`;

    const result = parseRadarData(content);

    expect(result.observere).toHaveLength(1);
    expect(result.prove).toHaveLength(1);
    expect(result.bruke).toHaveLength(1);
    expect(result.unnga).toHaveLength(1);
  });

  it('should parse descriptions correctly', () => {
    const content = `# Observere
- Rust [Lang] (1) - Systems programming language with memory safety
- CRI-O [Tool] (4) - Container runtime for Kubernetes

# Bruke
- Node.js [Lang] (1) - JavaScript runtime for server-side applications`;

    const result = parseRadarData(content);

    expect(result.observere[0]).toMatchObject({
      name: 'Rust',
      category: 'Lang',
      maturityScore: 1,
      description: 'Systems programming language with memory safety'
    });

    expect(result.observere[1]).toMatchObject({
      name: 'CRI-O',
      category: 'Tool',
      maturityScore: 4,
      description: 'Container runtime for Kubernetes'
    });

    expect(result.bruke[0]).toMatchObject({
      name: 'Node.js',
      category: 'Lang',
      maturityScore: 1,
      description: 'JavaScript runtime for server-side applications'
    });
  });

  it('should handle technologies with hyphens in names', () => {
    const content = `# Observere
- CRI-O [Tool] (4) - Container runtime
- Node.js [Lang] (1) - JavaScript runtime`;

    const result = parseRadarData(content);

    expect(result.observere[0].name).toBe('CRI-O');
    expect(result.observere[1].name).toBe('Node.js');
  });
});
