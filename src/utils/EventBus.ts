/**
 * EventBus - Centralized event system for decoupled component communication
 * Follows Observer pattern and Single Responsibility Principle
 *
 * Fully type-safe implementation using mapped types
 */

export type EventCallback<T = unknown> = (data: T) => void;

export interface TechRadarEvents {
  'radar:changed': string; // radarId
  'category:filter:changed': Set<string>; // Set of visible category names
}

// Mapped type for type-safe listener storage
type EventListenerMap = {
  [K in keyof TechRadarEvents]: Set<EventCallback<TechRadarEvents[K]>>;
};

export class EventBus {
  private listeners: EventListenerMap = {
    'radar:changed': new Set(),
    'category:filter:changed': new Set(),
  };

  /**
   * Subscribe to an event
   * @returns Unsubscribe function
   */
  on<K extends keyof TechRadarEvents>(
    event: K,
    callback: EventCallback<TechRadarEvents[K]>
  ): () => void {
    this.listeners[event].add(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from an event
   */
  off<K extends keyof TechRadarEvents>(
    event: K,
    callback: EventCallback<TechRadarEvents[K]>
  ): void {
    this.listeners[event].delete(callback);
  }

  /**
   * Emit an event
   */
  emit<K extends keyof TechRadarEvents>(
    event: K,
    data: TechRadarEvents[K]
  ): void {
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for "${event}":`, error);
      }
    });
  }

  /**
   * Subscribe to an event only once
   */
  once<K extends keyof TechRadarEvents>(
    event: K,
    callback: EventCallback<TechRadarEvents[K]>
  ): void {
    const wrappedCallback = (data: TechRadarEvents[K]): void => {
      callback(data);
      this.off(event, wrappedCallback);
    };
    this.on(event, wrappedCallback);
  }

  /**
   * Clear all listeners for an event, or all events if no event specified
   */
  clear(event?: keyof TechRadarEvents): void {
    if (event) {
      this.listeners[event].clear();
    } else {
      Object.keys(this.listeners).forEach(key => {
        this.listeners[key as keyof TechRadarEvents].clear();
      });
    }
  }

  /**
   * Get listener count for debugging
   */
  getListenerCount(event: keyof TechRadarEvents): number {
    return this.listeners[event].size;
  }
}

// Export singleton instance
export const eventBus = new EventBus();
