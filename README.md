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

## Key Commands

```bash
pnpm dev                  # Local dev server
pnpm build                # Production build
pnpm lint:fix             # Lint and auto-fix
pnpm generate:types       # Regenerate Payload types after schema changes
pnpm test:pre-deploy      # Lint + unit + integration tests
```

