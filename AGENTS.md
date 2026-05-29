# AGENTS.md — Gallery 1882

## Project Overview

Gallery 1882 — a Chesterton, IN art gallery website. Directs users to core gallery information, event/exhibition browsing, and current happenings. Currently in **launch phase**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, route groups) |
| CMS | Payload CMS 3 (embedded, not headless) |
| Database | MongoDB (via `@payloadcms/db-mongodb`) |
| Storage | Vercel Blob (`BLOB_READ_WRITE_TOKEN`) |
| Hosting | Vercel (auto-deploy from `prod` and `preview` branches) |
| Package Manager | **pnpm** (required — do not use npm or yarn) |
| Testing | Vitest (unit/integration) + Playwright (e2e) |
| Error Tracking | Sentry (`@sentry/nextjs`) → Discord alerts |
| Log Aggregation | Axiom (via Vercel log drain) |
| Client Analytics | Vercel Analytics + Speed Insights |

## CLI Commands

```bash
pnpm dev                  # Local development server
pnpm build                # Production build
pnpm lint:fix             # Lint and auto-fix
pnpm generate:types       # Regenerate Payload types (run after schema changes)
pnpm generate:importmap   # Regenerate Payload import map
pnpm test:unit            # Run unit tests
pnpm test:int             # Run integration tests
pnpm test:e2e             # Run Playwright e2e tests
pnpm test:pre-deploy      # Lint + unit + integration (run before merging)
```

## Git Branching

| Branch | Purpose |
|--------|---------|
| `main` | Production. Deploys to production domain. |
| `preview` | Staging. Deploys to preview environment. |
| `feature/*` | New features. Branch from `preview`, merge back. |
| `fix/*` | Bug fixes. Branch from affected branch, merge back. |

**Workflow**: feature branch → `preview` (validate) → `main` (release)


### Branch Safety Rules

| Rule |
|------|
| **Never edit source files directly on `prod`** |
| **Prefer feature/fix branches over direct `preview` edits** |
| **Merge to `main` only after validating on `preview`** | 

### Environment Context

| Branch | Deploys to | Database | Risk |
|--------|-----------|----------|------|
| `main` | Production domain | **High** |
| `preview` | Preview environment | Uses same database as main | Medium |
| `feature/*`, `fix/*` | Preview (on push) | same database as above | Medium |

## Key Patterns

- **Route groups**: `src/app/(frontend)/` for public site, `src/app/(payload)/` for admin
- **Draft/Publish**: Collections use versions with drafts; live preview via `generatePreviewPath`
- **Revalidation**: afterChange hooks call `revalidatePath()` on published content
- **Scheduled publishing**: Payload jobs queue with `CRON_SECRET` for cron access control
- **Admin panel**: Accessible at `/admin`; API endpoints at `/api/*`
- **Types**: `src/payload-types.ts` is auto-generated — regenerate with `pnpm generate:types` after schema changes

## Observability

### Error Handling Rules

- **Never** use empty `catch {}` blocks — at minimum log the error
- **Server-side catch blocks**: call `Sentry.captureException(error)` AND log with `payload.logger` or `logger` from `@/lib/logger`
- **Client-side catch blocks**: `import('@sentry/nextjs').then(Sentry => Sentry.captureException(error))`
- **Unhandled errors**: Automatically captured by `onRequestError` in `src/instrumentation.ts`
- All structured logs output JSON to stdout → Vercel drain → Axiom

### Key Files

| File | Purpose |
|------|---------|
| `sentry.server.config.ts` | Server-side Sentry init |
| `sentry.edge.config.ts` | Edge runtime Sentry init |
| `src/instrumentation.ts` | Next.js instrumentation hook (loads Sentry per runtime) |
| `src/instrumentation-client.ts` | Client-side Sentry init (session replay, router transitions) |
| `src/lib/logger.ts` | Structured JSON logger for non-Payload server code |
| `src/app/global-error.tsx` | Root error boundary (inline styles, Sentry report) |
| `src/app/(frontend)/error.tsx` | Frontend route error boundary (Gallery 1882 design) |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URI` | MongoDB connection string |
| `PAYLOAD_SECRET` | Payload encryption secret |
| `NEXT_PUBLIC_SERVER_URL` | Public URL (auto-set on Vercel) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token |
| `CRON_SECRET` | Cron job authentication |
| `SENTRY_DSN` | Sentry server-side DSN |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry client-side DSN |
| `SENTRY_AUTH_TOKEN` | Source map upload auth |
| `SENTRY_ORG` | Sentry organization slug |
| `SENTRY_PROJECT` | Sentry project slug |
| `RESEND_API_KEY` | Email sending (newsletter) |
| `RESEND_AUDIENCE_ID` | Resend audience for contacts |
| `RESEND_FROM_EMAIL` | Sender email address |

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues (`toolnyc/g1882`). See `docs/agents/issue-tracker.md`.

### Triage labels

Standard triage labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout with `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
