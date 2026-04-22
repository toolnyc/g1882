# g1882 — Post-Retrofit Session

Project path: /Users/pete/Code/g1882/g1882
Stack: docker, nextjs, playwright, react, tailwind, vercel, vitest

## Context

This project was just onboarded to the agent brain via `wizard retrofit`.
The brain is wired — CLAUDE.md, domain knowledge, review hook, skills are
all in place. Now it's time to do the actual work.

## What you know

**Purpose:** Gallery 1882 web presence (events, exhibitions, artist management).
**Audience:** Non-technical gallery staff.
**Business context:** The site needs to be self-sufficient for staff. Duplicated editing fields and unclear content locations are the current primary blockers.
**Technical context:** Payload CMS 3 (Embedded) with MongoDB and Vercel Blob. Stability of the admin panel is mission-critical given past issues with blank create pages.

## Known risks
- Regression of existing business logic (e.g., `isActive` hook)
- Admin UI bloat if not carefully organized
- Sync issues between `preview` and `prod` databases

## Scope of work
- Stabilize caching layer (`unstable_cache`) to ensure cache tags are reliable. Audit `layout.tsx` and data fetching to eliminate double-load hydration loops.
- Establish a test harness focused on critical UI paths (CMS changes reflecting on frontend). Replace shallow tests with high-value integration tests.
- Refactor CMS dashboard for the client. Move all hardcoded strings to editable fields. Implement client-friendly draft/preview workflows.
- Configure Sentry/Axiom to alert on cache misses and hydration errors.

## Project-specific conventions
All CMS changes must be validated in `preview`. Always regenerate types (`pnpm generate:types`) after schema modifications. Update `ADMIN-GUIDE.md` whenever the UI logic changes. Follow the `preview` -> `prod` deployment path strictly.

## Your first task

Read the codebase starting with CLAUDE.md and .agent/memory/semantic/DOMAIN_KNOWLEDGE.md,
then ask Pete what to work on first. Do not start making changes without direction.
