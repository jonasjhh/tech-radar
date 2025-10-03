import { LABEL_CONFIG } from '../constants/config';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export function checkCollision(box1: BoundingBox, box2: BoundingBox): boolean {
  return !(
    box1.x + box1.width / 2 < box2.x - box2.width / 2 ||
    box1.x - box1.width / 2 > box2.x + box2.width / 2 ||
    box1.y + box1.height / 2 < box2.y - box2.height / 2 ||
    box1.y - box1.height / 2 > box2.y + box2.height / 2
  );
}

export function measureTextBox(ctx: CanvasRenderingContext2D, text: string): { width: number; height: number } {
  ctx.font = LABEL_CONFIG.font;
  const metrics = ctx.measureText(text);
  return {
    width: metrics.width + LABEL_CONFIG.padding * 2,
    height: LABEL_CONFIG.height + LABEL_CONFIG.padding,
  };
}
