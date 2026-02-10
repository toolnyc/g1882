# Web Performance Improvement Plan

Branch: `feature/web-perf` | Skill: `web-perf`

## Quick Wins (High Impact, Low Effort)

### 1. Lower image quality from 100 to 90
- **File**: `src/components/Media/ImageMedia/index.tsx:69`
- **Change**: `quality={100}` -> `quality={90}`
- **Impact**: ~15-20% reduction in image payload with imperceptible visual difference

### 2. Add responsive `sizes` to FeaturedHappenings
- **File**: `src/components/FeaturedHappenings/index.tsx:97-105`
- **Change**: Add `sizes="(max-width: 640px) 80px, 96px"` to thumbnail images
- **Impact**: Prevents oversized image downloads on small screens

### 3. Add DNS preconnect hints
- **File**: `src/app/(frontend)/layout.tsx`
- **Change**: Add `<link rel="preconnect">` for Open-Meteo API, Cloudflare Stream, Vercel Blob
- **Impact**: ~100ms faster first requests to external APIs

## Medium Effort (Significant Impact)

### 4. Lazy-load Framer Motion on non-critical components
- **Files**: `src/components/PageTransition/index.tsx`, `src/components/PageLoadingIndicator/index.tsx`
- **Change**: Dynamic import Framer Motion via `React.lazy()` + code splitting
- **Impact**: ~40KB reduction in initial JS bundle

### 5. Add Suspense boundaries on detail pages
- **Files**: `src/app/(frontend)/happenings/[slug]/page.tsx`, `src/app/(frontend)/artists/[slug]/page.tsx`
- **Change**: Wrap Related Happenings/Works grid in `<Suspense>` with skeleton fallbacks
- **Impact**: Faster initial paint on detail pages via streaming SSR

### 6. Consolidate redundant data fetches on homepage
- **File**: `src/app/(frontend)/page.tsx:22-57`
- **Change**: Fetch happenings once, filter in-memory server-side
- **Impact**: Reduces 3 DB queries to 1 on homepage

### 7. Add `Cache-Control` headers in middleware
- **File**: `src/middleware.ts`
- **Change**: Add browser caching headers for static assets and HTML pages
- **Impact**: Repeat visits load significantly faster

## Lower Priority (Polish)

### 8. Optimize CSS grain effects
- **File**: `src/app/(frontend)/globals.css:109-162`
- **Change**: Replace computed radial-gradients with a single SVG pattern, or limit grain to above-fold sections
- **Impact**: Reduced paint cost on pages with many gallery-card/gallery-section elements

### 9. Conditionally render AdminBar
- **File**: `src/app/(frontend)/layout.tsx:41-47`
- **Change**: Only render AdminBar when `isEnabled` (preview mode) is true
- **Impact**: Removes unnecessary component from production render tree

### 10. Throttle scroll handlers
- **Files**: `src/Header/Component.client.tsx:28-48`, `src/providers/index.tsx` (ScrollAwareToaster)
- **Change**: Add RAF throttling to scroll event listeners
- **Impact**: Smoother scrolling performance, reduced main thread work

### 11. Cache WeatherWidget server-side
- **File**: `src/components/GalleryHero/WeatherWidget.tsx:28-50`
- **Change**: Fetch weather data server-side and pass as prop, or cache in sessionStorage
- **Impact**: Eliminates per-visitor API call to Open-Meteo

## Validation

After implementing changes:
1. Run `pnpm build` to verify no errors
2. Run `pnpm test:pre-deploy` to verify tests pass
3. Use Chrome DevTools Lighthouse for before/after Core Web Vitals comparison
4. Verify Framer Motion animations still work after lazy loading
