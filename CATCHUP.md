# Movefwd.today Catch-Up

Last updated: 2026-03-01 (America/Los_Angeles)

## Initialization Status

- Git repo already initialized (`.git` present).
- Dependencies installed with `npm install` (606 packages).
- `node_modules` now present.

## Project Snapshot

- Stack: Next.js 14 + TypeScript + Tailwind + Supabase + React Query + Mapbox.
- Core MVP is implemented (resource API, list/map UI, filters, cards, map view).
- Current progress docs indicate MVP is mostly complete and ready for environment setup + testing.

## Run Locally

1. Copy env template:
   - `cp .env.example .env.local`
2. Add required values in `.env.local`:
   - Supabase URL/key
   - `NEXT_PUBLIC_MAPBOX_TOKEN`
3. Start dev server:
   - `npm run dev`
4. Build/test checks:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run test:run`

## Important Repo Gotchas

- Use semantic Tailwind tokens (`text-text`, `text-text-muted`, `bg-background`) instead of hardcoded colors.
- Category badge styling source of truth: `CATEGORY_COLORS` in `components/ResourceCard.tsx`.
- UI category visibility is filtered by `PUBLIC_CATEGORIES` in `components/ResourceList.tsx`.
- In development, `app/api/resources/route.ts` returns mock resources when `NODE_ENV === "development"`.
- API response shape is `{ data: Resource[], count: number }`.
- `state` is required on `Resource`; `city` and `zip` can be `null`.
- `?verified=true` filters verified only; `?verified=false` behaves like no filter.
- Map rendering requires `mapbox-gl/dist/mapbox-gl.css` import in `app/globals.css`.

## Suggested Next Actions

1. Configure `.env.local` and run `npm run dev`.
2. Verify list/map toggle, search, category filters, and city filters.
3. Confirm database migrations + seed data if switching from mock to live Supabase.
4. Prioritize next feature from backlog:
   - Resource detail page (`/resources/[id]`)
   - Favorites
   - Mobile map/list polish

