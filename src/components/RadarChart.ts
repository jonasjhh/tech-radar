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
    this.drawRadialRings();
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

  private drawRadialRings(): void {
    // Draw 5 concentric rings with equal areas
    // Area of circle = π * r²
    // For equal areas, radius should be proportional to sqrt(n)
    const numRings = 5;
    this.ctx.strokeStyle = 'rgba(53, 71, 84, 0.15)'; // Semi-transparent dark blue-gray
    this.ctx.lineWidth = 1;

    for (let i = 1; i <= numRings; i++) {
      // Use sqrt to ensure equal areas between rings
      const ringRadius = this.radius * Math.sqrt(i / numRings);
      this.ctx.beginPath();
      this.ctx.arc(this.centerX, this.centerY, ringRadius, 0, 2 * Math.PI);
      this.ctx.stroke();
    }
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

    // Measure text to create background box
    this.ctx.font = TITLE_CONFIG.font;
    const text = phase.title.toUpperCase();
    const textMetrics = this.ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = 16; // Approximate font height

    // Add padding
    const padding = 8;
    const boxWidth = textWidth + padding * 2;
    const boxHeight = textHeight + padding * 2;
    const boxX = titleX - boxWidth / 2;
    const boxY = titleY - boxHeight / 2;

    // Draw rounded rectangle background with phase color
    const borderRadius = 4;
    drawRoundedRect(this.ctx, boxX, boxY, boxWidth, boxHeight, borderRadius);
    this.ctx.fillStyle = phase.color;
    this.ctx.fill();

    // Draw white text
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, titleX, titleY);
  }

  private drawItems(): void {
    const placedItems: BoundingBox[] = [];

    // Remove existing tech tooltips and hover areas
    const container = this.canvas.parentElement;
    if (container) {
      const existingTechAreas = container.querySelectorAll('.tech-canvas-hover-area');
      existingTechAreas.forEach(area => area.remove());
    }

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
        if (item.description) {
          this.createLabelTooltip(item.name, item.description, position.x, position.y, position.boundingBox);
        }
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
      const { x, y } = this.calculatePosition(phase, index, totalItems, item);
      const boundingBox: BoundingBox = { x, y, width, height };

      if (!placedItems.some(placed => checkCollision(boundingBox, placed))) {
        return { x, y, boundingBox };
      }
    }

    // Fallback: return last calculated position even if overlapping
    const { x, y } = this.calculatePosition(phase, index, totalItems, item);
    return { x, y, boundingBox: { x, y, width, height } };
  }

  private calculatePosition(
    phase: PhaseConfig,
    index: number,
    totalItems: number,
    item?: TechItem
  ): { x: number; y: number } {
    const angleSpread = (phase.endAngle - phase.startAngle) * CANVAS_CONFIG.angleSpreadMultiplier;
    const angleOffset = (phase.endAngle - phase.startAngle) * CANVAS_CONFIG.angleOffsetMultiplier;
    const randomAngle = (Math.random() - 0.5) * COLLISION_CONFIG.randomAngleRange;
    const itemAngle = phase.startAngle + angleOffset +
      (angleSpread * (index + 1) / (totalItems + 1)) + randomAngle;

    // Use maturityScore (1-5) to determine radius with equal-area distribution
    // maturityScore 1 = closest to center (most mature), maturityScore 5 = furthest from center (least mature)
    // Position items in the middle of their respective ring area using sqrt for equal areas
    const score = item.maturityScore;
    const minRadiusFactor = Math.sqrt((score - 1) / 5); // Inner boundary of ring
    const maxRadiusFactor = Math.sqrt(score / 5); // Outer boundary of ring

    // Add more variation for inner rings to spread out labels
    // Inner rings get more radial noise to utilize the full ring width
    const ringWidth = maxRadiusFactor - minRadiusFactor;
    const radiusWithinRing = minRadiusFactor + Math.random() * ringWidth; // Random position within ring

    const itemRadius = this.radius * radiusWithinRing;

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

  private createLabelTooltip(name: string, description: string, x: number, y: number, boundingBox: BoundingBox): void {
    const container = this.canvas.parentElement;
    if (!container) return;

    // Get canvas position relative to container
    const canvasRect = this.canvas.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const canvasOffsetX = canvasRect.left - containerRect.left;
    const canvasOffsetY = canvasRect.top - containerRect.top;

    // Convert center-based bounding box to top-left coordinates
    const boxX = boundingBox.x - boundingBox.width / 2;
    const boxY = boundingBox.y - boundingBox.height / 2;

    // Create hover area matching the label's bounding box
    const hoverArea = document.createElement('div');
    hoverArea.className = 'tech-canvas-hover-area';
    hoverArea.style.position = 'absolute';
    hoverArea.style.left = `${canvasOffsetX + boxX}px`;
    hoverArea.style.top = `${canvasOffsetY + boxY}px`;
    hoverArea.style.width = `${boundingBox.width}px`;
    hoverArea.style.height = `${boundingBox.height}px`;
    hoverArea.style.cursor = 'help';
    hoverArea.dataset.tech = name;

    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tech-canvas-tooltip';
    tooltip.textContent = description;

    hoverArea.appendChild(tooltip);
    container.appendChild(hoverArea);
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
