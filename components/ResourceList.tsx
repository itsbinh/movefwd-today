'use client'

import { useState } from 'react'
import { Search, X, Filter } from 'lucide-react'
import { ResourceCard } from './ResourceCard'
import type { Resource, Category } from '@/types/resources'

interface ResourceListProps {
  resources: Resource[]
  categories: Category[]
  onResourceClick?: (resource: Resource) => void
}

export function ResourceList({ resources, categories, onResourceClick }: ResourceListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      searchQuery === '' ||
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

    const matchesCategories =
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) => resource.categories.includes(cat))

    return matchesSearch && matchesCategories
  })

  const toggleCategory = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategories([])
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            {selectedCategories.length > 0 && (
              <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                {selectedCategories.length}
              </span>
            )}
          </button>

          {(searchQuery || selectedCategories.length > 0) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-muted hover:text-text hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategories.includes(category)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <p className="text-sm text-text-muted">
          {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'}{' '}
          found
        </p>
      </div>

      {/* Resource List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-muted">No resources found matching your criteria.</p>
          </div>
        ) : (
          filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onClick={() => onResourceClick?.(resource)}
            />
          ))
        )}
      </div>
    </div>
  )
}
