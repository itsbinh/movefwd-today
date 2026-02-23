'use client'
import dynamic from 'next/dynamic'

const LazyMap = dynamic(() => import('./MapViewInner'), {
  ssr: false,
  loading: () => <p className="text-text-muted">Loading map…</p>,
})

export function MapView(props: any) {
  return <LazyMap {...props} />
}
