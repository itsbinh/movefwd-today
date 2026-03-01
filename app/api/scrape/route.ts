import { NextRequest, NextResponse } from 'next/server'
import { scrapeGovResources } from '@/lib/scraper'
import { supabase } from '@/lib/supabase'
import type { Resource } from '@/types/resources'
import { scrapeRequestSchema } from '@/modules/resources/domain/schemas'
import { checkRateLimit } from '@/lib/server/rateLimit'
import { isAdminRequest } from '@/lib/server/auth'
import { securityConfig } from '@/lib/server/env'
import { isSafePublicUrl } from '@/lib/server/urlSafety'

const ALLOWED_INGEST_HOSTS = ['data.cityofnewyork.us', 'www.nyc.gov', 'www.211oc.org']

export async function POST(request: NextRequest) {
  if (!securityConfig.adminIngestionEnabled) {
    return NextResponse.json({ error: 'Ingestion is disabled' }, { status: 403 })
  }

  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const limit = checkRateLimit(`scrape:post:${ip}`)
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
    const body = await request.json()
    const parsed = scrapeRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    if (!isSafePublicUrl(parsed.data.url, ALLOWED_INGEST_HOSTS)) {
      return NextResponse.json(
        { error: 'URL host is not permitted for ingestion' },
        { status: 400 }
      )
    }

    const scraped = await scrapeGovResources(parsed.data.url)
    if (scraped.length === 0) {
      return NextResponse.json({ inserted: 0, message: 'No resources found' })
    }

    const { error } = await (supabase.from('resources' as never) as any).insert(scraped as Resource[])
    if (error) {
      return NextResponse.json({ error: 'Failed to store resources' }, { status: 500 })
    }

    return NextResponse.json({ inserted: scraped.length })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
