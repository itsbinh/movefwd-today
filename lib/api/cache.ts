/**
 * Shared-first caching layer.
 * Uses Upstash Redis REST when configured; falls back to in-memory cache.
 */

import type { CacheEntry, CacheConfig } from './types'
import { upstashConfig } from '@/lib/server/env'
import { logger } from '@/lib/server/logger'

const DEFAULT_TTL_SECONDS = 3600
const MAX_STALE_SECONDS = 86400

const memoryCache = new Map<string, CacheEntry<unknown>>()

interface CacheStore {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>
  del(key: string): Promise<boolean>
}

class MemoryCacheStore implements CacheStore {
  async get<T>(key: string): Promise<T | null> {
    const entry = memoryCache.get(key) as CacheEntry<T> | undefined
    if (!entry) return null

    const now = Date.now()
    if (now >= entry.expiry) {
      if (entry.staleAt && now < entry.staleAt) {
        logger.warn('Returning stale cache data', { key })
        return entry.data
      }
      memoryCache.delete(key)
      return null
    }

    return entry.data
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    const now = Date.now()
    const expiry = now + ttlSeconds * 1000
    const staleAt = now + MAX_STALE_SECONDS * 1000
    memoryCache.set(key, {
      data: value,
      expiry,
      staleAt,
    } as CacheEntry<unknown>)
  }

  async del(key: string): Promise<boolean> {
    return memoryCache.delete(key)
  }
}

class UpstashCacheStore implements CacheStore {
  private url: string
  private token: string
  private fallback = new MemoryCacheStore()

  constructor(url: string, token: string) {
    this.url = url
    this.token = token
  }

  private async call(path: string, body?: unknown) {
    const response = await fetch(`${this.url}${path}`, {
      method: body ? 'POST' : 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Upstash request failed: ${response.status}`)
    }

    return response.json() as Promise<{ result: unknown }>
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const payload = await this.call(`/get/${encodeURIComponent(key)}`)
      if (!payload.result) return null
      return JSON.parse(String(payload.result)) as T
    } catch (error) {
      logger.warn('Upstash get failed, falling back to memory cache', {
        key,
        error: error instanceof Error ? error.message : 'unknown',
      })
      return this.fallback.get<T>(key)
    }
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
      await this.call('/set', [key, JSON.stringify(value), 'EX', ttlSeconds])
    } catch (error) {
      logger.warn('Upstash set failed, writing to memory cache', {
        key,
        error: error instanceof Error ? error.message : 'unknown',
      })
      await this.fallback.set(key, value, ttlSeconds)
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await this.call(`/del/${encodeURIComponent(key)}`)
      return true
    } catch (error) {
      logger.warn('Upstash del failed, deleting memory cache key', {
        key,
        error: error instanceof Error ? error.message : 'unknown',
      })
      return this.fallback.del(key)
    }
  }
}

const store: CacheStore =
  upstashConfig.url && upstashConfig.token
    ? new UpstashCacheStore(upstashConfig.url, upstashConfig.token)
    : new MemoryCacheStore()

export async function getFromCache<T>(key: string): Promise<T | null> {
  return store.get<T>(key)
}

export async function setCache<T>(
  key: string,
  data: T,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<void> {
  await store.set(key, data, ttlSeconds)
}

export async function deleteFromCache(key: string): Promise<boolean> {
  return store.del(key)
}

export async function invalidateCache(prefix: string): Promise<number> {
  let count = 0
  const keysToDelete: string[] = []

  memoryCache.forEach((_value, key) => {
    if (key.startsWith(prefix)) keysToDelete.push(key)
  })

  for (const key of keysToDelete) {
    if (await store.del(key)) count += 1
  }

  return count
}

export function clearCache(): void {
  memoryCache.clear()
}

export function getCacheStats(): { size: number; keys: string[] } {
  const now = Date.now()
  const keys: string[] = []

  memoryCache.forEach((entry, key) => {
    if (entry.expiry > now) keys.push(key)
  })

  return {
    size: memoryCache.size,
    keys,
  }
}

export function cleanupCache(): number {
  const now = Date.now()
  let removed = 0

  memoryCache.forEach((entry, key) => {
    if (entry.expiry <= now && (!entry.staleAt || entry.staleAt <= now)) {
      memoryCache.delete(key)
      removed += 1
    }
  })

  return removed
}

export async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<{ data: T; cached: boolean }> {
  const cachedData = await getFromCache<T>(key)

  if (cachedData !== null) {
    return { data: cachedData, cached: true }
  }

  const data = await fetchFn()
  await setCache(key, data, ttlSeconds)

  return { data, cached: false }
}

export const cacheConfigs: Record<string, CacheConfig> = {
  resources: {
    key: 'resources',
    ttlSeconds: DEFAULT_TTL_SECONDS,
    maxStaleSeconds: MAX_STALE_SECONDS,
  },
  sourceStatus: {
    key: 'source_status',
    ttlSeconds: 300,
    maxStaleSeconds: 600,
  },
  syncStatus: {
    key: 'sync_status',
    ttlSeconds: 60,
    maxStaleSeconds: 120,
  },
  externalServices: {
    key: 'external_services',
    ttlSeconds: DEFAULT_TTL_SECONDS,
    maxStaleSeconds: MAX_STALE_SECONDS,
  },
}

export function generateCacheKey(
  prefix: string,
  params: Record<string, string | number | boolean | undefined>
): string {
  const sortedParams = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return `${prefix}${sortedParams ? `?${sortedParams}` : ''}`
}

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const removed = cleanupCache()
    if (removed > 0) {
      logger.info('Cache cleanup removed expired entries', { removed })
    }
  }, 5 * 60 * 1000)
}
