---
title: Task Tracker
created: 2026-02-23
modified: 2026-02-23
tags: [tasks, tracking, movefwd-today]
type: documentation
status: active
---

# Movefwd.today — Task Tracker

> **Related Documentation:**
>
> - [[00-Overview/README|Project Overview]]
> - [[00-Overview/ROADMAP|Project Roadmap]]
> - [[05-Tasks/BOARD|Kanban Board]]
> - [[05-Tasks/SPRINTS|Sprint Planning]]

## Legend

- [ ] Not started
- 🔄 In progress
- ✅ Done
- ⚠️ Blocked
- 📅 Scheduled

---

## Phase 1: Foundation ✅

### Brand & Planning

- [x] Register movefwd.today domain
- [ ] Register backup domains (movefwd.life, movefwd.app)
- [ ] Claim @movefwdapp on social media
- [ ] Set up hello@movefwd.today email
- [ ] Create logo (hire designer or AI mockup)
- [x] Set up GitHub repo: movefwd-today

### Tech Setup

- [ ] Set up VPS with Docker
- [ ] Deploy self-hosted Supabase
- [x] Set up Next.js project
- [x] Configure Tailwind CSS with brand colors
- [ ] Set up Mapbox account
- [ ] Configure domain DNS

---

## Phase 2: MVP 🔄 (80% Complete)

### Week 1: Data & Backend ✅

- [x] Create Supabase schema (resources, users, opportunities)
- [ ] Seed with sample data (10-20 resources)
- [ ] Set up authentication (Supabase Auth)
- [x] Build API endpoints

### Week 2: Frontend — Map & List ✅

- [x] Implement Mapbox map view
- [x] Create resource list view
- [x] Build category filters
- [x] Add search functionality

### Week 3: Resource Details 🔄

- [ ] Resource detail page
- [ ] "How to apply" guide display
- [x] Contact actions (call, directions, website)
- [ ] Favorites/bookmarks

### Week 4: Polish & Test ⏳

- [x] Mobile responsive design
- [ ] Performance optimization
- [ ] User testing (5-10 people)
- [ ] Bug fixes
- [ ] Deploy to production

---

## Phase 3: User Accounts ⏳ (Weeks 5-8)

- [ ] User profiles (seeker, volunteer, org)
- [ ] User dashboard
- [ ] Resource suggestion form
- [ ] Analytics dashboard (basic)
- [ ] Email notifications

---

## Phase 4: Community ⏳ (Weeks 9-12)

- [ ] Volunteer signup & profiles
- [ ] Organization profiles
- [ ] Opportunity postings
- [ ] Matching system
- [ ] In-app messaging (optional)

---

## Phase 5: Scale ⏳ (Week 13+)

- [ ] PWA (offline mode)
- [ ] SMS integration (Twilio)
- [ ] Multi-language support
- [ ] Admin dashboard
- [ ] 211 API integration

---

## Backlog (Future)

- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Offline maps
- [ ] Government contracts
- [ ] Grant applications

---

## Current Sprint

### Sprint 1: MVP Completion

**Dates:** February 23 - March 1, 2026
**Goal:** Complete MVP features and deploy to production

#### Tasks

- [ ] [[TASK-001|Run database migrations]]
- [ ] [[TASK-002|Seed sample data]]
- [ ] [[TASK-003|Configure Mapbox token]]
- [ ] [[TASK-004|Create resource detail page]]
- [ ] [[TASK-005|Add favorites feature]]
- [ ] [[TASK-006|Performance optimization]]
- [ ] [[TASK-007|User testing]]
- [ ] [[TASK-008|Deploy to production]]

#### Progress

- Completed: 0/8 tasks
- In Progress: 0 tasks
- Blocked: 0 tasks

---

## Task Templates

### Task Template

```markdown
---
type: task
status: todo
priority: medium
tags: [task]
created: 2026-02-23
---

# TASK-XXX: Task Title

## Description

Brief description of the task.

## Acceptance Criteria

- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

## Related

- [[Related Document]]
- [[Related Task]]

## Notes

Additional notes and context.

## Subtasks

- [ ] Subtask 1
- [ ] Subtask 2
```

---

## Quick Stats

```dataview
TABLE status, priority
FROM #task
WHERE !contains(file.path, "Templates")
GROUP BY status
```

---

## Related Documents

- [[05-Tasks/BOARD|Kanban Board]]
- [[05-Tasks/SPRINTS|Sprint Planning]]
- [[05-Tasks/BACKLOG|Product Backlog]]
- [[06-Knowledge/DECISIONS|Architecture Decisions]]

---

_Last Updated: 2026-02-23_
