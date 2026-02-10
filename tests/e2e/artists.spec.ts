import { test, expect } from '@playwright/test'

test.describe('Artists', () => {
  test('listing page loads successfully', async ({ page }) => {
    const response = await page.goto('/artists')
    expect(response).not.toBeNull()
    expect(response!.status()).toBe(200)
  })

  test('page title is displayed', async ({ page }) => {
    await page.goto('/artists')

    // The DirectoryListing component renders an h1 with the title "Artists"
    const heading = page.locator('h1', { hasText: 'Artists' })
    await expect(heading).toBeVisible()
  })

  test('artist cards are displayed or empty state is handled', async ({ page }) => {
    await page.goto('/artists')

    // DirectoryListing renders items as links with href="/artists/<slug>"
    const artistLinks = page.locator('.group a[href^="/artists/"]')
    const groupHeaders = page.locator('[data-group-key]')

    const itemCount = await artistLinks.count()
    const groupCount = await groupHeaders.count()

    if (itemCount > 0) {
      // There should be alphabetical group headers (e.g., "A", "B", ...)
      expect(groupCount).toBeGreaterThanOrEqual(1)
      await expect(artistLinks.first()).toBeVisible()
    } else {
      // Even with no artists, the page should have loaded without error
      await expect(page.locator('h1', { hasText: 'Artists' })).toBeVisible()
    }
  })

  test('clicking an artist navigates to their detail page', async ({ page }) => {
    await page.goto('/artists')

    const artistLink = page.locator('.group a[href^="/artists/"]').first()
    const linkExists = (await artistLink.count()) > 0

    if (!linkExists) {
      test.skip()
      return
    }

    const href = await artistLink.getAttribute('href')
    expect(href).toBeTruthy()

    await artistLink.click()
    await page.waitForURL(`**${href}`)

    expect(page.url()).toContain('/artists/')
  })

  test('detail page shows artist name', async ({ page }) => {
    await page.goto('/artists')

    const artistLink = page.locator('.group a[href^="/artists/"]').first()
    const linkExists = (await artistLink.count()) > 0

    if (!linkExists) {
      test.skip()
      return
    }

    // Get the artist name from the listing before navigating
    const artistName = await artistLink.locator('h3').textContent()

    await artistLink.click()
    await page.waitForURL('**/artists/**')

    // Detail page should display the artist name as h1
    const title = page.locator('article h1')
    await expect(title).toBeVisible()
    const titleText = await title.textContent()
    expect(titleText).toBeTruthy()
    expect(titleText!.trim().length).toBeGreaterThan(0)

    // The name on the detail page should match the listing
    if (artistName) {
      expect(titleText!.trim()).toBe(artistName.trim())
    }
  })
})
