import { parseRadarData, TechRadar } from './techRadar';
import { radarData } from './radarData';

function loadRadarData(): TechRadar {
  return parseRadarData(radarData);
}

function renderRadarChart(radar: TechRadar): void {
  const canvas = document.getElementById('radar-chart') as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size to match container
  const container = canvas.parentElement;
  const containerWidth = container ? container.clientWidth : 1400;
  const size = Math.min(containerWidth, 1400) * 0.8;
  canvas.width = size;
  canvas.height = size;

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.42;

  const phases = [
    { key: 'observere', title: 'Observere', color: '#3b82f6', startAngle: Math.PI, endAngle: 3 * Math.PI / 2 },
    { key: 'prøve', title: 'Prøve', color: '#eab308', startAngle: 3 * Math.PI / 2, endAngle: 2 * Math.PI },
    { key: 'bruke', title: 'Bruke', color: '#10b981', startAngle: 0, endAngle: Math.PI / 2 },
    { key: 'avvikle', title: 'Avvikle', color: '#ef4444', startAngle: Math.PI / 2, endAngle: Math.PI },
  ];

  // Draw quadrants
  phases.forEach(phase => {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, phase.startAngle, phase.endAngle);
    ctx.closePath();
    ctx.fillStyle = phase.color + '20'; // 20% opacity
    ctx.fill();
    ctx.strokeStyle = phase.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw phase title in corner
    const titleAngle = (phase.startAngle + phase.endAngle) / 2;
    const titleRadius = radius * Math.sqrt(2); // Distance to corner of bounding square
    const titleX = centerX + Math.cos(titleAngle) * titleRadius;
    const titleY = centerY + Math.sin(titleAngle) * titleRadius;

    ctx.fillStyle = phase.color;
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(phase.title.toUpperCase(), titleX, titleY);
  });

  // Draw items in each quadrant
  const placedItems: Array<{x: number, y: number, width: number, height: number}> = [];

  phases.forEach((phase) => {
    const items = radar[phase.key as keyof TechRadar];
    const itemCount = items.length;

    items.forEach((item, index) => {
      let x: number, y: number, itemAngle: number, itemRadius: number;
      let attempts = 0;
      const maxAttempts = 50;
      let overlapping = true;

      // Try to find a non-overlapping position
      while (overlapping && attempts < maxAttempts) {
        // Position items within the quadrant
        const angleSpread = (phase.endAngle - phase.startAngle) * 0.8;
        const angleOffset = (phase.endAngle - phase.startAngle) * 0.1;
        itemAngle = phase.startAngle + angleOffset + (angleSpread * (index + 1) / (itemCount + 1)) + (Math.random() - 0.5) * 0.3;

        const radiusSpread = radius * 0.7;
        const radiusOffset = radius * 0.15;
        itemRadius = radiusOffset + (radiusSpread * Math.random());

        x = centerX + Math.cos(itemAngle) * itemRadius;
        y = centerY + Math.sin(itemAngle) * itemRadius;

        // Measure text width for collision detection
        ctx.font = '12px sans-serif';
        const textMetrics = ctx.measureText(item.name);
        const padding = 6;
        const textWidth = textMetrics.width + padding * 2;
        const textHeight = 16 + padding;

        // Check for overlap
        overlapping = placedItems.some(placed => {
          return !(x + textWidth / 2 < placed.x - placed.width / 2 ||
                   x - textWidth / 2 > placed.x + placed.width / 2 ||
                   y + textHeight / 2 < placed.y - placed.height / 2 ||
                   y - textHeight / 2 > placed.y + placed.height / 2);
        });

        attempts++;
      }

      // Store position
      ctx.font = '12px sans-serif';
      const textMetrics = ctx.measureText(item.name);
      const padding = 6;
      placedItems.push({
        x: x!,
        y: y!,
        width: textMetrics.width + padding * 2,
        height: 16 + padding
      });

      // Draw label box
      ctx.font = '12px sans-serif';
      const textMetrics2 = ctx.measureText(item.name);
      const boxWidth = textMetrics2.width + padding * 2;
      const boxHeight = 16 + padding;
      const boxX = x! - boxWidth / 2;
      const boxY = y! - boxHeight / 2;

      // Draw rounded rectangle background
      const borderRadius = 4;
      ctx.beginPath();
      ctx.moveTo(boxX + borderRadius, boxY);
      ctx.lineTo(boxX + boxWidth - borderRadius, boxY);
      ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + borderRadius);
      ctx.lineTo(boxX + boxWidth, boxY + boxHeight - borderRadius);
      ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - borderRadius, boxY + boxHeight);
      ctx.lineTo(boxX + borderRadius, boxY + boxHeight);
      ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - borderRadius);
      ctx.lineTo(boxX, boxY + borderRadius);
      ctx.quadraticCurveTo(boxX, boxY, boxX + borderRadius, boxY);
      ctx.closePath();

      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.strokeStyle = phase.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.name, x!, y!);
    });
  });

  // Draw center circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
  ctx.fillStyle = '#1f2937';
  ctx.fill();
}

function renderRadar(radar: TechRadar): void {
  const container = document.getElementById('radar-container');
  if (!container) return;

  const phases = [
    { key: 'observere', title: 'Observere', color: '#3b82f6' },
    { key: 'prøve', title: 'Prøve', color: '#eab308' },
    { key: 'bruke', title: 'Bruke', color: '#10b981' },
    { key: 'avvikle', title: 'Avvikle', color: '#ef4444' },
  ];

  let html = '<div class="radar-grid">';

  for (const phase of phases) {
    const items = radar[phase.key as keyof TechRadar];
    html += `
      <div class="phase-column" style="border-top: 4px solid ${phase.color}">
        <h2 class="phase-title">${phase.title}</h2>
        <ul class="tech-list">
          ${items.map(item => `<li class="tech-item">${item.name}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  html += '</div>';
  container.innerHTML = html;
}

function init(): void {
  try {
    console.log('Initializing tech radar...');
    const radar = loadRadarData();
    console.log('Radar data loaded:', radar);
    renderRadarChart(radar);
    console.log('Chart rendered');
    renderRadar(radar);
    console.log('Radar rendered');
  } catch (error) {
    console.error('Failed to load tech radar:', error);
    const container = document.getElementById('radar-container');
    if (container) {
      container.innerHTML = '<p class="error">Failed to load tech radar data</p>';
    }
  }
}

if (typeof window !== 'undefined') {
  init();
}

export { loadRadarData, renderRadar };
