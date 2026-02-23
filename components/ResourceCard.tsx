'use client'

import { MapPin, Phone, Globe, BadgeCheck } from 'lucide-react'
import type { Resource } from '@/types/resources'

interface ResourceCardProps {
  resource: Resource
  onClick?: () => void
}

export function ResourceCard({ resource, onClick }: ResourceCardProps) {
  const categoryColors: Record<string, string> = {
    food: 'bg-category-food text-white',
    housing: 'bg-category-housing text-white',
    health: 'bg-category-health text-white',
    legal: 'bg-category-legal text-white',
    employment: 'bg-category-employment text-white',
    education: 'bg-category-education text-white',
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-text flex-1">{resource.name}</h3>
        {resource.verified && <BadgeCheck className="w-5 h-5 text-success flex-shrink-0 ml-2" />}
      </div>

      <p className="text-text-muted text-sm mb-4 line-clamp-2">{resource.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {resource.categories.map((category) => (
          <span
            key={category}
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              categoryColors[category] || 'bg-gray-200 text-gray-700'
            }`}
          >
            {category}
          </span>
        ))}
      </div>

      <div className="space-y-2 text-sm text-text-muted">
        {resource.address && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">
              {resource.address}
              {resource.city && `, ${resource.city}`}
              {resource.state && ` ${resource.state}`}
            </span>
          </div>
        )}

        {resource.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <a
              href={`tel:${resource.phone}`}
              className="hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {resource.phone}
            </a>
          </div>
        )}

        {resource.website && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 flex-shrink-0" />
            <a
              href={resource.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors truncate"
              onClick={(e) => e.stopPropagation()}
            >
              Website
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
