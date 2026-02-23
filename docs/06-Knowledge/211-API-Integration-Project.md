---
title: "211 API Integration & Human Services Search"
date: 2026-02-23
tags: [nextjs, react, typescript, 211-api, human-services, hsds, api-integration]
related-docs:
  - "[[211-API-Integration-Spec]]"
  - "[[Search-Implementation]]"
---

# 211 API Integration & Human Services Search

## Project Overview

This project implements a comprehensive human services resource search system designed to help users find social services, government benefits, and community resources. The system integrates with the Human Services Data Specification (HSDS) open data standard and leverages 211 service databases for authoritative, up-to-date information.

### Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, React Query
- **Backend**: Next.js API Routes (Serverless)
- **Database**: Supabase (PostgreSQL)
- **Maps**: Mapbox GL JS
- **Data Sources**: NYC 311 API (public), extensible for 211 organizations

## Technical Implementation

### API Integration Library (`lib/api/`)

The API integration layer provides a unified interface for fetching human services data from external sources.

#### Base Connector (`lib/api/211Connector.ts`)

The `Base211Connector` class provides foundational functionality for all API connectors:

```typescript
// Key features:
- Rate limiting (requests per day/minute)
- Error handling with exponential backoff
- Phone number normalization
- Abstract methods: fetchServices(), fetchServiceById(), syncAll()
```

#### NYC 311 Connector (`lib/api/nyc311.ts`)

Primary public data source implementation:

```typescript
class NYC311Connector extends Base211Connector {
  // Configurable API key and rate limits
  // Service fetching with filters (search, city, zip, pagination)
  // Full sync capability for bulk data import
}
```

#### Type Definitions (`lib/api/types.ts`)

Core type definitions for the integration:

```typescript
type DataSource = 'local' | 'nyc311' | 'chicago311' | '211la' | 'bayarea211';

interface ApiConfig {
  apiKey: string;
  baseUrl: string;
  rateLimit: {
    perDay: number;
    perMinute: number;
  };
}

interface ExternalService {
  source: DataSource;
  source_id: string;
  name: string;
  description: string;
  // ... HSDS-compliant fields
}
```

#### Caching Layer (`lib/api/cache.ts`)

In-memory cache implementation with:

- **TTL**: 1 hour default
- **Stale-while-revalidate**: Up to 24 hours
- **Automatic cleanup**: Periodic removal of expired entries
- **Pattern-based invalidation**: Clear cache by source or pattern

```typescript
const cache = new ServiceCache({
  ttl: 1000 * 60 * 60, // 1 hour
  maxStale: 1000 * 60 * 60 * 24, // 24 hours
});
```

#### Data Normalization (`lib/api/normalizer.ts`)

Transforms external API responses to our internal `Resource` type:

- Category inference from service name/description
- Phone number formatting (E.164)
- Accessibility information parsing
- HSDS field mapping

### Extended Types (`types/resources.ts`)

Added HSDS-compatible fields to the Resource type:

```typescript
interface Resource {
  // ... existing fields
  source: DataSource;
  source_id: string;
  organization_name: string;
  organization_id: string;
  email: string | null;
  languages: string[];
  interpretation_services: boolean;
  accessibility: string[];
  fees: string | null;
  schedule: string | null;
  service_area: string;
  last_verified_at: string | null;
  data_source_url: string | null;
}

interface ResourcePhone {
  id: string;
  resource_id: string;
  phone_type: PhoneType;
  number: string;
  description: string | null;
}

interface ResourceEligibility {
  id: string;
  resource_id: string;
  eligibility: string;
  description: string | null;
}
```

## Frontend Components

### SearchBar Component (`components/SearchBar.tsx`)

Main search interface with:

- **Text Search**: Search services by name or keyword
- **Location Filters**: 
  - City input
  - State dropdown (all US states)
  - ZIP code input
- **Quick Category Selection**: Pill buttons for each category
- **Submit/Clear Buttons**: Action controls

```tsx
// Usage
import { SearchBar } from '@/components/search';

<SearchBar 
  onSearch={(filters) => console.log(filters)}
  initialValues={{ search: '', city: '', state: 'CA', zip: '' }}
/>
```

### Category Colors

From `components/ResourceCard.tsx`:

```typescript
const CATEGORY_COLORS = {
  food: 'bg-category-food',
  housing: 'bg-category-housing',
  health: 'bg-category-health',
  legal: 'bg-category-legal',
  employment: 'bg-category-employment',
  education: 'bg-category-education',
};
```

### SearchFilters Component (`components/SearchFilters.tsx`)

Expanded filter panel with:

- **Keywords Input**: Full-text search
- **Location Fields**: City, State, ZIP
- **Category Multi-Select**: Toggle buttons with visual feedback
- **Eligibility Checkboxes**: 12 predefined options (seniors, families, veterans, youth, immigrants, etc.)
- **Verified Toggle**: Filter for verified resources only

### ResourceSearch Component (`components/ResourceSearch.tsx`)

Integrated component combining search and results:

