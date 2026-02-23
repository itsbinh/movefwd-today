# Obsidian Integration Guide for Movefwd.today

This guide explains how to use Obsidian for project documentation, knowledge management, and developer onboarding.

---

## What is Obsidian?

Obsidian is a powerful knowledge base that works on top of a local folder of plain text Markdown files. It's perfect for software projects because:

- **Local-first** - All files are in your repo, no vendor lock-in
- **Markdown-based** - Works with Git and standard Markdown tools
- **Linking** - Connect ideas with `[[wiki links]]`
- **Graph View** - Visualize relationships between documents
- **Extensible** - 1000+ community plugins
- **Fast** - Instant search and navigation

---

## Current Obsidian Setup

Your project already has an Obsidian-style workspace with these files:

### Core Documentation

- `AGENTS.md` - Developer guide for AI agents
- `RESUME.md` - Technical implementation documentation
- `BUILD_PROGRESS.md` - Build status and next steps
- `tasks.md` - Active task tracking

### Planning & Strategy

- `PROJECT_PLAN.md` - Business proposal and pitch
- `stack.md` - Tech stack and setup
- `tasks.md` - Task tracker

### Brand & Identity

- `brand.md` - Brand quick reference
- `BRANDING.md` - Full brand kit
- `IDENTITY.md` - Project identity
- `SOUL.md` - Project philosophy

### Deployment & Operations

- `DEPLOYMENT.md` - Coolify deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Deployment checklist
- `DATABASE_SETUP.md` - Database setup instructions

### Development

- `BOOTSTRAP.md` - Project bootstrap
- `TOOLS.md` - Development tools
- `USER.md` - User documentation

---

## Enhanced Obsidian Structure

Let's reorganize and enhance the documentation with Obsidian features:

### Directory Structure

```
movefwd-today/
├── docs/                           # Obsidian vault root
│   ├── 00-Overview/                # Project overview
│   │   ├── README.md
│   │   ├── PROJECT_PLAN.md
│   │   └── ROADMAP.md
│   │
│   ├── 01-Architecture/            # Technical architecture
│   │   ├── stack.md
│   │   ├── DATABASE_SCHEMA.md
│   │   ├── API_REFERENCE.md
│   │   └── COMPONENTS.md
│   │
│   ├── 02-Development/             # Development guides
│   │   ├── AGENTS.md
│   │   ├── CODING_STANDARDS.md
│   │   ├── TESTING.md
│   │   └── DEBUGGING.md
│   │
│   ├── 03-Deployment/              # Deployment & ops
│   │   ├── DEPLOYMENT.md
│   │   ├── DEPLOYMENT_CHECKLIST.md
│   │   ├── MONITORING.md
│   │   └── BACKUP_RECOVERY.md
│   │
│   ├── 04-Brand/                   # Brand & design
│   │   ├── brand.md
│   │   ├── BRANDING.md
│   │   ├── IDENTITY.md
│   │   └── SOUL.md
│   │
│   ├── 05-Tasks/                   # Task tracking
│   │   ├── tasks.md
│   │   ├── SPRINTS.md
│   │   └── BACKLOG.md
│   │
│   ├── 06-Knowledge/               # Knowledge base
│   │   ├── DECISIONS.md            # Architecture Decision Records
│   │   ├── LESSONS_LEARNED.md
│   │   ├── TROUBLESHOOTING.md
│   │   └── FAQ.md
│   │
│   ├── 07-Portfolio/               # Portfolio materials
│   │   ├── RESUME.md
│   │   ├── CASE_STUDY.md
│   │   └── DEMO.md
│   │
│   ├── Templates/                  # Obsidian templates
│   │   ├── Task Template.md
│   │   ├── ADR Template.md
│   │   └── Meeting Notes.md
│   │
│   ├── Daily Notes/                # Daily work logs
│   │   ├── 2026-02-23.md
│   │   └── ...
│   │
│   └── .obsidian/                  # Obsidian config
│       ├── vault.json
│       ├── graph.json
│       └── plugins/
```

---

## Obsidian Features to Implement

### 1. Wiki Links

Connect related documents using `[[link]]` syntax:

```markdown
# In tasks.md

See [[stack.md]] for tech stack details.
Refer to [[DEPLOYMENT.md]] for deployment instructions.
Architecture decisions are documented in [[DECISIONS.md]].
```

### 2. Tags

Add tags for better organization:

