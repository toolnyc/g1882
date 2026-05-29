import { describe, expect, it, vi } from 'vitest'

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}))

import { shouldQueueImageSizeGeneration } from '@/collections/Media'

describe('shouldQueueImageSizeGeneration', () => {
  it('queues a new pending image with a URL', () => {
    expect(
      shouldQueueImageSizeGeneration({
        mimeType: 'image/jpeg',
        processingStatus: 'pending',
        url: 'https://blob.example/art.jpg',
      }),
    ).toBe(true)
  })

  it('does not queue non-images', () => {
    expect(
      shouldQueueImageSizeGeneration({
        mimeType: 'video/mp4',
        processingStatus: 'pending',
        url: 'https://blob.example/video.mp4',
      }),
    ).toBe(false)
  })

  it('does not queue images without a source URL', () => {
    expect(
      shouldQueueImageSizeGeneration({
        mimeType: 'image/png',
        processingStatus: 'pending',
      }),
    ).toBe(false)
  })

  it('does not queue status updates made by the processing job', () => {
    expect(
      shouldQueueImageSizeGeneration(
        {
          mimeType: 'image/webp',
          processingStatus: 'processing',
          url: 'https://blob.example/art.webp',
        },
        {
          mimeType: 'image/webp',
          processingStatus: 'pending',
          url: 'https://blob.example/art.webp',
        },
      ),
    ).toBe(false)
  })

  it('does not queue repeated saves while already pending', () => {
    const doc = {
      mimeType: 'image/webp',
      processingStatus: 'pending',
      url: 'https://blob.example/art.webp',
    }

    expect(shouldQueueImageSizeGeneration(doc, doc)).toBe(false)
  })

  it('queues an image reset back to pending', () => {
    expect(
      shouldQueueImageSizeGeneration(
        {
          mimeType: 'image/webp',
          processingStatus: 'pending',
          url: 'https://blob.example/art.webp',
        },
        {
          mimeType: 'image/webp',
          processingStatus: 'failed',
          url: 'https://blob.example/art.webp',
        },
      ),
    ).toBe(true)
  })
})
