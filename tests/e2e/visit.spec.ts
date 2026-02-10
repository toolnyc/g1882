import { test, expect } from '@playwright/test'

test.describe('Visit Page', () => {
  test('loads successfully with 200 status', async ({ page }) => {
    const response = await page.goto('/visit')
    expect(response).not.toBeNull()
    expect(response!.status()).toBe(200)
  })

  test('page title is displayed', async ({ page }) => {
    await page.goto('/visit')

    // The VisitPageClient renders an h1 with "Visit"
    const heading = page.locator('h1', { hasText: 'Visit' })
    await expect(heading).toBeVisible()
  })

  test('core sections render based on configured data', async ({ page }) => {
    await page.goto('/visit')

    const main = page.locator('main')
    await expect(main).toBeVisible()

    // The visit page renders multiple gallery-section blocks.
    // Check for sections that are commonly configured.
    const sections = main.locator('section')
    const sectionCount = await sections.count()

    // At least the header section should exist
    expect(sectionCount).toBeGreaterThanOrEqual(1)

    // Check for hours section — rendered when visit.hours data exists
    const hoursHeading = page.locator('h2', { hasText: /Gallery Hours|Hours/ })
    const hasHours = (await hoursHeading.count()) > 0
    if (hasHours) {
      await expect(hoursHeading.first()).toBeVisible()
    }

    // Check for location / "Getting Here" section
    const locationHeading = page.locator('h2', { hasText: /Getting Here|Location/ })
    const hasLocation = (await locationHeading.count()) > 0
    if (hasLocation) {
      await expect(locationHeading.first()).toBeVisible()
    }

    // Check for FAQ section
    const faqHeading = page.locator('h2', { hasText: /Visitor Information|FAQ/ })
    const hasFaqs = (await faqHeading.count()) > 0
    if (hasFaqs) {
      await expect(faqHeading.first()).toBeVisible()
    }
  })
})
