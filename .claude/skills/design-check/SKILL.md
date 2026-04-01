---
name: design-check
description: Verify a TSX file against Gallery 1882 design system conventions.
---

# /design-check

Review TSX component files against the Gallery 1882 design system.

## Checklist

- [ ] All spacing uses Tailwind scale (p-4, gap-6, etc.) — no arbitrary values
- [ ] Border radius uses design tokens: `rounded-gallery` (1px) or `rounded-lg`/`rounded-full`
- [ ] No hardcoded hex colors — use palette: navy, lake, bright-lake, forest, warm-*, off-white
- [ ] Geist Sans for interface text, Geist Mono for code/data/timestamps
- [ ] Max one primary CTA button per visible screen area
- [ ] Accessible focus rings (ring-lake or ring-navy)
- [ ] Color contrast meets WCAG AA (4.5:1 for text, 3:1 for large text)
- [ ] Images use `next/image` with responsive `imageSizes` from Media collection
- [ ] Animations use `framer-motion` with `fadeUp` or similar shared utilities
- [ ] No inline `style={{}}` objects — prefer Tailwind classes

## Procedure

1. Read the target TSX file(s)
2. Run through the checklist above
3. Report any violations with specific line numbers
4. Set `design-checked` sentinel on pass

## Sentinel Lifecycle

- **Sets:** `design-checked` (on pass)
