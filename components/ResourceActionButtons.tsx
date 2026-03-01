'use client'

import { PhoneCall, Navigation, ExternalLink } from 'lucide-react'

interface ResourceActionButtonsProps {
  resourceId: string
  phone: string | null
  mapAddress: string
  website: string | null
}

async function emitEvent(type: 'resource_call_clicked' | 'resource_directions_clicked', resourceId: string) {
  try {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, resourceId }),
    })
  } catch {
    // Best-effort telemetry only.
  }
}

export function ResourceActionButtons({ resourceId, phone, mapAddress, website }: ResourceActionButtonsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {phone && (
        <a
          href={`tel:${phone}`}
          onClick={() => emitEvent('resource_call_clicked', resourceId)}
          className="rounded-lg bg-primary text-white px-4 py-3 font-medium inline-flex items-center justify-center gap-2"
        >
          <PhoneCall className="w-4 h-4" /> Call
        </a>
      )}
      {mapAddress && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => emitEvent('resource_directions_clicked', resourceId)}
          className="rounded-lg bg-secondary text-white px-4 py-3 font-medium inline-flex items-center justify-center gap-2"
        >
          <Navigation className="w-4 h-4" /> Directions
        </a>
      )}
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-gray-300 px-4 py-3 font-medium inline-flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" /> Website
        </a>
      )}
    </div>
  )
}
