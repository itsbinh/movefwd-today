'use client'

import { useEffect, useRef, useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'
import { MapPin } from 'lucide-react'
import type { Resource, Category } from '@/types/resources'

interface MapViewProps {
  resources: Resource[]
  selectedCategories?: Category[]
  onResourceClick?: (resource: Resource) => void
}

export function MapView({ resources, selectedCategories = [], onResourceClick }: MapViewProps) {
  const mapRef = useRef<any>(null)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [viewState, setViewState] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 10,
  })

  const filteredResources = resources.filter((resource) => {
    if (!resource.latitude || !resource.longitude) return false
    if (selectedCategories.length === 0) return true
    return selectedCategories.some((cat) => resource.categories.includes(cat))
  })

  // Fit bounds to show all resources
  useEffect(() => {
    if (filteredResources.length > 0 && mapRef.current) {
      const bounds: [[number, number], [number, number]] = [
        [Infinity, Infinity],
        [-Infinity, -Infinity],
      ]

      filteredResources.forEach((resource) => {
        if (resource.latitude && resource.longitude) {
          bounds[0][0] = Math.min(bounds[0][0], resource.longitude)
          bounds[0][1] = Math.min(bounds[0][1], resource.latitude)
          bounds[1][0] = Math.max(bounds[1][0], resource.longitude)
          bounds[1][1] = Math.max(bounds[1][1], resource.latitude)
        }
      })

      if (bounds[0][0] !== Infinity) {
        mapRef.current.fitBounds(bounds, { padding: 50, duration: 1000 })
      }
    }
  }, [filteredResources])

  const categoryColors: Record<string, string> = {
    food: '#4CAF50',
    housing: '#2196F3',
    health: '#009688',
    legal: '#7E57C2',
    employment: '#FF9800',
    education: '#5C6BC0',
  }

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        {filteredResources.map((resource) => {
          if (!resource.latitude || !resource.longitude) return null

          const category = resource.categories[0]
          const color = categoryColors[category] || '#E76F51'

          return (
            <Marker
              key={resource.id}
              latitude={resource.latitude}
              longitude={resource.longitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                setSelectedResource(resource)
                onResourceClick?.(resource)
              }}
            >
              <div
                className="cursor-pointer hover:scale-110 transition-transform"
                style={{ color }}
              >
                <MapPin className="w-8 h-8" fill="currentColor" />
              </div>
            </Marker>
          )
        })}

        {selectedResource && (
          <Popup
            latitude={selectedResource.latitude!}
            longitude={selectedResource.longitude!}
            anchor="top"
            onClose={() => setSelectedResource(null)}
            closeOnClick={false}
            className="map-popup"
          >
            <div className="p-2 min-w-[200px]">
              <h3 className="font-semibold text-text mb-1">{selectedResource.name}</h3>
              <p className="text-sm text-text-muted mb-2 line-clamp-2">
                {selectedResource.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedResource.categories.slice(0, 2).map((category) => (
                  <span
                    key={category}
                    className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-text"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
