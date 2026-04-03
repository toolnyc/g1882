# Epic 3: Hero Video System

**Priority**: High | **Phase**: 2 — Core features
**Launch gate**: Professional video must be uploadable via this system

## Intent

Replace the Cloudflare Stream iframe approach with native HTML5 video. The client needs to upload and swap hero video directly in the CMS without dealing with iframe URLs. Video hosted on Vercel Blob (already configured for media storage).

## Current State

- `src/components/GalleryHero/index.tsx` renders a Cloudflare Stream `<iframe>` with a hardcoded default URL
- `heroVideoUrl` field in Home global (`src/globals/Home/config.ts`) accepts a URL string
- Media collection already accepts `video/mp4` and `video/webm`
- Vercel Blob storage is configured for all media uploads
- Hero logo overlay was canceled — video is the hero element
- WeatherWidget overlay renders on top of the hero

## Delta

1. **Replace** `heroVideoUrl` text field in Home global with a media upload field (`type: 'upload', relationTo: 'media'`)
2. **Convert** `GalleryHero` from `<iframe>` to `<video>` element with `autoPlay`, `muted`, `loop`, `playsInline`, `poster`
3. **Ensure performance** — `preload="metadata"`, poster image, mobile autoplay compatibility
4. **Remove** Cloudflare Stream constants and iframe code
5. **Test** with stock footage placeholder

## Data Model

**Home global** (`src/globals/Home/config.ts`):
- Remove: `heroVideoUrl` (text field)
- Add: `heroVideo` (upload, relationTo: 'media') — video file upload

## UI Breakdown

**Modified**: `src/components/GalleryHero/index.tsx`
- Replace `<iframe>` with `<video>` element
- Source URL from uploaded media item's Vercel Blob URL
- Keep poster image fallback
- Preserve WeatherWidget overlay positioning

## Acceptance Criteria

- [ ] Client can upload MP4/WebM video in Home global admin panel
- [ ] Hero renders as native `<video>` with autoplay, muted, loop
- [ ] Mobile autoplay works (requires `muted` + `playsInline`)
- [ ] `preload="metadata"` prevents full video download on page load
- [ ] Poster image displays before video loads
- [ ] WeatherWidget overlay renders correctly on top of video
- [ ] Cloudflare Stream iframe code and constants removed
- [ ] Video swappable by client without developer intervention

## Known Risks

- Large video files may affect page load performance — consider admin guidance on file size
- Mobile browsers have varying autoplay policies beyond `muted` + `playsInline`
- Stock footage is TBD by client — testing with placeholder only