```markdown
---
tags: [architecture, database, postgresql]
---

# Database Schema

This document describes the #database schema for #movefwd-today.
```

### 3. YAML Frontmatter

Add metadata to documents:

```markdown
---
title: Database Schema
created: 2026-02-23
modified: 2026-02-23
tags: [architecture, database, postgresql]
status: complete
related: [stack.md, API_REFERENCE.md]
---

# Database Schema
```

### 4. Backlinks

Obsidian automatically tracks which documents link to each other. Enable this in settings.

### 5. Graph View

Visualize relationships between all documents. Enable in settings (View → Graph View).

### 6. Properties

Use Obsidian Properties (YAML frontmatter) for structured metadata:

```markdown
---
type: documentation
category: architecture
priority: high
status: complete
author: binh
---
```

---

## Recommended Obsidian Plugins

### Essential Plugins

1. **Dataview** - Query and display data from your notes

   ````markdown
   ```dataview
   TABLE status, priority
   FROM #task
   WHERE status = "in-progress"
   SORT priority DESC
   ```
   ````

   ```

   ```

2. **Templater** - Powerful template system
   - Create templates for tasks, ADRs, meeting notes
   - Insert dates, times, and dynamic content

3. **Calendar** - Visual calendar for daily notes
   - Click dates to create/view daily notes
   - Track work over time

4. **Kanban** - Task boards
   - Create Kanban boards from tasks
   - Drag and drop task management

5. **Excalidraw** - Diagrams and sketches
   - Draw architecture diagrams
   - Create flowcharts and wireframes

6. **Advanced Tables** - Better table editing
   - Sort, filter, and format tables
   - Excel-like editing experience

7. **Obsidian Git** - Git integration
   - Commit, push, pull from within Obsidian
   - View diff and history

8. **Tag Wrangler** - Tag management
   - Rename, merge, and organize tags
   - Bulk tag operations

9. **Homepage** - Set a landing page
   - Open to a specific document
   - Quick navigation hub

10. **Hotkeys for specific plugins** - Custom shortcuts
    - Speed up common tasks
    - Personalize workflow

---

## Implementation Steps

### Step 1: Set Up Obsidian Vault

1. Install Obsidian: https://obsidian.md/download
2. Open your project folder as a vault
3. Enable core features:
   - Settings → Files & Links → Use `[[wikilinks]]`
   - Settings → Files & Links → Detect all file extensions
   - Settings → Graph View → Enable

### Step 2: Organize Documentation

```bash
# Create directory structure
mkdir -p docs/{00-Overview,01-Architecture,02-Development,03-Deployment,04-Brand,05-Tasks,06-Knowledge,07-Portfolio,Templates,Daily Notes}

# Move existing files
mv AGENTS.md docs/02-Development/
mv RESUME.md docs/07-Portfolio/
mv BUILD_PROGRESS.md docs/00-Overview/
mv tasks.md docs/05-Tasks/
mv stack.md docs/01-Architecture/
mv DEPLOYMENT.md docs/03-Deployment/
mv DEPLOYMENT_CHECKLIST.md docs/03-Deployment/
mv DATABASE_SETUP.md docs/03-Deployment/
mv brand.md docs/04-Brand/
mv BRANDING.md docs/04-Brand/
mv IDENTITY.md docs/04-Brand/
mv SOUL.md docs/04-Brand/
```

### Step 3: Add Wiki Links

Update documents to link to each other:

```markdown
# In docs/00-Overview/README.md

Welcome to Movefwd.today documentation.

## Quick Links

- [[01-Architecture/stack|Tech Stack]]
- [[05-Tasks/tasks|Task Tracker]]
- [[02-Development/AGENTS|Developer Guide]]
- [[03-Deployment/DEPLOYMENT|Deployment Guide]]
- [[07-Portfolio/RESUME|Technical Resume]]

## Getting Started

1. Read the [[PROJECT_PLAN.md]]
2. Review the [[01-Architecture/stack|Tech Stack]]
3. Check [[05-Tasks/tasks|Active Tasks]]
4. Follow [[03-Deployment/DEPLOYMENT|Deployment Guide]]
```

### Step 4: Create Templates

Create `docs/Templates/Task Template.md`:

