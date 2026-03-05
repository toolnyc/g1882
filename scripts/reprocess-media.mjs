#!/usr/bin/env node

/**
 * Re-process existing media uploads to generate WebP variants and apply
 * the 2560px resize cap.
 *
 * Requires a running dev server (pnpm dev) and admin credentials.
 *
 * Usage:
 *   node scripts/reprocess-media.mjs
 *
 * Reads DATABASE_URI from .env in the project root.
 * Does a dry run first, then prompts before applying changes.
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createInterface } from 'readline'
import { createRequire } from 'module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
// Resolve mongodb through Payload's dependency (pnpm doesn't hoist it)
const payloadMongoPath = require.resolve('@payloadcms/db-mongodb')
const requireFromPayloadMongo = createRequire(payloadMongoPath)
const { MongoClient } = requireFromPayloadMongo('mongodb')

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000'

// Support non-interactive mode via env vars
const NON_INTERACTIVE = process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD

function getDatabaseUri() {
  try {
    const envPath = resolve(__dirname, '..', '.env')
    const envContent = readFileSync(envPath, 'utf-8')
    const match = envContent.match(/^DATABASE_URI=(.+)$/m)
    if (match) return match[1].trim().replace(/^["']|["']$/g, '')
  } catch {
    // fall through
  }
  if (process.env.DATABASE_URI) return process.env.DATABASE_URI
  throw new Error('DATABASE_URI not found in .env or environment variables')
}

function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

async function login(email, password) {
  const res = await fetch(`${SERVER_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Login failed (${res.status}): ${text}`)
  }
  const data = await res.json()
  return data.token
}

async function downloadFile(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type') || 'application/octet-stream'
  return { buffer, contentType }
}

async function reuploadMedia(id, filename, fileBuffer, contentType, token) {
  // Build multipart form with the file and _payload (to preserve existing data)
  const FormData = globalThis.FormData
  const form = new FormData()
  const blob = new Blob([fileBuffer], { type: contentType })
  form.append('file', blob, filename)
  // Send _payload as empty JSON to avoid overwriting fields
  form.append('_payload', JSON.stringify({}))

  const res = await fetch(`${SERVER_URL}/api/media/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `JWT ${token}`,
    },
    body: form,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Upload failed (${res.status}): ${text}`)
  }

  return await res.json()
}

async function main() {
  const uri = getDatabaseUri()
  const dbName = uri.split('/').pop()?.split('?')[0]

  console.log(`Connecting to MongoDB (database: ${dbName})...\n`)

  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(dbName)

  const mediaCollection = db.collection('media')
  const allMedia = await mediaCollection.find({}).toArray()

  console.log(`Found ${allMedia.length} media documents.\n`)

  // Categorize media
  const toProcess = []
  const skipped = []

  for (const doc of allMedia) {
    const mimeType = doc.mimeType || ''
    const isImage = mimeType.startsWith('image/')

    if (!isImage) {
      skipped.push({ doc, reason: `Non-image (${mimeType || 'unknown type'})` })
      continue
    }

    if (!doc.url) {
      skipped.push({ doc, reason: 'Missing url field' })
      continue
    }

    toProcess.push(doc)
  }

  // Dry-run report
  console.log('=== DRY RUN REPORT ===\n')

  if (toProcess.length > 0) {
    console.log(`Will re-process (${toProcess.length}):`)
    for (const doc of toProcess) {
      const sizes = doc.sizes ? Object.keys(doc.sizes).length : 0
      const hasWebP = doc.sizes
        ? Object.values(doc.sizes).some((s) => s?.filename?.endsWith('.webp'))
        : false
      console.log(
        `  - ${doc.filename} (${doc.width || '?'}x${doc.height || '?'}, ${sizes} sizes, webp: ${hasWebP ? 'yes' : 'NO'})`,
      )
    }
  }

  if (skipped.length > 0) {
    console.log(`\nWill skip (${skipped.length}):`)
    for (const { doc, reason } of skipped) {
      console.log(`  - ${doc.filename || doc._id} — ${reason}`)
    }
  }

  if (toProcess.length === 0) {
    console.log('\nNothing to re-process.')
    await client.close()
    return
  }

  // Auth
  let email, password
  if (NON_INTERACTIVE) {
    email = process.env.ADMIN_EMAIL
    password = process.env.ADMIN_PASSWORD
    console.log(`\nUsing credentials from environment variables.`)
  } else {
    console.log(`\nThis script needs admin credentials to re-upload via the REST API.`)
    console.log(`Make sure the dev server is running at ${SERVER_URL}\n`)
    email = await prompt('Admin email: ')
    password = await prompt('Admin password: ')
  }

  let token
  try {
    token = await login(email, password)
    console.log('Authenticated successfully.\n')
  } catch (err) {
    console.error(`Authentication failed: ${err.message}`)
    await client.close()
    process.exit(1)
  }

  if (!NON_INTERACTIVE) {
    const confirm = await prompt(
      `Re-process ${toProcess.length} media files? This will download and re-upload each one. (yes/no): `,
    )
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('Aborted. No changes made.')
      await client.close()
      return
    }
  }

  // Process
  let success = 0
  let failed = 0

  for (let i = 0; i < toProcess.length; i++) {
    const doc = toProcess[i]
    const label = `[${i + 1}/${toProcess.length}]`

    try {
      // Download original file from its URL
      const fileUrl = doc.url.startsWith('http') ? doc.url : `${SERVER_URL}${doc.url}`
      console.log(`${label} Downloading ${doc.filename}...`)
      const { buffer, contentType } = await downloadFile(fileUrl)

      console.log(`${label} Re-uploading ${doc.filename} (${(buffer.length / 1024).toFixed(0)} KB)...`)
      const result = await reuploadMedia(doc._id.toString(), doc.filename, buffer, contentType, token)

      const newSizes = result.doc?.sizes ? Object.keys(result.doc.sizes).length : 0
      const hasWebP = result.doc?.sizes
        ? Object.values(result.doc.sizes).some((s) => s?.filename?.endsWith('.webp'))
        : false
      console.log(`${label} Done — ${newSizes} sizes, webp: ${hasWebP ? 'yes' : 'no'}`)
      success++
    } catch (err) {
      console.error(`${label} FAILED: ${doc.filename} — ${err.message}`)
      failed++
    }
  }

  console.log(`\n=== RESULTS ===`)
  console.log(`  Success: ${success}`)
  console.log(`  Failed:  ${failed}`)
  console.log(`  Skipped: ${skipped.length}`)

  await client.close()
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
