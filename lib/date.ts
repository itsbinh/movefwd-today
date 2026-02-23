/**
 * Date formatting utilities for the Movefwd application
 */

/**
 * Format a date string to show how long ago it was verified
 * @param dateString - ISO date string from the database
 * @returns Human-readable string like "Verified 3 days ago"
 */
export function formatVerifiedDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const nowUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const dateUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.floor((nowUtc - dateUtc) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Verified today'
  if (diffDays === 1) return 'Verified yesterday'
  if (diffDays < 7) return `Verified ${diffDays} days ago`
  if (diffDays < 30) return `Verified ${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `Verified ${Math.floor(diffDays / 30)} months ago`
  return `Verified ${Math.floor(diffDays / 365)} years ago`
}
