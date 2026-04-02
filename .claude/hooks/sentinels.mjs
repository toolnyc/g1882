/**
 * Sentinel state management for g1882 agentic workflows.
 *
 * Sentinels are ephemeral JSON files in .claude/state/ that track workflow
 * stage. They are gitignored and machine-local.
 *
 * Resolves state directory from the git common dir so sentinels work
 * correctly in worktrees (worktrees share the main repo's .claude/state/).
 */
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function resolveStateDir() {
  try {
    // git rev-parse --git-common-dir returns the shared .git dir,
    // which is the main repo's .git even when run from a worktree.
    const commonDir = execSync('git rev-parse --git-common-dir', {
      encoding: 'utf-8',
      timeout: 3000,
    }).trim()
    // commonDir is either ".git" (main repo) or an absolute path (worktree)
    const repoRoot = path.resolve(commonDir, '..')
    return path.join(repoRoot, '.claude', 'state')
  } catch {
    // Fallback to __dirname-relative resolution
    return path.resolve(__dirname, '..', 'state')
  }
}

const STATE_DIR = resolveStateDir()

// Max ages in milliseconds (0 = no expiration)
const MAX_AGES = {
  'types-current': 0,
  'design-checked': 2 * 60 * 60 * 1000, // 2 hours
  'verify-passed': 2 * 60 * 60 * 1000, // 2 hours
}

function statePath(name) {
  return path.join(STATE_DIR, name)
}

/**
 * Check if a sentinel is set and fresh (not expired).
 * Returns the sentinel data if valid, null otherwise.
 */
export function check(name) {
  const filePath = statePath(name)
  if (!fs.existsSync(filePath)) return null

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const maxAge = MAX_AGES[name] || 0

    if (maxAge > 0) {
      const age = Date.now() - new Date(data.timestamp).getTime()
      if (age > maxAge) {
        // Expired — clean up
        fs.unlinkSync(filePath)
        return null
      }
    }

    return data
  } catch {
    return null
  }
}

/**
 * Set a sentinel with current timestamp and optional metadata.
 */
export function set(name, metadata = {}) {
  if (!fs.existsSync(STATE_DIR)) {
    fs.mkdirSync(STATE_DIR, { recursive: true })
  }

  const data = {
    timestamp: new Date().toISOString(),
    ...metadata,
  }

  fs.writeFileSync(statePath(name), JSON.stringify(data, null, 2))
}

/**
 * Clear a specific sentinel.
 */
export function clear(name) {
  const filePath = statePath(name)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}

/**
 * Clear all sentinels.
 */
export function clearAll() {
  if (!fs.existsSync(STATE_DIR)) return

  for (const file of fs.readdirSync(STATE_DIR)) {
    if (file.startsWith('.')) continue
    fs.unlinkSync(path.join(STATE_DIR, file))
  }
}
