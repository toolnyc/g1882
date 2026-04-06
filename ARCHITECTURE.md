# Architecture

Detailed architecture documentation for Gallery 1882. For quick reference and rules, see [CLAUDE.md](./CLAUDE.md).

## Dual Application Structure

The app uses Next.js route groups to separate frontend and admin concerns:

- **Frontend**: `src/app/(frontend)/` -- Public-facing website with SSR pages
- **Admin Panel**: `src/app/(payload)/` -- Payload CMS admin interface at `/admin`

## Collections (Content Types)

Payload collections are defined in `src/collections/`:

1. **Posts (aka Journal)** (`src/collections/Posts/index.ts`) -- Blog/journal articles with:
   - Draft/publish workflow with scheduled publishing
   - Relationships to artists and happenings
   - SEO metadata

2. **Artists** (`src/collections/Artists/index.ts`) -- Artist profiles with:
   - Name, bio, and image
   - Draft/publish workflow
   - URL slug generation

3. **Happenings** (`src/collections/Happenings/index.ts`) -- Events/exhibitions with similar structure to Artists. Events are single-day things whereas exhibitions are longer running.

4. **Media** (`src/collections/Media.ts`) -- Upload collection for all images/assets with Vercel Blob storage. These connect to happenings and artists and also globally to hero images etc.

5. **Categories** (`src/collections/Categories.ts`) -- Nested taxonomy for organizing posts.

6. **Users** (`src/collections/Users/index.ts`) -- Authentication-enabled collection for admin access.

## Globals (Singleton Content)

Defined in `src/globals/`:

- **Header** (`src/Header/config.ts`) -- Site navigation
- **Footer** (`src/Footer/config.ts`) -- Site footer content
- **Home** (`src/globals/Home/config.ts`) -- Homepage-specific content
- **Space** (`src/globals/Space/config.ts`) -- Venue/space information

## Blocks (Layout Builder)

Reusable content blocks in `src/blocks/`:

| Block | Purpose |
|-------|---------|
| `ArchiveBlock` | Post listings |
| `Banner` | Alert/announcement banners |
| `CallToAction` | CTA sections |
| `Code` | Code snippets with syntax highlighting |
| `Content` | Rich text content blocks |
| `MediaBlock` | Image/video blocks |
| `Form` | Form builder integration |

## Hooks

Custom hooks for data lifecycle:

- **Revalidation hooks**: Trigger Next.js on-demand revalidation when content changes (e.g., `src/collections/Posts/hooks/revalidatePost.ts`)
- **Population hooks**: Auto-populate author data (`src/collections/Posts/hooks/populateAuthors.ts`)
- **Scheduling hooks**: Handle scheduled publish/unpublish via jobs queue

## Frontend Routes

Key frontend routes in `src/app/(frontend)/`:

| Route | Description |
|-------|-------------|
| `/` | Homepage (`page.tsx`) |
| `/journal` | Blog listing |
| `/artists` | Artist directory |
| `/artists/[slug]` | Individual artist pages |
| `/happenings` | Events/exhibitions listing |
| `/happenings/[slug]` | Individual event pages |
| `/[slug]` | Dynamic pages (catches all other slugs) |
| `/search` | Search results page |

## Utilities

Important utility functions in `src/utilities/`:

| File | Purpose |
|------|---------|
| `getDocument.ts` | Fetch Payload documents |
| `generateMeta.ts` | Generate Next.js metadata |
| `generatePreviewPath.ts` | Generate draft preview URLs |
| `getRedirects.ts` | Fetch redirects for Next.js middleware |
| `dataTransformers.ts` | Transform Payload data for frontend |
| `dateHelpers.ts` | Date formatting and manipulation |
| `mediaHelpers.ts` | Image URL and sizing helpers |

## Type System

- Generated types: `src/payload-types.ts` (auto-generated, do not edit manually)
- TypeScript paths configured in `tsconfig.json`:
  - `@/*` maps to `src/*`
  - `@payload-config` maps to `src/payload.config.ts`

## Draft Preview and Live Preview

Collections use Payload's draft/version system with live preview enabled. The `generatePreviewPath` utility creates preview URLs that route through `/next/preview` to display drafts on the frontend.

## ISR and Revalidation

Next.js caching is disabled by default (`export const dynamic = 'force-dynamic'`) because Payload Cloud uses Cloudflare caching. If self-hosting outside Payload Cloud, re-enable Next.js caching by:

1. Removing `no-store` from fetch calls in `src/app/_api`
2. Removing `export const dynamic = 'force-dynamic'` from page files

On-demand revalidation is handled by collection hooks that call `revalidatePath()` after content changes.

## Seed Data

- Database seeding available via admin panel or `/next/seed` endpoint
- Mock data in `src/endpoints/seed/mockData.ts`
- ESLint rule prevents importing seed data in runtime code (`no-restricted-imports` pattern for `@/endpoints/seed/*`)

## Jobs and Scheduled Publishing

Payload jobs queue is configured in `payload.config.ts` with cron-based access control using `CRON_SECRET` environment variable.

### Image Size Generation (`generateImageSizes` task)

Media uploads generate only a `thumbnail` synchronously for fast response (~1-2s). The remaining 6 sizes (square, small, medium, large, xlarge, og) are generated asynchronously by the `generateImageSizes` job in `src/jobs/generateImageSizes.ts`. The job fetches the original from Vercel Blob, resizes with sharp, uploads each variant, and updates the media document. Vercel Cron hits `/api/payload-jobs/run` every minute to process queued jobs. The `afterChange` hook queues the job but does **not** trigger `jobs.run()` immediately — doing so caused MongoDB write conflicts by racing with the originating save transaction.

Blob storage uses `disablePayloadAccessControl: true` so media URLs resolve directly to Blob CDN (`https://<store>.public.blob.vercel-storage.com/...`) rather than being proxied through a serverless function. A diagnostic endpoint at `/next/media-audit` (admin-only) audits all media documents for URL health.

Processing status is tracked via `processingStatus` field (pending → processing → complete/failed) visible in the admin sidebar. The `MediaWithSizes` type in `src/types/media-sizes.d.ts` extends the generated `Media` type to include the deferred size fields.
