# Frontend Design Improvement Plan

Branch: `feature/frontend-design` | Skill: `frontend-design`

## Overall Assessment

The site has a solid foundation with some sophisticated components (DirectoryListing, GalleryHero) but inconsistency across the design system. The "refined, minimal, art-forward" gallery aesthetic is partially achieved but undermined by a non-functional font import, generic button styling, and overly subtle visual details.

## High Priority (Biggest Design Impact)

### 1. Fix Aktiv Grotesk font import
- **Files**: `src/app/(frontend)/globals.css:1`, `tailwind.config.mjs:111`
- **Issue**: TypeKit import URL contains placeholder `your-aktiv-grotesk-kit-id.css` -- font never loads
- **Result**: Site falls back to Geist Sans (generic) instead of Aktiv Grotesk (premium gallery font)
- **Options**:
  - Get proper Adobe Fonts kit ID and activate
  - Self-host Aktiv Grotesk WOFF2 files (better performance)
  - Choose alternative distinctive gallery font if license unavailable

### 2. Enhance button system
- **File**: `src/app/(frontend)/globals.css:124-143`
- **Current**: Flat buttons with 1px radius, simple hover (scale + color shift)
- **Improve**:
  - Add depth: subtle inset shadow, border treatment
  - Create primary/secondary/tertiary variants
  - Add animated underline or background reveal on hover
  - Introduce multiple sizes (sm, md, lg)

### 3. Add warm accent color to palette
- **File**: `tailwind.config.mjs:63-107`
- **Current**: Navy + dual blues (cool-toned, feels slightly corporate)
- **Add**: Warm accent -- muted gold (#d4af37), warm taupe, or sage for sophistication
- **Also**: Remove unused Forest color or repurpose it
- **Clean up**: Consolidate Lake/Bright Lake or create clearer hierarchy

### 4. Make grain texture intentionally visible
- **File**: `src/app/(frontend)/globals.css:109-162`
- **Current**: gallery-card grain at opacity 0.1, gallery-section at 0.03 (nearly invisible)
- **Change**: Increase to 0.15/0.05 so texture reads as intentional design, not accident
- **Also**: Consider adding subtle background color shifts to sections

### 5. Add image hover overlays
- **Files**: `src/components/ArtistFeature/index.tsx`, `src/components/CurrentExhibition/index.tsx`, artist detail pages
- **Current**: Simple `group-hover:scale-105` everywhere (repetitive)
- **Add**: Caption reveal, color tint, or gradient overlay on hover for richness and information

## Medium Priority (Refinement)

### 6. Implement parallax/scroll depth effects
- **Files**: `src/components/GalleryHero/index.tsx`, `src/components/ArtistFeature/index.tsx`
- **Add**: `useScroll()` parallax on hero images and featured sections for depth
- **Also**: Use custom easing curves `[0.25, 0.46, 0.45, 0.94]` instead of default `easeOut`

### 7. Create masonry/staggered layout for artist works
- **File**: `src/app/(frontend)/artists/[slug]/page.tsx:113-147`
- **Current**: Simple 3-column grid with identical square images
- **Change**: Masonry layout with varied aspect ratios for visual rhythm

### 8. Enhance footer design
- **File**: `src/Footer/Component.tsx`
- **Current**: Functional 5-column layout, dark navy background
- **Improve**:
  - Add vertical dividers between columns
  - Enhanced social icons with hover effects
  - Newsletter success/error animations
  - Subtle border or decorative element at top

### 9. Add navigation active states
- **File**: `src/Header/Component.client.tsx`
- **Current**: No visible active route indicator
- **Add**: Underline, background highlight, or color change for current page
- **Also**: Add breadcrumbs on detail pages

### 10. Implement lightbox for image viewing
- **Files**: Artist detail pages, happening detail pages
- **Add**: Full-size image modal with keyboard navigation (Esc to close, arrow keys)
- **Consider**: Use Framer Motion's `layout` animation for smooth expand/collapse

## Lower Priority (Polish)

### 11. Refine card component
- **File**: `src/components/Card/index.tsx`
- **Current**: Generic shadcn-based card
- **Improve**: Gallery-specific styling with corner accents, frame effects, hover metadata reveal

### 12. Add section background variety
- **Files**: Homepage sections, artist/happening pages
- **Current**: Mostly white backgrounds with one navy section
- **Add**: Subtle gradient shifts, semi-transparent color washes between sections

### 13. Improve FeatureBanner impact
- **File**: `src/components/FeatureBanner/index.tsx`
- **Current**: Compact with small 128px thumbnail
- **Improve**: Larger image, more dramatic layout, better visual hierarchy

### 14. Custom easing and animation variety
- **File**: `src/utilities/animations.ts`
- **Current**: All animations use same 0.8s duration with `easeOut`
- **Improve**: Vary timing per context, add custom cubic-bezier curves, introduce occasional unexpected motion

## Design Principles to Follow

Per the frontend-design skill:
- **Typography**: Distinctive, characterful font choices (not generic)
- **Color**: Dominant colors with sharp accents (not evenly distributed)
- **Motion**: High-impact orchestrated reveals over scattered micro-interactions
- **Spatial**: Unexpected layouts, intentional asymmetry, creative negative space
- **Backgrounds**: Atmosphere and depth through textures, gradients, layering

## Validation

After implementing changes:
1. Run `pnpm build` to verify no errors
2. Visual review across breakpoints (mobile, tablet, desktop)
3. Verify WCAG AA contrast ratios for any color changes
4. Test animations are smooth (no jank) using Chrome Performance tab
5. Verify responsive layouts don't break on any breakpoint
