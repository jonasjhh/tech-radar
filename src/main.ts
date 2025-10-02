import { parseRadarData } from './techRadar';
import { radarData } from './radarData';
import { RadarChart } from './radarChart';
import { RadarList } from './radarList';

class TechRadarApp {
  private radar = parseRadarData(radarData);

  init(): void {
    try {
      this.renderChart();
      this.renderList();
    } catch (error) {
      this.showError(error);
    }
  }

  private renderChart(): void {
    const canvas = document.getElementById('radar-chart') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    const chart = new RadarChart(canvas, this.radar);
    chart.render();
  }

  private renderList(): void {
    const container = document.getElementById('radar-container');
    if (!container) {
      throw new Error('Radar container element not found');
    }

    const list = new RadarList(container, this.radar);
    list.render();
  }

  private showError(error: unknown): void {
    console.error('Failed to load tech radar:', error);
    const container = document.getElementById('radar-container');
    if (container) {
      container.innerHTML = '<p class="error">Failed to load tech radar data</p>';
    }
  }
}

if (typeof window !== 'undefined') {
  const app = new TechRadarApp();
  app.init();
}

export { parseRadarData };
