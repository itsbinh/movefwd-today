'use client'

import { useState } from 'react'

export function ScrapeForm() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Scraping...')
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus(`Inserted ${data.inserted?.length ?? 0} resources`)
        setUrl('')
      } else {
        setStatus(`Error: ${data.error ?? 'unknown'}`)
      }
    } catch (err) {
      setStatus('Network error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 bg-gray-50 border-b">
      <input
        type="url"
        placeholder="Gov website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 px-2 py-1 border rounded"
        required
      />
      <button
        type="submit"
        className="px-3 py-1 bg-primary/30 text-primary backdrop-blur-md rounded-full hover:bg-primary/50 transform hover:scale-105 transition-colors transition-transform"
        aria-label="Import resources from URL"
      >
        Import
      </button>
      {status && <span className="text-sm text-text-muted ml-2">{status}</span>}
    </form>
  )
}
