# Supabase Free Hosted Setup (Movefwd)

This is the fastest path to run Movefwd against a hosted Supabase Free project.

## 1) Create Free Supabase Project

1. Go to https://supabase.com and create a new project (free tier).
2. Choose a region near your target metro area.
3. Wait for project provisioning.

## 2) Collect Project Credentials

In **Project Settings → API**, copy:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional (server-side admin workflows only):
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

## 3) Configure Environment

Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_MAPBOX_TOKEN=...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Security / admin APIs
ADMIN_API_KEY=replace_with_long_random_value
ENABLE_ADMIN_INGESTION=false
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=120

# Optional shared cache
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## 4) Run SQL Migrations in Supabase SQL Editor

Run these files in order:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_resource_trust_layer.sql`

Then seed sample data:
3. `supabase/seed/001_sample_data.sql`

## 5) Verify Locally

```bash
npm run dev
npm run typecheck
npm run test:run
npm run build
```

Visit:
- `/` for map/list discovery flow
- `/resources/<id>` for canonical detail page

## 6) Optional: Enable Admin Ingestion

If you want to use `/api/scrape`:
1. set `ENABLE_ADMIN_INGESTION=true`
2. send `x-admin-api-key: <ADMIN_API_KEY>` header
3. only allowed hosts are accepted by design for SSRF safety

## Notes

- Free tier is sufficient for MVP and early pilot.
- Move to paid only when query volume, storage, or connection limits require it.
