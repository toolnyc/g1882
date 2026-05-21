# AGENTS.md — Gallery 1882

> Primary instruction source for all AI coding agents.
> Tool-specific entry points (CLAUDE.md, .cursorrules, .windsurfrules) are thin wrappers that reference this file.

| Entry point | Tool |
|-------------|------|
| `CLAUDE.md` | Claude Code |
| `.cursorrules` | Cursor |
| `.windsurfrules` | Windsurf |
| `AGENTS.md` | GitHub Copilot, other agents |

## Project Overview

Gallery 1882 — a Chesterton, IN art gallery website. Directs users to core gallery information, event/exhibition browsing, and current happenings. Currently in **maintenance/launch phase**.

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
| `prod` | Production. Deploys to production domain. |
| `preview` | Staging. Deploys to preview environment. |
| `feature/*` | New features. Branch from `preview`, merge back. |
| `fix/*` | Bug fixes. Branch from affected branch, merge back. |

**Workflow**: feature branch → `preview` (validate) → `prod` (release)

The `main` branch exists for backwards compatibility but should not be used for new work.

### Branch Safety Rules

| Rule | Why |
|------|-----|
| **Never edit source files directly on `prod`** | Auto-deploys to live site; production MongoDB is empty (no test data) |
| **Prefer feature/fix branches over direct `preview` edits** | Keeps staging clean; allows PR review before merge |
| **Always branch from `preview`**, not `prod` | `preview` has the full development database and latest validated code |
| **Run `/verify` before any push** | Lint + tests + build must pass; sentinel tracks this |
| **Merge to `prod` only after validating on `preview`** | Production has no test data — broken code is immediately visible to users |

### Environment Context

| Branch | Deploys to | Database | Risk |
|--------|-----------|----------|------|
| `prod` | Production domain | Production MongoDB (empty — no test data) | **High** |
| `preview` | Preview environment | Development MongoDB (has test data) | Medium |
| `feature/*`, `fix/*` | Preview (on push) | Development MongoDB | Low |

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

## Design References

- Gallery aesthetic: refined, minimal, art-forward. Avoid generic/corporate patterns.
- Typography and color should reflect the gallery's physical identity
- Mobile-first responsive design; touch-friendly event browsing
- Accessibility: WCAG AA compliance target for all public-facing pages
- Image-heavy pages must use responsive `imageSizes` from Media collection and Next.js `<Image />`

## Testing Priorities

1. **Pre-deploy gate**: `pnpm test:pre-deploy` must pass before merging to `preview`
2. **Unit tests** (`tests/unit/`): Utility functions, data transformers, date helpers
3. **Integration tests** (`tests/int/`): Payload collection CRUD, hook behavior, access control
4. **E2E tests** (`tests/e2e/` via Playwright): Critical user paths
5. **Manual verification**: Live preview, admin panel content editing, image uploads

## Deployment Checklist

1. All tests pass locally (`pnpm test:pre-deploy`)
2. No TypeScript errors (`pnpm build` succeeds)
3. Payload types are up to date (`pnpm generate:types` if schema changed)
4. Environment variables are set in Vercel for the target environment
5. Feature branch merged to `preview`; verify in preview environment
6. After validation, merge `preview` to `prod` for production release

## Platform Constraints

- Vercel serverless functions have a 10s default / 60s max execution time
- MongoDB connections are pooled; avoid opening new connections in hooks
- Vercel Blob has a 500MB free tier; monitor media storage usage
- ISR/caching is currently disabled (`force-dynamic`); Cloudflare handles caching
- Payload admin bundle size affects cold start; avoid heavy imports in collection configs
- ESLint blocks importing from `@/endpoints/seed/*` in runtime code

## Agentic Build System (Claude Code)

Claude Code has access to hooks and skills in `.claude/` that enforce soft guardrails:

### Sentinels (`.claude/state/`)

Ephemeral JSON state files that track workflow progress. Soft warnings only — no hard blocks.

| Sentinel | Set by | Cleared by |
|----------|--------|------------|
| `types-current` | `pnpm generate:types` | Editing collection schema files |
| `design-checked` | `/design-check` pass | Editing TSX files |
| `verify-passed` | `/verify` pass | Any source file edit |

### Skills

| Skill | Purpose |
|-------|---------|
| `/verify` | Lint → unit tests → int tests → build |
| `/session-close` | End-of-session ritual, captures learnings |
| `/epic` | Optional feature planning |
| `/design-check` | Gallery 1882 design system validation |
| `/docs-sync` | Documentation synchronization |
| `/observability` | Logging/monitoring reference |

## Agent Team Conventions

When spawning parallel agents (e.g., worktree-isolated epic implementations):

| Guideline | Why |
|-----------|-----|
| Use `dontAsk` mode, not `bypassPermissions` | `bypassPermissions` causes write failures in worktrees |
| Always branch from `preview` | `main` is deprecated; `prod` has empty DB. Verify with `git merge-base HEAD preview` after completion |
| Prefer smaller agent scope | One sub-task per agent. Shorter runs = less exposure to session drops |
| Research-only agents are more reliable | Agents that only read/search rarely fail; use them for exploration |
| Include fallback instructions | Tell agents to document progress so work can be completed manually if auth drops |
| Frame prompts idempotently | Agents should check if work already exists before creating, so re-runs are safe |
| Verify branch base after completion | Run `git merge-base HEAD preview` to confirm the branch descends from `preview` |

### Worktree Notes

- Sentinels resolve from `git rev-parse --git-common-dir`, so they're shared across worktrees
- Hooks in `.claude/hooks/` reference sentinels via import, so they work in worktrees automatically
- If hooks aren't firing in a worktree, ensure `.claude/` is accessible from the worktree root

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues (`toolnyc/g1882`). See `docs/agents/issue-tracker.md`.

### Triage labels

Standard triage labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout with `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Knowledge Base

Session reports and architecture decisions are stored in the Obsidian vault:

```
/Users/pete/Dropbox/Notes/Obsidian/Clients/Gallery 1882/
├── Session Reports/     # AI session summaries
├── Architecture/        # Design decisions
└── *.md                 # Client feedback, meeting notes
```
