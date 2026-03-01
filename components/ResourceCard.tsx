import Link from 'next/link'
import { MapPin, Phone, Globe, BadgeCheck, Clock3 } from 'lucide-react'
import type { ResourceCardDTO } from '@/modules/resources/domain/types'

export const CATEGORY_COLORS: Record<string, string> = {
  food: 'bg-category-food text-white',
  housing: 'bg-category-housing text-white',
  health: 'bg-category-health text-white',
  legal: 'bg-category-legal text-white',
  employment: 'bg-category-employment text-white',
  education: 'bg-category-education text-white',
}

interface ResourceCardProps {
  resource: ResourceCardDTO
  onClick?: () => void
}

const AVAILABILITY_STYLE: Record<string, string> = {
  open: 'bg-green-100 text-green-800',
  limited: 'bg-amber-100 text-amber-800',
  waitlist: 'bg-purple-100 text-purple-800',
  full: 'bg-red-100 text-red-800',
  unknown: 'bg-gray-100 text-gray-700',
}

export function ResourceCard({ resource, onClick }: ResourceCardProps) {
  return (
    <article
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-lg font-semibold text-text flex-1">
          <Link href={`/resources/${resource.id}`} className="hover:underline">
            {resource.name}
          </Link>
        </h3>
        {resource.verified && <BadgeCheck className="w-5 h-5 text-success flex-shrink-0" />}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${AVAILABILITY_STYLE[resource.availability_status]}`}
        >
          {resource.availability_status}
        </span>
        <span className="text-xs text-text-muted inline-flex items-center gap-1">
          <Clock3 className="w-3 h-3" />
          {resource.freshness_state}
        </span>
        <span className="text-xs text-text-muted">{resource.data_source_label}</span>
      </div>

      <p className="text-text-muted text-sm mb-4 line-clamp-2">{resource.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {resource.categories.map((category) => (
          <span
            key={category}
            className={`px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[category] || 'bg-gray-200 text-gray-700'}`}
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
            <a href={`tel:${resource.phone}`} className="hover:text-primary transition-colors">
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
            >
              Website
            </a>
          </div>
        )}
      </div>
    </article>
  )
}
