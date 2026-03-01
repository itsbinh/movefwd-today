import { describe, expect, it } from 'vitest'
import { parseResourceQuery } from '@/modules/resources/domain/schemas'

describe('parseResourceQuery', () => {
  it('parses valid query params', () => {
    const params = new URLSearchParams({
      categories: 'food,housing',
      zip: '92614',
      verified: 'true',
      open_now: 'true',
      limit: '20',
      offset: '0',
    })

    const parsed = parseResourceQuery(params)
    expect(parsed.categories).toEqual(['food', 'housing'])
    expect(parsed.zip).toBe('92614')
    expect(parsed.verified).toBe(true)
    expect(parsed.openNow).toBe(true)
  })

  it('rejects malformed zip', () => {
    const params = new URLSearchParams({ zip: 'abcde' })
    expect(() => parseResourceQuery(params)).toThrow()
  })
})
