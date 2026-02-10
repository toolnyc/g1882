#!/usr/bin/env node

/**
 * One-time migration script to fix artist slugs in MongoDB.
 *
 * Converts raw-name slugs (e.g. "Louise Jones") to URL-friendly format
 * (e.g. "louise-jones"). Uses the same algorithm as the formatSlug hook.
 *
 * Usage:
 *   node scripts/fix-artist-slugs.mjs
 *
 * Reads DATABASE_URI from .env in the project root.
 * Does a dry run first, then prompts before applying changes.
 */

import { createRequire } from 'module'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createInterface } from 'readline'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Resolve mongodb from pnpm's .pnpm store (strict hoisting means it's not at top-level node_modules)
const mongodbPath = resolve(
  __dirname, '..', 'node_modules', '.pnpm',
  'mongodb@6.16.0_@aws-sdk+credential-providers@3.910.0',
  'node_modules', 'mongodb', 'lib', 'index.js',
)
const { MongoClient } = await import(mongodbPath)

// Read DATABASE_URI from .env
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

function formatSlug(slug) {
  return slug
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()
}

function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim().toLowerCase())
    })
  })
}

async function main() {
  const uri = getDatabaseUri()
  // Extract DB name from URI (everything after the last /)
  const dbName = uri.split('/').pop()?.split('?')[0]

  console.log(`Connecting to MongoDB (database: ${dbName})...\n`)

  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(dbName)
  const collection = db.collection('artists')

  const artists = await collection.find({}, { projection: { slug: 1, name: 1 } }).toArray()

  console.log(`Found ${artists.length} artists.\n`)

  // Find artists that need slug fixes
  const fixes = []
  const alreadyGood = []

  for (const artist of artists) {
    const currentSlug = artist.slug || ''
    const fixedSlug = formatSlug(currentSlug)

    if (currentSlug !== fixedSlug) {
      fixes.push({ _id: artist._id, name: artist.name, oldSlug: currentSlug, newSlug: fixedSlug })
    } else {
      alreadyGood.push({ name: artist.name, slug: currentSlug })
    }
  }

  if (fixes.length === 0) {
    console.log('All artist slugs are already properly formatted. Nothing to do.')
    await client.close()
    return
  }

  // Dry run report
  console.log(`${fixes.length} slugs need fixing:\n`)
  console.log('  %-30s %-30s -> %s', 'NAME', 'OLD SLUG', 'NEW SLUG')
  console.log('  ' + '-'.repeat(90))
  for (const fix of fixes) {
    console.log('  %-30s %-30s -> %s', fix.name, `"${fix.oldSlug}"`, `"${fix.newSlug}"`)
  }

  if (alreadyGood.length > 0) {
    console.log(`\n${alreadyGood.length} slugs already correct (no changes needed).`)
  }

  // Check for duplicates after fix
  const newSlugs = fixes.map((f) => f.newSlug)
  const existingSlugs = alreadyGood.map((a) => a.slug)
  const allSlugs = [...newSlugs, ...existingSlugs]
  const duplicates = allSlugs.filter((s, i) => allSlugs.indexOf(s) !== i)

  if (duplicates.length > 0) {
    console.log(`\nWARNING: The following slugs would create duplicates: ${duplicates.join(', ')}`)
    console.log('Please resolve these manually before running this script.')
    await client.close()
    process.exit(1)
  }

  // Prompt for confirmation
  const answer = await prompt('\nApply these changes? (yes/no): ')

  if (answer !== 'yes' && answer !== 'y') {
    console.log('Aborted. No changes made.')
    await client.close()
    return
  }

  // Apply fixes
  let updated = 0
  for (const fix of fixes) {
    const result = await collection.updateOne(
      { _id: fix._id },
      { $set: { slug: fix.newSlug } },
    )
    if (result.modifiedCount === 1) {
      updated++
      console.log(`  Updated: "${fix.oldSlug}" -> "${fix.newSlug}"`)
    } else {
      console.log(`  FAILED: "${fix.oldSlug}" (no document matched)`)
    }
  }

  console.log(`\nDone. ${updated}/${fixes.length} slugs updated.`)
  await client.close()
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
