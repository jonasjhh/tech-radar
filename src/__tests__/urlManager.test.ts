import { UrlManager } from '../utils/urlManager';

describe('UrlManager', () => {
  beforeEach(() => {
    // Clear hash before each test
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = '';
  });

  describe('getCurrentRadarId', () => {
    it('should return null when no hash is present', () => {
      expect(UrlManager.getCurrentRadarId()).toBeNull();
    });

    it('should return radar ID from hash', () => {
      window.location.hash = '#tech2025';
      expect(UrlManager.getCurrentRadarId()).toBe('tech2025');
    });

    it('should return radar ID with hyphens', () => {
      window.location.hash = '#da-radar';
      expect(UrlManager.getCurrentRadarId()).toBe('da-radar');
    });

    it('should return null for empty hash', () => {
      window.location.hash = '#';
      expect(UrlManager.getCurrentRadarId()).toBeNull();
    });
  });

  describe('setRadarId', () => {
    it('should set the radar ID in hash', () => {
      UrlManager.setRadarId('tech2025');
      expect(window.location.hash).toBe('#tech2025');
    });

    it('should update existing hash', () => {
      window.location.hash = '#old';
      UrlManager.setRadarId('new');
      expect(window.location.hash).toBe('#new');
    });

    it('should handle radar IDs with special characters', () => {
      UrlManager.setRadarId('da-radar');
      expect(window.location.hash).toBe('#da-radar');
    });
  });

  describe('clearHash', () => {
    it('should clear the hash', () => {
      window.location.hash = '#tech2025';
      UrlManager.clearHash();
      expect(window.location.hash).toBe('');
    });

    it('should do nothing if no hash present', () => {
      UrlManager.clearHash();
      expect(window.location.hash).toBe('');
    });
  });

  describe('hasHash', () => {
    it('should return false when no hash', () => {
      expect(UrlManager.hasHash()).toBe(false);
    });

    it('should return true when hash exists', () => {
      window.location.hash = '#tech2025';
      expect(UrlManager.hasHash()).toBe(true);
    });

    it('should return false for empty hash', () => {
      window.location.hash = '#';
      // getCurrentRadarId returns null for empty hash, so hasHash should be false
      expect(UrlManager.hasHash()).toBe(false);
    });
  });

  describe('onHashChange', () => {
    it('should call callback when hash changes', (done) => {
      const callback = jest.fn((radarId) => {
        expect(radarId).toBe('test');
        done();
      });

      UrlManager.onHashChange(callback);

      // Trigger hash change
      window.location.hash = '#test';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    it('should return cleanup function', () => {
      const callback = jest.fn();
      const cleanup = UrlManager.onHashChange(callback);

      expect(typeof cleanup).toBe('function');

      cleanup();
      window.location.hash = '#test';
      window.dispatchEvent(new HashChangeEvent('hashchange'));

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle multiple listeners', (done) => {
      let callCount = 0;

      const callback1 = jest.fn(() => {
        callCount++;
        if (callCount === 2) done();
      });

      const callback2 = jest.fn(() => {
        callCount++;
        if (callCount === 2) done();
      });

      UrlManager.onHashChange(callback1);
      UrlManager.onHashChange(callback2);

      window.location.hash = '#test';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  });
});
