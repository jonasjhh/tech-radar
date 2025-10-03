import { Category } from '../models/TechRadar';

export type CategoryVisibility = Set<Category>;

export class CategoryFilter {
  private container: HTMLElement;
  private visibleCategories: CategoryVisibility;
  private onChange: (visible: CategoryVisibility) => void;
  private filterElement: HTMLDivElement | null = null;

  private readonly categories: Category[] = ['Lang', 'FW', 'Lib', 'Tool', 'Plat', 'DB', 'Proto', 'Format', 'Infra'];

  constructor(container: HTMLElement, onChange: (visible: CategoryVisibility) => void) {
    this.container = container;
    this.visibleCategories = new Set(this.categories);
    this.onChange = onChange;
  }

  render(): void {
    if (this.filterElement) {
      this.filterElement.remove();
    }

    this.filterElement = document.createElement('div');
    this.filterElement.className = 'category-filter';

    this.categories.forEach(category => {
      const button = document.createElement('button');
      button.className = 'category-filter-btn';
      button.textContent = category;
      button.dataset.category = category;
      button.dataset.visible = 'true';

      button.addEventListener('click', () => {
        const isVisible = this.visibleCategories.has(category);
        if (isVisible) {
          this.visibleCategories.delete(category);
          button.dataset.visible = 'false';
        } else {
          this.visibleCategories.add(category);
          button.dataset.visible = 'true';
        }
        this.onChange(this.visibleCategories);
      });

      this.filterElement!.appendChild(button);
    });

    // Insert after the radar selector
    const selector = this.container.querySelector('.radar-selector-header');
    if (selector && selector.nextSibling) {
      this.container.insertBefore(this.filterElement, selector.nextSibling);
    } else {
      this.container.appendChild(this.filterElement);
    }
  }

  reset(): void {
    this.visibleCategories = new Set(this.categories);
    const buttons = this.filterElement?.querySelectorAll('.category-filter-btn');
    buttons?.forEach(btn => {
      (btn as HTMLElement).dataset.visible = 'true';
    });
  }
}
