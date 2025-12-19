// Simple caching utility with TTL (Time To Live)

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

const CACHE_PREFIX = 'analytics_cache_';
const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes default

export function getCachedData<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cached) return null;
    
    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is expired
    if (now - entry.timestamp > entry.ttl) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }
    
    return entry.data;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

export function setCachedData<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  if (typeof window === 'undefined') return;
  
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    ttl,
  };
  
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
  } catch (error) {
    console.error('Error writing cache:', error);
    // If storage is full, try to clear old cache entries
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      clearExpiredCache();
      try {
        localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
      } catch (retryError) {
        console.error('Failed to cache after cleanup:', retryError);
      }
    }
  }
}

export function clearExpiredCache(): void {
  if (typeof window === 'undefined') return;
  
  const now = Date.now();
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_PREFIX)) {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const entry: CacheEntry<any> = JSON.parse(cached);
          if (now - entry.timestamp > entry.ttl) {
            keysToRemove.push(key);
          }
        }
      } catch {
        // Invalid cache entry, remove it
        keysToRemove.push(key);
      }
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

export function clearCache(key?: string): void {
  if (typeof window === 'undefined') return;
  
  if (key) {
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
  } else {
    // Clear all cache entries
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}

export function getCacheTimestamp(key: string): number | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cached) return null;
    
    const entry: CacheEntry<any> = JSON.parse(cached);
    return entry.timestamp;
  } catch {
    return null;
  }
}

