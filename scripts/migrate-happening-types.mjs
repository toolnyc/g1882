#!/usr/bin/env node

/**
 * One-time migration script to convert happening `type` fields from plain
 * strings ('exhibition' | 'event') to ObjectId references pointing at the
 * HappeningTypes collection.
 *
 * Usage:
 *   node scripts/migrate-happening-types.mjs
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
const { MongoClient } = require('mongodb')

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
      resolve(answer.trim().toLowerCase())
    })
  })
}

const TYPE_DEFINITIONS = [
  { name: 'Exhibition', slug: 'exhibition', dateDisplayMode: 'date-range' },
  { name: 'Event', slug: 'event', dateDisplayMode: 'datetime' },
]

async function main() {
  const uri = getDatabaseUri()
  const dbName = uri.split('/').pop()?.split('?')[0]

  console.log(`Connecting to MongoDB (database: ${dbName})...\n`)

  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(dbName)

  // Step 1: Upsert HappeningType documents
  const typesCollection = db.collection('happening-types')
  const typeIdMap = new Map()

  for (const typeDef of TYPE_DEFINITIONS) {
    const result = await typesCollection.findOneAndUpdate(
      { slug: typeDef.slug },
      { $setOnInsert: typeDef },
      { upsert: true, returnDocument: 'after' },
    )
    typeIdMap.set(typeDef.slug, result._id)
    console.log(`  HappeningType "${typeDef.name}" -> ${result._id}`)
  }

  console.log()

  // Step 2: Find happenings with string type values
  const happeningsCollection = db.collection('happenings')
  const happenings = await happeningsCollection.find(
    { type: { $type: 'string' } },
    { projection: { title: 1, type: 1 } },
  ).toArray()

  console.log(`Found ${happenings.length} happenings with plain-string type fields.\n`)

  if (happenings.length === 0) {
    console.log('Nothing to migrate in happenings collection.')
  } else {
    // Dry run report
    for (const h of happenings) {
      const targetId = typeIdMap.get(h.type)
      console.log(`  "${h.title}" — "${h.type}" -> ${targetId || 'UNKNOWN'}`)
      if (!targetId) {
        console.log(`    WARNING: No matching HappeningType for value "${h.type}"`)
      }
    }
  }

  // Check versions collection
  const versionsCollection = db.collection('_happenings_v')
  const versions = await versionsCollection.find(
    { 'version.type': { $type: 'string' } },
    { projection: { 'version.title': 1, 'version.type': 1 } },
  ).toArray()

  console.log(`\nFound ${versions.length} version records with plain-string type fields.`)

  const totalToMigrate = happenings.length + versions.length
  if (totalToMigrate === 0) {
    console.log('\nNothing to migrate.')
    await client.close()
    return
  }

  const answer = await prompt(`\nMigrate ${totalToMigrate} records? (yes/no): `)

  if (answer !== 'yes' && answer !== 'y') {
    console.log('Aborted. No changes made.')
    await client.close()
    return
  }

  // Migrate happenings
  let updated = 0
  for (const h of happenings) {
    const targetId = typeIdMap.get(h.type)
    if (!targetId) {
      console.log(`  SKIPPED: "${h.title}" — no matching type for "${h.type}"`)
      continue
    }
    const result = await happeningsCollection.updateOne(
      { _id: h._id },
      { $set: { type: targetId } },
    )
    if (result.modifiedCount === 1) {
      updated++
      console.log(`  Migrated: "${h.title}"`)
    } else {
      console.log(`  FAILED: "${h.title}"`)
    }
  }

  // Migrate versions
  let versionUpdated = 0
  for (const ver of versions) {
    const targetId = typeIdMap.get(ver.version.type)
    if (!targetId) continue
    const result = await versionsCollection.updateOne(
      { _id: ver._id },
      { $set: { 'version.type': targetId } },
    )
    if (result.modifiedCount === 1) versionUpdated++
  }

  console.log(`\nDone. ${updated}/${happenings.length} happenings migrated.`)
  if (versions.length > 0) {
    console.log(`  ${versionUpdated}/${versions.length} version records migrated.`)
  }
  await client.close()
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
