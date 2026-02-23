/**
 * Base 211 API Connector
 * Abstract class for connecting to various 211 and human services APIs
 */

import type {
  DataSource,
  ApiConfig,
  RateLimitState,
  ConnectorResponse,
  ExternalService,
  ExternalApiFilters,
  SyncResult,
} from './types'

/**
 * Abstract base class for all 211 API connectors
 * Provides common functionality for API communication, rate limiting, and error handling
 */
export abstract class Base211Connector {
  protected source: DataSource
  protected config: ApiConfig
  protected rateLimitState: RateLimitState

  constructor(source: DataSource, config: ApiConfig) {
    this.source = source
    this.config = config
    this.rateLimitState = {
      requestsToday: 0,
      requestsThisMinute: 0,
      lastRequestTimestamp: Date.now(),
      resetAt: this.getMidnightTimestamp(),
    }
  }

  /**
   * Get the data source identifier
   */
  public getSource(): DataSource {
    return this.source
  }

  /**
   * Check if rate limits allow making a request
   */
  protected canMakeRequest(): boolean {
    this.updateRateLimitState()
    
    const { requestsPerDay, requestsPerMinute } = this.config.rateLimit
    
    return (
      this.rateLimitState.requestsToday < requestsPerDay &&
      this.rateLimitState.requestsThisMinute < requestsPerMinute
    )
  }

  /**
   * Update rate limit state based on time
   */
  protected updateRateLimitState(): void {
    const now = Date.now()
    
    // Reset daily counter at midnight
    if (now >= this.rateLimitState.resetAt) {
      this.rateLimitState.requestsToday = 0
      this.rateLimitState.resetAt = this.getMidnightTimestamp()
    }
    
    // Reset minute counter if 1 minute has passed
    if (now - this.rateLimitState.lastRequestTimestamp >= 60000) {
      this.rateLimitState.requestsThisMinute = 0
    }
    
    this.rateLimitState.lastRequestTimestamp = now
  }

  /**
   * Record a request being made
   */
  protected recordRequest(): void {
    this.rateLimitState.requestsToday++
    this.rateLimitState.requestsThisMinute++
  }

  /**
   * Get timestamp for midnight (start of next day)
   */
  private getMidnightTimestamp(): number {
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    return midnight.getTime()
  }

  /**
   * Abstract method to fetch services from the API
   * Must be implemented by subclasses
   */
  abstract fetchServices(filters: ExternalApiFilters): Promise<ConnectorResponse<ExternalService[]>>

  /**
   * Abstract method to fetch a single service by ID
   */
  abstract fetchServiceById(id: string): Promise<ConnectorResponse<ExternalService>>

  /**
   * Abstract method to sync all services from the API
   */
  abstract syncAll(): Promise<SyncResult>

  /**
   * Make a fetch request with error handling
   */
  protected async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    // Check rate limits
    if (!this.canMakeRequest()) {
      return {
        success: false,
        error: `Rate limit exceeded for ${this.source}. Please try again later.`,
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      this.recordRequest()

      if (!response.ok) {
        const errorText = await response.text()
        return {
          success: false,
          error: `API error (${response.status}): ${errorText}`,
        }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        error: `Request failed: ${errorMessage}`,
      }
    }
  }

  /**
   * Build query string from filters
   */
  protected buildQueryString(filters: ExternalApiFilters): string {
    const params = new URLSearchParams()
    
    if (filters.search) params.set('search', filters.search)
    if (filters.city) params.set('city', filters.city)
    if (filters.zip) params.set('zip', filters.zip)
    if (filters.category) params.set('category', filters.category)
    if (filters.state) params.set('state', filters.state)
    if (filters.limit) params.set('limit', filters.limit.toString())
    if (filters.offset) params.set('offset', filters.offset.toString())
    
    const queryString = params.toString()
    return queryString ? `?${queryString}` : ''
  }

  /**
   * Parse and validate phone number
   */
  protected normalizePhone(phone: string | null | undefined): string | null {
    if (!phone) return null
    
    // Strip non-numeric characters
    const digits = phone.replace(/\D/g, '')
    
    // Format as E.164 if valid 10-digit number
    if (digits.length === 10) {
      return `+1${digits}`
    }
    
    // If already has country code, keep as is
    if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`
    }
    
    return phone
  }

  /**
   * Parse comma or pipe-separated values into array
   */
  protected parseListField(value: string | null | undefined): string[] {
    if (!value) return []
    return value
      .split(/[,|]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  /**
   * Get current rate limit status
   */
  public getRateLimitStatus(): RateLimitState {
    this.updateRateLimitState()
    return { ...this.rateLimitState }
  }
}

/**
 * Factory function to create a connector based on source type
 */
export function createConnector(source: DataSource): Base211Connector | null {
  // Import here to avoid circular dependencies
  const { NYC311Connector } = require('./nyc311')
  
  switch (source) {
    case 'nyc311':
      return new NYC311Connector()
    // Future connectors can be added here
    // case 'chicago311':
    //   return new Chicago311Connector()
    default:
      console.warn(`No connector available for source: ${source}`)
      return null
  }
}
