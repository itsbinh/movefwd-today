import type { Category } from './resources'

/**
 * Search filters for resource queries
 */
export interface SearchFilters {
  search: string
  city: string
  state: string
  zip: string
  categories: Category[]
  eligibility: string[]
  verified: boolean | undefined
}

/**
 * Default eligibility options
 */
export const ELIGIBILITY_OPTIONS = [
  { value: 'seniors', label: 'Seniors (65+)' },
  { value: 'families', label: 'Families' },
  { value: 'veterans', label: 'Veterans' },
  { value: 'youth', label: 'Youth' },
  { value: 'children', label: 'Children' },
  { value: 'pregnant', label: 'Pregnant Women' },
  { value: 'disabled', label: 'People with Disabilities' },
  { value: 'homeless', label: 'Homeless' },
  { value: 'low-income', label: 'Low Income' },
  { value: 'immigrants', label: 'Immigrants/Refugees' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'medicare', label: 'Medicare/Medicaid Recipients' },
] as const

/**
 * US States for location filter
 */
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'Washington D.C.' },
] as const

/**
 * Default search filters
 */
export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  search: '',
  city: '',
  state: '',
  zip: '',
  categories: [],
  eligibility: [],
  verified: undefined,
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filters: SearchFilters): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.city.trim() !== '' ||
    filters.state.trim() !== '' ||
    filters.zip.trim() !== '' ||
    filters.categories.length > 0 ||
    filters.eligibility.length > 0 ||
    filters.verified !== undefined
  )
}
