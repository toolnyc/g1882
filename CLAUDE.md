# CLAUDE.md

## Project Overview

Gallery 1882 -- a Chesterton, IN art gallery website. The goal is to direct users to core gallery information, allow browsing of events/exhibitions, and keep visitors up-to-date with happenings.

## Directives

- Always plan before implementing
- Use DRY code; clean up and improve efficiency while making changes
- Follow Payload CMS and Next.js standards
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system documentation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, route groups) |
| CMS | Payload CMS 3 (embedded, not headless) |
| Database | MongoDB (via `@payloadcms/db-mongodb`) |
| Storage | Vercel Blob (`BLOB_READ_WRITE_TOKEN`) |
| Hosting | Vercel (auto-deploy from `prod` and `preview` branches) |
| Package Manager | **pnpm** (required -- do not use npm or yarn) |
| Testing | Vitest (unit/integration) + Playwright (e2e) |

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
| `feature/*` | New features. Branch from `preview`, merge back to `preview`. |
| `fix/*` | Bug fixes. Branch from affected branch, merge back when resolved. |

**Workflow**: feature branch -> `preview` (validate) -> `prod` (release)

The `main` branch exists for backwards compatibility but should not be used for new work.

### Worktrees (Required for Parallel Work)

```bash
git worktree add ../g1882-feature-name feature/feature-name
git worktree list
git worktree remove ../g1882-feature-name
```

- Name worktrees `g1882-<branch-short-name>` as siblings to the main repo
- Run `pnpm install` in each new worktree

## Key Patterns

- **Route groups**: `src/app/(frontend)/` for public site, `src/app/(payload)/` for admin
- **Draft/Publish**: Collections use versions with drafts; live preview via `generatePreviewPath`
- **Revalidation**: afterChange hooks call `revalidatePath()` on published content
- **Scheduled publishing**: Payload jobs queue with `CRON_SECRET` for cron access control
- **Admin panel**: Accessible at `/admin`; API endpoints at `/api/*`
- **Types**: `src/payload-types.ts` is auto-generated -- never edit manually

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URI` | MongoDB connection string |
| `PAYLOAD_SECRET` | Payload encryption secret |
| `NEXT_PUBLIC_SERVER_URL` | Public URL (auto-set on Vercel) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token |
| `CRON_SECRET` | Cron job authentication |

## Design References

- Gallery aesthetic: refined, minimal, art-forward. Avoid generic/corporate design patterns.
- Typography and color should reflect the gallery's physical identity
- Mobile-first responsive design; touch-friendly event browsing
- Accessibility: WCAG AA compliance target for all public-facing pages
- Image-heavy pages must use responsive `imageSizes` from Media collection and Next.js `<Image />`

## Testing Priorities

1. **Pre-deploy gate**: `pnpm test:pre-deploy` must pass before merging to `preview`
2. **Unit tests** (`tests/unit/`): Utility functions, data transformers, date helpers
3. **Integration tests** (`tests/int/`): Payload collection CRUD, hook behavior, access control
4. **E2E tests** (`tests/e2e/` via Playwright): Critical user paths -- homepage load, event browsing, artist pages, search
5. **Manual verification**: Live preview, admin panel content editing, image uploads

## Deployment Checklist

1. All tests pass locally (`pnpm test:pre-deploy`)
2. No TypeScript errors (`pnpm build` succeeds)
3. Payload types are up to date (`pnpm generate:types` if schema changed)
4. Environment variables are set in Vercel for the target environment
5. Feature branch merged to `preview`; verify in preview environment
6. After validation, merge `preview` to `prod` for production release
7. Verify production deployment and revalidation of affected pages

## Platform Constraints

- Vercel serverless functions have a 10s default / 60s max execution time
- MongoDB connections are pooled; avoid opening new connections in hooks
- Vercel Blob has a 500MB free tier; monitor media storage usage
- ISR/caching is currently disabled (`force-dynamic`); Cloudflare handles caching
- Payload admin bundle size affects cold start; avoid heavy imports in collection configs
- ESLint blocks importing from `@/endpoints/seed/*` in runtime code
