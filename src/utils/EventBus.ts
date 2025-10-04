/**
 * EventBus - Centralized event system for decoupled component communication
 * Follows Observer pattern and Single Responsibility Principle
 */

export type EventCallback<T = any> = (data: T) => void;

export interface TechRadarEvents {
  'radar:changed': string; // radarId
  'category:filter:changed': Set<string>; // Set of visible category names
}

export class EventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  /**
   * Subscribe to an event
   * @returns Unsubscribe function
   */
  on<K extends keyof TechRadarEvents>(
    event: K,
    callback: EventCallback<TechRadarEvents[K]>
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(callback);

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
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  /**
   * Emit an event
   */
  emit<K extends keyof TechRadarEvents>(
    event: K,
    data: TechRadarEvents[K]
  ): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for "${event}":`, error);
        }
      });
    }
  }

  /**
   * Subscribe to an event only once
   */
  once<K extends keyof TechRadarEvents>(
    event: K,
    callback: EventCallback<TechRadarEvents[K]>
  ): void {
    const wrappedCallback = (data: TechRadarEvents[K]) => {
      callback(data);
      this.off(event, wrappedCallback as EventCallback<TechRadarEvents[K]>);
    };
    this.on(event, wrappedCallback as EventCallback<TechRadarEvents[K]>);
  }

  /**
   * Clear all listeners for an event, or all events if no event specified
   */
  clear(event?: keyof TechRadarEvents): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get listener count for debugging
   */
  getListenerCount(event: keyof TechRadarEvents): number {
    return this.listeners.get(event)?.size ?? 0;
  }
}

// Export singleton instance
export const eventBus = new EventBus();
