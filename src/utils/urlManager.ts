/**
 * URL Manager - Handles browser URL for deep linking using hash fragments
 * Allows direct navigation to specific radars via URL anchors
 * Example: tech-radar/#tech2025 or tech-radar/#da
 *
 * Uses hash-based routing (SPA standard) which works with static hosting
 */

export class UrlManager {
  /**
   * Get the current radar ID from URL hash
   * Supports format: #radarId
   * @returns Radar ID from URL or null if not present
   */
  static getCurrentRadarId(): string | null {
    const hash = window.location.hash.substring(1); // Remove #
    return hash || null;
  }

  /**
   * Set the radar ID in URL hash
   * Uses simple anchor format: #radarId
   * @param radarId - The radar ID to set in the hash
   */
  static setRadarId(radarId: string): void {
    const newHash = `#${radarId}`;
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
  }

  /**
   * Clear the URL hash
   */
  static clearHash(): void {
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }

  /**
   * Register a callback for hash changes
   * @param callback - Function to call when hash changes
   * @returns Cleanup function to remove the listener
   */
  static onHashChange(callback: (radarId: string | null) => void): () => void {
    const handler = () => {
      callback(this.getCurrentRadarId());
    };

    window.addEventListener('hashchange', handler);

    return () => {
      window.removeEventListener('hashchange', handler);
    };
  }

  /**
   * Check if a radar ID exists in the URL hash
   */
  static hasHash(): boolean {
    return !!this.getCurrentRadarId();
  }
}
