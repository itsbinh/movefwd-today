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

### Testing (Vitest)

```bash
npm test             # Run all tests (watch mode)
npm run test:run     # Run tests once (no watch)
npm test -- path/to/test.test.tsx    # Single test file
npm test -- -t "pattern"             # Tests matching name pattern
npm test -- --coverage               # With coverage
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

- Always type function parameters and return values.
- Use explicit types over inference for props and API responses.
- Avoid `any`. Use `unknown` if type is truly uncertain, then narrow with type guards.
- Strict mode enabled in tsconfig.json.

### React & Next.js

- **Use Server Components by default** — add `'use client'` only when needed (hooks, event handlers, browser APIs).
- **File naming:** Components: `ResourceCard.tsx` (PascalCase), Hooks: `useResources.ts` (camelCase, `use` prefix), Utils: `formatAddress.ts` (camelCase), Types: `resources.ts` (plural).
- **Colocate** component, test, and styles in same directory.
- **Use React Query for server state**, Zustand for client state.

### Imports

- **Order:** External libs → Internal components/hooks → Utils/types → Styles (last).
- **Use path aliases (`@/`)** for project imports, not relative paths beyond one level.
- Path alias `@/*` points to project root.

### Tailwind CSS

- Use utility classes — avoid custom CSS unless unavoidable.
- Extract repeated patterns to components.
- Use semantic colors from `tailwind.config.ts` (primary, secondary, category colors).
- Avoid hardcoded hex values.

### Naming Conventions

| Type                | Convention               | Example             |
| ------------------- | ------------------------ | ------------------- |
| Components          | PascalCase               | `ResourceMap`       |
| Hooks               | camelCase + `use` prefix | `useResourceSearch` |
| Functions           | camelCase, verb-first    | `fetchResources()`  |
| Types/Interfaces    | PascalCase, descriptive  | `Resource`          |
| Constants           | SCREAMING_SNAKE          | `MAX_RESULTS`       |
| Files (components)  | PascalCase               | `ResourceCard.tsx`  |
| Files (utils/hooks) | camelCase                | `formatAddress.ts`  |

### Error Handling

- Use error boundaries for component failures.
- Return typed errors from API functions with proper status checks.
- Show user-friendly errors — don't expose raw error messages.

### Database (Supabase)

- Use typed Supabase clients — never raw SQL in frontend code.
- Row Level Security (RLS) is mandatory — all tables must have policies.
- Migrations only — never modify schema directly in production.

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

| Task            | Command                            |
| --------------- | ---------------------------------- |
| Run dev server  | `npm run dev`                      |
| Run single test | `npm test -- path/to/test.test.ts` |
| Lint            | `npm run lint`                     |
| Type check      | `npm run typecheck`                |
| Reset DB        | `npx supabase db reset`            |

---

_Last updated: 2026-02-23_
