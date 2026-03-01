import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ShieldCheck, AlertTriangle } from 'lucide-react'
import { getResourceDetailWithAlternatives } from '@/modules/resources/application/getResourceDetail'
import { ResourceActionButtons } from '@/components/ResourceActionButtons'

interface ResourceDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { id } = await params
  const { resource, alternatives } = await getResourceDetailWithAlternatives(id)

  if (!resource) {
    notFound()
  }

  const mapAddress = [resource.address, resource.city, resource.state, resource.zip]
    .filter(Boolean)
    .join(' ')

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-6 max-w-3xl space-y-6">
        <Link href="/" className="text-sm text-primary underline">
          Back to search
        </Link>

        <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-text">{resource.name}</h1>
            <p className="text-sm text-text-muted mt-1">{resource.description}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-gray-100 text-text">
              Availability: {resource.availability_status}
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-100 text-text">
              Last confirmed: {resource.last_confirmed_at ? new Date(resource.last_confirmed_at).toLocaleString() : 'Unknown'}
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-100 text-text">
              Source: {resource.data_source_label}
            </span>
          </div>

          <div className="space-y-3">
            <ResourceActionButtons
              resourceId={resource.id}
              phone={resource.phone}
              mapAddress={mapAddress}
              website={resource.website}
            />
            {resource.application_guide && (
              <div className="rounded-lg border border-gray-300 px-4 py-3 text-sm text-text">
                <p className="font-semibold">How to access</p>
                <p>{resource.application_guide}</p>
              </div>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm">
            <p className="font-medium text-text inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Trust and freshness
            </p>
            <p className="text-text-muted mt-1">
              Confidence score: {resource.confidence_score ?? 'Unknown'} · Verification: {resource.verification_badge}
            </p>
          </div>
        </section>

        {['full', 'waitlist'].includes(resource.availability_status) && (
          <section className="rounded-xl border border-amber-300 bg-amber-50 p-4">
            <p className="font-semibold text-amber-900 inline-flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> This resource may be unavailable right now
            </p>
            <p className="text-sm text-amber-900/90 mt-1">Try these nearby alternatives:</p>
            <ul className="mt-3 space-y-2">
              {alternatives.map((alt) => (
                <li key={alt.id}>
                  <Link href={`/resources/${alt.id}`} className="text-primary underline">
                    {alt.name}
                  </Link>
                  <span className="text-sm text-text-muted"> · {alt.city ?? alt.state}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  )
}
