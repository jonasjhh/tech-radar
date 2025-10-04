/**
 * DOM utility functions following DRY principles
 */

/**
 * Gets element bounding box relative to a container
 */
export function getRelativePosition(
  element: HTMLElement,
  container: HTMLElement
): { x: number; y: number } {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return {
    x: elementRect.left - containerRect.left,
    y: elementRect.top - containerRect.top
  };
}

/**
 * Converts center-based coordinates to top-left coordinates
 */
export function centerToTopLeft(
  centerX: number,
  centerY: number,
  width: number,
  height: number
): { x: number; y: number } {
  return {
    x: centerX - width / 2,
    y: centerY - height / 2
  };
}

/**
 * Creates a DOM element with optional attributes and children
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options?: {
    className?: string;
    textContent?: string;
    attributes?: Record<string, string>;
    styles?: Partial<CSSStyleDeclaration>;
  }
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);

  if (options?.className) {
    element.className = options.className;
  }

  if (options?.textContent) {
    element.textContent = options.textContent;
  }

  if (options?.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  if (options?.styles) {
    Object.assign(element.style, options.styles);
  }

  return element;
}

/**
 * Safely queries an element, throwing if not found
 */
export function getRequiredElement<T extends HTMLElement>(
  selector: string,
  parent: Document | HTMLElement = document
): T {
  const element = parent.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Required element not found: ${selector}`);
  }
  return element;
}
