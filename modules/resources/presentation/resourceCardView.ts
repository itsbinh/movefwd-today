import type { ResourceCardDTO } from '@/modules/resources/domain/types'

export interface ResourceCardViewModel {
  id: string
  title: string
  subtitle: string
  availability: string
  trust: string
}

export function toResourceCardViewModel(resource: ResourceCardDTO): ResourceCardViewModel {
  const location = [resource.city, resource.state].filter(Boolean).join(', ')
  return {
    id: resource.id,
    title: resource.name,
    subtitle: location || 'Location unavailable',
    availability: resource.availability_status,
    trust: `${resource.verification_badge} · ${resource.freshness_state}`,
  }
}
