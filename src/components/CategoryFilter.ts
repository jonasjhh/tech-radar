import { Category } from '../models/TechRadar';
import { eventBus } from '../utils/EventBus';

export type CategoryVisibility = Set<Category>;

export class CategoryFilter {
  private container: HTMLElement;
  private visibleCategories: CategoryVisibility;
  private filterElement: HTMLDivElement | null = null;

  private readonly categories: Category[] = ['Lang', 'FW', 'Lib', 'Tool', 'Plat', 'DB', 'Proto', 'Format', 'Infra'];

  private readonly categoryLabels: Record<Category, string> = {
    'Lang': 'Language',
    'FW': 'Framework',
    'Lib': 'Library',
    'Tool': 'Tool',
    'Plat': 'Platform',
    'DB': 'Database',
    'Proto': 'Protocol',
    'Format': 'Format',
    'Infra': 'Infrastructure'
  };

  constructor(container: HTMLElement) {
    this.container = container;
    this.visibleCategories = new Set(this.categories);
  }

  render(): void {
    if (this.filterElement) {
      this.filterElement.remove();
    }

    this.filterElement = document.createElement('div');
    this.filterElement.className = 'category-filter';

    // Add "All" button first
    const allButton = document.createElement('button');
    allButton.className = 'category-filter-btn';
    allButton.textContent = 'All';
    allButton.dataset.visible = 'true';

    allButton.addEventListener('click', () => {
      const allVisible = this.visibleCategories.size === this.categories.length;

      if (allVisible) {
        // Deselect all
        this.visibleCategories.clear();
        allButton.dataset.visible = 'false';
        this.filterElement?.querySelectorAll('.category-filter-btn[data-category]').forEach(btn => {
          (btn as HTMLElement).dataset.visible = 'false';
        });
      } else {
        // Select all
        this.categories.forEach(cat => this.visibleCategories.add(cat));
        allButton.dataset.visible = 'true';
        this.filterElement?.querySelectorAll('.category-filter-btn[data-category]').forEach(btn => {
          (btn as HTMLElement).dataset.visible = 'true';
        });
      }

      eventBus.emit('category:filter:changed', this.visibleCategories);
    });

    this.filterElement.appendChild(allButton);

    this.categories.forEach(category => {
      const button = document.createElement('button');
      button.className = 'category-filter-btn';
      button.textContent = this.categoryLabels[category];
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

        // Update "All" button state
        const allBtn = this.filterElement?.querySelector('.category-filter-btn:first-child') as HTMLElement;
        if (allBtn) {
          allBtn.dataset.visible = this.visibleCategories.size === this.categories.length ? 'true' : 'false';
        }

        eventBus.emit('category:filter:changed', this.visibleCategories);
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
