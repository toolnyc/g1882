/**
 * PostToolUse hook: Gallery 1882 design system compliance.
 *
 * Fires after Write | Edit on TSX files. Checks:
 * 1. No hardcoded hex colors (should use Tailwind tokens)
 * 2. No inline style={{}} objects
 * 3. No arbitrary pixel values in className
 *
 * Clears design-checked sentinel on any TSX write.
 *
 * Triggers: Write | Edit
 */
import fs from 'fs'
import { clear } from './sentinels.mjs'

const input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf-8').trim() || '{}')
const toolInput = input.tool_input || {}
const filePath = toolInput.file_path || ''

// Only check TSX files in src/ (not error boundaries which use inline styles intentionally)
if (!filePath.endsWith('.tsx') || !filePath.includes('/src/')) {
  process.exit(0)
}

// Skip error boundary files (they need inline styles since CSS may not load)
if (filePath.includes('global-error') || filePath.includes('error.tsx')) {
  process.exit(0)
}

// Clear design-checked on any TSX write
clear('design-checked')

try {
  const content = fs.readFileSync(filePath, 'utf-8')
  const warnings = []

  // Check for hardcoded hex colors (skip comments and string content in seed files)
  if (!filePath.includes('/seed/') && !filePath.includes('/endpoints/')) {
    const hexMatches = content.match(/#[0-9a-fA-F]{3,8}(?=[;\s'"`),])/g)
    if (hexMatches) {
      // Filter out common non-color hex patterns (e.g., anchors, URL fragments)
      const colorHexes = hexMatches.filter(
        (h) => !['#main', '#content', '#root'].includes(h),
      )
      if (colorHexes.length > 0) {
        warnings.push(
          `Hardcoded hex color(s) found: ${colorHexes.slice(0, 3).join(', ')}. Use Tailwind tokens (navy, lake, forest, off-white, etc.)`,
        )
      }
    }
  }

  // Check for inline style objects (skip if it's the global-error boundary)
  const styleMatches = content.match(/style=\{\{/g)
  if (styleMatches && styleMatches.length > 0) {
    warnings.push(
      `${styleMatches.length} inline style={{}} object(s) found. Prefer Tailwind classes.`,
    )
  }

  // Check for arbitrary pixel values in className (e.g., w-[47px])
  const arbitraryPxMatches = content.match(/\b\w+-\[\d+px\]/g)
  if (arbitraryPxMatches && arbitraryPxMatches.length > 2) {
    warnings.push(
      `${arbitraryPxMatches.length} arbitrary pixel values in className. Prefer Tailwind spacing scale.`,
    )
  }

  if (warnings.length > 0) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: `🎨 Design system check:\n${warnings.map((w) => `  - ${w}`).join('\n')}`,
        },
      }),
    )
  }
} catch {
  // File read failed — allow silently
}

process.exit(0)
