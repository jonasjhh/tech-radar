import { TechRadar, Category } from '../models/TechRadar';
import { PhaseConfig } from '../constants/config';

export class RadarList {
  private visibleCategories: Set<Category>;

  constructor(
    private container: HTMLElement,
    private radar: TechRadar,
    private phaseConfigs: PhaseConfig[],
    visibleCategories?: Set<Category>
  ) {
    this.visibleCategories = visibleCategories || new Set(['Lang', 'FW', 'Lib', 'Tool', 'Plat', 'DB', 'Proto', 'Format', 'Infra']);
  }

  render(): void {
    const grid = document.createElement('div');
    grid.className = 'radar-grid';

    this.phaseConfigs.forEach(phase => {
      const column = this.createPhaseColumn(phase);
      grid.appendChild(column);
    });

    this.container.innerHTML = '';
    this.container.appendChild(grid);
  }

  private createPhaseColumn(phase: PhaseConfig): HTMLElement {
    const column = document.createElement('div');
    column.className = 'phase-column';
    column.style.borderTop = `4px solid ${phase.color}`;
    column.style.setProperty('--phase-color', phase.color);

    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'phase-title-wrapper';

    const title = document.createElement('h2');
    title.className = 'phase-title';
    title.textContent = phase.title;

    const tooltip = document.createElement('div');
    tooltip.className = 'phase-tooltip';
    tooltip.textContent = phase.description;

    titleWrapper.appendChild(title);
    titleWrapper.appendChild(tooltip);

    const list = document.createElement('ul');
    list.className = 'tech-list';

    const items = this.radar[phase.key];
    items.forEach(item => {
      const listItem = document.createElement('li');
      listItem.className = 'tech-item';

      // Grey out items with invisible categories
      const isVisible = !item.category || this.visibleCategories.has(item.category);
      if (!isVisible) {
        listItem.classList.add('greyed-out');
      }

      const nameSpan = document.createElement('span');
      nameSpan.className = 'tech-name';
      nameSpan.textContent = item.name;

      listItem.appendChild(nameSpan);

      if (item.category) {
        const categorySpan = document.createElement('span');
        categorySpan.className = 'tech-category';
        categorySpan.textContent = item.category;
        listItem.appendChild(categorySpan);
      }

      // Add custom tooltip if description exists
      if (item.description) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tech-item-tooltip';
        tooltip.textContent = item.description;
        listItem.appendChild(tooltip);
      }

      list.appendChild(listItem);
    });

    column.appendChild(titleWrapper);
    column.appendChild(list);

    return column;
  }

  updateVisibleCategories(visibleCategories: Set<Category>): void {
    this.visibleCategories = visibleCategories;

    // Update existing items instead of re-rendering
    const items = this.container.querySelectorAll('.tech-item');
    items.forEach(item => {
      const categorySpan = item.querySelector('.tech-category');
      const category = categorySpan?.textContent as Category | null;

      const isVisible = !category || this.visibleCategories.has(category);
      if (isVisible) {
        item.classList.remove('greyed-out');
      } else {
        item.classList.add('greyed-out');
      }
    });
  }
}
