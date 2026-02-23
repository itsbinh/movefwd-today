/**
 * Caching Layer for API Responses
 * In-memory cache with configurable TTL and invalidation support
 */

import type { CacheEntry, CacheConfig } from './types'

// Default cache TTL: 1 hour (in seconds)
const DEFAULT_TTL_SECONDS = 3600

// Maximum stale time: 24 hours (in seconds)
const MAX_STALE_SECONDS = 86400

// Cache storage
const memoryCache = new Map<string, CacheEntry<unknown>>()

/**
 * Get a value from cache if it exists and is not expired
 */
export function getFromCache<T>(key: string): T | null {
  const entry = memoryCache.get(key) as CacheEntry<T> | undefined

  if (!entry) {
    return null
  }

  const now = Date.now()

  // Check if entry has expired
  if (now >= entry.expiry) {
    // Check if within stale period
    if (entry.staleAt && now < entry.staleAt) {
      // Return stale data but log that it's stale
      console.warn(`Cache key '${key}' returned stale data`)
      return entry.data
    }

    // Fully expired, remove from cache
    memoryCache.delete(key)
    return null
  }

  return entry.data
}

/**
 * Set a value in cache with TTL
 */
export function setCache<T>(key: string, data: T, ttlSeconds: number = DEFAULT_TTL_SECONDS): void {
  const now = Date.now()
  const expiry = now + ttlSeconds * 1000
  const staleAt = MAX_STALE_SECONDS > ttlSeconds ? now + MAX_STALE_SECONDS * 1000 : undefined

  memoryCache.set(key, {
    data,
    expiry,
    staleAt,
  } as CacheEntry<unknown>)
}

/**
 * Delete a specific key from cache
 */
export function deleteFromCache(key: string): boolean {
  return memoryCache.delete(key)
}

/**
 * Invalidate cache entries matching a pattern
 */
export function invalidateCache(pattern: string): number {
  let count = 0
  const regex = new RegExp(pattern)

  for (const key of memoryCache.keys()) {
    if (regex.test(key)) {
      memoryCache.delete(key)
      count++
    }
  }

  return count
}

/**
 * Clear all cache entries
 */
export function clearCache(): void {
  memoryCache.clear()
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; keys: string[] } {
  const now = Date.now()
  const keys: string[] = []

  for (const [key, entry] of memoryCache.entries()) {
    if (entry.expiry > now) {
      keys.push(key)
    }
  }

  return {
    size: memoryCache.size,
    keys,
  }
}

/**
 * Clean up expired entries from cache
 */
export function cleanupCache(): number {
  const now = Date.now()
  let removed = 0

  for (const [key, entry] of memoryCache.entries()) {
    if (entry.expiry <= now && (!entry.staleAt || entry.staleAt <= now)) {
      memoryCache.delete(key)
      removed++
    }
  }

  return removed
}

/**
 * Get cached or fetch data
 * If cached data exists and is not expired, return it
 * Otherwise, call fetchFn and cache the result
 */
export async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<{ data: T; cached: boolean }> {
  // Try to get from cache first
  const cachedData = getFromCache<T>(key)

  if (cachedData !== null) {
    return { data: cachedData, cached: true }
  }

  // Fetch fresh data
  const data = await fetchFn()

  // Store in cache
  setCache(key, data, ttlSeconds)

  return { data, cached: false }
}

/**
 * Cache configuration for different data types
 */
export const cacheConfigs: Record<string, CacheConfig> = {
  resources: {
    key: 'resources',
    ttlSeconds: DEFAULT_TTL_SECONDS,
    maxStaleSeconds: MAX_STALE_SECONDS,
  },
  sourceStatus: {
    key: 'source_status',
    ttlSeconds: 300, // 5 minutes
    maxStaleSeconds: 600,
  },
  syncStatus: {
    key: 'sync_status',
    ttlSeconds: 60, // 1 minute
    maxStaleSeconds: 120,
  },
  externalServices: {
    key: 'external_services',
    ttlSeconds: DEFAULT_TTL_SECONDS,
    maxStaleSeconds: MAX_STALE_SECONDS,
  },
}

/**
 * Generate cache key from parameters
 */
export function generateCacheKey(
  prefix: string,
  params: Record<string, string | number | boolean | undefined>
): string {
  const sortedParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return `${prefix}${sortedParams ? `?${sortedParams}` : ''}`
}

// Set up periodic cleanup (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const removed = cleanupCache()
    if (removed > 0) {
      console.log(`Cache cleanup: removed ${removed} expired entries`)
    }
  }, 5 * 60 * 1000)
}
