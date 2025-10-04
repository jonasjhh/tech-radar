/**
 * TooltipManager - Manages creation and lifecycle of tooltips
 * Follows Single Responsibility Principle by handling only tooltip-related operations
 */
export class TooltipManager {
  private container: HTMLElement;
  private tooltipClass: string;
  private hoverAreaClass: string;

  constructor(
    container: HTMLElement,
    tooltipClass: string = 'tooltip',
    hoverAreaClass: string = 'hover-area'
  ) {
    this.container = container;
    this.tooltipClass = tooltipClass;
    this.hoverAreaClass = hoverAreaClass;
  }

  /**
   * Creates a tooltip with hover area
   */
  createTooltip(config: TooltipConfig): HTMLElement {
    const hoverArea = document.createElement('div');
    hoverArea.className = this.hoverAreaClass;
    hoverArea.style.position = 'absolute';
    hoverArea.style.left = `${config.x}px`;
    hoverArea.style.top = `${config.y}px`;
    hoverArea.style.width = `${config.width}px`;
    hoverArea.style.height = `${config.height}px`;
    hoverArea.style.cursor = config.cursor || 'help';

    if (config.dataAttribute) {
      hoverArea.dataset[config.dataAttribute.key] = config.dataAttribute.value;
    }

    const tooltip = document.createElement('div');
    tooltip.className = this.tooltipClass;
    tooltip.textContent = config.content;

    hoverArea.appendChild(tooltip);
    this.container.appendChild(hoverArea);

    return hoverArea;
  }

  /**
   * Removes all tooltips with the specified class
   */
  clearTooltips(): void {
    const tooltips = this.container.querySelectorAll(`.${this.hoverAreaClass}`);
    tooltips.forEach(tooltip => tooltip.remove());
  }

  /**
   * Removes a specific tooltip element
   */
  removeTooltip(element: HTMLElement): void {
    element.remove();
  }
}

export interface TooltipConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  cursor?: string;
  dataAttribute?: {
    key: string;
    value: string;
  };
}
