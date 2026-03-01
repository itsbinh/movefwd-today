import { load } from 'cheerio'
import type { Resource, Category } from '@/types/resources'

const FETCH_TIMEOUT_MS = 8000

function safeCategory(category: string): Category | null {
  const normalized = category.trim().toLowerCase()
  const allowed: Category[] = ['food', 'housing', 'health', 'legal', 'employment', 'education']
  return allowed.includes(normalized as Category) ? (normalized as Category) : null
}

export async function scrapeGovResources(url: string): Promise<Partial<Resource>[]> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'movefwd-ingestion-bot/1.0',
      },
    })

    if (!response.ok) {
      return []
    }

    const html = await response.text()
    const $ = load(html)

    const resources: Partial<Resource>[] = []

    $('.resource-item').each((_index, element) => {
      const el = $(element)
      const name = el.find('.name').text().trim()
      const description = el.find('.description').text().trim() || undefined
      const address = el.find('.address').text().trim() || undefined
      const latAttr = el.attr('data-lat')
      const lngAttr = el.attr('data-lng')
      const latitude = latAttr ? parseFloat(latAttr) : undefined
      const longitude = lngAttr ? parseFloat(lngAttr) : undefined
      const categoriesText = el.find('.categories').text().trim()
      const parsedCategories = categoriesText
        ? categoriesText
            .split(',')
            .map((c) => safeCategory(c))
            .filter((c): c is Category => Boolean(c))
        : []

      if (!name) return

      resources.push({
        name,
        description,
        address,
        latitude,
        longitude,
        categories: parsedCategories,
      })
    })

    return resources
  } catch {
    return []
  } finally {
    clearTimeout(timeout)
  }
}
