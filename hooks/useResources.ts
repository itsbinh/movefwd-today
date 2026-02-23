import { useQuery } from '@tanstack/react-query'
import type { Resource, Category } from '@/types/resources'

interface UseResourcesParams {
  categories?: Category[]
  search?: string
  city?: string
  state?: string
  zip?: string
  eligibility?: string[]
  verified?: boolean
  page?: number
  pageSize?: number
}

export function useResources(params: UseResourcesParams) {
  const { categories, search, city, state, zip, eligibility, verified, page = 1, pageSize = 20 } = params

  const offset = (page - 1) * pageSize

  const queryKey = [
    'resources',
    { categories, search, city, state, zip, eligibility, verified, offset, limit: pageSize },
  ]

  const fetchResources = async () => {
    const searchParams = new URLSearchParams()
    if (categories?.length) searchParams.append('categories', categories.join(','))
    if (search) searchParams.append('search', search)
    if (city) searchParams.append('city', city)
    if (state) searchParams.append('state', state)
    if (zip) searchParams.append('zip', zip)
    if (eligibility?.length) searchParams.append('eligibility', eligibility.join(','))
    if (verified !== undefined) searchParams.append('verified', String(verified))
    searchParams.append('limit', String(pageSize))
    searchParams.append('offset', String(offset))

    const res = await fetch(`/api/resources?${searchParams.toString()}`)
    if (!res.ok) throw new Error('Failed to fetch resources')
    const json = await res.json()
    return json // { data: Resource[], count: number }
  }

  return useQuery({
    queryKey,
    queryFn: fetchResources,

    staleTime: 1000 * 60, // 1 minute
  })
}
