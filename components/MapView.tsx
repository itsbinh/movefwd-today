'use client'

import dynamic from 'next/dynamic'
import type { Category } from '@/types/resources'
import type { ResourceCardDTO } from '@/modules/resources/domain/types'

const LazyMap = dynamic(() => import('./MapViewInner'), {
  ssr: false,
  loading: () => <p className="text-text-muted">Loading map…</p>,
})

interface MapViewProps {
  resources: ResourceCardDTO[]
  selectedCategories?: Category[]
  onResourceClick?: (resource: ResourceCardDTO) => void
}

export function MapView(props: MapViewProps) {
  return <LazyMap {...props} />
}
