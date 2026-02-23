# Movefwd.today — Tech Stack

> **Project Tracking:** Markdown files in this workspace
> - See `tasks.md` for active task list
> - See `brand.md` for brand quick ref

## Overview

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 (React) | Web app framework |
| **Styling** | Tailwind CSS | Utility-first styling |
| **Maps** | Mapbox GL JS | Interactive maps |
| **State** | React Query + Zustand | Data & UI state |
| **Backend** | Supabase | Database, Auth, API |
| **Hosting** | Self-hosted (VPS) | Docker deployment |
| **PWA** | next-pwa | Offline support |

---

## Frontend

### Core
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Package Manager:** npm

### UI
- **Styling:** Tailwind CSS
- **Icons:** Phosphor Icons or Heroicons
- **Fonts:** DM Sans + Fraunces (via Google Fonts)

### State & Data
- **Server State:** TanStack Query (React Query)
- **Client State:** Zustand
- **Forms:** React Hook Form + Zod

### Maps
- **Mapbox GL JS** — Customizable, beautiful, good free tier
- **React-Map-GL** — React wrapper for Mapbox

---

## Backend

### Database
- **Supabase (self-hosted)** — PostgreSQL
- **ORM:** Prisma or Supabase JS client

### Authentication
- **Supabase Auth** — Email, phone, social logins

### Storage
- **Supabase Storage** — Images, documents

### Edge Functions
- **Deno** — For custom API endpoints

---

## Infrastructure

### Hosting
- **VPS:** 4CPU/8GB (current)
- **OS:** Ubuntu 22.04
- **Container:** Docker + Docker Compose

### Deployment Options
1. **Coolify** — Self-hosted PaaS (easiest)
2. **Portainer** — Container management
3. **Direct Docker** — Manual

### Domain & DNS
- **Domain:** movefwd.today
- **DNS:** Cloudflare (free CDN + SSL)

---

## Development Tools

### IDE
- **VS Code** — Recommended
- **Extensions:** ESLint, Prettier, Tailwind IntelliSense

### Version Control
- **Git** — Version control
- **GitHub** — Repository hosting
- **GitHub Actions** — CI/CD

### Monitoring
- **Uptime Kuma** — Uptime monitoring
- **Loglevel** — Simple logging

---

## External Services (Optional)

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **Mapbox** | Maps | 25,000 loads/month |
| **Twilio** | SMS | $15 credit |
| **Resend** | Email | 3,000 emails/month |
| **PostHog** | Analytics | 1M events/month |

---

## Project Structure

```
movefwd-today/
├── app/                    # Next.js App Router
│   ├── (routes)/          # Page routes
│   ├── components/        # UI components
│   ├── lib/               # Utilities
│   └── api/               # API routes
├── supabase/
│   ├── migrations/        # DB migrations
│   └── seed/              # Seed data
├── public/                # Static assets
├── docker-compose.yml     # Local dev
└── .env.example           # Environment vars
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Docker + Docker Compose
- Git
- Mapbox API key
- Supabase instance

### Local Development

```bash
# Clone repo
git clone https://github.com/yourusername/movefwd-today.git
cd movefwd-today

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

*Stack defined for Movefwd.today*
