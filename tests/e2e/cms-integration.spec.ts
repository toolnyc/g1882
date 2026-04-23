import { test, expect } from './fixtures/payload-api'

/**
 * CMS-to-frontend golden path tests.
 *
 * These tests verify that edits made through the Payload CMS REST API
 * propagate correctly to the Next.js frontend after cache revalidation.
 *
 * Requirements:
 *   - Dev server running on localhost:3000
 *   - TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD env vars set
 *   - PREVIEW_SECRET env var set (for draft preview test)
 */

/** Wait for Next.js cache revalidation, then hard-reload the page. */
async function waitForRevalidation(page: import('@playwright/test').Page, url: string) {
  // Give revalidateTag / revalidatePath time to flush
  await page.waitForTimeout(2_000)
  await page.goto(url, { waitUntil: 'networkidle' })

  // If the cache still hasn't caught up, try one more hard reload after a beat
  await page.waitForTimeout(1_000)
  await page.reload({ waitUntil: 'networkidle' })
}

// ---------------------------------------------------------------------------
// Group A: Global edit -> frontend update
// ---------------------------------------------------------------------------
test.describe.serial('Global edit -> frontend update', () => {
  test.slow()

  let originalMission: string | undefined

  test('updating Home mission statement reflects on homepage', async ({
    page,
    payloadAPI,
  }) => {
    // 1. Read current Home global
    const home = await payloadAPI.getGlobal('home')
    originalMission = (home.missionStatement as string) ?? ''

    // 2. Update with a unique test string
    const testString = `E2E mission test ${Date.now()}`
    await payloadAPI.updateGlobal('home', { missionStatement: testString })

    // 3. Wait for revalidation and check the homepage
    await waitForRevalidation(page, '/')

    const body = page.locator('main')
    await expect(body).toContainText(testString, { timeout: 10_000 })

    // 4. Restore original value
    await payloadAPI.updateGlobal('home', { missionStatement: originalMission })
  })
})

// ---------------------------------------------------------------------------
// Group B: Draft preview workflow
// ---------------------------------------------------------------------------
test.describe.serial('Draft preview workflow', () => {
  test.slow()

  let createdPostId: string | undefined

  test('draft post is not visible on /news but appears in preview mode', async ({
    page,
    payloadAPI,
  }) => {
    const previewSecret = process.env.PREVIEW_SECRET
    if (!previewSecret) {
      test.skip(!previewSecret, 'PREVIEW_SECRET env var is required')
      return
    }

    const uniqueTitle = `Draft E2E ${Date.now()}`
    const slug = `draft-e2e-${Date.now()}`

    // 1. Create a draft post
    const post = await payloadAPI.createDoc('posts', {
      title: uniqueTitle,
      slug,
      _status: 'draft',
      content: [
        {
          type: 'paragraph',
          children: [{ text: `Test content for ${uniqueTitle}` }],
        },
      ],
    })
    createdPostId = (post.id as string) ?? (post._id as string)

    // 2. Navigate to /news — the draft should NOT be visible
    await page.goto('/news', { waitUntil: 'networkidle' })
    const listing = page.locator('main')
    await expect(listing).not.toContainText(uniqueTitle, { timeout: 5_000 })

    // 3. Enter preview mode via the Next.js preview endpoint
    const previewUrl =
      `/next/preview?previewSecret=${previewSecret}` +
      `&slug=${slug}&collection=posts&path=/news/${slug}`
    await page.goto(previewUrl, { waitUntil: 'networkidle' })

    // After redirect, the draft content should be visible
    await expect(page.locator('body')).toContainText(uniqueTitle, { timeout: 10_000 })

    // 4. Clean up
    if (createdPostId) {
      await payloadAPI.deleteDoc('posts', createdPostId)
      createdPostId = undefined
    }
  })

  // Safety net: delete the post if the test failed before cleanup
  test.afterAll(async ({ request }) => {
    if (!createdPostId) return
    const email = process.env.TEST_ADMIN_EMAIL
    const password = process.env.TEST_ADMIN_PASSWORD
    if (!email || !password) return

    const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    try {
      const loginRes = await request.post(`${baseURL}/api/users/login`, {
        data: { email, password },
        headers: { 'Content-Type': 'application/json' },
      })
      const { token } = await loginRes.json()
      await request.delete(`${baseURL}/api/posts/${createdPostId}`, {
        headers: { Authorization: `users API-Key ${token}` },
      })
    } catch {
      // Best-effort cleanup
    }
  })
})

// ---------------------------------------------------------------------------
// Group C: Media caption propagation
// ---------------------------------------------------------------------------
test.describe.serial('Media caption propagation', () => {
  test.slow()

  let originalCaption: string | undefined
  let mediaId: string | undefined

  test('updating media caption revalidates artist page', async ({
    page,
    payloadAPI,
  }) => {
    // 1. Find a published artist with a hero image
    const { docs: artists } = await payloadAPI.findDocs('artists', {
      'where[image][exists]': 'true',
      'where[_status][equals]': 'published',
      limit: '1',
      depth: '1',
    })

    if (!artists.length) {
      test.skip(true, 'No published artist with an image found — skipping')
      return
    }

    const artist = artists[0]
    const slug = artist.slug as string

    // Resolve the media document ID
    const imageField = artist.image as Record<string, unknown> | string
    mediaId =
      typeof imageField === 'string'
        ? imageField
        : ((imageField?.id as string) ?? (imageField?._id as string))

    if (!mediaId) {
      test.skip(true, 'Could not resolve media ID from artist.image')
      return
    }

    // 2. Read the current media caption
    const { docs: mediaDocs } = await payloadAPI.findDocs('media', {
      'where[id][equals]': mediaId,
      limit: '1',
    })

    if (!mediaDocs.length) {
      test.skip(true, 'Media document not found')
      return
    }

    originalCaption = (mediaDocs[0].caption as string) ?? ''

    // 3. Update caption with a unique test string
    const testCaption = `E2E caption test ${Date.now()}`
    await payloadAPI.updateDoc('media', mediaId, { caption: testCaption })

    // 4. Wait for revalidation and check the artist page
    await waitForRevalidation(page, `/artists/${slug}`)

    await expect(page.locator('body')).toContainText(testCaption, { timeout: 10_000 })

    // 5. Restore original caption
    await payloadAPI.updateDoc('media', mediaId, { caption: originalCaption })
  })
})
