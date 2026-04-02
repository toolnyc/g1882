---
name: epic
description: Plan a feature from plain English into a structured epic document.
---

# /epic

Plan a feature from a plain English description. Explore the codebase for
related code, then produce a structured plan document.

## Procedure

1. Read the user's description
2. Explore the codebase for related existing code:
   - Relevant collections, components, utilities, routes
   - Similar patterns already implemented
3. Read `ARCHITECTURE.md` and `CLAUDE.md` for context
4. Create `.claude/epics/<slug>.md` with this structure:

```markdown
# Epic: <title>

## Intent
What we're trying to achieve and why.

## Current State
What exists today (from codebase exploration).

## Delta
What needs to change or be added.

## Data Model
Any collection/field changes needed.

## UI Breakdown
Components to create or modify.

## Acceptance Criteria
- [ ] Specific, testable criteria

## Known Risks
- Anything that might go wrong

## Sub-tasks
Ordered list of discrete implementation steps. Each should be completable
independently and verifiable in isolation.

1. [ ] Sub-task description (files: list of files)
2. [ ] ...

## Progress
Updated by implementing agents as sub-tasks complete. Enables resume after
session drops.

| Sub-task | Status | Agent / Commit |
|----------|--------|----------------|
| 1        | pending | — |
```

5. Present the plan to the user for confirmation

## Notes

- This skill is **optional** — not required before writing code
- Useful for larger features that span multiple files
- The epic document is git-tracked project history

## Agent Resilience

When epics are implemented by spawned agents:
- Agents should update the **Progress** table as they complete sub-tasks
- Prompts should be **idempotent** — agents check if work exists before creating
- Each sub-task should be scoped small enough to survive a session drop
- If an agent fails mid-task, re-launch it with the same epic doc — it reads Progress to resume
