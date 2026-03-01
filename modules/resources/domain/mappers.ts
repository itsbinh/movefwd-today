import type { Resource } from '@/types/resources'
import type { ResourceCardDTO, AvailabilityStatus, ResourceVerification } from './types'

const FRESH_HOURS = 24
const AGING_HOURS = 72

function inferAvailabilityStatus(resource: Resource): AvailabilityStatus {
  const text = `${resource.name} ${resource.description ?? ''} ${resource.schedule ?? ''}`.toLowerCase()

  if (text.includes('waitlist')) return 'waitlist'
  if (text.includes('full') || text.includes('no vacancy')) return 'full'
  if (text.includes('limited')) return 'limited'
  if (resource.verified) return 'open'
  return 'unknown'
}

function computeFreshnessState(lastConfirmedAt: string | null): ResourceVerification['freshness_state'] {
  if (!lastConfirmedAt) return 'unknown'
  const confirmedMs = new Date(lastConfirmedAt).getTime()
  if (Number.isNaN(confirmedMs)) return 'unknown'

  const ageHours = (Date.now() - confirmedMs) / (1000 * 60 * 60)
  if (ageHours <= FRESH_HOURS) return 'fresh'
  if (ageHours <= AGING_HOURS) return 'aging'
  return 'stale'
}

function dataSourceLabel(source: string | null): string {
  if (!source || source === 'local') return 'Local partner directory'
  if (source === 'nyc311') return 'NYC 311 open data'
  return source.toUpperCase()
}

function verificationBadge(resource: Resource): ResourceVerification['verification_badge'] {
  if (resource.verified && resource.source === 'local') return 'verified_partner'
  if (resource.verified && resource.source && resource.source !== 'local') return 'verified_api'
  if (resource.source === 'community') return 'community'
  return 'unverified'
}

function confidenceScore(resource: Resource): number | null {
  if (!resource.last_verified_at) return null
  const ageHours = (Date.now() - new Date(resource.last_verified_at).getTime()) / (1000 * 60 * 60)
  const base = resource.verified ? 0.95 : 0.5
  const decay = Math.min(0.6, ageHours / (24 * 14))
  return Number(Math.max(0.2, base - decay).toFixed(2))
}

export function toResourceCardDTO(resource: Resource): ResourceCardDTO {
  const lastConfirmed = resource.last_confirmed_at ?? resource.last_verified_at ?? null
  const source = resource.source ?? null

  return {
    id: resource.id,
    name: resource.name,
    description: resource.description,
    categories: resource.categories,
    eligibility: resource.eligibility,
    address: resource.address,
    city: resource.city,
    state: resource.state,
    zip: resource.zip,
    latitude: resource.latitude,
    longitude: resource.longitude,
    phone: resource.phone,
    website: resource.website,
    application_guide: resource.application_guide,
    organization_name: resource.organization_name ?? null,
    service_area: resource.service_area ?? null,
    source,
    source_id: resource.source_id ?? null,
    availability_status: resource.availability_status ?? inferAvailabilityStatus(resource),
    last_confirmed_at: lastConfirmed,
    confirmation_source: resource.confirmation_source ?? source ?? 'local',
    confidence_score: resource.confidence_score ?? confidenceScore(resource),
    verified: resource.verified,
    verification_badge: resource.verification_badge ?? verificationBadge(resource),
    data_source_label: resource.data_source_label ?? dataSourceLabel(source),
    last_verified_at: resource.last_verified_at,
    freshness_state: resource.freshness_state ?? computeFreshnessState(lastConfirmed),
    created_at: resource.created_at,
    updated_at: resource.updated_at,
  }
}
