'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Map, { Marker, type MapRef, type ViewStateChangeEvent } from 'react-map-gl'
import { MapPin } from 'lucide-react'
import type { Category } from '@/types/resources'
import type { ResourceCardDTO } from '@/modules/resources/domain/types'

const PUBLIC_CATEGORIES = ['food', 'housing', 'health', 'legal', 'employment', 'education'] as const

interface MapViewInnerProps {
  resources: ResourceCardDTO[]
  selectedCategories?: Category[]
  onResourceClick?: (resource: ResourceCardDTO) => void
}

export default function MapViewInner({
  resources,
  selectedCategories = [],
  onResourceClick,
}: MapViewInnerProps) {
  const mapRef = useRef<MapRef | null>(null)
  const [viewState, setViewState] = useState({
    latitude: 33.7175,
    longitude: -117.8311,
    zoom: 10,
  })

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      if (resource.latitude === null || resource.longitude === null) return false
      if (!resource.categories.some((cat) => PUBLIC_CATEGORIES.includes(cat))) return false
      if (selectedCategories.length === 0) return true
      return selectedCategories.some((cat) => resource.categories.includes(cat))
    })
  }, [resources, selectedCategories])

  useEffect(() => {
    if (filteredResources.length === 0 || !mapRef.current) return

    const bounds: [[number, number], [number, number]] = [
      [Infinity, Infinity],
      [-Infinity, -Infinity],
    ]

    filteredResources.forEach((resource) => {
      if (resource.latitude !== null && resource.longitude !== null) {
        bounds[0][0] = Math.min(bounds[0][0], resource.longitude)
        bounds[0][1] = Math.min(bounds[0][1], resource.latitude)
        bounds[1][0] = Math.max(bounds[1][0], resource.longitude)
        bounds[1][1] = Math.max(bounds[1][1], resource.latitude)
      }
    })

    if (bounds[0][0] !== Infinity) {
      mapRef.current.fitBounds(bounds, { padding: 50, duration: 1000, maxZoom: 15 })
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
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        {filteredResources.map((resource) => {
          if (resource.latitude === null || resource.longitude === null) return null

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
                setViewState((prev) => ({
                  ...prev,
                  latitude: resource.latitude ?? prev.latitude,
                  longitude: resource.longitude ?? prev.longitude,
                  zoom: Math.max(prev.zoom, 14),
                }))
              }}
            >
              <div className="cursor-pointer hover:scale-110 transition-transform" style={{ color }}>
                <MapPin className="w-8 h-8" fill="currentColor" />
              </div>
            </Marker>
          )
        })}
      </Map>
    </div>
  )
}
