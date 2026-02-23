export type Category = 'food' | 'housing' | 'health' | 'legal' | 'employment' | 'education'

export type UserRole = 'seeker' | 'volunteer' | 'organization' | 'admin'

export type OpportunityType = 'volunteer' | 'donation' | 'both'

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
  created_at: string
  updated_at: string
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
  verified?: boolean
}
