/**
 * PreToolUse gate for g1882.
 *
 * Soft warnings only — no hard blocks. This project is in maintenance phase,
 * so we prompt rather than prevent.
 *
 * Guards:
 * 1. Branch/environment safety — prevent accidental work on wrong branch
 * 2. Verify-passed sentinel — remind to run /verify before commit/push
 *
 * Triggers: Write | Edit | Bash
 */
import fs from 'fs'
import { execSync } from 'child_process'
import { check } from './sentinels.mjs'

const input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf-8').trim() || '{}')

const toolName = input.tool_name || ''
const toolInput = input.tool_input || {}

// --- Helpers ---

let _branch = undefined
function getBranch() {
  if (_branch !== undefined) return _branch
  try {
    _branch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
      timeout: 3000,
    }).trim()
  } catch {
    _branch = null
  }
  return _branch
}

function warn(reason) {
  process.stdout.write(JSON.stringify({ decision: 'allow', reason }))
  process.exit(0)
}

function isSourceFile(filePath) {
  if (!filePath) return false
  return /\.(tsx?|jsx?|mjs|css|json)$/.test(filePath) && !filePath.includes('.claude/')
}

// --- Branch context for environment awareness ---

const BRANCH_ENV = {
  prod: {
    label: 'PRODUCTION',
    db: 'production MongoDB (currently empty — no test data)',
    danger: 'high',
  },
  preview: {
    label: 'PREVIEW/STAGING',
    db: 'development MongoDB (has test data)',
    danger: 'medium',
  },
  main: {
    label: 'DEPRECATED (main)',
    db: 'unknown',
    danger: 'medium',
  },
}

// --- Gate: Source file edits on protected branches ---

if (toolName === 'Write' || toolName === 'Edit') {
  const filePath = toolInput.file_path || ''
  const branch = getBranch()

  if (branch === 'prod' && isSourceFile(filePath)) {
    warn(
      `🚨 PRODUCTION BRANCH — You are editing source files directly on \`prod\`. ` +
        `This branch auto-deploys to the production domain with an empty MongoDB. ` +
        `Create a feature/* or fix/* branch from \`preview\` instead, then merge preview → prod when validated.\n` +
        `File: ${filePath}`,
    )
  }

  if (branch === 'preview' && isSourceFile(filePath)) {
    warn(
      `⚠️ PREVIEW BRANCH — You are editing directly on \`preview\` (staging). ` +
        `For anything beyond a quick fix, create a feature/* or fix/* branch first: ` +
        `\`git checkout -b feature/<name>\`\n` +
        `File: ${filePath}`,
    )
  }

  if (branch === 'main' && isSourceFile(filePath)) {
    warn(
      `⚠️ DEPRECATED BRANCH — \`main\` is no longer used. ` +
        `Switch to \`preview\` and create a feature branch: ` +
        `\`git checkout preview && git checkout -b feature/<name>\`\n` +
        `File: ${filePath}`,
    )
  }
}

// --- Gate: Bash commands ---

if (toolName === 'Bash') {
  const cmd = toolInput.command || ''
  const branch = getBranch()

  // Gate: pushing to prod
  if (/git\s+push/.test(cmd) && (branch === 'prod' || /\bprod\b/.test(cmd))) {
    const verifyPassed = check('verify-passed')
    warn(
      `🚨 PUSHING TO PRODUCTION — This will deploy to the live site (empty production MongoDB). ` +
        `Ensure:\n` +
        `  1. Changes have been validated on preview first\n` +
        `  2. /verify has passed ${verifyPassed ? '✅' : '❌ (not set — run /verify first)'}\n` +
        `  3. This is an intentional production release`,
    )
  }

  // Gate: merging into prod
  if (/git\s+merge/.test(cmd) && branch === 'prod') {
    warn(
      `🚨 MERGING INTO PRODUCTION — You are on \`prod\`. This merge will be deployed to the live site ` +
        `(production MongoDB is currently empty — no test data). ` +
        `Confirm this is an intentional release.`,
    )
  }

  // Gate: checking out prod
  if (/git\s+checkout\s+prod\b/.test(cmd)) {
    warn(
      `⚠️ Switching to \`prod\` (production) branch. ` +
        `This branch auto-deploys to the live site. ` +
        `Do not make direct edits here — use preview → prod workflow.`,
    )
  }

  // Gate: warn if committing without verify-passed
  if (/git\s+commit/.test(cmd) && !check('verify-passed')) {
    const env = BRANCH_ENV[branch]
    const envNote = env ? ` [${env.label} — DB: ${env.db}]` : ''
    warn(
      `⚠️ verify-passed sentinel is not set. Consider running /verify (lint + test + build) before committing.${envNote}`,
    )
  }

  // Gate: warn if pushing without verify-passed (non-prod, since prod has its own gate above)
  if (/git\s+push/.test(cmd) && branch !== 'prod' && !check('verify-passed')) {
    warn(
      `⚠️ verify-passed sentinel is not set. Run /verify before pushing to ensure lint, tests, and build all pass.`,
    )
  }

  // Gate: warn on branch creation from wrong base
  if (/git\s+(checkout\s+-b|switch\s+-c)/.test(cmd) && branch === 'prod') {
    warn(
      `⚠️ Creating a branch from \`prod\`. Feature/fix branches should typically branch from \`preview\` instead. ` +
        `Switch to preview first: \`git checkout preview\``,
    )
  }
}

// Allow everything else
process.exit(0)
