/**
 * A simple LRU (Least Recently Used) Cache implementation
 * that stores a maximum number of items and evicts the least
 * recently used item when capacity is reached.
 */
export class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;
  
  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map<K, V>();
  }
  
  /**
   * Get a value from the cache and mark it as recently used
   */
  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }
    
    // Remove the item and re-add it to mark it as most recently used
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value as V);
    
    return value;
  }
  
  /**
   * Add or update a key-value pair in the cache
   */
  put(key: K, value: V): void {
    // If key exists, remove it first to update its position
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } 
    // If at capacity, remove the oldest item (first in the map)
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    // Add the new item (it will be the newest)
    this.cache.set(key, value);
  }
  
  /**
   * Get all values currently in the cache
   */
  values(): V[] {
    return Array.from(this.cache.values());
  }
  
  /**
   * Check if a key exists in the cache
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }
  
  /**
   * Clear the cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get the current size of the cache
   */
  size(): number {
    return this.cache.size;
  }
}