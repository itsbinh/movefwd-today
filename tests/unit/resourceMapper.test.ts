import { describe, expect, it } from 'vitest'
import { toResourceCardDTO } from '@/modules/resources/domain/mappers'
import type { Resource } from '@/types/resources'

const baseResource: Resource = {
  id: 'r1',
  name: 'Community Shelter',
  description: 'Overnight shelter with limited beds',
  categories: ['housing'],
  eligibility: null,
  address: '123 Main St',
  city: 'Irvine',
  state: 'CA',
  zip: '92614',
  latitude: 33.6846,
  longitude: -117.8265,
  phone: '+17145550000',
  website: 'https://example.org',
  application_guide: 'Call before arrival',
  verified: true,
  source: 'local',
  source_id: 'local-1',
  organization_name: 'OC Support',
  organization_id: null,
  email: null,
  languages: null,
  interpretation_services: null,
  accessibility: null,
  fees: null,
  schedule: null,
  service_area: 'Orange County',
  last_verified_at: new Date().toISOString(),
  data_source_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

describe('toResourceCardDTO', () => {
  it('maps to trust metadata fields', () => {
    const dto = toResourceCardDTO(baseResource)
    expect(dto.verification_badge).toBe('verified_partner')
    expect(dto.data_source_label).toBe('Local partner directory')
    expect(dto.confidence_score).not.toBeNull()
    expect(dto.availability_status).toBeTypeOf('string')
  })
})
