'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { LocateFixed, List, Map, PhoneCall } from 'lucide-react'
import { MapView } from '@/components/MapView'
import { ResourceList, PUBLIC_CATEGORIES } from '@/components/ResourceList'
import { useResources } from '@/hooks/useResources'
import { getUserLocation } from '@/lib/distance'
import type { Category } from '@/types/resources'

type ViewMode = 'map' | 'list'

export default function HomeClient() {
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [query, setQuery] = useState('')
  const [zipInput, setZipInput] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [page, setPage] = useState(1)
  const [openNow, setOpenNow] = useState(false)
  const [verifiedRecently, setVerifiedRecently] = useState(false)
  const [nearLat, setNearLat] = useState<number | undefined>(undefined)
  const [nearLng, setNearLng] = useState<number | undefined>(undefined)

  const { data, isLoading, isError } = useResources({
    search: query || undefined,
    zip: zipCode || undefined,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    page,
    pageSize: 20,
    openNow,
    verifiedRecently,
    nearLat,
    nearLng,
    nearRadiusMiles: nearLat && nearLng ? 5 : undefined,
  })

  const resources = data?.data ?? []
  const totalCount = data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / 20))

  const freshnessLabel = useMemo(() => {
    if (!data) return 'Freshness unknown'
    if (data.freshness.stale_count > 0) {
      return `${data.freshness.stale_count} listings may be stale`
    }
    return 'Recently verified listings prioritized'
  }, [data])

  const toggleCategory = (category: Category) => {
    setPage(1)
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    )
  }

  const onSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setZipCode(zipInput.trim())
    setPage(1)
  }

  const onUseMyLocation = async () => {
    try {
      const position = await getUserLocation()
      setNearLat(position.coords.latitude)
      setNearLng(position.coords.longitude)
      setPage(1)
    } catch {
      setNearLat(undefined)
      setNearLng(undefined)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="container py-3 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-text">
              <span className="text-primary">Movefwd</span>.today
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  viewMode === 'map' ? 'bg-primary text-white' : 'bg-gray-100 text-text'
                }`}
                aria-pressed={viewMode === 'map'}
              >
                <Map className="w-4 h-4 inline mr-1" /> Map
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-text'
                }`}
                aria-pressed={viewMode === 'list'}
              >
                <List className="w-4 h-4 inline mr-1" /> List
              </button>
            </div>
          </div>

          <p className="text-sm text-text-muted">
            Need immediate help? Call or text <a className="underline" href="tel:988">988</a>. If
            there is immediate danger, call <a className="underline" href="tel:911">911</a>.
          </p>

          <form onSubmit={onSearchSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you need? (shelter, food, addiction, legal help)"
              className="w-full rounded-lg border border-gray-300 px-3 py-3 text-base"
              aria-label="Search support services"
            />
            <input
              type="text"
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value)}
              placeholder="ZIP"
              className="w-full md:w-28 rounded-lg border border-gray-300 px-3 py-3"
              inputMode="numeric"
              pattern="[0-9]{5}"
              maxLength={5}
              aria-label="ZIP code"
            />
            <button type="submit" className="rounded-lg bg-primary text-white px-4 py-3 font-medium">
              Find help
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2">
            {PUBLIC_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium border ${
                  selectedCategories.includes(category)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-text border-gray-300'
                }`}
                aria-pressed={selectedCategories.includes(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setOpenNow((prev) => !prev)}
              className={`rounded-full px-3 py-1 text-sm ${
                openNow ? 'bg-secondary text-white' : 'bg-gray-100 text-text'
              }`}
              aria-pressed={openNow}
            >
              Open now
            </button>
            <button
              onClick={() => setVerifiedRecently((prev) => !prev)}
              className={`rounded-full px-3 py-1 text-sm ${
                verifiedRecently ? 'bg-secondary text-white' : 'bg-gray-100 text-text'
              }`}
              aria-pressed={verifiedRecently}
            >
              Verified recently
            </button>
            <button
              onClick={onUseMyLocation}
              className="rounded-full px-3 py-1 text-sm bg-gray-100 text-text"
            >
              <LocateFixed className="inline w-4 h-4 mr-1" /> Near me
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">{freshnessLabel}</span>
            <span className="text-text-muted">{totalCount} results</span>
          </div>
        </div>
      </header>

      <section className="h-[calc(100vh-270px)]">
        {isLoading && (
          <div className="h-full flex items-center justify-center text-text-muted">Loading resources...</div>
        )}
        {isError && (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-6">
            <p className="text-text">We could not load resources right now.</p>
            <p className="text-sm text-text-muted">If this is urgent, call 988 or 911.</p>
          </div>
        )}
        {!isLoading && !isError && (
          <>
            {viewMode === 'map' ? (
              <MapView resources={resources} selectedCategories={selectedCategories} />
            ) : (
              <ResourceList resources={resources} categories={PUBLIC_CATEGORIES} />
            )}
          </>
        )}
      </section>

      <footer className="border-t border-gray-200 bg-white">
        <div className="container py-3 flex items-center justify-between text-sm text-text-muted">
          <span>Need a human navigator?</span>
          <Link href="tel:211" className="font-medium text-primary inline-flex items-center gap-1">
            <PhoneCall className="w-4 h-4" /> Call 211
          </Link>
        </div>
      </footer>

      <div className="container py-3 flex justify-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-2 rounded bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-2 text-sm text-text-muted">
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-2 rounded bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  )
}
