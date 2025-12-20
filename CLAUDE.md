# CLAUDE.md

## Project Overview

This is a site for Gallery 1882, a Chesterton, IN art gallery.  The goal of the site is to clearly direct users to core information about the gallery, allow them to browse events and exhibitions with ease, and stay up-to-date with gallery happenings.


## Your Directives
Always plan before implementing. Always use DRY-code and look for ways to clean up the codebase and improve efficiency while making changes. Always use Payload and Next.JS standards.

## Git Branching Strategy

### Main Branches
- **prod** - Production branch. Deploys to the production domain. Only stable, tested code.
- **preview** - Staging/preview branch. Deploys to the preview environment for testing.

### Feature & Fix Branches
- **feature/*** - New features. Branch from `preview`, merge back to `preview` when complete.
- **fix/*** - Bug fixes. Branch from the affected branch (`preview` or `prod`), merge back when resolved.

### Workflow
1. Create feature/fix branch from `preview`
2. Develop and test locally
3. Merge to `preview` for staging review
4. Once validated, merge `preview` to `prod` for production release

### Notes
- The `main` branch exists for backwards compatibility but should not be used for new work
- Always test in `preview` before promoting to `prod`
- Vercel auto-deploys: `prod` -> production, `preview` -> preview environment

## Architecture

### Dual Application Structure

The app uses Next.js route groups to separate frontend and admin concerns:

- **Frontend**: `src/app/(frontend)/` - Public-facing website with SSR pages
- **Admin Panel**: `src/app/(payload)/` - Payload CMS admin interface at `/api/admin`

### Collections (Content Types)

Payload collections are defined in `src/collections/`:

1. **Posts (aka journal)** (`src/collections/Posts/index.ts`) - Blog/journal articles with:
   - Draft/publish workflow with scheduled publishing
   - Relationships to artists and happenings
   - SEO metadata

2. **Artists** (`src/collections/Artists/index.ts`) - Artist profiles with:
   - Name, bio, and image
   - Draft/publish workflow
   - URL slug generation

3. **Happenings** (`src/collections/Happenings/index.ts`) - Events/exhibitions with similar structure to Artists. Events are single day things whereas exhibitions are longer running

4. **Media** (`src/collections/Media.ts`) - Upload collection for all images/assets with Vercel Blob storage. These connect to happenings and artists and also globally to hero images etc.

5. **Categories** (`src/collections/Categories.ts`) - Nested taxonomy for organizing posts

6. **Users** (`src/collections/Users/index.ts`) - Authentication-enabled collection for admin access

### Globals (Singleton Content)

Defined in `src/globals/`:

- **Header** (`src/Header/config.ts`) - Site navigation
- **Footer** (`src/Footer/config.ts`) - Site footer content
- **Home** (`src/globals/Home/config.ts`) - Homepage-specific content
- **Space** (`src/globals/Space/config.ts`) - Venue/space information

### Blocks (Layout Builder)

Reusable content blocks in `src/blocks/`:

- `ArchiveBlock` - Post listings
- `Banner` - Alert/announcement banners
- `CallToAction` - CTA sections
- `Code` - Code snippets with syntax highlighting
- `Content` - Rich text content blocks
- `MediaBlock` - Image/video blocks
- `Form` - Form builder integration

### Hooks

Custom hooks for data lifecycle:
- **Revalidation hooks**: Trigger Next.js on-demand revalidation when content changes (e.g., `src/collections/Posts/hooks/revalidatePost.ts`)
- **Population hooks**: Auto-populate author data (`src/collections/Posts/hooks/populateAuthors.ts`)
- **Scheduling hooks**: Handle scheduled publish/unpublish via jobs queue

### Frontend Pages
Key frontend routes in `src/app/(frontend)/`:

- `/` - Homepage (`page.tsx`)
- `/journal` - Blog listing
- `/artists` - Artist directory
- `/artists/[slug]` - Individual artist pages
- `/happenings` - Events/exhibitions listing
- `/happenings/[slug]` - Individual event pages
- `/[slug]` - Dynamic pages (catches all other slugs)
- `/search` - Search results page

### Utilities

Important utility functions in `src/utilities/`:
- `getDocument.ts` - Fetch Payload documents
- `generateMeta.ts` - Generate Next.js metadata
- `generatePreviewPath.ts` - Generate draft preview URLs
- `getRedirects.ts` - Fetch redirects for Next.js middleware
- `dataTransformers.ts` - Transform Payload data for frontend
- `dateHelpers.ts` - Date formatting and manipulation
- `mediaHelpers.ts` - Image URL and sizing helpers

### Type System
- Generated types: `src/payload-types.ts` (auto-generated, do not edit manually)
- TypeScript paths configured in `tsconfig.json`:
  - `@/*` maps to `src/*`
  - `@payload-config` maps to `src/payload.config.ts`

## Key Patterns

### Draft Preview & Live Preview

Collections use Payload's draft/version system with live preview enabled. The `generatePreviewPath` utility creates preview URLs that route through `/next/preview` to display drafts on the frontend.

### ISR & Revalidation
Next.js caching is disabled by default (`export const dynamic = 'force-dynamic'`) because Payload Cloud uses Cloudflare caching. If self-hosting outside Payload Cloud, re-enable Next.js caching by:
1. Removing `no-store` from fetch calls in `src/app/_api`
2. Removing `export const dynamic = 'force-dynamic'` from page files

On-demand revalidation is handled by collection hooks that call `revalidatePath()` after content changes.
### Seed Data

- Database seeding available via admin panel or `/next/seed` endpoint
- Mock data in `src/endpoints/seed/mockData.ts`
- ESLint rule prevents importing seed data in runtime code (`no-restricted-imports` pattern for `@/endpoints/seed/*`)

### Jobs & Scheduled Publishing

Payload jobs queue is configured in `payload.config.ts` with cron-based access control using `CRON_SECRET` environment variable. Used for scheduled publish/unpublish operations.

## Environment Variables
Required environment variables:
- `DATABASE_URI` - MongoDB connection string
- `PAYLOAD_SECRET` - Secret key for Payload
- `NEXT_PUBLIC_SERVER_URL` - Public URL (auto-set on Vercel)
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
- `CRON_SECRET` - Secret for cron job authentication

## Important Notes
- Always use `pnpm` (not npm or yarn) due to workspace configuration
- Run `pnpm generate:types` after changing Payload collection schemas
- The admin panel is accessible at `/admin` (not `/api/admin`)
- All Payload API endpoints are at `/api/*`
- GraphQL endpoint available at `/api/graphql` with playground at `/api/graphql-playground`
