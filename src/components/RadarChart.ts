import { TechRadar, TechItem, Category } from '../models/TechRadar';
import { PhaseConfig, CANVAS_CONFIG, LABEL_CONFIG, TITLE_CONFIG, COLLISION_CONFIG } from '../constants/config';
import { BoundingBox, drawRoundedRect, checkCollision, measureTextBox } from '../utils/canvasUtils';

export class RadarChart {
  private ctx: CanvasRenderingContext2D;
  private centerX: number;
  private centerY: number;
  private radius: number;
  private visibleCategories: Set<Category>;

  constructor(
    private canvas: HTMLCanvasElement,
    private radar: TechRadar,
    private phaseConfigs: PhaseConfig[],
    visibleCategories?: Set<Category>
  ) {
    this.visibleCategories = visibleCategories || new Set(['Lang', 'FW', 'Lib', 'Tool', 'Plat', 'DB', 'Proto', 'Format', 'Infra']);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    this.ctx = ctx;

    this.setupCanvas();
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.radius = this.canvas.width * CANVAS_CONFIG.radiusMultiplier;
  }

  private setupCanvas(): void {
    const container = this.canvas.parentElement;
    const containerWidth = container?.clientWidth ?? CANVAS_CONFIG.maxWidth;
    const size = Math.min(containerWidth, CANVAS_CONFIG.maxWidth) * CANVAS_CONFIG.sizeMultiplier;
    this.canvas.width = size;
    this.canvas.height = size;
  }

  render(): void {
    // Clear the canvas before redrawing
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawQuadrants();
    this.drawItems();
    this.drawCenter();
    this.setupPhaseTooltips();
  }

  private setupPhaseTooltips(): void {
    const container = this.canvas.parentElement;
    if (!container) return;

    // Remove existing phase tooltips and hover areas
    const existingAreas = container.querySelectorAll('.phase-canvas-hover-area');
    existingAreas.forEach(area => area.remove());

    // Get canvas position relative to container
    const canvasRect = this.canvas.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const canvasOffsetX = canvasRect.left - containerRect.left;
    const canvasOffsetY = canvasRect.top - containerRect.top;

    // Create invisible hover areas for each phase title
    this.phaseConfigs.forEach(phase => {
      const titleAngle = (phase.startAngle + phase.endAngle) / 2;
      const titleRadius = this.radius * TITLE_CONFIG.radiusMultiplier;
      const titleX = this.centerX + Math.cos(titleAngle) * titleRadius;
      const titleY = this.centerY + Math.sin(titleAngle) * titleRadius;

      // Create hover area
      const hoverArea = document.createElement('div');
      hoverArea.className = 'phase-canvas-hover-area';
      hoverArea.style.position = 'absolute';
      hoverArea.style.left = `${canvasOffsetX + titleX - 60}px`;
      hoverArea.style.top = `${canvasOffsetY + titleY - 20}px`;
      hoverArea.style.width = '120px';
      hoverArea.style.height = '40px';
      hoverArea.style.cursor = 'help';
      hoverArea.dataset.phase = phase.key;

      // Create tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'phase-canvas-tooltip';
      tooltip.textContent = phase.description;

      hoverArea.appendChild(tooltip);
      container.appendChild(hoverArea);
    });
  }

  private drawQuadrants(): void {
    this.phaseConfigs.forEach(phase => {
      this.drawQuadrant(phase);
      this.drawPhaseTitle(phase);
    });
  }

