#!/usr/bin/env node

/**
 * One-time migration script to convert artist bio fields from plain strings
 * to Lexical rich text format in MongoDB.
 *
 * Usage:
 *   node scripts/migrate-artist-bio.mjs
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

function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim().toLowerCase())
    })
  })
}

function textToLexical(text) {
  const paragraphs = text.split(/\n+/).filter(Boolean)
  if (paragraphs.length === 0) return null

  return {
    root: {
      type: 'root',
      children: paragraphs.map((paragraph) => ({
        type: 'paragraph',
        children: [{ type: 'text', text: paragraph, version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

async function main() {
  const uri = getDatabaseUri()
  const dbName = uri.split('/').pop()?.split('?')[0]

  console.log(`Connecting to MongoDB (database: ${dbName})...\n`)

  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(dbName)
  const collection = db.collection('artists')

  const artists = await collection.find(
    { bio: { $type: 'string' } },
    { projection: { name: 1, bio: 1 } },
  ).toArray()

  console.log(`Found ${artists.length} artists with plain-string bio fields.\n`)

  if (artists.length === 0) {
    console.log('Nothing to migrate.')
    await client.close()
    return
  }

  // Dry run report
  for (const artist of artists) {
    const preview = artist.bio.length > 80 ? artist.bio.slice(0, 80) + '...' : artist.bio
    console.log(`  ${artist.name}: "${preview}"`)
  }

  const answer = await prompt(`\nConvert ${artists.length} bio fields to rich text? (yes/no): `)

  if (answer !== 'yes' && answer !== 'y') {
    console.log('Aborted. No changes made.')
    await client.close()
    return
  }

  let updated = 0
  for (const artist of artists) {
    const lexical = textToLexical(artist.bio)
    const result = await collection.updateOne(
      { _id: artist._id },
      { $set: { bio: lexical } },
    )
    if (result.modifiedCount === 1) {
      updated++
      console.log(`  Migrated: ${artist.name}`)
    } else {
      console.log(`  FAILED: ${artist.name}`)
    }
  }

  // Also update any _versions collection
  const versionsCollection = db.collection('_artists_v')
  const versions = await versionsCollection.find(
    { 'version.bio': { $type: 'string' } },
    { projection: { 'version.name': 1, 'version.bio': 1 } },
  ).toArray()

  if (versions.length > 0) {
    console.log(`\nMigrating ${versions.length} version records...`)
    for (const ver of versions) {
      const lexical = textToLexical(ver.version.bio)
      await versionsCollection.updateOne(
        { _id: ver._id },
        { $set: { 'version.bio': lexical } },
      )
    }
    console.log(`  Done.`)
  }

  console.log(`\nDone. ${updated}/${artists.length} artist bios migrated.`)
  await client.close()
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
