/**
 * API Integration Library
 * Unified exports for 211 and external service connectors
 */

// Types
export * from './types'

// Base connector
export { Base211Connector, createConnector } from './211Connector'

// Specific connectors
export { NYC311Connector, createNYC311Connector, getNYCServiceCategories } from './nyc311'

// Normalization
export {
  normalizeExternalService,
  toResource,
  generateSourceId,
  validateResource,
} from './normalizer'

// Caching
export {
  getFromCache,
  setCache,
  deleteFromCache,
  invalidateCache,
  clearCache,
  getCacheStats,
  cleanupCache,
  getCachedOrFetch,
  generateCacheKey,
  cacheConfigs,
} from './cache'
