'use client'
import dynamic from 'next/dynamic'
import type { Resource, Category } from '@/types/resources'

const LazyMap = dynamic(() => import('./MapViewInner'), {
  ssr: false,
  loading: () => <p className="text-text-muted">Loading map…</p>,
})

interface MapViewProps {
  resources: Resource[]
  selectedCategories?: Category[]
  onResourceClick?: (resource: Resource) => void
}

export function MapView(props: MapViewProps) {
  return <LazyMap {...props} />
}
