---
title: ADR Template
type: template
tags: [template, adr]
---

# ADR-XXX: <% tp.file.title %>

---

type: adr
status: proposed
tags: [adr, decision]
date: <% tp.date.now("YYYY-MM-DD") %>
deciders: binh
related: [[]]

---

## Context

What is the issue that we're seeing that is motivating this decision or change?

## Decision

What is the change that we're proposing and/or doing?

## Consequences

### Positive

- Benefit 1
- Benefit 2

### Negative

- Drawback 1
- Drawback 2

## Alternatives Considered

| Alternative   | Pros | Cons | Why Rejected |
| ------------- | ---- | ---- | ------------ |
| Alternative 1 | Pro  | Con  | Reason       |
| Alternative 2 | Pro  | Con  | Reason       |

## References

- [[<% tp.file.cursor(1) %>]]
- [External Link](url)

## Status Changes

- **<% tp.date.now("YYYY-MM-DD") %>** - Proposed
- **YYYY-MM-DD** - Accepted/Rejected/Deprecated/Superseded by [[ADR-XXX]]
