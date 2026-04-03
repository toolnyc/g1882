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
