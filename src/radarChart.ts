import { TechRadar, TechItem } from './techRadar';
import { PHASE_CONFIGS, CANVAS_CONFIG, LABEL_CONFIG, TITLE_CONFIG, COLLISION_CONFIG } from './config';
import { BoundingBox, drawRoundedRect, checkCollision, measureTextBox } from './canvasUtils';

export class RadarChart {
  private ctx: CanvasRenderingContext2D;
  private centerX: number;
  private centerY: number;
  private radius: number;

  constructor(private canvas: HTMLCanvasElement, private radar: TechRadar) {
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
    this.drawQuadrants();
    this.drawItems();
    this.drawCenter();
  }

  private drawQuadrants(): void {
    PHASE_CONFIGS.forEach(phase => {
      this.drawQuadrant(phase);
      this.drawPhaseTitle(phase);
    });
  }

  private drawQuadrant(phase: typeof PHASE_CONFIGS[0]): void {
    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, this.centerY);
    this.ctx.arc(this.centerX, this.centerY, this.radius, phase.startAngle, phase.endAngle);
    this.ctx.closePath();
    this.ctx.fillStyle = phase.color + '20';
    this.ctx.fill();
    this.ctx.strokeStyle = phase.color;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  private drawPhaseTitle(phase: typeof PHASE_CONFIGS[0]): void {
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

    PHASE_CONFIGS.forEach(phase => {
      const items = this.radar[phase.key];
      items.forEach((item, index) => {
        const position = this.findNonOverlappingPosition(
          phase,
          item,
          index,
          items.length,
          placedItems
        );
        this.drawLabel(item.name, position.x, position.y, phase.color);
        placedItems.push(position.boundingBox);
      });
    });
  }

  private findNonOverlappingPosition(
    phase: typeof PHASE_CONFIGS[0],
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
    phase: typeof PHASE_CONFIGS[0],
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

    // Draw rounded rectangle
    drawRoundedRect(this.ctx, boxX, boxY, width, height, LABEL_CONFIG.borderRadius);
    this.ctx.fillStyle = LABEL_CONFIG.backgroundColor;
    this.ctx.fill();
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
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, 5, 0, 2 * Math.PI);
    this.ctx.fillStyle = LABEL_CONFIG.textColor;
    this.ctx.fill();
  }
}
