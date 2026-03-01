import { supabase } from '@/lib/supabase'
import type { Category, Resource } from '@/types/resources'
import type { ResourceFiltersInput } from '@/modules/resources/domain/types'

type AvailabilityRow = {
  resource_id: string
  availability_status: Resource['availability_status']
  last_confirmed_at: string | null
  confirmation_source: string | null
  confidence_score: number | null
}

type VerificationRow = {
  resource_id: string
  verification_badge: Resource['verification_badge']
  data_source_label: string
  freshness_state: Resource['freshness_state']
}

async function attachTrustMetadata(resources: Resource[]): Promise<Resource[]> {
  if (resources.length === 0) return resources

  const ids = resources.map((resource) => resource.id)

  const [availabilityRes, verificationRes] = await Promise.all([
    (supabase.from('resource_availability' as never) as any)
      .select('resource_id, availability_status, last_confirmed_at, confirmation_source, confidence_score')
      .in('resource_id', ids),
    (supabase.from('resource_verifications' as never) as any)
      .select('resource_id, verification_badge, data_source_label, freshness_state')
      .in('resource_id', ids),
  ])

  if (availabilityRes.error || verificationRes.error) {
    // If trust tables are not migrated yet, continue with base resources.
    return resources
  }

  const availabilityByResourceId = new Map<string, AvailabilityRow>(
    ((availabilityRes.data ?? []) as AvailabilityRow[]).map((row) => [row.resource_id, row])
  )

  const verificationByResourceId = new Map<string, VerificationRow>(
    ((verificationRes.data ?? []) as VerificationRow[]).map((row) => [row.resource_id, row])
  )

  return resources.map((resource) => {
    const availability = availabilityByResourceId.get(resource.id)
    const verification = verificationByResourceId.get(resource.id)

    return {
      ...resource,
      availability_status: availability?.availability_status ?? resource.availability_status,
      last_confirmed_at: availability?.last_confirmed_at ?? resource.last_confirmed_at,
      confirmation_source: availability?.confirmation_source ?? resource.confirmation_source,
      confidence_score: availability?.confidence_score ?? resource.confidence_score,
      verification_badge: verification?.verification_badge ?? resource.verification_badge,
      data_source_label: verification?.data_source_label ?? resource.data_source_label,
      freshness_state: verification?.freshness_state ?? resource.freshness_state,
    }
  })
}

export async function fetchLocalResources(filters: ResourceFiltersInput): Promise<{
  data: Resource[]
  count: number
}> {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
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
        availability_status: 'open',
        last_confirmed_at: new Date().toISOString(),
        confirmation_source: 'local',
        confidence_score: 0.95,
        verification_badge: 'verified_partner',
        data_source_label: 'Local partner directory',
        freshness_state: 'fresh',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    return { data: mock, count: mock.length }
  }

  let query = (supabase.from('resources' as never) as any).select('*', { count: 'exact' })

  if (filters.categories && filters.categories.length > 0) {
    query = query.contains('categories', filters.categories as Category[])
  }
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }
  if (filters.city) {
    query = query.eq('city', filters.city)
  }
  if (filters.state) {
    query = query.eq('state', filters.state)
  }
  if (filters.zip) {
    query = query.eq('zip', filters.zip)
  }
  if (filters.verified !== undefined) {
    query = query.eq('verified', filters.verified)
  }

  query = query.range(filters.offset, filters.offset + filters.limit - 1)

  const { data, error, count } = await query
  if (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }

  const withTrust = await attachTrustMetadata((data ?? []) as Resource[])

  return {
    data: withTrust,
    count: count ?? 0,
  }
}

export async function fetchResourceById(id: string): Promise<Resource | null> {
  const { data, error } = await supabase.from('resources').select('*').eq('id', id).single()
  if (error) return null

  const [withTrust] = await attachTrustMetadata([data as Resource])
  return withTrust ?? null
}
