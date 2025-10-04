import { getRelativePosition, centerToTopLeft, createElement } from '../utils/domUtils';

describe('domUtils', () => {
  describe('getRelativePosition', () => {
    it('should calculate relative position correctly', () => {
      const container = document.createElement('div');
      const element = document.createElement('div');

      // Mock getBoundingClientRect
      jest.spyOn(container, 'getBoundingClientRect').mockReturnValue({
        left: 100,
        top: 50,
        right: 300,
        bottom: 250,
        width: 200,
        height: 200,
        x: 100,
        y: 50,
        toJSON: () => ({})
      });

      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        left: 150,
        top: 100,
        right: 250,
        bottom: 200,
        width: 100,
        height: 100,
        x: 150,
        y: 100,
        toJSON: () => ({})
      });

      const result = getRelativePosition(element, container);

      expect(result).toEqual({ x: 50, y: 50 });
    });
  });

  describe('centerToTopLeft', () => {
    it('should convert center coordinates to top-left', () => {
      const result = centerToTopLeft(100, 100, 50, 30);

      expect(result).toEqual({ x: 75, y: 85 });
    });

    it('should handle zero width and height', () => {
      const result = centerToTopLeft(50, 50, 0, 0);

      expect(result).toEqual({ x: 50, y: 50 });
    });
  });

  describe('createElement', () => {
    it('should create element with className', () => {
      const element = createElement('div', { className: 'test-class' });

      expect(element.tagName).toBe('DIV');
      expect(element.className).toBe('test-class');
    });

    it('should create element with textContent', () => {
      const element = createElement('span', { textContent: 'Hello' });

      expect(element.textContent).toBe('Hello');
    });

    it('should create element with attributes', () => {
      const element = createElement('div', {
        attributes: {
          'data-test': 'value',
          'id': 'my-id'
        }
      });

      expect(element.getAttribute('data-test')).toBe('value');
      expect(element.id).toBe('my-id');
    });

    it('should create element with styles', () => {
      const element = createElement('div', {
        styles: {
          position: 'absolute',
          left: '10px'
        }
      });

      expect(element.style.position).toBe('absolute');
      expect(element.style.left).toBe('10px');
    });

    it('should create element with all options combined', () => {
      const element = createElement('button', {
        className: 'btn',
        textContent: 'Click me',
        attributes: { 'type': 'button' },
        styles: { color: 'red' }
      });

      expect(element.className).toBe('btn');
      expect(element.textContent).toBe('Click me');
      expect(element.getAttribute('type')).toBe('button');
      expect(element.style.color).toBe('red');
    });
  });
});
