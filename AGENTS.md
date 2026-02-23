# AGENTS.md - Movefwd.today Developer Guide

> This file provides context for AI agents working on the Movefwd.today codebase.
> See `stack.md` for tech stack details and `tasks.md` for active work.

## Build, Lint & Test Commands

### Development
```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run start        # Start production server
```

### Testing
```bash
npm test             # Run all tests (Vitest)
npm test -- --run   # Run tests once (no watch mode)

# Single test file
npm test -- src/components/Map.test.tsx

# Single test (by name pattern)
npm test -- -t "renders correctly"

# With coverage
npm test -- --coverage
```

### Linting & Formatting
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix auto-fixable issues
npm run format       # Format with Prettier
npm run typecheck    # TypeScript type checking
```

### Database (Supabase)
```bash
npx supabase start        # Start local Supabase
npx supabase db reset     # Reset local DB
npx supabase db push      # Push schema changes
npx supabase migration new <name>  # Create migration
```

---

## Code Style Guidelines

### General Principles
- **Be concise.** No verbose comments, no unnecessary abstractions.
- **Fail fast.** Use TypeScript strictly — avoid `any`.
- **Component-first.** Keep components small, focused, and co-located with their tests.

### TypeScript
- **Always type function parameters and return values:**
  ```typescript
  // Good
  function getResourceById(id: string): Promise<Resource | null>
  
  // Avoid
  function getResourceById(id) { ... }
  ```

- **Use explicit types over inference for props and API responses:**
  ```typescript
  interface ResourceCardProps {
    resource: Resource;
    onSelect: (id: string) => void;
  }
  ```

- **Avoid `any`.** Use `unknown` if type is truly uncertain, then narrow with type guards.

### React & Next.js
- **Use Server Components by default** — add `'use client'` only when needed (hooks, event handlers, browser APIs).

- **File naming:**
  - Components: `ResourceCard.tsx` (PascalCase)
  - Hooks: `useResources.ts` (camelCase, prefix `use`)
  - Utils: `formatAddress.ts` (camelCase)
  - Types: `resources.ts` (plural, descriptive)

- **Colocate** component, test, and styles:
  ```
  components/
  ├── ResourceCard/
  │   ├── ResourceCard.tsx
  │   ├── ResourceCard.test.tsx
  │   └── index.ts
  ```

- **Use React Query for server state**, Zustand for client state:
  ```typescript
  // Server state
  const { data, isLoading } = useQuery({ queryKey: ['resources'], queryFn: fetchResources })
  
  // Client state
  const useMapStore = create<MapState>((set) => ({ center: null, setCenter: ... }))
  ```

### Imports
- **Order imports consistently:**
  1. External libs (React, Next, TanStack)
  2. Internal components/hooks
  3. Utils/types
  4. Styles (last)

  ```typescript
  import { useState } from 'react'
  import Link from 'next/link'
  import { useQuery } from '@tanstack/react-query'
  
  import { ResourceCard } from '@/components/ResourceCard'
  import { useResources } from '@/hooks/useResources'
  import { formatAddress } from '@/lib/utils'
  import type { Resource } from '@/types'
  ```

- **Use path aliases (`@/`)** for project imports, not relative paths beyond one level.

### Tailwind CSS
- **Use utility classes — avoid custom CSS** unless unavoidable.
- **Extract repeated patterns to components:**
  ```tsx
  // Instead of repeating classes
  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  
  // Create a Card component
  <Card>...</Card>
  ```

- **Keep responsive classes readable:**
  ```tsx
  <div className="
    grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
    gap-4 px-4 py-8
  ">
  ```

- **Use semantic colors from `tailwind.config.ts`** — avoid hardcoded hex values.

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ResourceMap` |
| Hooks | camelCase + `use` prefix | `useResourceSearch` |
| Functions | camelCase, verb-first | `fetchResources()` |
| Types/Interfaces | PascalCase, descriptive | `Resource` |
| Constants | SCREAMING_SNAKE | `MAX_RESULTS` |
| Files (components) | PascalCase | `ResourceCard.tsx` |
| Files (utils/hooks) | camelCase | `formatAddress.ts` |

### Error Handling
- **Use error boundaries** for component failures.
- **Return typed errors from API functions:**
  ```typescript
  async function fetchResource(id: string): Promise<Resource> {
    const res = await fetch(`/api/resources/${id}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`)
    }
    return res.json()
  }
  ```

- **Show user-friendly errors** — don't expose raw error messages:
  ```tsx
  try {
    await deleteResource(id)
  } catch (err) {
    toast.error('Unable to delete resource. Please try again.')
  }
  ```

### Database (Supabase)
- **Use Prisma or typed Supabase clients** — never raw SQL in frontend code.
- **Row Level Security (RLS) is mandatory** — all tables must have policies.
- **Migrations only** — never modify schema directly in production.

---

## Project Structure

```
movefwd-today/
├── app/                    # Next.js App Router
│   ├── (routes)/          # Page routes
│   ├── components/        # Shared UI components
│   ├── lib/               # Utilities, clients
│   └── api/               # API routes
├── components/            # Feature components (colocated)
├── hooks/                 # Custom React hooks
├── lib/                   # Supabase client, utils
├── types/                 # TypeScript types
├── supabase/
│   ├── migrations/       # DB migrations
│   └── seed/             # Seed data
└── public/               # Static assets
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Run dev server | `npm run dev` |
| Run single test | `npm test -- path/to/test.test.ts` |
| Lint | `npm run lint` |
| Type check | `npm run typecheck` |
| Reset DB | `npx supabase db reset` |

---

*Last updated: 2026-02-23*
