import { parseRadarData } from '../utils/techRadar';

describe('parseRadarData', () => {
  it('should parse basic tech radar data', () => {
    const content = `# Observere
- Rust
- Deno

# Prøve
- TypeScript

# Bruke
- JavaScript
- React

# Unngå
- jQuery`;

    const result = parseRadarData(content);

    expect(result.observere).toHaveLength(2);
    expect(result.observere[0]).toEqual({ name: 'Rust', phase: 'Observere' });
    expect(result.observere[1]).toEqual({ name: 'Deno', phase: 'Observere' });

    expect(result.prove).toHaveLength(1);
    expect(result.prove[0]).toEqual({ name: 'TypeScript', phase: 'Prove' });

    expect(result.bruke).toHaveLength(2);
    expect(result.bruke[0]).toEqual({ name: 'JavaScript', phase: 'Bruke' });
    expect(result.bruke[1]).toEqual({ name: 'React', phase: 'Bruke' });

    expect(result.unnga).toHaveLength(1);
    expect(result.unnga[0]).toEqual({ name: 'jQuery', phase: 'Unnga' });
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
- Item1
# Prøve
- Item2
# Bruke
- Item3
# Unngå
- Item4`;

    const result = parseRadarData(content);

    expect(result.observere).toHaveLength(1);
    expect(result.prove).toHaveLength(1);
    expect(result.bruke).toHaveLength(1);
    expect(result.unnga).toHaveLength(1);
  });
});
