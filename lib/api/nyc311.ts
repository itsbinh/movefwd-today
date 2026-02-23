/**
 * NYC 311 API Connector
 * Integration with NYC 311 service directory as a public data source
 */

import { Base211Connector } from './211Connector'
import type {
  DataSource,
  ApiConfig,
  ConnectorResponse,
  ExternalService,
  ExternalApiFilters,
  SyncResult,
  NYC311Service,
} from './types'
import { normalizeExternalService } from './normalizer'

// NYC 311 API configuration
const NYC311_CONFIG: ApiConfig = {
  baseUrl: process.env.NYC311_API_URL || 'https://api.nyc.gov/311/srv/v2',
  apiKey: process.env.NYC311_API_KEY,
  rateLimit: {
    requestsPerDay: 10000,
    requestsPerMinute: 100,
  },
}

// Default pagination
const DEFAULT_LIMIT = 50
const MAX_LIMIT = 100

/**
 * NYC 311 API Connector
 * Extends Base211Connector to provide NYC-specific functionality
 */
export class NYC311Connector extends Base211Connector {
  constructor() {
    super('nyc311', NYC311_CONFIG)
  }

  /**
   * Fetch services from NYC 311 API
   */
  async fetchServices(filters: ExternalApiFilters): Promise<ConnectorResponse<ExternalService[]>> {
    const { search, city, zip, limit = DEFAULT_LIMIT, offset = 0 } = filters

    // Build query parameters
    const params = new URLSearchParams()
    if (search) params.set('keyword', search)
    if (city) params.set('borough', city) // NYC uses boroughs instead of cities
    if (zip) params.set('zip', zip)
    params.set('$limit', Math.min(limit, MAX_LIMIT).toString())
    params.set('$offset', offset.toString())

    const url = `${this.config.baseUrl}/services?${params.toString()}`

    const headers: Record<string, string> = {}
    if (this.config.apiKey) {
      headers['ApiKey'] = this.config.apiKey
    }

    const result = await this.makeRequest<NYC311Service[]>(url, { headers })

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || 'Failed to fetch NYC 311 services',
        source: this.source,
        timestamp: new Date().toISOString(),
      }
    }

    // Normalize the response to our ExternalService format
    const normalizedServices = result.data.map((service) =>
      normalizeExternalService(service, 'nyc311')
    )

    return {
      success: true,
      data: normalizedServices,
      source: this.source,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Fetch a single service by ID
   */
  async fetchServiceById(id: string): Promise<ConnectorResponse<ExternalService>> {
    const url = `${this.config.baseUrl}/services/${id}`

    const headers: Record<string, string> = {}
    if (this.config.apiKey) {
      headers['ApiKey'] = this.config.apiKey
    }

    const result = await this.makeRequest<NYC311Service>(url, { headers })

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || 'Failed to fetch NYC 311 service',
        source: this.source,
        timestamp: new Date().toISOString(),
      }
    }

    const normalizedService = normalizeExternalService(result.data, 'nyc311')

    return {
      success: true,
      data: normalizedService,
      source: this.source,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Sync all services from NYC 311 API
   * Note: This is a full sync operation that would typically be run as a background job
   */
  async syncAll(): Promise<SyncResult> {
    const errors: string[] = []
    let imported = 0
    let updated = 0

    try {
      // Fetch services in batches
      let offset = 0
      let hasMore = true

      while (hasMore) {
        const response = await this.fetchServices({
          limit: MAX_LIMIT,
          offset,
        })

        if (!response.success || !response.data) {
          errors.push(`Failed to fetch batch at offset ${offset}: ${response.error}`)
          break
        }

        // Process each service (in a real implementation, this would upsert to database)
        for (const service of response.data) {
          try {
            // Here we would upsert to Supabase
            // For now, just count
            imported++
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error'
            errors.push(`Error processing service ${service.source_id}: ${errorMsg}`)
            updated++
          }
        }

        offset += MAX_LIMIT
        hasMore = response.data.length === MAX_LIMIT
      }

      return {
        success: errors.length === 0,
        imported,
        updated,
        errors,
        timestamp: new Date().toISOString(),
        source: this.source,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        imported,
        updated,
        errors: [errorMessage],
        timestamp: new Date().toISOString(),
        source: this.source,
      }
    }
  }
}

/**
 * Factory function to create NYC 311 connector
 */
export function createNYC311Connector(): NYC311Connector {
  return new NYC311Connector()
}

/**
 * Get available NYC service categories
 */
export function getNYCServiceCategories(): string[] {
  return [
    'Food',
    'Housing',
    'Health',
    'Legal',
    'Employment',
    'Education',
    'Utilities',
    'Transportation',
    'Safety',
    'Social Services',
  ]
}
