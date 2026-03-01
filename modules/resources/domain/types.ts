import type { Category } from '@/types/resources'

export type AvailabilityStatus = 'unknown' | 'open' | 'limited' | 'full' | 'waitlist'

export interface ResourceCore {
  id: string
  name: string
  description: string | null
  categories: Category[]
  eligibility: string | null
  address: string | null
  city: string | null
  state: string
  zip: string | null
  latitude: number | null
  longitude: number | null
  phone: string | null
  website: string | null
  application_guide: string | null
  organization_name: string | null
  service_area: string | null
  source: string | null
  source_id: string | null
}

export interface ResourceAvailability {
  availability_status: AvailabilityStatus
  last_confirmed_at: string | null
  confirmation_source: string | null
  confidence_score: number | null
}

export interface ResourceVerification {
  verified: boolean
  verification_badge: 'verified_partner' | 'verified_api' | 'community' | 'unverified'
  data_source_label: string
  last_verified_at: string | null
  freshness_state: 'fresh' | 'aging' | 'stale' | 'unknown'
}

export interface ResourceCardDTO
  extends ResourceCore,
    ResourceAvailability,
    ResourceVerification {
  created_at: string
  updated_at: string
}

export interface ListFreshness {
  oldest_confirmation_at: string | null
  stale_count: number
  unknown_count: number
}

export interface ResourceListResponse {
  data: ResourceCardDTO[]
  count: number
  freshness: ListFreshness
  source_mix: Record<string, number>
  cached: boolean
}

export interface ResourceFiltersInput {
  categories?: Category[]
  search?: string
  city?: string
  state?: string
  zip?: string
  eligibility?: string[]
  verified?: boolean
  openNow?: boolean
  verifiedRecently?: boolean
  nearLat?: number
  nearLng?: number
  nearRadiusMiles?: number
  source?: string
  limit: number
  offset: number
}

export interface ResourceQueryResult {
  data: ResourceCardDTO[]
  count: number
  sources: string[]
}
