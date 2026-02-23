# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project-Specific Gotchas

### Tailwind Semantic Colors
Use semantic color tokens instead of hardcoded values:
- `text-text` / `text-text-muted` for text
- `bg-background` for backgrounds
- Category prefixes: `bg-category-food`, `bg-category-housing`, `bg-category-health`, `bg-category-legal`, `bg-category-employment`, `bg-category-education`

### Category Styling
[`CATEGORY_COLORS`](/components/ResourceCard.tsx:4) exported from `ResourceCard.tsx` is the canonical source for category badge styling. Values: `food`, `housing`, `health`, `legal`, `employment`, `education`.

### Public Categories Filter
[`PUBLIC_CATEGORIES`](/components/ResourceList.tsx:8) in `ResourceList.tsx` filters which categories are displayed in the UI. Resources without these categories are excluded from the list.

### API Mock in Development
[`app/api/resources/route.ts`](/app/api/resources/route.ts:7) returns mock data when `NODE_ENV === 'development'`. This bypasses Supabase for local testing.

### Resource Type - Required `state`
In [`types/resources.ts`](/types/resources.ts:15), `state` is required (`string`), but `city` and `zip` are nullable (`string | null`). Always handle null checks for city/zip.

### Mapbox CSS Required
[`app/globals.css`](/app/globals.css:5) must import `mapbox-gl/dist/mapbox-gl.css` for maps to render correctly.

### API Response Format
API returns `{ data: Resource[], count: number }` - see [route.ts](/app/api/resources/route.ts:27) and [useResources.ts](/hooks/useResources.ts:37).

### React Query staleTime
[`hooks/useResources.ts`](/hooks/useResources.ts:44) sets `staleTime: 1000 * 60` (1 minute).

### Verified Filter Behavior
In [route.ts](/app/api/resources/route.ts:42), `?verified=true` filters for verified resources, but `?verified=false` is treated as `undefined` (returns all). Use no `verified` param to get all resources.

### Font Variables
Fonts use CSS variables: `--font-dm-sans` (DM Sans) and `--font-fraunces` (Fraunces). Set via [app/layout.tsx](/app/layout.tsx:7).
