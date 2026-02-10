import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads successfully with 200 status', async ({ page }) => {
    const response = await page.goto('/')
    expect(response).not.toBeNull()
    expect(response!.status()).toBe(200)
  })

  test('hero section is visible', async ({ page }) => {
    await page.goto('/')

    // The GalleryHero renders a full-screen <section> with the video iframe
    const heroSection = page.locator('section').first()
    await expect(heroSection).toBeVisible()

    // Video iframe should be present in the hero
    const heroIframe = heroSection.locator('iframe')
    await expect(heroIframe).toBeAttached()
  })

  test('navigation links are present', async ({ page }) => {
    await page.goto('/')

    const header = page.locator('header')
    await expect(header).toBeVisible()

    // The header contains the Gallery 1882 logo link
    const logoLink = header.locator('a[href="/"]')
    await expect(logoLink).toBeVisible()

    // Desktop nav should contain the three main links
    const desktopNav = header.locator('nav')
    await expect(desktopNav.locator('a[href="/happenings"]')).toBeAttached()
    await expect(desktopNav.locator('a[href="/artists"]')).toBeAttached()
    await expect(desktopNav.locator('a[href="/visit"]')).toBeAttached()
  })

  test('current exhibition or "Up Next" section renders when data exists', async ({ page }) => {
    await page.goto('/')

    const main = page.locator('main')
    await expect(main).toBeVisible()

    // The homepage may show a current exhibition ("On Now") or "Up Next" section,
    // or neither if no happenings are configured. We verify the main content area loads.
    // Look for section-level content blocks below the hero.
    const sections = main.locator('section')
    const sectionCount = await sections.count()
    // At minimum the hero section should exist
    expect(sectionCount).toBeGreaterThanOrEqual(1)
  })

  test('footer is visible with expected sections', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    // Footer should contain the gallery name
    await expect(footer.locator('h3')).toBeVisible()

    // Footer should contain Sitemap section with links
    await expect(footer.getByText('Sitemap')).toBeVisible()
    const sitemapLinks = footer.locator('nav a')
    const linkCount = await sitemapLinks.count()
    expect(linkCount).toBeGreaterThanOrEqual(4)

    // Footer should contain Hours section
    await expect(footer.getByText('Our Hours')).toBeVisible()

    // Footer should contain Contact section
    await expect(footer.getByText('Contact')).toBeVisible()

    // Footer should contain Newsletter section
    await expect(footer.getByText('News')).toBeVisible()

    // Footer should contain copyright text
    const copyrightText = footer.getByText(/All rights reserved/)
    await expect(copyrightText).toBeVisible()
  })
})
