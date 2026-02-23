---
title: Task Template
type: template
tags: [template, task]
---

# TASK-XXX: <% tp.file.title %>

---

type: task
status: todo
priority: medium
tags: [task]
created: <% tp.date.now("YYYY-MM-DD") %>
assignee: binh
sprint: Sprint X

---

## Description

<% tp.system.clipboard() %>

## Acceptance Criteria

- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

## Definition of Done

- [ ] Code is written and follows [[02-Development/CODING_STANDARDS|coding standards]]
- [ ] Tests are written and passing
- [ ] Code is reviewed and approved
- [ ] Documentation is updated
- [ ] Deployed to staging/production

## Related

- [[<% tp.file.cursor(1) %>]]

## Subtasks

- [ ] Subtask 1
- [ ] Subtask 2
- [ ] Subtask 3

## Notes

<% tp.file.cursor() %>

## Time Estimate

- Estimate: X hours
- Actual: X hours

## Blocked By

- [[TASK-XXX]]

## Blocking

- [[TASK-XXX]]
