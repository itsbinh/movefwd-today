/**
 * API Types for 211 and External Service Connectors
 * Defines interfaces for API responses and connector configurations
 */

// Data source identifiers
export type DataSource = 'local' | 'nyc311' | 'chicago311' | '211la' | 'bayarea211'

// API configuration interfaces
export interface ApiConfig {
  baseUrl: string
  apiKey?: string
  rateLimit: {
    requestsPerDay: number
    requestsPerMinute: number
  }
}

// Rate limit tracking
export interface RateLimitState {
  requestsToday: number
  requestsThisMinute: number
  lastRequestTimestamp: number
  resetAt: number
}

// Base connector response
export interface ConnectorResponse<T> {
  success: boolean
  data?: T
  error?: string
  source: DataSource
  cached?: boolean
  timestamp: string
}

// Pagination metadata
export interface PaginationParams {
  limit: number
  offset: number
}

export interface PaginationMeta {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

// Raw NYC 311 Service (from API)
export interface NYC311Service {
  unique_id: string
  service_name: string
  service_description: string
  service_type: string
  service_status: string
  service_subtype: string
  agency_responsible: string
  address: string
  city: string
  state: string
  zipcode: string
  latitude: number
  longitude: number
  phone: string
  phone_extension: string
  website: string
  email: string
  fees: string
  accessibility: string
  languages: string
  hours: string
  eligibility: string
  application_process: string
  service_area: string
}

// Raw Chicago 311 Service (from API)
export interface Chicago311Service {
  service_request_id: number
  service_name: string
  service_description: string
  service_type: string
  requested_datetime: string
  updated_datetime: string
  status: string
  address: string
  zip_code: number
  latitude: number
  longitude: number
  phone: string
  website: string
}

// Generic external service (normalized format from various 211 APIs)
export interface ExternalService {
  source_id: string
  source: DataSource
  name: string
  description: string | null
  organization_name: string | null
  organization_id: string | null
  address: string | null
  city: string | null
  state: string
  zip: string | null
  latitude: number | null
  longitude: number | null
  phone: string | null
  phone_type: 'voice' | 'fax' | 'tty' | 'sms' | null
  website: string | null
  email: string | null
  eligibility: string | null
  fees: string | null
  schedule: string | null
  service_area: string | null
  languages: string[]
  interpretation_services: string[]
  accessibility: string[]
  last_verified_at: string | null
  data_source_url: string | null
}

// API cache configuration
export interface CacheConfig {
  key: string
  ttlSeconds: number
  maxStaleSeconds: number
}

// Cache entry
export interface CacheEntry<T> {
  data: T
  expiry: number
  staleAt: number
}

// Sync result
export interface SyncResult {
  success: boolean
  imported: number
  updated: number
  errors: string[]
  timestamp: string
  source: DataSource
}

// Filter parameters for external API queries
export interface ExternalApiFilters {
  search?: string
  city?: string
  zip?: string
  category?: string
  state?: string
  limit?: number
  offset?: number
}
