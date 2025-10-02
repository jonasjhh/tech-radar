import { TechRadar } from './techRadar';
import { PHASE_CONFIGS } from './config';

export class RadarList {
  constructor(private container: HTMLElement, private radar: TechRadar) {}

  render(): void {
    const grid = document.createElement('div');
    grid.className = 'radar-grid';

    PHASE_CONFIGS.forEach(phase => {
      const column = this.createPhaseColumn(phase);
      grid.appendChild(column);
    });

    this.container.innerHTML = '';
    this.container.appendChild(grid);
  }

  private createPhaseColumn(phase: typeof PHASE_CONFIGS[0]): HTMLElement {
    const column = document.createElement('div');
    column.className = 'phase-column';
    column.style.borderTop = `4px solid ${phase.color}`;

    const title = document.createElement('h2');
    title.className = 'phase-title';
    title.textContent = phase.title;

    const list = document.createElement('ul');
    list.className = 'tech-list';

    const items = this.radar[phase.key];
    items.forEach(item => {
      const listItem = document.createElement('li');
      listItem.className = 'tech-item';

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

      list.appendChild(listItem);
    });

    column.appendChild(title);
    column.appendChild(list);

    return column;
  }
}
