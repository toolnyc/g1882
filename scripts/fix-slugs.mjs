#!/usr/bin/env node

/**
 * One-time migration script to fix slugs in MongoDB for artists and happenings.
 *
 * Converts raw-name slugs (e.g. "Louise Jones") to URL-friendly format
 * (e.g. "louise-jones"). Uses the same algorithm as the formatSlug hooks.
 *
 * Usage:
 *   node scripts/fix-slugs.mjs
 *
 * Reads DATABASE_URI from .env in the project root.
 * Does a dry run first, then prompts before applying changes.
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createInterface } from 'readline'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Resolve mongodb from pnpm's .pnpm store
const mongodbPath = resolve(
  __dirname, '..', 'node_modules', '.pnpm',
  'mongodb@6.16.0_@aws-sdk+credential-providers@3.910.0',
  'node_modules', 'mongodb', 'lib', 'index.js',
)
const { MongoClient } = await import(mongodbPath)

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

async function fixCollection(db, collectionName, nameField) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`  ${collectionName.toUpperCase()}`)
  console.log(`${'='.repeat(60)}`)

  const collection = db.collection(collectionName)
  const docs = await collection.find({}, { projection: { slug: 1, [nameField]: 1 } }).toArray()

  console.log(`Found ${docs.length} documents.\n`)

  const fixes = []
  const alreadyGood = []

  for (const doc of docs) {
    const currentSlug = doc.slug || ''
    const fixedSlug = formatSlug(currentSlug)
    const label = doc[nameField] || '(untitled)'

    if (!currentSlug) {
      console.log(`  SKIP: "${label}" has no slug`)
      continue
    }

    if (currentSlug !== fixedSlug) {
      fixes.push({ _id: doc._id, label, oldSlug: currentSlug, newSlug: fixedSlug })
    } else {
      alreadyGood.push({ label, slug: currentSlug })
    }
  }

  if (fixes.length === 0) {
    console.log(`All ${collectionName} slugs are already properly formatted.`)
    return 0
  }

  console.log(`${fixes.length} slugs need fixing:\n`)
  for (const fix of fixes) {
    console.log(`  ${fix.label}`)
    console.log(`    "${fix.oldSlug}" -> "${fix.newSlug}"`)
  }

  if (alreadyGood.length > 0) {
    console.log(`\n${alreadyGood.length} already correct.`)
  }

  // Check for duplicates
  const allSlugs = [...fixes.map((f) => f.newSlug), ...alreadyGood.map((a) => a.slug)]
  const duplicates = allSlugs.filter((s, i) => allSlugs.indexOf(s) !== i)

  if (duplicates.length > 0) {
    console.log(`\nWARNING: Duplicate slugs would be created: ${duplicates.join(', ')}`)
    console.log('Skipping this collection. Resolve manually.')
    return 0
  }

  const answer = await prompt(`\nApply ${fixes.length} changes to ${collectionName}? (yes/no): `)
  if (answer !== 'yes' && answer !== 'y') {
    console.log('Skipped.')
    return 0
  }

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
      console.log(`  FAILED: "${fix.oldSlug}"`)
    }
  }

  console.log(`\n${updated}/${fixes.length} ${collectionName} slugs updated.`)
  return updated
}

async function main() {
  const uri = getDatabaseUri()
  const dbName = uri.split('/').pop()?.split('?')[0]

  console.log(`Connecting to MongoDB (database: ${dbName})...`)

  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(dbName)

  let total = 0
  total += await fixCollection(db, 'artists', 'name')
  total += await fixCollection(db, 'happenings', 'title')

  console.log(`\n${'='.repeat(60)}`)
  console.log(`  TOTAL: ${total} slugs updated across all collections.`)
  console.log(`${'='.repeat(60)}`)

  await client.close()
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
