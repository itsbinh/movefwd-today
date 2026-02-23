'use client'

import { useState, FormEvent } from 'react'
import { Map, List } from 'lucide-react'
import { ScrapeForm } from '@/components/ScrapeForm'
import { ResourceList } from '@/components/ResourceList'
import { MapView } from '@/components/MapView'
import { ResourceDetailCard } from '@/components/ResourceDetailCard'
import { useResources } from '@/hooks/useResources'
import type { Resource, Category } from '@/types/resources'

type ViewMode = 'map' | 'list'

export default function HomeClient() {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [zipInput, setZipInput] = useState('92614')
  const [zipCode, setZipCode] = useState('92614')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

  // Use the new React‑Query hook for paginated resources
  const { data, isLoading, isError, refetch } = useResources({
    zip: zipCode,
    page,
    pageSize,
  })

  const resources = data?.data ?? []
  const totalCount = data?.count ?? 0
  const totalPages = Math.ceil(totalCount / pageSize)

  // Derive unique categories from the fetched resources (public categories only)
  const categories = Array.from(
    new Set(resources.flatMap((r: Resource) => r.categories))
  ) as Category[]

  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource)
  }

  const handleZipSubmit = (e: FormEvent) => {
    e.preventDefault()
    setZipCode(zipInput.trim())
    setPage(1)
    refetch()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-muted">Loading resources...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-muted">Failed to load resources.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white/20 backdrop-blur-md border-b border-white/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2 flex justify-center items-center">
          <h1 className="text-2xl font-bold text-text">
            <span className="text-primary">Movefwd</span>.today
          </h1>
        </div>
      </header>

      {/* Floating Controls (search, view toggle, pagination) */}
      <div className="fixed inset-x-0 top-3/4 transform -translate-y-1/2 flex flex-col items-center space-y-4 pointer-events-none z-10">
        <div className="bg-white/30 backdrop-blur-md rounded-xl border border-white/20 shadow-lg p-4 flex flex-col md:flex-row items-center gap-4 pointer-events-auto transition-all duration-300 ease-in-out">
          <ScrapeForm />
          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full p-1">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-white text-text shadow-sm'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <Map className="w-4 h-4" />
              Map
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-text shadow-sm'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
          {/* ZIP Search */}
          <form onSubmit={handleZipSubmit} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="ZIP code"
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value)}
              className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white/30 backdrop-blur-md"
            />
            <button
              type="submit"
              className="px-2 py-1 bg-primary/30 text-primary backdrop-blur-md rounded-full hover:bg-primary/50 transition-colors"
            >
              Search
            </button>
          </form>
          {/* Pagination */}
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-2 py-1 bg-gray-200/30 text-text rounded-full disabled:opacity-50"
              aria-label="Previous page"
            >
              ‹ Prev
            </button>
            <span className="text-sm text-text-muted whitespace-nowrap">
              {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-2 py-1 bg-gray-200/30 text-text rounded-full disabled:opacity-50"
              aria-label="Next page"
            >
              Next ›
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-73px)] relative z-0">
        <div key={viewMode} className="transition-opacity duration-500 ease-in-out">
          {viewMode === 'map' ? (
            <MapView
              resources={resources}
              selectedCategories={selectedCategories}
              onResourceClick={handleResourceClick}
            />
          ) : (
            <ResourceList
              resources={resources}
              categories={categories}
              onResourceClick={handleResourceClick}
            />
          )}
        </div>
        {/* Sliding detail card */}
        {selectedResource && (
          <ResourceDetailCard
            resource={selectedResource}
            onClose={() => setSelectedResource(null)}
          />
        )}
      </div>
    </main>
  )
}
