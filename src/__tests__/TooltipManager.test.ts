import { TooltipManager } from '../components/TooltipManager';

describe('TooltipManager', () => {
  let container: HTMLElement;
  let manager: TooltipManager;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    manager = new TooltipManager(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('createTooltip', () => {
    it('should create tooltip with hover area', () => {
      const hoverArea = manager.createTooltip({
        x: 10,
        y: 20,
        width: 100,
        height: 50,
        content: 'Test tooltip'
      });

      expect(hoverArea.parentElement).toBe(container);
      expect(hoverArea.style.left).toBe('10px');
      expect(hoverArea.style.top).toBe('20px');
      expect(hoverArea.style.width).toBe('100px');
      expect(hoverArea.style.height).toBe('50px');

      const tooltip = hoverArea.querySelector('.tooltip');
      expect(tooltip).toBeTruthy();
      expect(tooltip?.textContent).toBe('Test tooltip');
    });

    it('should apply custom cursor', () => {
      const hoverArea = manager.createTooltip({
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        content: 'Test',
        cursor: 'pointer'
      });

      expect(hoverArea.style.cursor).toBe('pointer');
    });

    it('should add data attributes', () => {
      const hoverArea = manager.createTooltip({
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        content: 'Test',
        dataAttribute: {
          key: 'tech',
          value: 'TypeScript'
        }
      });

      expect(hoverArea.dataset.tech).toBe('TypeScript');
    });

    it('should use custom CSS classes', () => {
      const customManager = new TooltipManager(
        container,
        'custom-tooltip',
        'custom-hover-area'
      );

      const hoverArea = customManager.createTooltip({
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        content: 'Test'
      });

      expect(hoverArea.className).toBe('custom-hover-area');
      expect(hoverArea.querySelector('.custom-tooltip')).toBeTruthy();
    });
  });

  describe('clearTooltips', () => {
    it('should remove all tooltips', () => {
      manager.createTooltip({
        x: 0, y: 0, width: 50, height: 50, content: 'Test 1'
      });
      manager.createTooltip({
        x: 10, y: 10, width: 50, height: 50, content: 'Test 2'
      });

      expect(container.querySelectorAll('.hover-area')).toHaveLength(2);

      manager.clearTooltips();

      expect(container.querySelectorAll('.hover-area')).toHaveLength(0);
    });
  });

  describe('removeTooltip', () => {
    it('should remove specific tooltip', () => {
      const tooltip1 = manager.createTooltip({
        x: 0, y: 0, width: 50, height: 50, content: 'Test 1'
      });
      const tooltip2 = manager.createTooltip({
        x: 10, y: 10, width: 50, height: 50, content: 'Test 2'
      });

      expect(container.querySelectorAll('.hover-area')).toHaveLength(2);

      manager.removeTooltip(tooltip1);

      expect(container.querySelectorAll('.hover-area')).toHaveLength(1);
      expect(container.contains(tooltip2)).toBe(true);
    });
  });
});
