// lib/scraper.ts
// Simple scraper for public government service listings.
// This is a very lightweight implementation that fetches a page and extracts
// basic resource information using Cheerio. It is intentionally generic – it looks
// for elements with the class `.resource-item` and extracts a few data attributes.
// In a real‑world scenario you would tailor the selectors to each agency’s HTML.

// @ts-ignore // eslint-disable-next-line import/no-unresolved
import { load } from 'cheerio'
import type { Resource, Category } from '@/types/resources'

/**
 * Scrape a government website for resource listings.
 *
 * The function expects the page to contain one or more elements with the class
 * `resource-item`. Inside each element it looks for:
 *   - a child with class `.name` for the resource name
 *   - a child with class `.description` for a short description
 *   - a child with class `.address` for a street address (optional)
 *   - data attributes `data-lat` and `data-lng` for coordinates (optional)
 *   - a child with class `.categories` containing a comma‑separated list of
 *     categories (e.g. "food, health")
 *
 * The scraper returns an array of partial Resource objects that can be merged
 * with existing data before insertion into Supabase.
 */
export async function scrapeGovResources(url: string): Promise<Partial<Resource>[]> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.error('Failed to fetch URL', url, response.status)
      return []
    }
    const html = await response.text()
    const $ = load(html)

    const resources: Partial<Resource>[] = []
    $('.resource-item').each((_i: number, el: any) => {
      const name = $(el).find('.name').text().trim()
      const description = $(el).find('.description').text().trim() || undefined
      const address = $(el).find('.address').text().trim() || undefined
      const latAttr = $(el).attr('data-lat')
      const lngAttr = $(el).attr('data-lng')
      const latitude = latAttr ? parseFloat(latAttr) : undefined
      const longitude = lngAttr ? parseFloat(lngAttr) : undefined
      const categoriesText = $(el).find('.categories').text().trim()
      const categories = categoriesText
        ? (categoriesText.split(',').map((c: string) => c.trim()) as Category[])
        : []

      if (name) {
        resources.push({
          name,
          description,
          address,
          latitude,
          longitude,
          categories,
        })
      }
    })
    return resources
  } catch (error) {
    console.error('Error scraping', url, error)
    return []
  }
}
