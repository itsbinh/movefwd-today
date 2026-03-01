const DISALLOWED_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1'])

export function isSafePublicUrl(urlString: string, allowedHosts: string[]): boolean {
  let parsed: URL
  try {
    parsed = new URL(urlString)
  } catch {
    return false
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) return false

  const host = parsed.hostname.toLowerCase()
  if (DISALLOWED_HOSTS.has(host)) return false

  if (allowedHosts.length === 0) return false
  return allowedHosts.some((allowedHost) => host === allowedHost || host.endsWith(`.${allowedHost}`))
}
