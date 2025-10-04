import { parseRadarData } from './utils/techRadar';
import { radarConfigs, getRadarById, RadarConfig } from './radarConfig';
import { RadarChart } from './components/RadarChart';
import { RadarList } from './components/RadarList';
import { RadarSelector } from './components/RadarSelector';
import { CategoryFilter, CategoryVisibility } from './components/CategoryFilter';
import { TechRadar, Category } from './models/TechRadar';
import { getPhaseConfigs } from './constants/config';
import { eventBus } from './utils/EventBus';

class TechRadarApp {
  private currentRadarId: string = radarConfigs[0].id;
  private currentConfig: RadarConfig = radarConfigs[0];
  private radar: TechRadar;
  private chart: RadarChart | null = null;
  private list: RadarList | null = null;
  private filter: CategoryFilter | null = null;
  private visibleCategories: Set<Category>;

  constructor() {
    this.radar = parseRadarData(radarConfigs[0].data);
    this.visibleCategories = new Set(['Lang', 'FW', 'Lib', 'Tool', 'Plat', 'DB', 'Proto', 'Format', 'Infra']);
    this.setupEventListeners();
  }

  init(): void {
    try {
      this.initializeSelector();
      this.initializeFilter();
      this.applyGradient();
      this.renderChart();
      this.renderList();
    } catch (error) {
      this.showError(error);
    }
  }

  private setupEventListeners(): void {
    // Listen for radar changes
    eventBus.on('radar:changed', (radarId) => {
      this.switchRadar(radarId);
    });

    // Listen for category filter changes
    eventBus.on('category:filter:changed', (visibleCategories) => {
      this.onFilterChange(visibleCategories);
    });
  }

  private initializeFilter(): void {
    const chartContainer = document.querySelector('.chart-container');
    if (!chartContainer) {
      throw new Error('Chart container element not found');
    }

    this.filter = new CategoryFilter(chartContainer as HTMLElement);
    this.filter.render();
  }

  private onFilterChange(visibleCategories: CategoryVisibility): void {
    this.visibleCategories = visibleCategories;
    if (this.chart) {
      this.chart.updateVisibleCategories(visibleCategories);
    }
    if (this.list) {
      this.list.updateVisibleCategories(visibleCategories);
    }
  }

  private applyGradient(): void {
    const gradient = this.currentConfig.theme?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    document.body.style.background = gradient;
  }

  private initializeSelector(): void {
    const chartContainer = document.querySelector('.chart-container');
    if (!chartContainer) {
      throw new Error('Chart container element not found');
    }

    new RadarSelector(chartContainer as HTMLElement, radarConfigs);
  }

  private switchRadar(radarId: string): void {
    const config = getRadarById(radarId);
    if (!config) {
      console.error(`Radar config not found for id: ${radarId}`);
      return;
    }

    this.currentRadarId = radarId;
    this.currentConfig = config;
    this.radar = parseRadarData(config.data);
    this.applyGradient();
    this.renderChart();
    this.renderList();
  }

  private renderChart(): void {
    const canvas = document.getElementById('radar-chart') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    const phaseConfigs = getPhaseConfigs(this.currentConfig.theme?.phaseColors);
    this.chart = new RadarChart(canvas, this.radar, phaseConfigs, this.visibleCategories);
    this.chart.render();
  }

  private renderList(): void {
    const container = document.getElementById('radar-container');
    if (!container) {
      throw new Error('Radar container element not found');
    }

    const phaseConfigs = getPhaseConfigs(this.currentConfig.theme?.phaseColors);
    this.list = new RadarList(container, this.radar, phaseConfigs, this.visibleCategories);
    this.list.render();
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
