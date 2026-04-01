---
name: observability
description: Reference for logging, error tracking, and monitoring patterns in g1882.
---

# Observability Reference

## Stack

| Tool | Purpose | Status |
|------|---------|--------|
| Sentry (`@sentry/nextjs`) | Error tracking, alerting, source maps | Installed |
| Sentry Payload plugin | CMS error forwarding via `afterError` hook | Installed (manual) |
| Vercel Analytics | Page views, visitor data | Installed |
| Vercel Speed Insights | Core Web Vitals (LCP, CLS, INP) | Installed |
| Axiom (via Vercel log drain) | Log aggregation, search, dashboards | Active |
| Structured logger (`@/lib/logger`) | JSON logging for non-Payload code | Installed |

## Logging Conventions

### In Payload hooks (server-side)
```ts
payload.logger.info({ msg: 'Content published', collection: 'posts', docId: doc.id, user: req.user?.email })
payload.logger.error({ err, msg: 'Failed to revalidate', path })
```

### In Next.js API routes / Server Components
```ts
import { logger } from '@/lib/logger'
logger.info('Newsletter subscription', { email: masked, route: '/api/newsletter' })
logger.error('Email send failed', { error: String(err), route: '/api/newsletter' })
```

### In client components
```ts
// Capture to Sentry — don't just console.error
import('@sentry/nextjs').then((Sentry) => Sentry.captureException(error))
```

## Rules

- Never use empty `catch {}` blocks — at minimum log the error
- Server-side code: use `payload.logger` or `logger` from `@/lib/logger`
- Client-side code: capture errors to Sentry, show user-friendly toast
- All structured logs output JSON to stdout → Vercel drain → Axiom

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `SENTRY_DSN` | Sentry server-side DSN |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry client-side DSN |
| `SENTRY_AUTH_TOKEN` | Source map upload auth |
| `SENTRY_ORG` | Sentry organization slug |
| `SENTRY_PROJECT` | Sentry project slug |
