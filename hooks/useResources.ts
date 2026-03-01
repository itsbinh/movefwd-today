import { useQuery } from '@tanstack/react-query'
import type { Category } from '@/types/resources'
import type { ResourceListResponse } from '@/modules/resources/domain/types'

interface UseResourcesParams {
  categories?: Category[]
  search?: string
  city?: string
  state?: string
  zip?: string
  eligibility?: string[]
  verified?: boolean
  openNow?: boolean
  verifiedRecently?: boolean
  nearLat?: number
  nearLng?: number
  nearRadiusMiles?: number
  page?: number
  pageSize?: number
}

export function useResources(params: UseResourcesParams) {
  const {
    categories,
    search,
    city,
    state,
    zip,
    eligibility,
    verified,
    openNow,
    verifiedRecently,
    nearLat,
    nearLng,
    nearRadiusMiles,
    page = 1,
    pageSize = 20,
  } = params

  const offset = (page - 1) * pageSize

  const queryKey = [
    'resources',
    {
      categories,
      search,
      city,
      state,
      zip,
      eligibility,
      verified,
      openNow,
      verifiedRecently,
      nearLat,
      nearLng,
      nearRadiusMiles,
      offset,
      limit: pageSize,
    },
  ]

  const fetchResources = async (): Promise<ResourceListResponse> => {
    const searchParams = new URLSearchParams()
    if (categories?.length) searchParams.append('categories', categories.join(','))
    if (search) searchParams.append('search', search)
    if (city) searchParams.append('city', city)
    if (state) searchParams.append('state', state)
    if (zip) searchParams.append('zip', zip)
    if (eligibility?.length) searchParams.append('eligibility', eligibility.join(','))
    if (verified !== undefined) searchParams.append('verified', String(verified))
    if (openNow !== undefined) searchParams.append('open_now', String(openNow))
    if (verifiedRecently !== undefined) {
      searchParams.append('verified_recently', String(verifiedRecently))
    }
    if (nearLat !== undefined) searchParams.append('near_lat', String(nearLat))
    if (nearLng !== undefined) searchParams.append('near_lng', String(nearLng))
    if (nearRadiusMiles !== undefined) {
      searchParams.append('near_radius_miles', String(nearRadiusMiles))
    }
    searchParams.append('limit', String(pageSize))
    searchParams.append('offset', String(offset))

    const res = await fetch(`/api/resources?${searchParams.toString()}`)
    if (!res.ok) throw new Error('Failed to fetch resources')
    return res.json() as Promise<ResourceListResponse>
  }

  return useQuery({
    queryKey,
    queryFn: fetchResources,
    staleTime: 1000 * 60,
  })
}
