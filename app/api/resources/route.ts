import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { Resource } from '@/types/resources'

export async function GET(request: NextRequest) {
  // DEV‑ONLY mock: if running locally without a reachable Supabase instance, return a static demo resource
  if (process.env.NODE_ENV === 'development') {
    const mock: Resource = {
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
      phone: null,
      website: null,
      application_guide: null,
      verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return NextResponse.json({ data: [mock], count: 1 })
  }
  try {
    const searchParams = request.nextUrl.searchParams

    // Pagination parameters (default values)
    const limit = Number(searchParams.get('limit')) || 20
    const offset = Number(searchParams.get('offset')) || 0

    const filters = {
      categories: searchParams.get('categories')?.split(',') as any[] | undefined,
      search: searchParams.get('search') || undefined,
      city: searchParams.get('city') || undefined,
      zip: searchParams.get('zip')?.trim() || undefined,
      verified: searchParams.get('verified') === 'true' ? true : undefined,
    }

    // Build supabase query with filters and pagination
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

    // Apply pagination range
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching resources:', error)
      return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
    }

    return NextResponse.json({ data, count })
  } catch (error) {
    console.error('Error in resources API:', error)
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}
