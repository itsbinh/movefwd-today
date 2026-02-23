'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { Resource } from '@/types/resources'

interface ResourceDetailCardProps {
  resource: Resource
  onClose: () => void
}

export function ResourceDetailCard({ resource, onClose }: ResourceDetailCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Trigger slide‑up animation after mount
  useEffect(() => {
    // Allow next tick for transition
    const id = requestAnimationFrame(() => setIsOpen(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 max-h-[45vh] overflow-y-auto bg-white/90 backdrop-blur-xl border-t border-white/20 rounded-t-3xl shadow-lg transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      } z-50`}
    >
      <div className="p-4 flex items-start gap-4">
        <img
          src={`https://i.pravatar.cc/150?u=${resource.id}`}
          alt={resource.name}
          className="w-16 h-16 rounded-full object-cover border border-white/30"
        />
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-text">{resource.name}</h2>
          {resource.description && (
            <p className="mt-1 text-sm text-text-muted">{resource.description}</p>
          )}
          {resource.address && (
            <p className="mt-2 text-sm text-text">
              {resource.address}, {resource.city}, {resource.state} {resource.zip}
            </p>
          )}
          {resource.phone && <p className="mt-1 text-sm text-text">Phone: {resource.phone}</p>}
          {resource.website && (
            <a
              href={resource.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-primary underline"
            >
              Visit website
            </a>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 text-text-muted hover:text-text transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
