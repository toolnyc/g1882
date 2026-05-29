#!/usr/bin/env node

/**
 * Cleanup orphaned Vercel Blob files that are not referenced by any
 * Payload media document.
 *
 * This addresses files left behind from failed upload attempts when
 * the old custom upload route was double-encoding filenames.
 *
 * Requires:
 *   - BLOB_READ_WRITE_TOKEN env var (or in .env)
 *   - DATABASE_URI env var (or in .env)
 *
 * Usage:
 *   node scripts/cleanup-orphaned-blobs.mjs           # dry run (default)
 *   node scripts/cleanup-orphaned-blobs.mjs --delete   # actually delete orphans
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const payloadMongoPath = require.resolve('@payloadcms/db-mongodb')
const requireFromPayloadMongo = createRequire(payloadMongoPath)
const { MongoClient } = requireFromPayloadMongo('mongodb')

// Load .env
try {
  const envPath = resolve(__dirname, '..', '.env')
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let val = trimmed.slice(eqIdx + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) {
      process.env[key] = val
    }
  }
} catch {
  // .env may not exist
}

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN
const DATABASE_URI = process.env.DATABASE_URI
const DRY_RUN = !process.argv.includes('--delete')

if (!BLOB_TOKEN) {
  console.error('BLOB_READ_WRITE_TOKEN is not set')
  process.exit(1)
}
if (!DATABASE_URI) {
  console.error('DATABASE_URI is not set')
  process.exit(1)
}

async function main() {
  console.log(DRY_RUN ? '\n=== DRY RUN (pass --delete to actually remove) ===' : '\n=== LIVE DELETE MODE ===')

  // 1. Get all media documents from Payload
  console.log('\nConnecting to MongoDB...')
  const client = new MongoClient(DATABASE_URI)
  await client.connect()
  const db = client.db()
  const mediaCollection = db.collection('media')

  const mediaDocs = await mediaCollection.find({}, {
    projection: { filename: 1, url: 1, sizes: 1, alt: 1, mimeType: 1, createdAt: 1 }
  }).toArray()

  // Collect both raw and decoded URLs for matching resilience
  const referencedUrlsRaw = new Set()
  const referencedUrlsDecoded = new Set()
  for (const doc of mediaDocs) {
    if (doc.url) {
      referencedUrlsRaw.add(doc.url)
      try { referencedUrlsDecoded.add(decodeURIComponent(doc.url)) } catch { referencedUrlsDecoded.add(doc.url) }
    }
    if (doc.sizes && typeof doc.sizes === 'object') {
      for (const size of Object.values(doc.sizes)) {
        if (size?.url) {
          referencedUrlsRaw.add(size.url)
          try { referencedUrlsDecoded.add(decodeURIComponent(size.url)) } catch { referencedUrlsDecoded.add(size.url) }
        }
      }
    }
  }
  // Also generate the URLs that the afterRead hook would produce from filenames
  // (with disablePayloadAccessControl: true, the plugin generates URLs dynamically)
  const storeIdForUrls = BLOB_TOKEN.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]?.toLowerCase()
  const blobBaseUrlForUrls = `https://${storeIdForUrls}.public.blob.vercel-storage.com`
  for (const doc of mediaDocs) {
    if (doc.filename) {
      const generatedUrl = `${blobBaseUrlForUrls}/${encodeURIComponent(doc.filename)}`
      referencedUrlsRaw.add(generatedUrl)
      try { referencedUrlsDecoded.add(decodeURIComponent(generatedUrl)) } catch { referencedUrlsDecoded.add(generatedUrl) }
    }
  }
  console.log(`Found ${mediaDocs.length} media documents referencing ${referencedUrlsRaw.size} blob URLs (including generated)`)

  // 2. List all blobs in the store
  console.log('\nListing all blobs in Vercel Blob store...')
  const { list, del } = await import('@vercel/blob')

  let allBlobs = []
  let cursor = undefined
  let page = 0
  do {
    const result = await list({ token: BLOB_TOKEN, cursor, limit: 1000 })
    allBlobs = allBlobs.concat(result.blobs)
    cursor = result.hasMore ? result.cursor : undefined
    page++
    process.stdout.write(`  Page ${page}: ${allBlobs.length} blobs so far\r`)
  } while (cursor)
  console.log(`\nTotal blobs in store: ${allBlobs.length}`)

  const blobUrlSet = new Set(allBlobs.map(b => b.url))
  const blobUrlDecodedSet = new Set(allBlobs.map(b => {
    try { return decodeURIComponent(b.url) } catch { return b.url }
  }))

  // Helper: check if a blob is referenced (exact or decoded match)
  const isBlobReferenced = (blob) => {
    if (referencedUrlsRaw.has(blob.url)) return true
    try {
      if (referencedUrlsDecoded.has(decodeURIComponent(blob.url))) return true
    } catch {}
    return false
  }

  // Helper: check if a doc URL exists in blob store (exact or decoded)
  const docUrlExistsInBlob = (url) => {
    if (!url) return false
    if (blobUrlSet.has(url)) return true
    try {
      if (blobUrlDecodedSet.has(decodeURIComponent(url))) return true
    } catch {}
    return false
  }

  // -------------------------------------------------------
  // PART A: Orphaned blobs (in Blob store, not in Payload)
  // -------------------------------------------------------
  const orphanBlobs = allBlobs.filter(blob => !isBlobReferenced(blob))
  const referencedBlobCount = allBlobs.length - orphanBlobs.length

  console.log('\n--- ORPHANED BLOBS (in store, not referenced by any media doc) ---')
  console.log(`Referenced blobs: ${referencedBlobCount}`)
  console.log(`Orphaned blobs:   ${orphanBlobs.length}`)

  if (orphanBlobs.length > 0) {
    let totalSize = 0
    console.log('')
    for (const blob of orphanBlobs) {
      const sizeMB = (blob.size / (1024 * 1024)).toFixed(2)
      totalSize += blob.size
      console.log(`  ${blob.pathname} (${sizeMB} MB, uploaded ${blob.uploadedAt.toISOString()})`)
    }
    console.log(`\n  Total orphaned size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`)
  }

  // -------------------------------------------------------
  // PART B: Broken media docs (in Payload, no backing blob)
  // -------------------------------------------------------
  // Note: with disablePayloadAccessControl: true, the storage plugin
  // generates URLs dynamically from the filename via afterRead hook.
  // So a doc with no `url` field but a valid filename + matching blob
  // is NOT broken — the URL is generated at read time.
  const blobBaseUrl = blobBaseUrlForUrls

  const brokenDocs = []
  const healthyDocs = []
  for (const doc of mediaDocs) {
    const primaryUrl = doc.url

    // Check if the blob exists either by stored URL or by generated URL from filename
    const generatedUrl = doc.filename
      ? `${blobBaseUrl}/${encodeURIComponent(doc.filename)}`
      : null

    const hasBlobByUrl = primaryUrl && docUrlExistsInBlob(primaryUrl)
    const hasBlobByFilename = generatedUrl && docUrlExistsInBlob(generatedUrl)

    if (hasBlobByUrl || hasBlobByFilename) {
      healthyDocs.push(doc)
    } else if (!primaryUrl && !hasBlobByFilename) {
      brokenDocs.push({ doc, reason: 'no URL and no blob matching filename' })
    } else if (primaryUrl && !hasBlobByUrl && !hasBlobByFilename) {
      brokenDocs.push({ doc, reason: 'URL not in blob store and no blob matching filename' })
    } else {
      brokenDocs.push({ doc, reason: 'no backing blob found' })
    }
  }

  console.log('\n--- BROKEN MEDIA DOCS (in Payload, primary blob missing) ---')
  console.log(`Healthy docs: ${healthyDocs.length}`)
  console.log(`Broken docs:  ${brokenDocs.length}`)

  if (brokenDocs.length > 0) {
    console.log('')
    for (const { doc, reason } of brokenDocs) {
      const name = doc.filename || doc.alt || doc._id.toString()
      const created = doc.createdAt ? new Date(doc.createdAt).toISOString().split('T')[0] : 'unknown'
      console.log(`  ${name} (id: ${doc._id}, created: ${created}) — ${reason}`)
      if (doc.url) console.log(`    url: ${doc.url}`)
    }
  }

  // -------------------------------------------------------
  // Summary
  // -------------------------------------------------------
  console.log('\n--- SUMMARY ---')
  console.log(`Orphaned blobs to delete:    ${orphanBlobs.length}`)
  console.log(`Broken media docs to delete: ${brokenDocs.length}`)

  if (orphanBlobs.length === 0 && brokenDocs.length === 0) {
    console.log('\nNothing to clean up!')
    await client.close()
    return
  }

  if (DRY_RUN) {
    console.log('\nDry run complete. Run with --delete to remove these.')
    await client.close()
    return
  }

  // -------------------------------------------------------
  // DELETE orphaned blobs
  // -------------------------------------------------------
  if (orphanBlobs.length > 0) {
    console.log(`\nDeleting ${orphanBlobs.length} orphaned blobs...`)
    let deleted = 0
    let failed = 0

    for (let i = 0; i < orphanBlobs.length; i += 100) {
      const batch = orphanBlobs.slice(i, i + 100)
      try {
        await del(batch.map(b => b.url), { token: BLOB_TOKEN })
        deleted += batch.length
      } catch {
        for (const blob of batch) {
          try {
            await del(blob.url, { token: BLOB_TOKEN })
            deleted++
          } catch (e) {
            console.error(`  Failed to delete blob ${blob.pathname}: ${e.message}`)
            failed++
          }
        }
      }
      process.stdout.write(`  Blobs deleted: ${deleted}/${orphanBlobs.length}\r`)
    }
    console.log(`\n  Blobs deleted: ${deleted}, failed: ${failed}`)
  }

  // -------------------------------------------------------
  // DELETE broken media documents
  // -------------------------------------------------------
  if (brokenDocs.length > 0) {
    console.log(`\nDeleting ${brokenDocs.length} broken media documents from Payload...`)
    let deleted = 0
    let failed = 0

    for (const { doc } of brokenDocs) {
      try {
        await mediaCollection.deleteOne({ _id: doc._id })
        deleted++
      } catch (e) {
        console.error(`  Failed to delete doc ${doc._id}: ${e.message}`)
        failed++
      }
    }
    console.log(`  Docs deleted: ${deleted}, failed: ${failed}`)
  }

  await client.close()
  console.log('\nCleanup complete.')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
