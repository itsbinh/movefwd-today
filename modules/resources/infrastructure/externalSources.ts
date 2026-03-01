import { NYC311Connector } from '@/lib/api/nyc311'
import { toResource } from '@/lib/api/normalizer'
import type { ExternalApiFilters } from '@/lib/api/types'
import type { Resource } from '@/types/resources'

export async function fetchFromExternalSource(
  source: string,
  filters: ExternalApiFilters
): Promise<Resource[]> {
  if (source !== 'nyc311') return []

  const connector = new NYC311Connector()
  const response = await connector.fetchServices(filters)

  if (!response.success || !response.data) {
    return []
  }

  return response.data.map((external) => {
    const resource = toResource(external)
    return {
      ...resource,
      id: `ext-${source}-${external.source_id}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Resource
  })
}