```markdown
---
type: task
status: todo
priority: medium
tags: [task]
created: <% tp.date.now("YYYY-MM-DD") %>
---

# <% tp.file.title %>

## Description

<% tp.system.clipboard() %>

## Acceptance Criteria

- [ ] Criteria 1
- [ ] Criteria 2

## Related

- [[<% tp.file.cursor(1) %>]]

## Notes

<% tp.file.cursor() %>
```

Create `docs/Templates/ADR Template.md`:

```markdown
---
type: adr
status: proposed
tags: [adr, decision]
date: <% tp.date.now("YYYY-MM-DD") %>
---

# ADR: <% tp.file.title %>

## Context

What is the issue that we're seeing that is motivating this decision or change?

## Decision

What is the change that we're proposing and/or doing?

## Consequences

What becomes easier or more difficult to do because of this change?

## Alternatives

What other approaches did you consider, and why did you reject them?

## References

- [[<% tp.file.cursor(1) %>]]
```

### Step 5: Set Up Daily Notes

1. Install Calendar plugin
2. Configure daily notes folder: `docs/Daily Notes`
3. Create template for daily notes:

```markdown
---
date: <% tp.date.now("YYYY-MM-DD") %>
tags: [daily-note]
---

# <% tp.date.now("YYYY-MM-DD") %>

## Goals

- [ ] Goal 1
- [ ] Goal 2

## Work Done

-

## Blockers

-

## Notes

-

## Tomorrow

-
```

### Step 6: Create Architecture Decision Records (ADRs)

Create `docs/06-Knowledge/DECISIONS.md`:

```markdown
---
type: documentation
tags: [adr, decisions]
---

# Architecture Decision Records

This document tracks significant architectural decisions.

## ADR-001: Choose Next.js 14 with App Router

**Status:** Accepted
**Date:** 2026-02-23
**Deciders:** binh

### Context

Need a modern React framework for building the Movefwd.today web application.

### Decision

Use Next.js 14 with App Router instead of alternatives like Create React App, Vite, or Remix.

### Consequences

**Positive:**

- Server Components by default reduce client-side JavaScript
- Built-in API routes eliminate need for separate backend
- Optimized production builds with automatic code splitting
- SEO-friendly with server-side rendering

**Negative:**

- Learning curve for App Router patterns
- Smaller ecosystem compared to traditional React

### Alternatives Considered

- **Create React App:** Too basic, no server-side rendering
- **Vite:** Great DX but requires more setup for SSR
- **Remix:** Excellent but steeper learning curve

### References

- [[01-Architecture/stack]]
- [[RESUME.md]]

---

## ADR-002: Use Supabase for Database and Auth

**Status:** Accepted
**Date:** 2026-02-23
**Deciders:** binh

### Context

Need a database solution that supports relational data, authentication, and real-time features.

### Decision

Use Supabase (self-hosted PostgreSQL) instead of Firebase, MongoDB, or traditional PostgreSQL.

### Consequences

**Positive:**

- PostgreSQL foundation with complex queries
- Built-in authentication for Phase 3
- Row Level Security (RLS) for database-level security
- Real-time capabilities via WebSockets
- Self-hosting option for data sovereignty

**Negative:**

- Requires PostgreSQL knowledge
- Self-hosting adds operational complexity

### Alternatives Considered

- **Firebase:** NoSQL, less suitable for relational data
- **MongoDB:** NoSQL, different data model
- **Traditional PostgreSQL:** No built-in auth or real-time

### References

- [[01-Architecture/DATABASE_SCHEMA]]
- [[03-Deployment/DATABASE_SETUP]]

---

_Add new ADRs using the ADR Template_
```

### Step 7: Create Kanban Board

Install Kanban plugin and create `docs/05-Tasks/BOARD.md`:

```markdown
---
kanban-plugin: basic
---

## To Do

- [ ] Run database migrations
- [ ] Configure Mapbox token
- [ ] Test full application flow
- [ ] Create resource detail page

## In Progress

- [ ] Add favorites feature
- [ ] Implement user authentication

## Done

- [x] Set up Next.js project
- [x] Create database schema
- [x] Build API endpoints
- [x] Create UI components
- [x] Deploy to production

## Blocked

- [ ] Mobile app (waiting for Phase 5)
```

### Step 8: Create Knowledge Base

Create `docs/06-Knowledge/LESSONS_LEARNED.md`:

