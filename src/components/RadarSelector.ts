import { RadarConfig } from '../data';

export class RadarSelector {
  private selectElement: HTMLSelectElement;

  constructor(
    private container: HTMLElement,
    private configs: RadarConfig[],
    private onRadarChange: (radarId: string) => void
  ) {
    this.selectElement = this.createSelector();
    this.render();
  }

  private createSelector(): HTMLSelectElement {
    const select = document.createElement('select');
    select.id = 'radar-selector';
    select.className = 'radar-selector';

    this.configs.forEach(config => {
      const option = document.createElement('option');
      option.value = config.id;
      option.textContent = config.name;
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.onRadarChange(target.value);
    });

    return select;
  }

  private render(): void {
    this.selectElement.className = 'radar-selector-header';
    this.container.prepend(this.selectElement);
  }

  setSelectedRadar(radarId: string): void {
    this.selectElement.value = radarId;
  }
}
