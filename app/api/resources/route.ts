import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { Resource, Category } from '@/types/resources'
import { getCachedOrFetch, generateCacheKey, invalidateCache } from '@/lib/api/cache'
import { NYC311Connector } from '@/lib/api/nyc311'
import { toResource } from '@/lib/api/normalizer'
import type { DataSource, ExternalApiFilters } from '@/lib/api/types'

// Default cache TTL: 1 hour
const CACHE_TTL = 3600

// Maximum external resources to fetch
const MAX_EXTERNAL_RESOURCES = 50

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  // Parse query parameters
  const limit = Number(searchParams.get('limit')) || 20
  const offset = Number(searchParams.get('offset')) || 0

  const categoriesParam = searchParams.get('categories')
  const filters = {
    categories: categoriesParam ? (categoriesParam.split(',') as Category[]) : undefined,
    search: searchParams.get('search') || undefined,
    city: searchParams.get('city') || undefined,
    zip: searchParams.get('zip')?.trim() || undefined,
    verified: searchParams.get('verified') === 'true' ? true : undefined,
    source: (searchParams.get('source') as DataSource) || undefined,
  }

  // Generate cache key
  const cacheKey = generateCacheKey('resources', {
    ...filters,
    categories: filters.categories?.join(','),
    limit,
    offset,
  })

  // Try to get cached data or fetch fresh data
  try {
    const result = await getCachedOrFetch<{ data: Resource[]; count: number; sources: string[] }>(
      cacheKey,
      async () => {
        // Fetch from local database
        const localData = await fetchFromLocalDatabase(filters, limit, offset)
        const localCount = localData.count

        // Fetch from external sources if requested or if no local results
        let externalData: Resource[] = []
        let sources: string[] = ['local']

        if (filters.source || localCount === 0) {
          // Determine which external sources to query
          const sourcesToQuery: DataSource[] = filters.source
            ? [filters.source]
            : ['nyc311'] // Default external source

          for (const source of sourcesToQuery) {
            try {
              const external = await fetchFromExternalSource(source, {
                search: filters.search,
                city: filters.city,
                zip: filters.zip,
                category: filters.categories?.[0],
                limit: MAX_EXTERNAL_RESOURCES,
                offset: 0,
              })

              if (external.length > 0) {
                externalData = [...externalData, ...external]
                sources.push(source)
              }
            } catch (error) {
              console.error(`Error fetching from ${source}:`, error)
            }
          }
        }

        // Merge results: local first, then external
        // If source is specified, filter to just that source
        let mergedData: Resource[] = []
        if (filters.source === 'local' || !filters.source) {
          mergedData = [...localData.data, ...externalData]
        } else {
          mergedData = externalData.filter((r) => r.source === filters.source)
        }

        return {
          data: mergedData,
          count: mergedData.length,
          sources,
        }
      },
      CACHE_TTL
    )

    return NextResponse.json({
      data: result.data.data,
      count: result.data.count,
      sources: result.data.sources,
      cached: result.cached,
    })
  } catch (error) {
    console.error('Error in resources API:', error)

    // Try to return local data as fallback
    try {
      const localData = await fetchFromLocalDatabase(filters, limit, offset)
      return NextResponse.json({
        data: localData.data,
        count: localData.count,
        sources: ['local'],
        error: 'External sources unavailable, returning local data',
      })
    } catch {
      return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
    }
  }
}

/**
 * Fetch resources from local Supabase database
 */
async function fetchFromLocalDatabase(
  filters: {
    categories?: Category[]
    search?: string
    city?: string
    zip?: string
    verified?: boolean
  },
  limit: number,
  offset: number
): Promise<{ data: Resource[]; count: number }> {
  // DEV‑ONLY mock: if running locally without a reachable Supabase instance, return static demo resources
  if (process.env.NODE_ENV === 'development') {
    const mock: Resource[] = [
      {
        id: 'demo-1',
        name: 'Demo Community Center',
        description: 'Demo resource for local testing.',
        categories: ['education'],
        eligibility: null,
        address: '123 Demo St',
        city: 'Orange',
        state: 'CA',
        zip: '92868',
        latitude: 33.7175,
        longitude: -117.8311,
        phone: '+17145551234',
        website: null,
        application_guide: null,
        verified: true,
        source: 'local',
        source_id: null,
        organization_name: 'Demo Organization',
        organization_id: null,
        email: null,
        languages: ['English', 'Spanish'],
        interpretation_services: null,
        accessibility: null,
        fees: null,
        schedule: 'Mon-Fri 9am-5pm',
        service_area: 'Orange County',
        last_verified_at: new Date().toISOString(),
        data_source_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
    return { data: mock, count: mock.length }
  }

  // Build Supabase query
  let query = supabase.from('resources').select('*', { count: 'exact' })

  if (filters.categories && filters.categories.length > 0) {
    query = query.contains('categories', filters.categories)
  }
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }
  if (filters.city) {
    query = query.eq('city', filters.city)
  }
  if (filters.zip) {
    query = query.eq('zip', filters.zip)
  }
  if (filters.verified !== undefined) {
    query = query.eq('verified', filters.verified)
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching from Supabase:', error)
    throw new Error('Database query failed')
  }

  return { data: data || [], count: count || 0 }
}

/**
 * Fetch resources from external 211 APIs
 */
async function fetchFromExternalSource(
  source: DataSource,
  filters: ExternalApiFilters
): Promise<Resource[]> {
  if (source === 'nyc311') {
    const connector = new NYC311Connector()
    const response = await connector.fetchServices(filters)

    if (!response.success || !response.data) {
      console.error('NYC 311 fetch error:', response.error)
      return []
    }

    // Transform to Resource type
    return response.data.map((external) => {
      const resource = toResource(external)
      // Add required fields
      return {
        ...resource,
        id: `ext-${source}-${external.source_id}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Resource
    })
  }

  // Future: Add more connectors here
  // case 'chicago311':
  //   ...

  console.warn(`Unknown external source: ${source}`)
  return []
}

/**
 * POST handler for cache invalidation (admin only)
 */
export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get('action')

  if (action === 'invalidate') {
    const pattern = searchParams.get('pattern') || 'resources'
    const removed = invalidateCache(pattern)

    return NextResponse.json({
      success: true,
      removed,
      message: `Invalidated ${removed} cache entries`,
    })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