```markdown
---
type: documentation
tags: [knowledge, lessons]
---

# Lessons Learned

## Technical

### Database Schema Design

**Lesson:** Start with a clear database schema before building features.

**Context:** Initially considered building features first, but realized the schema guides the entire architecture.

**Outcome:** Designed 4-table schema with proper relationships and indexes upfront.

**Tags:** #database #architecture

---

### TypeScript Type Safety

**Lesson:** TypeScript catches errors early and improves developer velocity.

**Context:** Used TypeScript throughout the project with strict mode enabled.

**Outcome:** Zero runtime type errors, better IDE support, self-documenting code.

**Tags:** #typescript #quality

---

## Process

### Iterative Development

**Lesson:** Ship features incrementally rather than all at once.

**Context:** Built MVP in phases: foundation → database → API → UI → deployment.

**Outcome:** Faster feedback loop, easier debugging, continuous progress.

**Tags:** #process #agile

---

### Documentation Matters

**Lesson:** Good documentation speeds up future development.

**Context:** Created AGENTS.md, BUILD_PROGRESS.md, and RESUME.md during development.

**Outcome:** Clear onboarding guide, portfolio materials, architectural decisions documented.

**Tags:** #documentation #knowledge

---

## Architecture

### Choose Boring Technology

**Lesson:** Proven stacks reduce risk and speed up development.

**Context:** Used Next.js, PostgreSQL, Tailwind CSS - all well-established technologies.

**Outcome:** Fast development, abundant resources, fewer surprises.

**Tags:** #architecture #decisions

---

### Security by Design

**Lesson:** Implement security from the start, not as an afterthought.

**Context:** Used RLS policies, environment variables, and input validation from day one.

**Outcome:** Secure by default, no security debt.

**Tags:** #security #architecture

---

_Add new lessons as you learn them_
```

### Step 9: Create Graph View Configuration

Create `.obsidian/graph.json`:

```json
{
  "local": {
    "attach": false,
    "drag": true,
    "fade": false,
    "focus": 0,
    "highlight": true,
    "minNodeSize": 5,
    "maxNodeSize": 30,
    "nodeSize": 20,
    "linkDistance": 100,
    "linkOpacity": 0.4,
    "linkShape": "directed",
    "showArrow": true,
    "showTags": true,
    "showAttachments": false,
    "showOrphans": true,
    "groups": [
      {
        "id": "architecture",
        "color": "#E76F51"
      },
      {
        "id": "development",
        "color": "#2A9D8F"
      },
      {
        "id": "deployment",
        "color": "#4CAF50"
      },
      {
        "id": "brand",
        "color": "#7E57C2"
      },
      {
        "id": "tasks",
        "color": "#FF9800"
      }
    ]
  }
}
```

---

## Benefits of Obsidian Integration

### For Development

1. **Faster Navigation** - Wiki links let you jump between related documents instantly
2. **Better Context** - Graph view shows relationships between all documentation
3. **Knowledge Retention** - Daily notes capture decisions and lessons learned
4. **Task Management** - Kanban boards and Dataview queries track progress
5. **Visual Documentation** - Excalidraw diagrams for architecture and flows

### For Onboarding

1. **Clear Structure** - Organized docs make it easy for new developers to find information
2. **Connected Knowledge** - Wiki links show relationships between concepts
3. **Living Documentation** - Daily notes keep docs up to date
4. **Decision History** - ADRs explain why decisions were made

### For Portfolio

1. **Comprehensive Documentation** - Shows attention to detail
2. **Process Visibility** - Daily notes and ADRs show your workflow
3. **Knowledge Management** - Demonstrates organizational skills
4. **Visual Storytelling** - Graph view and diagrams make complex ideas accessible

---

## Next Steps

1. **Install Obsidian** and open your project as a vault
2. **Reorganize files** into the suggested directory structure
3. **Install recommended plugins** (Dataview, Templater, Calendar, Kanban)
4. **Add wiki links** between related documents
5. **Create templates** for tasks, ADRs, and daily notes
6. **Set up daily notes** to track your work
7. **Create ADRs** for major architectural decisions
8. **Build a Kanban board** for task management
9. **Use the graph view** to visualize documentation relationships
10. **Publish to Obsidian Publish** (optional) for sharing

---

## Resources

- [Obsidian Documentation](https://help.obsidian.md/)
- [Obsidian Plugins](https://obsidian.md/plugins)
- [Obsidian Publish](https://obsidian.md/publish)
- [Markdown Guide](https://www.markdownguide.org/)
- [Architecture Decision Records](https://adr.github.io/)

---

_Last Updated: February 23, 2026_
