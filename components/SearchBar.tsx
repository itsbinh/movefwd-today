'use client'

import { useState, useCallback, type FormEvent } from 'react'
import { Search, MapPin, X, SlidersHorizontal } from 'lucide-react'
import type { Category } from '@/types/resources'
import { CATEGORY_COLORS } from './ResourceCard'
import { US_STATES, DEFAULT_SEARCH_FILTERS, type SearchFilters } from '@/types/search'

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void
  initialFilters?: Partial<SearchFilters>
  showFiltersToggle?: boolean
  onToggleFilters?: () => void
  filtersOpen?: boolean
  className?: string
}

/**
 * Search bar component with integrated filters for searching human services
 */
export function SearchBar({
  onSearch,
  initialFilters,
  showFiltersToggle = true,
  onToggleFilters,
  filtersOpen = false,
  className = '',
}: SearchBarProps) {
  const [search, setSearch] = useState(initialFilters?.search ?? '')
  const [city, setCity] = useState(initialFilters?.city ?? '')
  const [state, setState] = useState(initialFilters?.state ?? '')
  const [zip, setZip] = useState(initialFilters?.zip ?? '')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    initialFilters?.categories ?? []
  )

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      onSearch({
        search,
        city,
        state,
        zip,
        categories: selectedCategories,
        eligibility: [],
        verified: undefined,
      })
    },
    [search, city, state, zip, selectedCategories, onSearch]
  )

  const clearSearch = useCallback(() => {
    setSearch('')
    setCity('')
    setState('')
    setZip('')
    setSelectedCategories([])
    onSearch(DEFAULT_SEARCH_FILTERS)
  }, [onSearch])

  const toggleCategory = useCallback((category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }, [])

  const hasLocation = city || state || zip
  const hasFilters = search || selectedCategories.length > 0 || hasLocation

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}
      role="search"
      aria-label="Search resources"
    >
      <form onSubmit={handleSubmit}>
        {/* Main Search Input */}
        <div className="flex items-center gap-2 p-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services by name or keyword..."
              className="w-full pl-10 pr-4 py-2.5 text-text placeholder:text-text-muted bg-transparent border-0 focus:outline-none focus:ring-0 text-base"
              aria-label="Search services"
            />
          </div>

          {/* Location Quick Filter */}
          <div className="hidden md:flex items-center gap-1 px-2 border-l border-gray-200">
            <MapPin className="w-4 h-4 text-text-muted flex-shrink-0" aria-hidden="true" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="w-24 lg:w-28 px-2 py-1.5 text-sm text-text placeholder:text-text-muted bg-transparent border-0 focus:outline-none focus:ring-0"
              aria-label="City"
            />
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-16 lg:w-20 px-1 py-1.5 text-sm text-text bg-transparent border-0 focus:outline-none focus:ring-0 cursor-pointer"
              aria-label="State"
            >
              <option value="">State</option>
              {US_STATES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.value}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="ZIP"
              className="w-16 lg:w-20 px-2 py-1.5 text-sm text-text placeholder:text-text-muted bg-transparent border-0 focus:outline-none focus:ring-0"
              aria-label="ZIP code"
              maxLength={5}
              pattern="[0-9]{5}"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex items-center gap-2 px-4 lg:px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
            <span className="hidden lg:inline">Search</span>
          </button>

          {/* Filters Toggle */}
          {showFiltersToggle && (
            <button
              type="button"
              onClick={onToggleFilters}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-colors ${
                filtersOpen
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'text-text-muted border-gray-200 hover:bg-gray-50'
              }`}
              aria-label={filtersOpen ? 'Hide filters' : 'Show filters'}
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline text-sm font-medium">Filters</span>
            </button>
          )}
        </div>

        {/* Mobile Location Row */}
        <div className="md:hidden flex items-center gap-2 px-3 pb-3 border-t border-gray-100">
          <MapPin className="w-4 h-4 text-text-muted flex-shrink-0" aria-hidden="true" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="flex-1 px-2 py-1.5 text-sm text-text placeholder:text-text-muted bg-gray-50 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="City"
          />
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-24 px-2 py-1.5 text-sm text-text bg-gray-50 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            aria-label="State"
          >
            <option value="">State</option>
            {US_STATES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.value}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="ZIP"
            className="w-20 px-2 py-1.5 text-sm text-text placeholder:text-text-muted bg-gray-50 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="ZIP code"
            maxLength={5}
            pattern="[0-9]{5}"
          />
        </div>

        {/* Category Quick Select */}
        <div className="px-3 pb-3 border-t border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-text-muted font-medium uppercase tracking-wide">
              Quick Categories:
            </span>
            {(['food', 'housing', 'health', 'legal', 'employment', 'education'] as Category[]).map(
              (category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all transform hover:scale-105 ${
                    selectedCategories.includes(category)
                      ? `${CATEGORY_COLORS[category]} text-white`
                      : 'bg-gray-100 text-text-muted hover:bg-gray-200'
                  }`}
                  aria-pressed={selectedCategories.includes(category)}
                >
                  {category}
                </button>
              )
            )}
            {hasFilters && (
              <button
                type="button"
                onClick={clearSearch}
                className="flex items-center gap-1 px-2 py-1 text-xs text-text-muted hover:text-text transition-colors"
                aria-label="Clear all filters"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
