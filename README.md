# Gallery 1882

Website for Gallery 1882, a contemporary art gallery in Chesterton, Indiana.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **CMS**: Payload CMS 3 (embedded)
- **Database**: MongoDB
- **Storage**: Vercel Blob
- **Hosting**: Vercel

## Getting Started

```bash
pnpm install
pnpm dev
```

Admin panel at `/admin`. Requires `DATABASE_URI` and `PAYLOAD_SECRET` in `.env`.

## Documentation

| Document | Purpose |
|----------|---------|
| [AGENTS.md](./AGENTS.md) | AI agent instructions, tech stack, conventions, observability |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Collections, globals, blocks, frontend routes, type system |
| [ADMIN-GUIDE.md](./ADMIN-GUIDE.md) | CMS content management guide for editors |

## Key Commands

```bash
pnpm dev                  # Local dev server
pnpm build                # Production build
pnpm lint:fix             # Lint and auto-fix
pnpm generate:types       # Regenerate Payload types after schema changes
pnpm test:pre-deploy      # Lint + unit + integration tests
```

## Branching

`feature/*` or `fix/*` → `preview` (staging) → `prod` (production)

See [AGENTS.md](./AGENTS.md) for full branching and deployment workflow.

## Production Hardening

Recent hardening work on the `fix/production-readiness` branch:

- **Security**: Login attempt limits (5 attempts, 10-min lockout), CSRF Origin validation on `/api/*` mutating requests, `upgrade-insecure-requests` CSP directive
- **Accessibility**: aria-labels on form inputs, `:focus-visible` indicators on buttons, decorative video `aria-hidden`, mobile nav single-tab-stop fix
- **Observability**: Sentry reporting in admin error boundaries, diagnostic console.log calls gated to development
- **Performance**: Dynamic imports for WeatherWidget, NewsletterGateModal, PhotoCarousel; orphaned Aktiv Grotesk font reference removed
