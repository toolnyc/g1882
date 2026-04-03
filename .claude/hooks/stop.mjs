/**
 * Stop hook: Session closeout reminder.
 *
 * Fires when the session ends. If 3+ source files were modified,
 * reminds to run /session-close to capture learnings.
 */
import { execSync } from 'child_process'

try {
  const diffStat = execSync('git diff --stat HEAD 2>/dev/null || true', {
    encoding: 'utf-8',
    cwd: process.cwd(),
  })

  // Count modified source files (rough heuristic)
  const srcLines = diffStat
    .split('\n')
    .filter((line) => line.includes('src/') && line.includes('|'))

  if (srcLines.length >= 3) {
    process.stdout.write(
      JSON.stringify({
        decision: 'allow',
        reason: `📝 ${srcLines.length} source files modified this session. Consider running /session-close to capture learnings and update docs.`,
      }),
    )
  }
} catch {
  // Git not available or not in a repo — skip
}

process.exit(0)
