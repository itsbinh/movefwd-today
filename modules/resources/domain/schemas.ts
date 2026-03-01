import { z } from 'zod'
import type { Category } from '@/types/resources'

const categoryEnum = z.enum([
  'food',
  'housing',
  'health',
  'legal',
  'employment',
  'education',
])

const parseCsv = (value: string | null): string[] | undefined => {
  if (!value) return undefined
  const list = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  return list.length > 0 ? list : undefined
}

const boolFromQuery = (value: string | null): boolean | undefined => {
  if (value === 'true') return true
  if (value === 'false') return false
  return undefined
}

const numberFromQuery = (value: string | null): number | undefined => {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export const resourceQuerySchema = z.object({
  categories: z.array(categoryEnum).optional(),
  search: z.string().trim().min(1).max(120).optional(),
  city: z.string().trim().min(1).max(100).optional(),
  state: z.string().trim().length(2).optional(),
  zip: z.string().trim().regex(/^\d{5}$/).optional(),
  eligibility: z.array(z.string().trim().min(1).max(64)).max(20).optional(),
  verified: z.boolean().optional(),
  openNow: z.boolean().optional(),
  verifiedRecently: z.boolean().optional(),
  nearLat: z.number().min(-90).max(90).optional(),
  nearLng: z.number().min(-180).max(180).optional(),
  nearRadiusMiles: z.number().min(0.1).max(50).optional(),
  source: z.string().trim().min(1).max(40).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

export function parseResourceQuery(searchParams: URLSearchParams) {
  const raw = {
    categories: parseCsv(searchParams.get('categories')) as Category[] | undefined,
    search: searchParams.get('search') ?? undefined,
    city: searchParams.get('city') ?? undefined,
    state: searchParams.get('state') ?? undefined,
    zip: searchParams.get('zip') ?? undefined,
    eligibility: parseCsv(searchParams.get('eligibility')),
    verified: boolFromQuery(searchParams.get('verified')),
    openNow: boolFromQuery(searchParams.get('open_now')),
    verifiedRecently: boolFromQuery(searchParams.get('verified_recently')),
    nearLat: numberFromQuery(searchParams.get('near_lat')),
    nearLng: numberFromQuery(searchParams.get('near_lng')),
    nearRadiusMiles: numberFromQuery(searchParams.get('near_radius_miles')),
    source: searchParams.get('source') ?? undefined,
    limit: numberFromQuery(searchParams.get('limit')),
    offset: numberFromQuery(searchParams.get('offset')),
  }

  return resourceQuerySchema.parse(raw)
}

export const invalidateCacheSchema = z.object({
  action: z.literal('invalidate'),
  key: z.enum(['resources', 'source_status', 'sync_status', 'external_services']).default(
    'resources'
  ),
})

export const scrapeRequestSchema = z.object({
  url: z.string().url().max(500),
})
