'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import Map, { Marker } from 'react-map-gl'
import { MapPin } from 'lucide-react'
import type { Resource, Category } from '@/types/resources'

// Only show public/community categories – shared across the map
const PUBLIC_CATEGORIES = ['food', 'housing', 'health', 'legal', 'employment', 'education'] as const

interface MapViewInnerProps {
  resources: Resource[]
  selectedCategories?: Category[]
  onResourceClick?: (resource: Resource) => void
}

export default function MapViewInner({
  resources,
  selectedCategories = [],
  onResourceClick,
}: MapViewInnerProps) {
  const mapRef = useRef<any>(null)
  const [viewState, setViewState] = useState({
    // Center on Orange County, CA
    latitude: 33.7175,
    longitude: -117.8311,
    zoom: 10,
  })

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      if (!resource.latitude || !resource.longitude) return false
      // Exclude resources that don't belong to any public category
      if (!resource.categories.some((cat) => PUBLIC_CATEGORIES.includes(cat as any))) return false
      if (selectedCategories.length === 0) return true
      return selectedCategories.some((cat) => resource.categories.includes(cat))
    })
  }, [resources, selectedCategories])

  // Fit bounds to show all resources – only when the underlying data changes
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
        mapRef.current.fitBounds(bounds, { padding: 50, duration: 1000, maxZoom: 15 })
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
    <div className="relative w-full h-full min-h-[300px]">
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
                onResourceClick?.(resource)
                // Center map on the selected resource with a comfortable zoom level
                setViewState((prev) => ({
                  ...prev,
                  latitude: resource.latitude!,
                  longitude: resource.longitude!,
                  zoom: Math.max(prev.zoom, 14),
                }))
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
      </Map>
    </div>
  )
}
