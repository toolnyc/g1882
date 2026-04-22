/**
 * PostToolUse hook: Observability discipline enforcement.
 *
 * Fires after Write | Edit. Checks:
 * 1. No empty catch {} blocks in new/modified code
 * 2. No raw console.log/error/warn in server-side code (use payload.logger or logger)
 * 3. New route segments should have error.tsx boundaries
 *
 * Triggers: Write | Edit
 */
import fs from 'fs'
import path from 'path'

const input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf-8').trim() || '{}')
const toolInput = input.tool_input || {}
const filePath = toolInput.file_path || ''

// Only check TS/TSX source files
if (!filePath.match(/\.tsx?$/) || !filePath.includes('/src/')) {
  process.exit(0)
}

// Skip test files, seed files, and the logger utility itself
if (
  filePath.includes('.test.') ||
  filePath.includes('.spec.') ||
  filePath.includes('/seed/') ||
  filePath.includes('/endpoints/') ||
  filePath.includes('/lib/logger')
) {
  process.exit(0)
}

try {
  const content = fs.readFileSync(filePath, 'utf-8')
  const warnings = []

  // Check for empty catch blocks (catch { } or catch(e) { })
  const emptyCatchPattern = /catch\s*(\([^)]*\))?\s*\{\s*(\/\/[^\n]*)?\s*\}/g
  const emptyCatches = content.match(emptyCatchPattern)
  if (emptyCatches) {
    warnings.push(
      `${emptyCatches.length} empty/comment-only catch block(s). Log the error or forward to Sentry.`,
    )
  }

  // Check for console.log/error/warn in server-side code (not 'use client' files)
  const isClientComponent = content.trimStart().startsWith("'use client'")
  if (!isClientComponent) {
    // Server-side: should use payload.logger or the structured logger
    const consoleMatches = content.match(/\bconsole\.(log|error|warn|debug)\b/g)
    if (consoleMatches) {
      warnings.push(
        `${consoleMatches.length} console.* call(s) in server code. Use payload.logger (in hooks) or logger from @/lib/logger.`,
      )
    }
  }

  // Check if this is a new route page.tsx without a sibling error.tsx
  if (filePath.endsWith('/page.tsx')) {
    const dir = path.dirname(filePath)
    const errorPath = path.join(dir, 'error.tsx')
    if (!fs.existsSync(errorPath)) {
      // Only warn for frontend routes
      if (filePath.includes('(frontend)') && !filePath.includes('/next/')) {
        warnings.push(
          `Route segment missing error.tsx boundary. Add one for graceful error handling.`,
        )
      }
    }
  }

  if (warnings.length > 0) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: `🔍 Observability check:\n${warnings.map((w) => `  - ${w}`).join('\n')}`,
        },
      }),
    )
  }
} catch {
  // File read failed — allow silently
}

process.exit(0)
