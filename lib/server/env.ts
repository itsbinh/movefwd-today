import { z } from 'zod'

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  ADMIN_API_KEY: z.string().min(20).optional(),
  ENABLE_ADMIN_INGESTION: z.enum(['true', 'false']).optional(),
  RATE_LIMIT_WINDOW_MS: z.string().optional(),
  RATE_LIMIT_MAX_REQUESTS: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
})

export const serverEnv = serverEnvSchema.parse(process.env)

export const securityConfig = {
  adminApiKey: serverEnv.ADMIN_API_KEY,
  adminIngestionEnabled: serverEnv.ENABLE_ADMIN_INGESTION === 'true',
}

export const rateLimitConfig = {
  windowMs: Number(serverEnv.RATE_LIMIT_WINDOW_MS ?? 60_000),
  maxRequests: Number(serverEnv.RATE_LIMIT_MAX_REQUESTS ?? 120),
}

export const upstashConfig = {
  url: serverEnv.UPSTASH_REDIS_REST_URL,
  token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
}
