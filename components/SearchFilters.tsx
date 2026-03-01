'use client'

import { useState, useCallback } from 'react'
import { ChevronDown, ChevronUp, MapPin, Check } from 'lucide-react'
import type { Category } from '@/types/resources'
import { CATEGORY_COLORS } from './ResourceCard'
import {
  ELIGIBILITY_OPTIONS,
  US_STATES,
  DEFAULT_SEARCH_FILTERS,
  type SearchFilters,
} from '@/types/search'

interface SearchFiltersPanelProps {
  isOpen: boolean
  onToggle: () => void
  onApply: (filters: SearchFilters) => void
  initialFilters?: Partial<SearchFilters>
  className?: string
}

/**
 * Expandable search filters panel with multi-select categories,
 * location input, and eligibility checkboxes
 */
export function SearchFiltersPanel({
  isOpen,
  onToggle,
  onApply,
  initialFilters,
  className = '',
}: SearchFiltersPanelProps) {
  const [search, setSearch] = useState(initialFilters?.search ?? '')
  const [city, setCity] = useState(initialFilters?.city ?? '')
  const [state, setState] = useState(initialFilters?.state ?? '')
  const [zip, setZip] = useState(initialFilters?.zip ?? '')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    initialFilters?.categories ?? []
  )
  const [selectedEligibility, setSelectedEligibility] = useState<string[]>(
    initialFilters?.eligibility ?? []
  )
  const [verifiedOnly, setVerifiedOnly] = useState(initialFilters?.verified ?? false)

  const handleApply = useCallback(() => {
    onApply({
      search,
      city,
      state,
      zip,
      categories: selectedCategories,
      eligibility: selectedEligibility,
      verified: verifiedOnly || undefined,
    })
  }, [search, city, state, zip, selectedCategories, selectedEligibility, verifiedOnly, onApply])

  const handleReset = useCallback(() => {
    setSearch('')
    setCity('')
    setState('')
    setZip('')
    setSelectedCategories([])
    setSelectedEligibility([])
    setVerifiedOnly(false)
    onApply(DEFAULT_SEARCH_FILTERS)
  }, [onApply])

  const toggleCategory = useCallback((category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }, [])

  const toggleEligibility = useCallback((value: string) => {
    setSelectedEligibility((prev) =>
      prev.includes(value) ? prev.filter((e) => e !== value) : [...prev, value]
    )
  }, [])

  const categories: Category[] = ['food', 'housing', 'health', 'legal', 'employment', 'education']

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}
    >
      {/* Header / Toggle */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
        aria-controls="filters-panel"
      >
        <span className="font-medium text-text">Advanced Filters</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-text-muted" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-5 h-5 text-text-muted" aria-hidden="true" />
        )}
      </button>

      {/* Filter Panel Content */}
      {isOpen && (
        <div
          id="filters-panel"
          className="px-4 pb-4 border-t border-gray-100 space-y-6"
          role="region"
          aria-label="Filter options"
        >
          {/* Search Text */}
          <div>
            <label htmlFor="filter-search" className="block text-sm font-medium text-text mb-2">
              Keywords
            </label>
            <input
              id="filter-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by service name or keyword..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              <MapPin className="w-4 h-4 inline mr-1" aria-hidden="true" />
              Location
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="filter-city" className="sr-only">
                  City
                </label>
                <input
                  id="filter-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="filter-state" className="sr-only">
                  State
                </label>
                <select
                  id="filter-state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white cursor-pointer"
                >
                  <option value="">Select State</option>
                  {US_STATES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="filter-zip" className="sr-only">
                  ZIP Code
                </label>
                <input
                  id="filter-zip"
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="ZIP Code"
                  maxLength={5}
                  pattern="[0-9]{5}"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Categories Multi-Select */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Service Categories
            </label>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Select categories">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                    selectedCategories.includes(category)
                      ? `${CATEGORY_COLORS[category]} text-white`
                      : 'bg-gray-100 text-text-muted hover:bg-gray-200'
                  }`}
                  aria-pressed={selectedCategories.includes(category)}
                >
                  {selectedCategories.includes(category) && (
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Eligibility Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Eligibility Requirements
            </label>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
              role="group"
              aria-label="Select eligibility options"
            >
              {ELIGIBILITY_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedEligibility.includes(option.value)}
                    onChange={() => toggleEligibility(option.value)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-text group-hover:text-primary transition-colors">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Verified Toggle */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                Show verified resources only
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              Reset All
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
