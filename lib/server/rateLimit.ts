import { rateLimitConfig } from '@/lib/server/env'

const buckets = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, {
      count: 1,
      resetAt: now + rateLimitConfig.windowMs,
    })
    return { allowed: true, retryAfterSeconds: Math.ceil(rateLimitConfig.windowMs / 1000) }
  }

  if (existing.count >= rateLimitConfig.maxRequests) {
    return { allowed: false, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) }
  }

  existing.count += 1
  buckets.set(key, existing)

  return { allowed: true, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) }
}
