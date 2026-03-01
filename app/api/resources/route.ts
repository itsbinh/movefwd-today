import { NextRequest, NextResponse } from 'next/server'
import { listResources } from '@/modules/resources/application/listResources'
import { invalidateCache } from '@/lib/api/cache'
import { invalidateCacheSchema, parseResourceQuery } from '@/modules/resources/domain/schemas'
import { checkRateLimit } from '@/lib/server/rateLimit'
import { isAdminRequest } from '@/lib/server/auth'
import { logger } from '@/lib/server/logger'
import { emitAuditEvent } from '@/lib/server/audit'

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const limit = checkRateLimit(`resources:get:${ip}`)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please retry shortly.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(limit.retryAfterSeconds),
        },
      }
    )
  }

  try {
    const filters = parseResourceQuery(request.nextUrl.searchParams)
    const result = await listResources(filters)
    emitAuditEvent('search_performed', {
      count: result.count,
      city: filters.city,
      zip: filters.zip,
      categories: filters.categories ?? [],
      openNow: filters.openNow ?? false,
      verifiedRecently: filters.verifiedRecently ?? false,
    })
    if (result.count === 0) {
      emitAuditEvent('zero_results', {
        city: filters.city,
        zip: filters.zip,
        categories: filters.categories ?? [],
      })
    }
    if (result.freshness.stale_count > 0) {
      emitAuditEvent('stale_data_detected', {
        staleCount: result.freshness.stale_count,
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error listing resources', {
      error: error instanceof Error ? error.message : 'unknown',
      path: '/api/resources',
    })

    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = invalidateCacheSchema.safeParse({
    action: request.nextUrl.searchParams.get('action'),
    key: request.nextUrl.searchParams.get('key') ?? 'resources',
  })

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const removed = await invalidateCache(parsed.data.key)

  return NextResponse.json({
    success: true,
    removed,
    message: `Invalidated ${removed} cache entries`,
  })
}
