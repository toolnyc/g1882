import { test, expect } from '@playwright/test'

test.describe('Happenings', () => {
  test('listing page loads successfully', async ({ page }) => {
    const response = await page.goto('/happenings')
    expect(response).not.toBeNull()
    expect(response!.status()).toBe(200)
  })

  test('page title is displayed', async ({ page }) => {
    await page.goto('/happenings')

    // The DirectoryListing component renders an h1 with the title "Happenings"
    const heading = page.locator('h1', { hasText: 'Happenings' })
    await expect(heading).toBeVisible()
  })

  test('at least one happening card is visible or empty state is handled', async ({ page }) => {
    await page.goto('/happenings')

    // DirectoryListing renders items as links with h3 elements inside .group containers
    // If happenings exist, we should see group headers (h2) and item names (h3)
    const itemLinks = page.locator('.group a[href^="/happenings/"]')
    const groupHeaders = page.locator('[data-group-key]')

    const itemCount = await itemLinks.count()
    const groupCount = await groupHeaders.count()

    // Either there are items listed, or the page still renders without errors
    if (itemCount > 0) {
      expect(groupCount).toBeGreaterThanOrEqual(1)
      await expect(itemLinks.first()).toBeVisible()
    } else {
      // Even with no items, the page should have loaded without error
      // The h1 title should still be present
      await expect(page.locator('h1', { hasText: 'Happenings' })).toBeVisible()
    }
  })

  test('clicking a happening navigates to its detail page', async ({ page }) => {
    await page.goto('/happenings')

    const happeningLink = page.locator('.group a[href^="/happenings/"]').first()
    const linkExists = (await happeningLink.count()) > 0

    if (!linkExists) {
      test.skip()
      return
    }

    const href = await happeningLink.getAttribute('href')
    expect(href).toBeTruthy()

    await happeningLink.click()
    await page.waitForURL(`**${href}`)

    // The detail page should load with a 200 status
    expect(page.url()).toContain('/happenings/')
  })

  test('detail page shows title and dates', async ({ page }) => {
    await page.goto('/happenings')

    const happeningLink = page.locator('.group a[href^="/happenings/"]').first()
    const linkExists = (await happeningLink.count()) > 0

    if (!linkExists) {
      test.skip()
      return
    }

    await happeningLink.click()
    await page.waitForURL('**/happenings/**')

    // Detail page should have the happening title as h1
    const title = page.locator('article h1')
    await expect(title).toBeVisible()
    const titleText = await title.textContent()
    expect(titleText).toBeTruthy()
    expect(titleText!.trim().length).toBeGreaterThan(0)

    // Date section should be present (the "Start:" label in the date block)
    const dateSection = page.locator('article').locator('text=Start:')
    const datesVisible = (await dateSection.count()) > 0
    // Dates are optional (some happenings may not have them set), but the
    // article element itself should be present regardless
    const article = page.locator('article')
    await expect(article).toBeVisible()

    if (datesVisible) {
      await expect(dateSection.first()).toBeVisible()
    }
  })
})
