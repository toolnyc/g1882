@import ../../.agent/conventions.md
@import AGENTS.md

# g1882

Project-specific conventions: All CMS changes must be validated in `preview`. Always regenerate types (`pnpm generate:types`) after schema modifications. Update `ADMIN-GUIDE.md` whenever the UI logic changes. Follow the `preview` -> `prod` deployment path strictly.

## Stack
- Framework: Next.js 15 (App Router)
- Hosting: Vercel
- Cms: Payload CMS 3 (Embedded)
- Styling: Tailwind CSS
- MongoDB
- Vercel Blob
- Sentry
- Axiom

## Risks
- Regression of existing business logic (e.g., `isActive` hook)
- Admin UI bloat if not carefully organized
- Sync issues between `preview` and `prod` databases

## Dependencies
- Stable `preview` branch for all changes
- MongoDB write access
- Vercel Blob storage

## Workflow
- Worktree-only branching
- Review agent runs on post-commit
- Verify agent available for pre-push (web projects)

