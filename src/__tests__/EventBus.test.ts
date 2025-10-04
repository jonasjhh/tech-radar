import { EventBus } from '../utils/EventBus';

describe('EventBus', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  afterEach(() => {
    eventBus.clear();
  });

  describe('on/emit', () => {
    it('should allow subscribing and emitting events', () => {
      const callback = jest.fn();
      eventBus.on('radar:changed', callback);

      eventBus.emit('radar:changed', 'test-radar-id');

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('test-radar-id');
    });

    it('should support multiple subscribers', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      eventBus.on('radar:changed', callback1);
      eventBus.on('radar:changed', callback2);

      eventBus.emit('radar:changed', 'test-id');

      expect(callback1).toHaveBeenCalledWith('test-id');
      expect(callback2).toHaveBeenCalledWith('test-id');
    });

    it('should handle category filter changes', () => {
      const callback = jest.fn();
      const categories = new Set(['Lang', 'Tool']);

      eventBus.on('category:filter:changed', callback);
      eventBus.emit('category:filter:changed', categories);

      expect(callback).toHaveBeenCalledWith(categories);
    });
  });

  describe('off', () => {
    it('should unsubscribe from events', () => {
      const callback = jest.fn();
      eventBus.on('radar:changed', callback);

      eventBus.off('radar:changed', callback);
      eventBus.emit('radar:changed', 'test-id');

      expect(callback).not.toHaveBeenCalled();
    });

    it('should return unsubscribe function', () => {
      const callback = jest.fn();
      const unsubscribe = eventBus.on('radar:changed', callback);

      unsubscribe();
      eventBus.emit('radar:changed', 'test-id');

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('once', () => {
    it('should only trigger callback once', () => {
      const callback = jest.fn();
      eventBus.once('radar:changed', callback);

      eventBus.emit('radar:changed', 'id1');
      eventBus.emit('radar:changed', 'id2');

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('id1');
    });
  });

  describe('clear', () => {
    it('should clear all listeners for an event', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      eventBus.on('radar:changed', callback1);
      eventBus.on('category:filter:changed', callback2);

      eventBus.clear('radar:changed');

      eventBus.emit('radar:changed', 'test-id');
      eventBus.emit('category:filter:changed', new Set(['Lang']));

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it('should clear all listeners when no event specified', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      eventBus.on('radar:changed', callback1);
      eventBus.on('category:filter:changed', callback2);

      eventBus.clear();

      eventBus.emit('radar:changed', 'test-id');
      eventBus.emit('category:filter:changed', new Set(['Lang']));

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should catch and log errors in callbacks', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const errorCallback = jest.fn(() => {
        throw new Error('Test error');
      });
      const normalCallback = jest.fn();

      eventBus.on('radar:changed', errorCallback);
      eventBus.on('radar:changed', normalCallback);

      eventBus.emit('radar:changed', 'test-id');

      expect(consoleSpy).toHaveBeenCalled();
      expect(normalCallback).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('getListenerCount', () => {
    it('should return correct listener count', () => {
      expect(eventBus.getListenerCount('radar:changed')).toBe(0);

      eventBus.on('radar:changed', jest.fn());
      expect(eventBus.getListenerCount('radar:changed')).toBe(1);

      eventBus.on('radar:changed', jest.fn());
      expect(eventBus.getListenerCount('radar:changed')).toBe(2);
    });
  });
});
