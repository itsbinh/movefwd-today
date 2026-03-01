import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/server/rateLimit'
import { emitAuditEvent } from '@/lib/server/audit'

const eventSchema = z.object({
  type: z.enum(['resource_call_clicked', 'resource_directions_clicked']),
  resourceId: z.string().min(1),
})

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const limit = checkRateLimit(`events:post:${ip}`)
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const json = await request.json()
    const parsed = eventSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid event payload' }, { status: 400 })
    }

    emitAuditEvent(parsed.data.type, {
      resourceId: parsed.data.resourceId,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
