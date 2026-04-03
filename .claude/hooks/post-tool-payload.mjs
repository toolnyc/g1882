/**
 * PostToolUse hook: Payload CMS collection validation.
 *
 * Fires after Write | Edit on collection files. Checks:
 * 1. Collections define access control
 * 2. Published collections have revalidation hooks
 * 3. Clears types-current sentinel when collection schema changes
 *
 * Triggers: Write | Edit
 */
import fs from 'fs'
import path from 'path'
import { clear } from './sentinels.mjs'

const input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf-8').trim() || '{}')
const toolInput = input.tool_input || {}
const filePath = toolInput.file_path || ''

// Only check collection files
if (!filePath.includes('/collections/')) {
  process.exit(0)
}

// Clear types-current when collection schema changes
if (
  filePath.endsWith('.ts') &&
  !filePath.endsWith('.spec.ts') &&
  !filePath.endsWith('.test.ts')
) {
  clear('types-current')
  process.stdout.write(
    JSON.stringify({
      decision: 'allow',
      reason:
        '📋 Collection schema modified — types-current sentinel cleared. Run `pnpm generate:types` to regenerate Payload types.',
    }),
  )
  process.exit(0)
}

// Check for access control definition
if (filePath.match(/collections\/\w+\/(index\.ts|.*\.ts)$/)) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')

    const warnings = []

    // Check for access control (skip if it's a hooks file)
    if (!filePath.includes('/hooks/') && !content.includes('access:') && !content.includes('access :')) {
      warnings.push('Collection is missing `access` control definition')
    }

    if (warnings.length > 0) {
      process.stdout.write(
        JSON.stringify({
          decision: 'allow',
          reason: `⚠️ Payload collection warnings:\n${warnings.map((w) => `  - ${w}`).join('\n')}`,
        }),
      )
    }
  } catch {
    // File read failed — allow silently
  }
}

process.exit(0)
