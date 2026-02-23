# Movefwd.today — Gameplan & Proposal

> **Project Tracking:** See `tasks.md` for active tasks | `stack.md` for tech | `brand.md` for brand

## The Problem

- **Information fragmentation:** Resources (food assistance, housing, legal aid, mental health, job programs) are scattered across government sites, nonprofit directories, and word of mouth.
- **Discovery friction:** People who need help often don't know what they qualify for or how to apply. 211 helplines are overwhelmed and data is often outdated.
- **Barrier to action:** Government sites are confusing, applications are fragmented across different portals, and the process is overwhelming.
- **Community disconnect:** People who want to help (volunteers, donors) have no easy way to connect with verified organizations.

## The Solution

**Movefwd.today** — A user-friendly web app (mobile-first) that maps local resources, guides users through applications, and connects helpers with those in need.

### Core Value Propositions

1. **Unified discovery** — All local resources in one place, searchable by category, location, and eligibility
2. **Simplified access** — Plain-language guides for applying to benefits/programs
3. **Verified, current data** — Crowdsourced + official data with community moderation
4. **Privacy-first matching** — Connect volunteers/donors with needs without exposing vulnerable users
5. **Offline-capable** — Works without internet for those with limited connectivity

---

## Target Users

| Segment | Needs |
|---------|-------|
| **People in need** | Find resources, understand eligibility, apply easily |
| **Case workers / social workers** | Quick reference to refer clients |
| **Volunteers** | Sign up to help, see where needs are |
| **Donors / organizations** | List resources, receive volunteers |
| **Local government / nonprofits** | Outreach tool, data partner |

---

## Feature Roadmap

### Phase 1 — MVP (Weeks 1-4)
- [ ] **Map view** — Interactive map showing resources by category
- [ ] **Resource directory** — List of resources with name, address, phone, website, category
- [ ] **Category filters** — Food, housing, health, legal, employment, education
- [ ] **Basic search** — Search by name or keyword
- [ ] **Resource detail page** — Full info with plain-language "how to apply" guide
- [ ] **Supabase backend** — PostgreSQL database with resource data
- [ ] **Public data import** — Seed with existing open data (census, 211, gov APIs)

### Phase 2 — User Accounts (Weeks 5-8)
- [ ] **User authentication** — Sign up/login (Supabase Auth)
- [ ] **User roles** — Seeker, Volunteer, Organization
- [ ] **Favorites / bookmarks** — Save resources for later
- [ ] **Resource suggestions** — Users can suggest new resources
- [ ] **Basic analytics** — Track popular searches, resource views

### Phase 3 — Community & Matching (Weeks 9-12)
- [ ] **Volunteer signup** — Skills, availability, interests
- [ ] **Organization profiles** — List needs, volunteer opportunities
- [ ] **Anonymous matching** — Connect volunteers to orgs without exposing seeker data
- [ ] **In-app messaging** — Secure chat between volunteers and orgs (optional)
- [ ] **Reputation / verification** — Community ratings, official verification badges

### Phase 4 — Scale & Polish (Weeks 13+)
- [ ] **PWA** — Offline mode, add to home screen, push notifications
- [ ] **SMS integration** — Text-based access for low-tech users (Twilio)
- [ ] **Multi-language support** — Spanish, Vietnamese, other local languages
- [ ] **Admin dashboard** — For nonprofits to manage their listings
- **API for 211 integration** — Data partnership with local 211 systems

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (React) — SSR, SEO, easy deployment
- **Styling:** Tailwind CSS — Fast UI development
- **Maps:** Mapbox GL JS — Beautiful, customizable, generous free tier
- **State:** React Query + Zustand — Client state management
- **PWA:** next-pwa — Service workers for offline support

### Backend
- **Database:** Supabase (self-hosted on your VPS) — PostgreSQL + REST/Realtime
- **Auth:** Supabase Auth — Email, phone, social logins
- **Storage:** Supabase Storage — Images, documents
- **Edge Functions:** Deno/Supabase functions — API endpoints

### Infrastructure
- **Hosting:** Your VPS (4CPU/8GB) — Docker + Coolify or direct
- **CI/CD:** GitHub Actions — Deploy on push
- **Monitoring:** Uptime Kuma + Simple Logs

### Optional / Future
- **SMS:** Twilio — SMS notifications, text-based access
- **Email:** Resend — Transactional emails
- **Analytics:** PostHog (self-hosted) — Product analytics
- **Search:** Meilisearch — Better full-text search

---

## Data Model (Supabase Schema)

### `resources`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Resource name |
| description | text | Brief description |
| category | text[] | Array: food, housing, health, etc. |
| eligibility | text | Who qualifies |
| address | text | Street address |
| city | text | |
| state | text | |
| zip | text | |
| lat/long | decimal | Coordinates |
| phone | text | Contact |
| website | text | Link |
| application_guide | text | How to apply (markdown) |
| verified | boolean | Official verification |
| created_at | timestamp | |

### `users`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Supabase auth user |
| role | text | seeker, volunteer, org |
| name | text | Display name |
| avatar_url | text | Profile image |
| bio | text | About |
| skills | text[] | Volunteer skills |
| created_at | timestamp | |

### `opportunities` (volunteer/donation needs)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | |
| org_id | uuid | FK to users |
| title | text | |
| description | text | |
| type | text | volunteer, donation, both |
| location | text | |
| created_at | timestamp | |

---

## Monetization & Sustainability

### Free Tier
- Basic map + directory for seekers
- Organization listing
- Volunteer matching

### Potential Revenue (Future)
- **Premium organization features** — Analytics, custom branding, priority listing ($29-99/mo)
- **Government contracts** — Data licensing to cities/counties
- **Grants** — SBIR, HUD, local foundation grants for digital equity
- **Referral fees** — Partner with agencies (not ads — keeping it trustworthy)

---

## Pitch to Gov / Nonprofits

> **"Everyone deserves to move forward — to housing, to health, to their next chapter. We're the platform that gets them there."**

### Why they should care:
- **Reduces 211 call volume** — Self-service reduces load on helplines
- **Better outcomes** — Simplified applications mean more people actually get help
- **Data-driven** — See what resources are most searched, identify gaps
- **No cost** — Open source, community-built, can be hosted by the city

---

## Next Steps

1. **Set up VPS** — Install Docker, deploy self-hosted Supabase
2. **Seed data** — Import existing open data (census, 211 exports, local gov data)
3. **Build MVP** — Next.js + Mapbox, basic CRUD for resources
4. **Test with users** — 5-10 real people in need, get feedback
5. **Iterate** — Add features based on feedback
6. **Pitch** — Approach local nonprofits or city with working prototype

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Data gets outdated | Community moderation, orgs can claim/update listings |
| Privacy concerns | Minimal data collection, no sharing of seeker info |
| Scale challenges | Start local, prove model, then expand |
| Sustainability | Grants + premium features for orgs |

---

*Drafted for Binh — Movefwd.today*
