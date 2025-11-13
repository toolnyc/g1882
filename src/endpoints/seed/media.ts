import type { Payload, PayloadRequest, File } from 'payload'
import type { Media } from '@/payload-types'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const projectRoot = path.resolve(dirname, '../../../')
const mediaDir = path.join(projectRoot, 'public', 'media')

export async function seedMedia(
  payload: Payload,
  req: PayloadRequest,
): Promise<Map<string, Media>> {
  const mediaMap = new Map<string, Media>()

  // Media files to seed
  const mediaFiles = [
    { filename: 'test-artist.jpg', alt: 'Artist portrait' },
    { filename: 'test-art.jpg', alt: 'Artwork' },
    { filename: 'test-space.jpg', alt: 'Gallery space' },
  ]

  // Validate presence of required media assets upfront - fail fast if missing
  const missingFiles: string[] = []
  for (const mediaFile of mediaFiles) {
    const filePath = path.join(mediaDir, mediaFile.filename)
    try {
      await fs.access(filePath)
    } catch {
      missingFiles.push(mediaFile.filename)
    }
  }

  if (missingFiles.length > 0) {
    const missingList = missingFiles.join(', ')
    throw new Error(
      `Required media assets are missing from ${mediaDir}: ${missingList}. Please ensure all required media files are present before seeding.`,
    )
  }

  for (const mediaFile of mediaFiles) {
    const filePath = path.join(mediaDir, mediaFile.filename)

    try {
      // File existence already validated above
      await fs.access(filePath)

      // Check if media already exists
      const existing = await payload.find({
        collection: 'media',
        where: {
          filename: {
            equals: mediaFile.filename,
          },
        },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        mediaMap.set(mediaFile.filename, existing.docs[0])
        continue
      }

      // Read file
      const fileBuffer = await fs.readFile(filePath)
      const stats = await fs.stat(filePath)

      // Create file object
      const ext = path.extname(mediaFile.filename).slice(1).toLowerCase()
      const mimetype = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`
      
      const file: File = {
        name: mediaFile.filename,
        data: fileBuffer,
        mimetype,
        size: stats.size,
      }

      // Create media document
      const media = await payload.create({
        collection: 'media',
        data: {
          alt: mediaFile.alt,
        },
        file,
        req,
      })

      mediaMap.set(mediaFile.filename, media)
    } catch (error) {
      // This should not happen since we validated file existence upfront,
      // but handle it gracefully just in case
      payload.logger.error(`Failed to seed media file ${mediaFile.filename}: ${error}`)
      throw new Error(`Failed to seed media file ${mediaFile.filename}: ${error}`)
    }
  }

  return mediaMap
}

