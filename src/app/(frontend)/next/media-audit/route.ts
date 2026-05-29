import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'

export const maxDuration = 120

export async function GET(req: Request): Promise<Response> {
  const payload = await getPayload({ config })

  // Require authenticated admin user
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) {
    return new Response('Authentication required.', { status: 401 })
  }

  const url = new URL(req.url)
  const fix = url.searchParams.get('fix') === 'true'

  try {
    // Fetch ALL media documents (paginate through)
    const allMedia: Array<{
      id: string
      filename?: string | null
      url?: string | null
      mimeType?: string | null
      processingStatus?: string | null
      sizes?: Record<string, { url?: string | null }> | null
    }> = []

    let page = 1
    let hasMore = true
    while (hasMore) {
      const result = await payload.find({
        collection: 'media',
        page,
        limit: 100,
        depth: 0,
        sort: '-createdAt',
      })
      allMedia.push(
        ...result.docs.map((doc) => ({
          id: String(doc.id),
          filename: doc.filename,
          url: doc.url,
          mimeType: doc.mimeType,
          processingStatus: (doc as unknown as Record<string, unknown>).processingStatus as string | null,
          sizes: (doc as unknown as Record<string, unknown>).sizes as Record<
            string,
            { url?: string | null }
          > | null,
        })),
      )
      hasMore = result.hasNextPage
      page++
    }

    // Classify each document
    const isRelativeUrl = (u: string | null | undefined) => u && !u.startsWith('http')
    const isBlobUrl = (u: string | null | undefined) =>
      u?.includes('.public.blob.vercel-storage.com')

    const relativeUrls: typeof allMedia = []
    const blobUrls: typeof allMedia = []
    const noUrl: typeof allMedia = []
    const otherAbsolute: typeof allMedia = []
    const brokenSizes: Array<{ id: string; filename?: string | null; brokenSizeNames: string[] }> =
      []

    for (const doc of allMedia) {
      if (!doc.url) {
        noUrl.push(doc)
      } else if (isRelativeUrl(doc.url)) {
        relativeUrls.push(doc)
      } else if (isBlobUrl(doc.url)) {
        blobUrls.push(doc)
      } else {
        otherAbsolute.push(doc)
      }

      // Check sizes for relative URLs too
      if (doc.sizes && typeof doc.sizes === 'object') {
        const broken: string[] = []
        for (const [sizeName, sizeData] of Object.entries(doc.sizes)) {
          if (sizeData?.url && isRelativeUrl(sizeData.url)) {
            broken.push(sizeName)
          }
        }
        if (broken.length > 0) {
          brokenSizes.push({ id: doc.id, filename: doc.filename, brokenSizeNames: broken })
        }
      }
    }

    // If fix=true, re-queue background processing for affected documents
    let fixed = 0
    if (fix && relativeUrls.length > 0) {
      for (const doc of relativeUrls) {
        // Only re-queue images — videos with relative URLs need manual re-upload
        if (!doc.mimeType?.startsWith('image/')) continue

        try {
          // Reset processing status so the job picks it up
          await payload.update({
            collection: 'media',
            id: doc.id,
            data: {
              processingStatus: 'pending',
              processingError: null,
            },
          })
          fixed++
        } catch (err) {
          payload.logger.error(
            `[media-audit] Failed to reset media ${doc.id}: ${err instanceof Error ? err.message : 'Unknown'}`,
          )
        }
      }
    }

    const report = {
      total: allMedia.length,
      blobUrls: blobUrls.length,
      relativeUrls: {
        count: relativeUrls.length,
        documents: relativeUrls.map((d) => ({
          id: d.id,
          filename: d.filename,
          url: d.url,
          mimeType: d.mimeType,
          processingStatus: d.processingStatus,
        })),
      },
      noUrl: {
        count: noUrl.length,
        documents: noUrl.map((d) => ({ id: d.id, filename: d.filename })),
      },
      otherAbsolute: {
        count: otherAbsolute.length,
        documents: otherAbsolute.map((d) => ({ id: d.id, filename: d.filename, url: d.url })),
      },
      brokenSizes: {
        count: brokenSizes.length,
        documents: brokenSizes,
      },
      ...(fix ? { fixed } : {}),
      instructions: fix
        ? 'Documents with relative URLs have been reset to pending. The background job will re-attempt processing, but will fail if the source file is not in Blob. Those files need manual re-upload.'
        : 'Add ?fix=true to reset affected documents for reprocessing. Files with relative URLs likely need manual re-upload through the admin panel.',
    }

    return Response.json(report)
  } catch (err) {
    payload.logger.error({
      err,
      message: '[media-audit] Error running audit',
    })
    return Response.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
