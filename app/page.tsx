'use client'

import { useEffect, useState } from 'react'
import { Map, List } from 'lucide-react'
import { ResourceList } from '@/components/ResourceList'
import { MapView } from '@/components/MapView'
import type { Resource, Category } from '@/types/resources'

type ViewMode = 'map' | 'list'

export default function HomePage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch resources
        const resourcesRes = await fetch('/api/resources')
        const resourcesData = await resourcesRes.json()
        setResources(resourcesData)

        // Extract unique categories
        const allCategories = resourcesData.flatMap((r: Resource) => r.categories)
        const uniqueCategories = Array.from(new Set(allCategories)) as Category[]
        setCategories(uniqueCategories)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleResourceClick = (resource: Resource) => {
    // Could open a modal or navigate to detail page
    console.log('Selected resource:', resource)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-muted">Loading resources...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text">
                <span className="text-primary">Movefwd</span>.today
              </h1>
              <p className="text-sm text-text-muted">Your next step, simplified.</p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-text shadow-sm'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="h-[calc(100vh-73px)]">
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
    </main>
  )
}
