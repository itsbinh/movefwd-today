import { describe, expect, it } from 'vitest'
import { listResources } from '@/modules/resources/application/listResources'

describe('listResources', () => {
  it('returns response with freshness and source mix', async () => {
    const result = await listResources({
      limit: 20,
      offset: 0,
      zip: '92868',
    })

    expect(Array.isArray(result.data)).toBe(true)
    expect(result.count).toBeGreaterThanOrEqual(0)
    expect(result.freshness).toHaveProperty('stale_count')
    expect(result.source_mix).toBeTypeOf('object')
  })
})
