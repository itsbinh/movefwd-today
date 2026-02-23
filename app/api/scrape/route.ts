import { NextResponse } from 'next/server'
import { scrapeGovResources } from '@/lib/scraper'
import { supabase } from '@/lib/supabase'
import type { Resource } from '@/types/resources'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }
    const scraped = await scrapeGovResources(url)
    if (scraped.length === 0) {
      return NextResponse.json({ message: 'No resources found' }, { status: 200 })
    }
    // Insert into Supabase – we assume the table columns match the Resource type
    const { data, error } = await supabase.from('resources').insert(scraped as Resource[])
    if (error) {
      console.error('Supabase insert error', error)
      return NextResponse.json({ error: 'Failed to store resources' }, { status: 500 })
    }
    return NextResponse.json({ inserted: data })
  } catch (err) {
    console.error('Scrape endpoint error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