```tsx
<ResourceSearch 
  onResults={(resources, count) => console.log(count, resources)}
  onResourceClick={(resource) => navigate(`/resources/${resource.id}`)}
/>
```

### Search Filter Types (`types/search.ts`)

```typescript
interface SearchFilters {
  search: string;
  city: string;
  state: string;
  zip: string;
  categories: Category[];
  eligibility: string[];
  verified: boolean;
}

const ELIGIBILITY_OPTIONS = [
  { value: 'seniors', label: 'Seniors (65+)' },
  { value: 'families', label: 'Families with Children' },
  { value: 'veterans', label: 'Veterans' },
  { value: 'youth', label: 'Youth (18-24)' },
  { value: 'immigrants', label: 'Immigrants/Refugees' },
  { value: 'disabled', label: 'People with Disabilities' },
  { value: 'homeless', label: 'Homeless' },
  { value: 'low-income', label: 'Low Income' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'medicaid', label: 'Medicaid/Medicare' },
  { value: 'snap', label: 'SNAP Benefits' },
  { value: 'general', label: 'General Public' },
];
```

## Backend API Routes

### Search Endpoint (`app/api/resources/route.ts`)

The main API route handles:

1. **Query Parameters**:
   - `search`: Text search query
   - `city`, `state`, `zip`: Location filters
   - `category`: Service category filter
   - `eligibility`: Eligibility requirement filter
   - `verified`: Verified resources only

2. **Response Format**:
```typescript
{
  data: Resource[];
  count: number;
}
```

3. **Error Handling**:
   - Try/catch for all external API calls
   - Fallback to local Supabase data
   - Rate limit exceeded handling

4. **Caching**:
   - Cache key based on query parameters
   - 1-hour TTL
   - Cache invalidation endpoint available

## Key Technical Decisions

### HSDS (Human Services Data Specification)

Chosen as the data standard because:

- **Open Standard**: Freely available specification
- **Comprehensive**: Covers 8 core entities (Service, Organization, Location, Phone, Eligibility, Schedule, ServiceArea, Accessibility)
- **Interoperability**: Enables data sharing between systems
- **Industry Adoption**: Used by 211 organizations nationwide

### API Authentication

- **Public APIs**: NYC 311 (API key required, generous rate limits)
- **Partner APIs**: 211LA, Bay Area 211 (require MOU/partnership)
- **Configuration**: Environment variables for all API keys

```env
NYC311_API_KEY=your_api_key
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Caching Strategy

Implemented in-memory cache with:

- **TTL**: 1 hour (balances freshness with performance)
- **Stale-while-revalidate**: Serve stale data while fetching fresh
- **Per-source invalidation**: Clear specific sources independently

### Rate Limiting

- **NYC 311**: 10,000 requests/day, 100 requests/minute
- **Per-connector tracking**: Each source has independent limits
- **Exponential backoff**: Automatic retry on rate limit

### Database Schema (Supabase)

Using PostgreSQL with:

- **Resources table**: Core service information
- **Resource phones**: Multiple contacts per resource
- **Resource eligibility**: Multiple eligibility criteria
- **Full-text search**: PostgreSQL text search for location

## Challenges Overcome

### 1. Researching Available 211 APIs

**Challenge**: No national 211 API exists; regional 211s require partnerships.

**Solution**: 
- Used NYC 311 as primary public data source
- Designed extensible architecture for future 211 integration
- Documented requirements for partnership APIs

### 2. Data Standardization

**Challenge**: External APIs have different data formats.

**Solution**:
- Created normalization layer (`lib/api/normalizer.ts`)
- Mapped all external fields to HSDS standard
- Handled phone number formatting, accessibility parsing

### 3. Rate Limit Management

**Challenge**: External APIs have strict rate limits.

**Solution**:
- Implemented rate limiting in base connector
- Added caching to reduce API calls
- Built fallback to local data when limits exceeded

### 4. Search Performance

**Challenge**: Large dataset with complex filters.

**Solution**:
- Database indexes on frequently filtered fields
- React Query for client-side caching
- 1-minute staleTime for re-fetch avoidance

## Future Improvements

### Additional 211 API Integrations

- [ ] 211 LA API (requires partnership)
- [ ] 211 Bay Area API (requires partnership)
- [ ] 211 California API
- [ ] State-specific 211 services

### Enhanced Filtering

- [ ] Geographic radius search
- [ ] Availability/schedule filtering
- [ ] Language preference matching
- [ ] Accessibility requirements
- [ ] Cost/sliding scale options

### User Experience

- [ ] Autocomplete for location input
- [ ] Recent searches history
- [ ] Saved searches/favorites
- [ ] Search result clustering on map
- [ ] Accessibility improvements (ARIA)

### Performance

- [ ] Server-side caching (Redis)
- [ ] Database query optimization
- [ ] Pagination for large result sets
- [ ] Lazy loading for map markers

## Related Documentation

- [[211-API-Integration-Spec]] - Technical specification
- [[Search-Implementation]] - Implementation guide
- [[DECISIONS]] - Architecture decision records
- [[AGENTS]] - Developer guidelines