  private drawQuadrant(phase: PhaseConfig): void {
    // Draw gradient fill
    const gradient = this.ctx.createRadialGradient(
      this.centerX, this.centerY, 0,
      this.centerX, this.centerY, this.radius
    );
    gradient.addColorStop(0, phase.color + '10');
    gradient.addColorStop(1, phase.color + '30');

    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, this.centerY);
    this.ctx.arc(this.centerX, this.centerY, this.radius, phase.startAngle, phase.endAngle);
    this.ctx.closePath();
    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    // Draw border with shadow
    this.ctx.shadowBlur = 4;
    this.ctx.shadowColor = 'rgba(16, 2, 0, 0.1)';
    this.ctx.strokeStyle = phase.color;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }

  private drawPhaseTitle(phase: PhaseConfig): void {
    const titleAngle = (phase.startAngle + phase.endAngle) / 2;
    const titleRadius = this.radius * TITLE_CONFIG.radiusMultiplier;
    const titleX = this.centerX + Math.cos(titleAngle) * titleRadius;
    const titleY = this.centerY + Math.sin(titleAngle) * titleRadius;

    this.ctx.fillStyle = phase.color;
    this.ctx.font = TITLE_CONFIG.font;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(phase.title.toUpperCase(), titleX, titleY);
  }

  private drawItems(): void {
    const placedItems: BoundingBox[] = [];

    this.phaseConfigs.forEach(phase => {
      const items = this.radar[phase.key];
      const visibleItems = items.filter(item =>
        !item.category || this.visibleCategories.has(item.category)
      );

      visibleItems.forEach((item, index) => {
        const position = this.findNonOverlappingPosition(
          phase,
          item,
          index,
          visibleItems.length,
          placedItems
        );
        this.drawLabel(item.name, position.x, position.y, phase.color);
        placedItems.push(position.boundingBox);
      });
    });
  }

  updateVisibleCategories(visibleCategories: Set<Category>): void {
    this.visibleCategories = visibleCategories;
    this.render();
  }

  private findNonOverlappingPosition(
    phase: PhaseConfig,
    item: TechItem,
    index: number,
    totalItems: number,
    placedItems: BoundingBox[]
  ): { x: number; y: number; boundingBox: BoundingBox } {
    const { width, height } = measureTextBox(this.ctx, item.name);

    for (let attempt = 0; attempt < COLLISION_CONFIG.maxAttempts; attempt++) {
      const { x, y } = this.calculatePosition(phase, index, totalItems);
      const boundingBox: BoundingBox = { x, y, width, height };

      if (!placedItems.some(placed => checkCollision(boundingBox, placed))) {
        return { x, y, boundingBox };
      }
    }

    // Fallback: return last calculated position even if overlapping
    const { x, y } = this.calculatePosition(phase, index, totalItems);
    return { x, y, boundingBox: { x, y, width, height } };
  }

  private calculatePosition(
    phase: PhaseConfig,
    index: number,
    totalItems: number
  ): { x: number; y: number } {
    const angleSpread = (phase.endAngle - phase.startAngle) * CANVAS_CONFIG.angleSpreadMultiplier;
    const angleOffset = (phase.endAngle - phase.startAngle) * CANVAS_CONFIG.angleOffsetMultiplier;
    const randomAngle = (Math.random() - 0.5) * COLLISION_CONFIG.randomAngleRange;
    const itemAngle = phase.startAngle + angleOffset +
      (angleSpread * (index + 1) / (totalItems + 1)) + randomAngle;

    const radiusSpread = this.radius * CANVAS_CONFIG.radiusSpreadMultiplier;
    const radiusOffset = this.radius * CANVAS_CONFIG.radiusOffsetMultiplier;
    const itemRadius = radiusOffset + (radiusSpread * Math.random());

    return {
      x: this.centerX + Math.cos(itemAngle) * itemRadius,
      y: this.centerY + Math.sin(itemAngle) * itemRadius,
    };
  }

  private drawLabel(text: string, x: number, y: number, color: string): void {
    const { width, height } = measureTextBox(this.ctx, text);
    const boxX = x - width / 2;
    const boxY = y - height / 2;

    // Draw shadow
    this.ctx.shadowBlur = LABEL_CONFIG.shadowBlur;
    this.ctx.shadowColor = LABEL_CONFIG.shadowColor;
    this.ctx.shadowOffsetY = 2;

    // Draw rounded rectangle
    drawRoundedRect(this.ctx, boxX, boxY, width, height, LABEL_CONFIG.borderRadius);
    this.ctx.fillStyle = LABEL_CONFIG.backgroundColor;
    this.ctx.fill();

    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetY = 0;

    // Draw colored border
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = LABEL_CONFIG.lineWidth;
    this.ctx.stroke();

    // Draw text
    this.ctx.fillStyle = LABEL_CONFIG.textColor;
    this.ctx.font = LABEL_CONFIG.font;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }

  private drawCenter(): void {
    // Draw outer glow (using Deep Teal)
    const gradient = this.ctx.createRadialGradient(
      this.centerX, this.centerY, 0,
      this.centerX, this.centerY, 12
    );
    gradient.addColorStop(0, 'rgba(77, 100, 99, 0.4)');
    gradient.addColorStop(1, 'rgba(77, 100, 99, 0)');

    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, 12, 0, 2 * Math.PI);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    // Draw center circle with shadow (using Dark Blue Gray)
    this.ctx.shadowBlur = 4;
    this.ctx.shadowColor = 'rgba(16, 2, 0, 0.3)';
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, 6, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#354754';
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    // Draw inner highlight
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY - 1, 3, 0, Math.PI, true);
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.fill();
  }
}
