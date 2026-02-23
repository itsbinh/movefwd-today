---
title: Architecture Decision Records
created: 2026-02-23
modified: 2026-02-23
tags: [adr, decisions, architecture]
type: documentation
status: active
---

# Architecture Decision Records

This document tracks significant architectural decisions made during the development of Movefwd.today. Each decision follows the [Architecture Decision Record (ADR)](https://adr.github.io/) format.

## What is an ADR?

An Architecture Decision Record (ADR) captures important architectural decisions along with their context and consequences. Each ADR:

- Describes the context and problem
- States the decision made
- Explains the consequences
- Lists alternatives considered
- Provides references to related documents

## ADR Index

| ADR       | Title     | Status                                         | Date     |
| --------- | --------- | ---------------------------------------------- | -------- | ---------- |
| [[ADR-001 | ADR-001]] | Choose Next.js 14 with App Router              | Accepted | 2026-02-23 |
| [[ADR-002 | ADR-002]] | Use Supabase for Database and Auth             | Accepted | 2026-02-23 |
| [[ADR-003 | ADR-003]] | Use Mapbox GL JS for Mapping                   | Accepted | 2026-02-23 |
| [[ADR-004 | ADR-004]] | Use Tailwind CSS for Styling                   | Accepted | 2026-02-23 |
| [[ADR-005 | ADR-005]] | Use React Query + Zustand for State Management | Accepted | 2026-02-23 |
| [[ADR-006 | ADR-006]] | Deploy with Docker + Coolify                   | Accepted | 2026-02-23 |

---

## ADR-001: Choose Next.js 14 with App Router

**Status:** ✅ Accepted
**Date:** 2026-02-23
**Deciders:** binh
**Related:** [[01-Architecture/stack]], [[RESUME.md]]

### Context

We need a modern React framework for building the Movefwd.today web application. The framework should support:

- Server-side rendering for SEO
- API routes for backend functionality
- Optimized production builds
- Good developer experience
- Strong community support

### Decision

Use **Next.js 14 with App Router** instead of alternatives like Create React App, Vite, or Remix.

### Consequences

#### Positive

- **Server Components by Default** - Reduces client-side JavaScript, improves performance
- **Built-in API Routes** - Eliminates need for separate backend server
- **Optimized Production Builds** - Automatic code splitting, image optimization
- **SEO-Friendly** - Server-side rendering for better discoverability
- **Future-Proof** - Active development, strong community support
- **File-based Routing** - Intuitive routing structure

#### Negative

- **Learning Curve** - App Router patterns differ from traditional React
- **Smaller Ecosystem** - Compared to traditional React (but growing fast)
- **Opinionated** - Must follow Next.js conventions

### Alternatives Considered

| Alternative      | Pros                    | Cons                        | Why Rejected                 |
| ---------------- | ----------------------- | --------------------------- | ---------------------------- |
| Create React App | Simple, well-known      | No SSR, outdated            | Too basic for our needs      |
| Vite             | Fast DX, flexible       | Requires more setup for SSR | More configuration needed    |
| Remix            | Excellent DX, SSR       | Steeper learning curve      | Overkill for MVP             |
| Gatsby           | Great for content sites | Build-time only             | Not suitable for dynamic app |

### References

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [[01-Architecture/stack|Tech Stack]]
- [[RESUME.md|Technical Resume]]

---

## ADR-002: Use Supabase for Database and Auth

**Status:** ✅ Accepted
**Date:** 2026-02-23
**Deciders:** binh
**Related:** [[01-Architecture/DATABASE_SCHEMA]], [[03-Deployment/DATABASE_SETUP]]

### Context

We need a database solution that supports:

- Relational data model
- Authentication and authorization
- Real-time capabilities
- Row-level security
- Self-hosting option

### Decision

Use **Supabase (self-hosted PostgreSQL)** instead of Firebase, MongoDB, or traditional PostgreSQL.

### Consequences

#### Positive

- **PostgreSQL Foundation** - Relational data model with complex queries
- **Built-in Authentication** - Ready-to-use auth system for Phase 3
- **Row Level Security (RLS)** - Database-level security policies
- **Real-time Capabilities** - WebSocket support for future features
- **Self-Hosting Option** - Data sovereignty and cost control
- **TypeScript Support** - Type-safe database queries

#### Negative

- **PostgreSQL Knowledge Required** - Team needs SQL skills
- **Self-Hosting Complexity** - Adds operational overhead
- **Smaller Ecosystem** - Compared to Firebase

### Alternatives Considered

| Alternative            | Pros                  | Cons                       | Why Rejected         |
| ---------------------- | --------------------- | -------------------------- | -------------------- |
| Firebase               | Easy setup, real-time | NoSQL, vendor lock-in      | Not relational       |
| MongoDB                | Flexible schema       | NoSQL, different model     | Not relational       |
| Traditional PostgreSQL | Full control          | No built-in auth/real-time | More setup needed    |
| Prisma + PostgreSQL    | Type-safe, great DX   | Additional layer           | Supabase includes it |

### References

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [[01-Architecture/DATABASE_SCHEMA|Database Schema]]
- [[03-Deployment/DATABASE_SETUP|Database Setup]]

---

## ADR-003: Use Mapbox GL JS for Mapping

**Status:** ✅ Accepted
**Date:** 2026-02-23
**Deciders:** binh
**Related:** [[01-Architecture/stack]], [[RESUME.md]]

### Context

We need a mapping solution that provides:

- Interactive maps with markers
- Custom styling
- Good performance
- Generous free tier
- React integration

### Decision

Use **Mapbox GL JS** over Google Maps, Leaflet, or OpenStreetMap.

### Consequences

#### Positive

- **Highly Customizable** - Full control over map styling and markers
- **Generous Free Tier** - 25,000 loads/month (vs Google's $200 credit)
- **Performance** - WebGL-based rendering, smooth interactions
- **React Integration** - react-map-gl provides clean React wrapper
- **Beautiful Default Styles** - Professional-looking maps out of the box

#### Negative

- **Requires API Key** - Must manage access tokens
- **Learning Curve** - Custom styling requires Mapbox GL knowledge
- **Usage Limits** - Free tier has limits (but generous)

### Alternatives Considered

| Alternative   | Pros               | Cons                              | Why Rejected            |
| ------------- | ------------------ | --------------------------------- | ----------------------- |
| Google Maps   | Familiar, reliable | Expensive, less customizable      | Cost concerns           |
| Leaflet       | Free, simple       | Limited customization, older tech | Less modern             |
| OpenStreetMap | Free, open-source  | Limited styling options           | Not customizable enough |

### References

- [Mapbox Documentation](https://docs.mapbox.com/)
- [react-map-gl](https://visgl.github.io/react-map-gl/)
- [[01-Architecture/stack|Tech Stack]]

---

## ADR-004: Use Tailwind CSS for Styling

**Status:** ✅ Accepted
**Date:** 2026-02-23
**Deciders:** binh
**Related:** [[01-Architecture/stack]], [[04-Brand/BRANDING]]

### Context

We need a styling solution that provides:

- Rapid development
- Consistent design system
- Responsive design
- Small bundle size
- Good developer experience

### Decision

Use **Tailwind CSS** over CSS Modules, Styled Components, or Sass.

### Consequences

#### Positive

- **Rapid Development** - No context switching between CSS and JS
- **Consistent Design System** - Enforced through utility classes
- **Small Bundle Size** - PurgeCSS removes unused styles
- **Responsive Design** - Built-in breakpoint utilities
- **Custom Configuration** - Easy to add brand colors and utilities
- **Great DX** - IntelliSense, instant feedback

#### Negative

- **HTML Verbosity** - Utility classes can make HTML verbose
- **Learning Curve** - Need to learn utility classes
- **Initial Setup** - Configuration required for custom theme

### Alternatives Considered

| Alternative       | Pros               | Cons                            | Why Rejected         |
| ----------------- | ------------------ | ------------------------------- | -------------------- |
| CSS Modules       | Scoped, simple     | More files, slower dev          | More boilerplate     |
| Styled Components | Component-scoped   | Larger bundle, runtime overhead | Performance concerns |
| Sass              | Powerful, familiar | More setup, larger bundle       | Slower development   |

### References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [[04-Brand/BRANDING|Brand Kit]]
- [[01-Architecture/stack|Tech Stack]]

---

## ADR-005: Use React Query + Zustand for State Management

**Status:** ✅ Accepted
**Date:** 2026-02-23
**Deciders:** binh
**Related:** [[01-Architecture/stack]], [[RESUME.md]]

### Context

We need a state management solution that handles:

- Server state (API data)
- Client state (UI interactions)
- Caching and synchronization
- TypeScript support
- Minimal boilerplate

### Decision

Use **React Query for server state** and **Zustand for client state** (hybrid approach).

### Consequences

#### Positive

- **Separation of Concerns** - Clear distinction between server and client state
- **React Query Benefits** - Caching, background refetching, optimistic updates
- **Zustand Benefits** - Lightweight, no boilerplate, TypeScript-friendly
- **TypeScript Support** - Excellent type inference
- **Small Bundle** - Both libraries are tree-shakeable

#### Negative

- **Two Libraries** - Need to learn and manage both
- **Concept Overlap** - Some state could be managed by either

### Alternatives Considered

| Alternative | Pros                   | Cons                   | Why Rejected             |
| ----------- | ---------------------- | ---------------------- | ------------------------ |
| Redux       | Mature, ecosystem      | Heavy boilerplate      | Too complex              |
| Context API | Built-in               | No caching, re-renders | Performance issues       |
| SWR         | Similar to React Query | Less features          | React Query more mature  |
| Jotai       | Atomic state           | Less popular           | Zustand more established |

### References

- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [[01-Architecture/stack|Tech Stack]]

---

## ADR-006: Deploy with Docker + Coolify

**Status:** ✅ Accepted
**Date:** 2026-02-23
**Deciders:** binh
**Related:** [[03-Deployment/DEPLOYMENT]], [[03-Deployment/DEPLOYMENT_CHECKLIST]]

### Context

We need a deployment solution that provides:

- Portability across environments
- Self-hosting option
- Easy deployments
- Scalability
- Cost control

### Decision

Use **Docker for containerization** and **Coolify for deployment** (self-hosted PaaS).

### Consequences

#### Positive

- **Portability** - Runs identically across environments
- **Self-Hosting** - No vendor lock-in, cost control
- **Coolify Benefits** - Easy deployments, SSL, monitoring
- **Scalability** - Easy to add load balancers, multiple instances
- **Multi-stage Build** - 70% smaller image size
- **Security** - No build tools in production image

#### Negative

- **Docker Learning Curve** - Need to learn Docker concepts
- **Self-Hosting Overhead** - Manage your own infrastructure
- **Coolify Setup** - Initial setup required

### Alternatives Considered

| Alternative | Pros               | Cons                  | Why Rejected      |
| ----------- | ------------------ | --------------------- | ----------------- |
| Vercel      | Easy, fast         | Vendor lock-in, cost  | Want self-hosting |
| Netlify     | Simple, free       | Limited customization | Want more control |
| AWS ECS     | Scalable, reliable | Complex, expensive    | Overkill for MVP  |
| Manual VPS  | Full control       | Manual deployments    | Too much work     |

### References

- [Docker Documentation](https://docs.docker.com/)
- [Coolify Documentation](https://coolify.io/docs)
- [[03-Deployment/DEPLOYMENT|Deployment Guide]]
- [[03-Deployment/DEPLOYMENT_CHECKLIST|Deployment Checklist]]

---

## Creating New ADRs

To create a new ADR:

1. Copy the ADR template from [[Templates/ADR Template]]
2. Fill in all sections
3. Add to this index
4. Link to related documents
5. Tag with `#adr` and relevant tags

## ADR Status Changes

ADRs can have the following statuses:

- **Proposed** - Under consideration
- **Accepted** - Decision made and implemented
- **Deprecated** - Superseded by a new decision
- **Superseded by** - Replaced by another ADR

When an ADR is deprecated or superseded, update its status and add a link to the new ADR.

---

_Last Updated: 2026-02-23_
