'use client'

import { useState, useCallback, useEffect } from 'react'
import { SearchBar } from './SearchBar'
import { SearchFiltersPanel } from './SearchFilters'
import { useResources } from '@/hooks/useResources'
import type { Resource, Category } from '@/types/resources'
import type { SearchFilters } from '@/types/search'

interface ResourceSearchProps {
  onResults?: (resources: Resource[], count: number) => void
  onResourceClick?: (resource: Resource) => void
  initialFilters?: Partial<SearchFilters>
  pageSize?: number
  className?: string
}

/**
 * Integrated search component combining SearchBar and SearchFilters
 * with resource fetching and display
 */
export function ResourceSearch({
  onResults,
  onResourceClick,
  initialFilters,
  pageSize = 20,
  className = '',
}: ResourceSearchProps) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    search: initialFilters?.search ?? '',
    city: initialFilters?.city ?? '',
    state: initialFilters?.state ?? '',
    zip: initialFilters?.zip ?? '',
    categories: initialFilters?.categories ?? [],
    eligibility: initialFilters?.eligibility ?? [],
    verified: initialFilters?.verified,
  })

  // Build query params for useResources
  const queryParams = {
    search: currentFilters.search || undefined,
    city: currentFilters.city || undefined,
    state: currentFilters.state || undefined,
    zip: currentFilters.zip || undefined,
    categories: currentFilters.categories.length > 0 ? currentFilters.categories : undefined,
    verified: currentFilters.verified,
    pageSize,
  }

  const { data, isLoading, error, refetch } = useResources(queryParams)

  // Report results to parent
  useEffect(() => {
    if (data) {
      onResults?.(data.data, data.count)
    }
  }, [data, onResults])

  const handleSearch = useCallback((filters: SearchFilters) => {
    setCurrentFilters(filters)
    setFiltersOpen(false)
  }, [])

  const handleToggleFilters = useCallback(() => {
    setFiltersOpen((prev) => !prev)
  }, [])

  return (
    <div className={`space-y-4 ${className}`}>
      <SearchBar
        onSearch={handleSearch}
        initialFilters={currentFilters}
        showFiltersToggle
        onToggleFilters={handleToggleFilters}
        filtersOpen={filtersOpen}
      />

      <SearchFiltersPanel
        isOpen={filtersOpen}
        onToggle={handleToggleFilters}
        onApply={handleSearch}
        initialFilters={currentFilters}
      />

      {/* Loading/Error States */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-500">
          <p>Error loading resources. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-sm underline hover:text-red-600"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Hook for using search functionality
 */
export function useResourceSearch(initialFilters?: Partial<SearchFilters>) {
  const [filters, setFilters] = useState<SearchFilters>({
    search: initialFilters?.search ?? '',
    city: initialFilters?.city ?? '',
    state: initialFilters?.state ?? '',
    zip: initialFilters?.zip ?? '',
    categories: initialFilters?.categories ?? [],
    eligibility: initialFilters?.eligibility ?? [],
    verified: initialFilters?.verified,
  })

  const queryParams = {
    search: filters.search || undefined,
    city: filters.city || undefined,
    state: filters.state || undefined,
    zip: filters.zip || undefined,
    categories: filters.categories.length > 0 ? filters.categories : undefined,
    eligibility: filters.eligibility.length > 0 ? filters.eligibility : undefined,
    verified: filters.verified,
  }

  const { data, isLoading, error, refetch } = useResources(queryParams)

  const search = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters)
  }, [])

  const reset = useCallback(() => {
    setFilters({
      search: '',
      city: '',
      state: '',
      zip: '',
      categories: [],
      eligibility: [],
      verified: undefined,
    })
  }, [])

  return {
    filters,
    search,
    reset,
    resources: data?.data ?? [],
    count: data?.count ?? 0,
    isLoading,
    error,
    refetch,
  }
}
