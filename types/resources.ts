export type Category = 'food' | 'housing' | 'health' | 'legal' | 'employment' | 'education'

export type UserRole = 'seeker' | 'volunteer' | 'organization' | 'admin'

export type OpportunityType = 'volunteer' | 'donation' | 'both'

// HSDS-compatible phone types
export type PhoneType = 'voice' | 'fax' | 'tty' | 'sms'
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
  source: string | null
  source_id: string | null
  organization_name: string | null
  service_area: string | null
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

// HSDS-compatible resource with extended fields
export interface Resource {
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
  verified: boolean
  // HSDS fields
  source: string | null
  source_id: string | null
  organization_name: string | null
  organization_id: string | null
  email: string | null
  languages: string[] | null
  interpretation_services: string[] | null
  accessibility: string[] | null
  fees: string | null
  schedule: string | null
  service_area: string | null
  last_verified_at: string | null
  data_source_url: string | null
  availability_status?: AvailabilityStatus
  last_confirmed_at?: string | null
  confirmation_source?: string | null
  confidence_score?: number | null
  verification_badge?: ResourceVerification['verification_badge']
  data_source_label?: string
  freshness_state?: ResourceVerification['freshness_state']
  created_at: string
  updated_at: string
}

// HSDS-compatible phone interface
export interface ResourcePhone {
  id: string
  resource_id: string
  phone_number: string
  phone_type: PhoneType
  description: string | null
  is_primary: boolean
}

// HSDS-compatible eligibility interface
export interface ResourceEligibility {
  id: string
  resource_id: string
  eligibility_type: string
  eligibility_value: string
  min_age: number | null
  max_age: number | null
  description: string | null
}

export interface Profile {
  id: string
  email: string | null
  role: UserRole
  name: string | null
  avatar_url: string | null
  bio: string | null
  phone: string | null
  organization_name: string | null
  skills: string[]
  created_at: string
  updated_at: string
}

export interface Opportunity {
  id: string
  organization_id: string
  title: string
  description: string | null
  type: OpportunityType
  location: string | null
  date_start: string | null
  date_end: string | null
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  user_id: string
  resource_id: string
  created_at: string
}

export interface ResourceFilters {
  categories?: Category[]
  search?: string
  city?: string
  zip?: string
  verified?: boolean
}
