import type { NextRequest } from 'next/server'
import { securityConfig } from '@/lib/server/env'

export function isAdminRequest(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-admin-api-key')
  if (!securityConfig.adminApiKey) return false
  return apiKey === securityConfig.adminApiKey
}
