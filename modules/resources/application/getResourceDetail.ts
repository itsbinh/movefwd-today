import { toResourceCardDTO } from '@/modules/resources/domain/mappers'
import { fetchResourceById, fetchLocalResources } from '@/modules/resources/infrastructure/resourceRepository'
import { calculateDistance } from '@/lib/distance'
import type { ResourceCardDTO } from '@/modules/resources/domain/types'

export async function getResourceDetailWithAlternatives(resourceId: string): Promise<{
  resource: ResourceCardDTO | null
  alternatives: ResourceCardDTO[]
}> {
  const resource = await fetchResourceById(resourceId)
  if (!resource) {
    return { resource: null, alternatives: [] }
  }

  const dto = toResourceCardDTO(resource)

  const local = await fetchLocalResources({
    limit: 100,
    offset: 0,
    city: resource.city ?? undefined,
    state: resource.state,
  })

  const alternatives = local.data
    .filter((item) => item.id !== resource.id && item.latitude && item.longitude)
    .map(toResourceCardDTO)
    .map((item) => ({
      item,
      distance:
        dto.latitude && dto.longitude && item.latitude && item.longitude
          ? calculateDistance(dto.latitude, dto.longitude, item.latitude, item.longitude)
          : Number.MAX_SAFE_INTEGER,
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map((entry) => entry.item)

  return {
    resource: dto,
    alternatives,
  }
}
