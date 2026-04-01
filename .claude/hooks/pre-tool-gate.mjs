/**
 * PreToolUse gate for g1882.
 *
 * Soft warnings only — no hard blocks. This project is in maintenance phase,
 * so we prompt rather than prevent.
 *
 * Triggers: Write | Edit | Bash
 */
import fs from 'fs'
import { check } from './sentinels.mjs'

const input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf-8').trim() || '{}')

const toolName = input.tool_name || ''
const toolInput = input.tool_input || {}

// Only gate on commit/push operations (soft warn)
if (toolName === 'Bash') {
  const cmd = toolInput.command || ''

  // Warn if committing without verify-passed
  if (/git\s+commit/.test(cmd) && !check('verify-passed')) {
    process.stdout.write(
      JSON.stringify({
        decision: 'allow',
        reason:
          '⚠️ verify-passed sentinel is not set. Consider running /verify (lint + test + build) before committing.',
      }),
    )
    process.exit(0)
  }

  // Warn if pushing without verify-passed
  if (/git\s+push/.test(cmd) && !check('verify-passed')) {
    process.stdout.write(
      JSON.stringify({
        decision: 'allow',
        reason:
          '⚠️ verify-passed sentinel is not set. Run /verify before pushing to ensure lint, tests, and build all pass.',
      }),
    )
    process.exit(0)
  }
}

// Allow everything else
process.exit(0)
