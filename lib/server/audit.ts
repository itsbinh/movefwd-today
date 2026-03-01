import { logger } from '@/lib/server/logger'

export type AuditEventType =
  | 'search_performed'
  | 'zero_results'
  | 'resource_call_clicked'
  | 'resource_directions_clicked'
  | 'stale_data_detected'

interface AuditEvent {
  type: AuditEventType
  timestamp: string
  payload: Record<string, unknown>
}

export function emitAuditEvent(type: AuditEventType, payload: Record<string, unknown>) {
  const event: AuditEvent = {
    type,
    timestamp: new Date().toISOString(),
    payload,
  }

  logger.info('audit_event', { event })
}
