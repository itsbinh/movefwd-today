import { getCachedOrFetch, generateCacheKey } from '@/lib/api/cache'
import { toResourceCardDTO } from '@/modules/resources/domain/mappers'
import type { ResourceCardDTO, ResourceFiltersInput, ResourceListResponse } from '@/modules/resources/domain/types'
import { fetchFromExternalSource } from '@/modules/resources/infrastructure/externalSources'
import { fetchLocalResources } from '@/modules/resources/infrastructure/resourceRepository'
import { calculateDistance } from '@/lib/distance'

const CACHE_TTL_SECONDS = 3600
const MAX_EXTERNAL_RESOURCES = 50

function matchesOpenNow(resource: ResourceCardDTO): boolean {
  return resource.availability_status === 'open' || resource.availability_status === 'limited'
}

function matchesVerifiedRecently(resource: ResourceCardDTO): boolean {
  if (!resource.last_verified_at) return false
  const ageMs = Date.now() - new Date(resource.last_verified_at).getTime()
  return ageMs <= 1000 * 60 * 60 * 72
}

function matchesNearMe(resource: ResourceCardDTO, filters: ResourceFiltersInput): boolean {
  if (filters.nearLat === undefined || filters.nearLng === undefined) return true
  if (resource.latitude === null || resource.longitude === null) return false
  const radius = filters.nearRadiusMiles ?? 5
  const miles = calculateDistance(filters.nearLat, filters.nearLng, resource.latitude, resource.longitude)
  return miles <= radius
}

function applyClientSideFilters(
  resources: ResourceCardDTO[],
  filters: ResourceFiltersInput
): ResourceCardDTO[] {
  return resources.filter((resource) => {
    if (filters.openNow && !matchesOpenNow(resource)) return false
    if (filters.verifiedRecently && !matchesVerifiedRecently(resource)) return false
    if (!matchesNearMe(resource, filters)) return false
    return true
  })
}

function computeFreshness(data: ResourceCardDTO[]) {
  const confirmations = data
    .map((item) => item.last_confirmed_at)
    .filter((item): item is string => Boolean(item))

  const oldest = confirmations.length > 0 ? confirmations.sort()[0] : null

  return {
    oldest_confirmation_at: oldest,
    stale_count: data.filter((item) => item.freshness_state === 'stale').length,
    unknown_count: data.filter((item) => item.freshness_state === 'unknown').length,
  }
}

function computeSourceMix(data: ResourceCardDTO[]) {
  return data.reduce<Record<string, number>>((acc, item) => {
    const source = item.source ?? 'local'
    acc[source] = (acc[source] ?? 0) + 1
    return acc
  }, {})
}

export async function listResources(filters: ResourceFiltersInput): Promise<ResourceListResponse> {
  const cacheKey = generateCacheKey('resources', {
    categories: filters.categories?.join(','),
    search: filters.search,
    city: filters.city,
    state: filters.state,
    zip: filters.zip,
    verified: filters.verified,
    openNow: filters.openNow,
    verifiedRecently: filters.verifiedRecently,
    nearLat: filters.nearLat,
    nearLng: filters.nearLng,
    nearRadiusMiles: filters.nearRadiusMiles,
    source: filters.source,
    limit: filters.limit,
    offset: filters.offset,
  })

  const cached = await getCachedOrFetch(cacheKey, async () => {
    const local = await fetchLocalResources(filters)

    let resources = local.data.map(toResourceCardDTO)

    if (filters.source && filters.source !== 'local') {
      const external = await fetchFromExternalSource(filters.source, {
        search: filters.search,
        city: filters.city,
        zip: filters.zip,
        category: filters.categories?.[0],
        state: filters.state,
        limit: Math.min(MAX_EXTERNAL_RESOURCES, filters.limit),
        offset: 0,
      })
      resources = external.map(toResourceCardDTO)
    }

    if (!filters.source && resources.length === 0) {
      const external = await fetchFromExternalSource('nyc311', {
        search: filters.search,
        city: filters.city,
        zip: filters.zip,
        category: filters.categories?.[0],
        state: filters.state,
        limit: Math.min(MAX_EXTERNAL_RESOURCES, filters.limit),
        offset: 0,
      })
      resources = external.map(toResourceCardDTO)
    }

    const filtered = applyClientSideFilters(resources, filters)
    return {
      data: filtered,
      count: filtered.length,
      freshness: computeFreshness(filtered),
      source_mix: computeSourceMix(filtered),
    }
  }, CACHE_TTL_SECONDS)

  return {
    ...cached.data,
    cached: cached.cached,
  }
}
