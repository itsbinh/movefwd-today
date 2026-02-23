# Human Services Search Implementation

This document provides comprehensive technical documentation for the human services search implementation in the MoveFWD platform. It covers the technical stack, API integrations, search functionality, caching, and data display components.

## Table of Contents

1. [Technical Stack](#technical-stack)
2. [API Integration](#api-integration)
3. [Environment Configuration](#environment-configuration)
4. [Search Functionality](#search-functionality)
5. [Caching & Error Handling](#caching--error-handling)
6. [Data Display](#data-display)
7. [Usage Examples](#usage-examples)
8. [Type Definitions](#type-definitions)

---

## Technical Stack

### Overview

The search implementation uses a modern web technology stack designed for performance, type safety, and developer experience.

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14+ | React framework with App Router |
| UI Framework | React 18 | Component-based UI library |
| Language | TypeScript | Type-safe JavaScript |
| Styling | Tailwind CSS | Utility-first CSS framework |
| State Management | React Query | Server state management |
| Backend | Next.js API Routes | Serverless API endpoints |
| Database | Supabase (PostgreSQL) | Primary data storage |
| External Data | 211 Service APIs | Human services data source |

### Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.0.0",
    "@supabase/supabase-js": "^2.39.0"
  }
}
```

### Project Structure

```
lib/api/                    # API connectors and utilities
├── 211Connector.ts        # Base class for 211 API integrations
├── nyc311.ts               # NYC 311 API connector
├── cache.ts                # In-memory caching layer
├── normalizer.ts           # Data transformation utilities
├── types.ts                # TypeScript type definitions
└── index.ts                # API exports

components/
├── search/
│   └── index.ts            # Search component exports
├── SearchBar.tsx           # Main search input component
├── SearchFilters.tsx       # Advanced filter panel
├── ResourceCard.tsx        # Resource display card
├── ResourceList.tsx        # Resource list with pagination
└── ResourceSearch.tsx      # Combined search & results view

hooks/
├── useResources.ts         # React Query hook for fetching resources
└── useFavorites.ts         # Favorites management

types/
├── resources.ts            # Resource type definitions
└── search.ts               # Search filter types
```

---

## API Integration

### 211 Service Database Integration

The system integrates with external 211 service databases to provide comprehensive human services data. Currently, the primary integration is with NYC 211 services.

#### Supported Data Sources

| Source | Status | Description |
|--------|--------|-------------|
| `local` | Active | Supabase database (primary) |
| `nyc311` | Active | NYC 311 Service Directory API |
| `chicago311` | Planned | Chicago 311 API |
| `211la` | Planned | Los Angeles 211 |
| `bayarea211` | Planned | Bay Area 211 |

#### NYC 311 API Integration

The NYC 311 API serves as a public data source for human services in New York City. The integration:

- Uses the [NYC 311 Service Directory API v2](https://api.nyc.gov/311/srv/v2)
- Supports keyword, borough, and ZIP code filtering
- Returns normalized HSDS-compliant data

##### Base Configuration

```typescript
// lib/api/nyc311.ts
const NYC311_CONFIG: ApiConfig = {
  baseUrl: process.env.NYC311_API_URL || 'https://api.nyc.gov/311/srv/v2',
  apiKey: process.env.NYC311_API_KEY,
  rateLimit: {
    requestsPerDay: 10000,
    requestsPerMinute: 100,
  },
}
```

### HSDS Compliance

The implementation follows the [Human Services Data Specification (HSDS)](https://github.com/human_services/human_services_data_specification) for data normalization:

- Standardized phone types: `voice`, `fax`, `tty`, `sms`
- Consistent eligibility and accessibility fields
- Normalized location data (address, city, state, zip, coordinates)
- Service area and schedule standardization

### External API Connectors

#### Base Connector Architecture

All external API connectors extend the [`Base211Connector`](lib/api/211Connector.ts:20) class, which provides:

- Rate limiting with configurable thresholds
- Request tracking and throttling
- Automatic retry logic
- Response normalization
- Error handling

```typescript
// lib/api/211Connector.ts
export abstract class Base211Connector {
  protected source: DataSource
  protected config: ApiConfig
  protected rateLimitState: RateLimitState

  abstract fetchServices(filters: ExternalApiFilters): Promise<ConnectorResponse<ExternalService[]>>
  abstract fetchServiceById(id: string): Promise<ConnectorResponse<ExternalService>>
  abstract syncAll(): Promise<SyncResult>
}
```

#### Adding New Connectors

To add a new 211 API connector:

1. Create a new file in `lib/api/` (e.g., `chicago311.ts`)
2. Extend the `Base211Connector` class
3. Implement required abstract methods
4. Add the connector to the factory function in [`createConnector()`](lib/api/211Connector.ts:219)

---

## Environment Configuration

### Required API Keys

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (server) | Service role for admin operations |
| `NYC311_API_KEY` | For production | NYC 311 API authentication key |
| `NYC311_API_URL` | No | Override default NYC 311 API endpoint |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | For maps | Mapbox access token |

### Example Environment File

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Mapbox (for map display)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_token

# NYC 311 API (production only)
NYC311_API_KEY=your_nyc_311_api_key
NYC311_API_URL=https://api.nyc.gov/311/srv/v2
```

### Rate Limits

| Source | Daily Limit | Minute Limit |
|--------|-------------|--------------|
| NYC 311 | 10,000 | 100 |
| Local (Supabase) | N/A | N/A |

### Usage Terms

- **NYC 311 API**: Requires registration at [NYC 311 Developer Portal](https://portal.311.gov/). Usage is free for public benefit applications.
- **Supabase**: Free tier available; see [pricing plans](https://supabase.com/pricing) for higher limits.

---

## Search Functionality

### Filter Options

The search system supports multiple filter types:

| Filter | Type | Description |
|--------|------|-------------|
| `search` | string | Keyword search in name/description |
| `city` | string | Filter by city name |
| `state` | string | Filter by US state (2-letter code) |
| `zip` | string | Filter by ZIP code |
| `categories` | Category[] | Filter by service categories |
| `eligibility` | string[] | Filter by eligibility requirements |
| `verified` | boolean | Show only verified resources |

### Available Categories

```typescript
// types/resources.ts
type Category = 'food' | 'housing' | 'health' | 'legal' | 'employment' | 'education'
```

### Eligibility Options

```typescript
// types/search.ts
const ELIGIBILITY_OPTIONS = [
  { value: 'seniors', label: 'Seniors (65+)' },
  { value: 'families', label: 'Families' },
  { value: 'veterans', label: 'Veterans' },
  { value: 'youth', label: 'Youth' },
  { value: 'children', label: 'Children' },
  { value: 'pregnant', label: 'Pregnant Women' },
  { value: 'disabled', label: 'People with Disabilities' },
  { value: 'homeless', label: 'Homeless' },
  { value: 'low-income', label: 'Low Income' },
  { value: 'immigrants', label: 'Immigrants/Refugees' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'medicare', label: 'Medicare/Medicaid Recipients' },
]
```

### Verified Filter Behavior

> **Important**: In [`app/api/resources/route.ts:28`](app/api/resources/route.ts:28), the verified filter has specific behavior:
> - `?verified=true` → Returns only verified resources
> - `?verified=false` → Treated as `undefined` (returns all resources)
> - No `verified` param → Returns all resources

### Search API Endpoint

```
GET /api/resources
```

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `search` | string | - | Search keywords |
| `categories` | string | - | Comma-separated categories |
| `city` | string | - | City name |
| `state` | string | - | State code (e.g., "NY") |
| `zip` | string | - | ZIP code |
| `verified` | string | - | "true" for verified only |
| `source` | string | - | Data source: "local", "nyc311" |
| `limit` | number | 20 | Results per page |
| `offset` | number | 0 | Pagination offset |

#### Response Format

```json
{
  "data": [
    {
      "id": "resource-123",
      "name": "Community Food Bank",
      "description": "Emergency food assistance",
      "categories": ["food"],
      "eligibility": "Low income residents",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "phone": "+12125551234",
      "verified": true,
      ...
    }
  ],
  "count": 1,
  "sources": ["local"],
  "cached": false
}
```

---

## Caching & Error Handling

### Caching Configuration

The implementation uses an in-memory cache with configurable TTL:

```typescript
// lib/api/cache.ts
const DEFAULT_TTL_SECONDS = 3600    // 1 hour
const MAX_STALE_SECONDS = 86400     // 24 hours Features

| Feature | Description |
|---------|
```

### Cache-------------|
| **TTL** | Configurable per data type (default: 1 hour) |
| **Stale-while-revalidate** | Returns stale data while fetching fresh |
| **Pattern-based invalidation** | Clear cache entries matching regex patterns |
| **Periodic cleanup** | Removes expired entries every 5 minutes |

### Cache Configuration by Data Type

```typescript
// lib/api/cache.ts
export const cacheConfigs: Record<string, CacheConfig> = {
  resources: {
    key: 'resources',
    ttlSeconds: 3600,
    maxStaleSeconds: 86400,
  },
  sourceStatus: {
    key: 'source_status',
    ttlSeconds: 300,    // 5 minutes
    maxStaleSeconds: 600,
  },
  syncStatus: {
    key: 'sync_status',
    ttlSeconds: 60,     // 1 minute
    maxStaleSeconds: 120,
  },
  externalServices: {
    key: 'external_services',
    ttlSeconds: 3600,
    maxStaleSeconds: 86400,
  },
}
```

### React Query Configuration

The frontend uses React Query with the following settings:

```typescript
// hooks/useResources.ts
return useQuery({
  queryKey,
  queryFn: fetchResources,
  staleTime: 1000 * 60, // 1 minute
})
```

### Error Handling

#### API Route Error Handling

The API route implements a fallback strategy:

1. **Primary**: Try cached or fresh data from all sources
2. **Fallback**: If external sources fail, return local data only
3. **Error Response**: Return 500 if all sources fail

```typescript
// app/api/resources/route.ts
try {
  const result = await getCachedOrFetch(...)
  return NextResponse.json(result)
} catch (error) {
  // Try local data as fallback
  try {
    const localData = await fetchFromLocalDatabase(filters, limit, offset)
    return NextResponse.json({
      data: localData.data,
      error: 'External sources unavailable, returning local data',
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}
```

#### Rate Limit Handling

The connector tracks rate limits and prevents exceeding thresholds:

```typescript
// lib/api/211Connector.ts
protected canMakeRequest(): boolean {
  this.updateRateLimitState()
  const { requestsPerDay, requestsPerMinute } = this.config.rateLimit
  
  return (
    this.rateLimitState.requestsToday < requestsPerDay &&
    this.rateLimitState.requestsThisMinute < requestsPerMinute
  )
}
```

---

## Data Display

### Resource Card

The [`ResourceCard`](components/ResourceCard.tsx:23) component displays individual resources with:

- Service name and organization
- Category badges with semantic colors
- Location with optional distance display
- Contact information (phone, website)
- Verification status indicator
- Favorite button

#### Category Colors

Category badges use semantic colors defined in [`CATEGORY_COLORS`](components/ResourceCard.tsx:7):

```typescript
export const CATEGORY_COLORS: Record<string, string> = {
  food: 'bg-category-food text-white',
  housing: 'bg-category-housing text-white',
  health: 'bg-category-health text-white',
  legal: 'bg-category-legal text-white',
  employment: 'bg-category-employment text-white',
  education: 'bg-category-education text-white',
}
```

#### Resource Card Features

| Feature | Implementation |
|---------|----------------|
| Favorite toggle | Uses [`useFavorites`](hooks/useFavorites.ts) hook |
| Distance display | Calculated via [`formatDistance`](lib/distance.ts) |
| Verification badge | Shows green checkmark for verified resources |
| Click handling | Opens resource details or navigates |

### Search Filters Panel

The [`SearchFiltersPanel`](components/SearchFilters.tsx:26) component provides:

- Expandable/collapsible UI
- Keyword search input
- Location filters (city, state, ZIP)
- Multi-select category buttons
- Eligibility checkboxes
- Verified toggle

### Resource List

The [`ResourceList`](components/ResourceList.tsx) component renders search results with:

- Grid layout for cards
- Pagination controls
- Result count display
- Loading and empty states

### Public Categories Filter

> **Note**: The [`PUBLIC_CATEGORIES`](components/ResourceList.tsx:8) constant in `ResourceList.tsx` filters which categories are displayed in the UI. Resources without these categories are excluded from the list.

---

## Usage Examples

### Using the React Query Hook

```tsx
import { useResources } from '@/hooks/useResources'

function SearchResults() {
  const { data, isLoading, error } = useResources({
    categories: ['food', 'housing'],
    city: 'New York',
    state: 'NY',
    verified: true,
    page: 1,
    pageSize: 20,
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      <p>Found {data?.count} resources</p>
      <ResourceList resources={data?.data} />
    </div>
  )
}
```

### Using the Search Filters Component

```tsx
import { SearchFiltersPanel, DEFAULT_SEARCH_FILTERS } from '@/components/search'

function FilterExample() {
  const [filters, setFilters] = useState(DEFAULT_SEARCH_FILTERS)

  return (
    <SearchFiltersPanel
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      onApply={setFilters}
      initialFilters={filters}
    />
  )
}
```

### Fetching Resources Directly

```bash
# Get all resources
curl "http://localhost:3000/api/resources"

# Filter by category
curl "http://localhost:3000/api/resources?categories=food,housing"

# Filter by location
curl "http://localhost:3000/api/resources?city=New%20York&state=NY"

# Verified only
curl "http://localhost:3000/api/resources?verified=true"

# Paginated
curl "http://localhost:3000/api/resources?limit=10&offset=20"
```

### Cache Invalidation

```bash
# Invalidate all resource cache entries
curl -X POST "http://localhost:3000/api/resources?action=invalidate"

# Invalidate specific pattern
curl -X POST "http://localhost:3000/api/resources?action=invalidate&pattern=resources.*food"
```

---

## Type Definitions

### Resource Type

```typescript
// types/resources.ts
export interface Resource {
  id: string
  name: string
  description: string | null
  categories: Category[]
  eligibility: string | null
  address: string | null
  city: string | null
  state: string
  zip: string | null
  latitude: number | null
  longitude: number | null
  phone: string | null
  website: string | null
  application_guide: string | null
  verified: boolean
  // HSDS fields
  source: string | null
  source_id: string | null
  organization_name: string | null
  organization_id: string | null
  email: string | null
  languages: string[] | null
  interpretation_services: string[] | null
  accessibility: string[] | null
  fees: string | null
  schedule: string | null
  service_area: string | null
  last_verified_at: string | null
  data_source_url: string | null
  created_at: string
  updated_at: string
}
```

### Search Filters Type

```typescript
// types/search.ts
export interface SearchFilters {
  search: string
  city: string
  state: string
  zip: string
  categories: Category[]
  eligibility: string[]
  verified: boolean | undefined
}
```

### External API Types

```typescript
// lib/api/types.ts
export interface ExternalService {
  source_id: string
  source: DataSource
  name: string
  description: string | null
  organization_name: string | null
  organization_id: string | null
  address: string | null
  city: string | null
  state: string
  zip: string | null
  latitude: number | null
  longitude: number | null
  phone: string | null
  phone_type: 'voice' | 'fax' | 'tty' | 'sms' | null
  website: string | null
  email: string | null
  eligibility: string | null
  fees: string | null
  schedule: string | null
  service_area: string | null
  languages: string[]
  interpretation_services: string[]
  accessibility: string[]
  last_verified_at: string | null
  data_source_url: string | null
}
```

---

## Related Documentation

- [211 API Integration Specification](211-API-Integration-Spec.md) - Detailed API specifications
- [Database Setup](DATABASE_SETUP.md) - Supabase schema and migrations
- [Deployment Guide](DEPLOYMENT.md) - Production deployment instructions
- [AGENTS.md](../../AGENTS.md) - Development guidelines and conventions
