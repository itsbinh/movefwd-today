/**
 * Data Normalization Module
 * Transforms external API responses to our Resource type
 * Handles HSDS-compliant data mapping
 */

import type { Resource, Category } from '@/types/resources'
import type { DataSource, NYC311Service, ExternalService } from './types'

/**
 * Normalize NYC 311 service to our ExternalService format
 */
export function normalizeExternalService(
  raw: NYC311Service,
  source: DataSource
): ExternalService {
  return {
    source_id: raw.unique_id,
    source,
    name: raw.service_name,
    description: raw.service_description || null,
    organization_name: raw.agency_responsible || null,
    organization_id: null,
    address: raw.address || null,
    city: raw.city || null,
    state: raw.state || 'NY',
    zip: raw.zipcode || null,
    latitude: raw.latitude || null,
    longitude: raw.longitude || null,
    phone: normalizePhoneNumber(raw.phone),
    phone_type: 'voice',
    website: raw.website || null,
    email: raw.email || null,
    eligibility: raw.eligibility || null,
    fees: raw.fees || null,
    schedule: raw.hours || null,
    service_area: raw.service_area || null,
    languages: parseListField(raw.languages),
    interpretation_services: [],
    accessibility: parseAccessibility(raw.accessibility),
    last_verified_at: new Date().toISOString(),
    data_source_url: raw.website || null,
  }
}

/**
 * Transform ExternalService to our internal Resource type
 */
export function toResource(external: ExternalService): Partial<Resource> {
  return {
    name: external.name,
    description: external.description,
    categories: inferCategories(external.name, external.description),
    eligibility: external.eligibility,
    address: external.address,
    city: external.city,
    state: external.state,
    zip: external.zip,
    latitude: external.latitude,
    longitude: external.longitude,
    phone: external.phone,
    website: external.website,
    application_guide: external.service_area,
    verified: true, // External APIs are considered verified
    source: external.source,
    source_id: external.source_id,
    organization_name: external.organization_name,
    organization_id: external.organization_id,
    email: external.email,
    languages: external.languages,
    interpretation_services: external.interpretation_services,
    accessibility: external.accessibility,
    fees: external.fees,
    schedule: external.schedule,
    service_area: external.service_area,
    last_verified_at: external.last_verified_at,
    data_source_url: external.data_source_url,
  }
}

/**
 * Infer categories from service name and description
 */
function inferCategories(name: string, description: string | null): Category[] {
  const text = `${name} ${description || ''}`.toLowerCase()
  const categories: Category[] = []

  // Food-related keywords
  if (
    text.includes('food') ||
    text.includes('meal') ||
    text.includes('hunger') ||
    text.includes('food pantry') ||
    text.includes('soup kitchen') ||
    text.includes('groceries')
  ) {
    categories.push('food')
  }

  // Housing-related keywords
  if (
    text.includes('housing') ||
    text.includes('shelter') ||
    text.includes('homeless') ||
    text.includes('rent') ||
    text.includes('housing assistance') ||
    text.includes('transitional')
  ) {
    categories.push('housing')
  }

  // Health-related keywords
  if (
    text.includes('health') ||
    text.includes('medical') ||
    text.includes('clinic') ||
    text.includes('hospital') ||
    text.includes('mental health') ||
    text.includes('counseling') ||
    text.includes('substance') ||
    text.includes('addiction')
  ) {
    categories.push('health')
  }

  // Legal-related keywords
  if (
    text.includes('legal') ||
    text.includes('law') ||
    text.includes('attorney') ||
    text.includes('immigration') ||
    text.includes('visa') ||
    text.includes('citizenship') ||
    text.includes('legal aid')
  ) {
    categories.push('legal')
  }

  // Employment-related keywords
  if (
    text.includes('job') ||
    text.includes('employment') ||
    text.includes('work') ||
    text.includes('career') ||
    text.includes('training') ||
    text.includes('resume') ||
    text.includes('unemployment')
  ) {
    categories.push('employment')
  }

  // Education-related keywords
  if (
    text.includes('education') ||
    text.includes('school') ||
    text.includes('tutoring') ||
    text.includes('college') ||
    text.includes('university') ||
    text.includes('classes') ||
    text.includes('literacy')
  ) {
    categories.push('education')
  }

  // Default to 'food' if no categories matched and we have some text
  if (categories.length === 0 && text.length > 0) {
    categories.push('food') // Default category
  }

  return categories
}

/**
 * Normalize phone number to E.164 format
 */
function normalizePhoneNumber(phone: string | null | undefined): string | null {
  if (!phone) return null

  // Strip all non-numeric characters
  const digits = phone.replace(/\D/g, '')

  // Handle 10-digit US numbers
  if (digits.length === 10) {
    return `+1${digits}`
  }

  // Handle 11-digit numbers with leading 1 (US country code)
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`
  }

  // Return original if we can't parse it
  return phone
}

/**
 * Parse list field (comma or pipe separated)
 */
function parseListField(value: string | null | undefined): string[] {
  if (!value) return []

  return value
    .split(/[,|]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

/**
 * Parse accessibility field
 */
function parseAccessibility(value: string | null | undefined): string[] {
  if (!value) return []

  const text = value.toLowerCase()
  const accessibility: string[] = []

  if (text.includes('wheelchair') || text.includes('accessible')) {
    accessibility.push('wheelchair_accessible')
  }
  if (text.includes('ramp')) {
    accessibility.push('ramp_accessible')
  }
  if (text.includes('elevator')) {
    accessibility.push('elevator')
  }
  if (text.includes('sign') || text.includes('asl')) {
    accessibility.push('sign_language')
  }
  if (text.includes('braille')) {
    accessibility.push('braille')
  }
  if (text.includes('visual') || text.includes('blind')) {
    accessibility.push('visual_assistance')
  }
  if (text.includes('hearing') || text.includes('deaf')) {
    accessibility.push('hearing_assistance')
  }

  return accessibility
}

/**
 * Generate a unique source ID from external service data
 */
export function generateSourceId(source: DataSource, externalId: string): string {
  return `${source}:${externalId}`
}

/**
 * Validate and clean resource data
 */
export function validateResource(resource: Partial<Resource>): Resource | null {
  // Required fields
  if (!resource.name || !resource.state) {
    return null
  }

  // Return with defaults for optional fields
  return {
    id: resource.id || '',
    name: resource.name,
    description: resource.description || null,
    categories: resource.categories || ['food'],
    eligibility: resource.eligibility || null,
    address: resource.address || null,
    city: resource.city || null,
    state: resource.state,
    zip: resource.zip || null,
    latitude: resource.latitude || null,
    longitude: resource.longitude || null,
    phone: resource.phone || null,
    website: resource.website || null,
    application_guide: resource.application_guide || null,
    verified: resource.verified || false,
    source: resource.source || null,
    source_id: resource.source_id || null,
    organization_name: resource.organization_name || null,
    organization_id: resource.organization_id || null,
    email: resource.email || null,
    languages: resource.languages || null,
    interpretation_services: resource.interpretation_services || null,
    accessibility: resource.accessibility || null,
    fees: resource.fees || null,
    schedule: resource.schedule || null,
    service_area: resource.service_area || null,
    last_verified_at: resource.last_verified_at || null,
    data_source_url: resource.data_source_url || null,
    created_at: resource.created_at || new Date().toISOString(),
    updated_at: resource.updated_at || new Date().toISOString(),
  }
}
