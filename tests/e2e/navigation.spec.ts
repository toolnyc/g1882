import { test, expect } from '@playwright/test'

/**
 * Main navigation routes matching the GalleryNav and Footer SITEMAP_LINKS.
 */
const MAIN_NAV_ROUTES = [
  { label: 'Home', path: '/' },
  { label: 'Happenings', path: '/happenings' },
  { label: 'Artists', path: '/artists' },
  { label: 'Visit', path: '/visit' },
  { label: 'Journal', path: '/journal' },
  { label: 'Space', path: '/space' },
]

test.describe('Navigation', () => {
  for (const route of MAIN_NAV_ROUTES) {
    test(`${route.label} page (${route.path}) loads without errors`, async ({ page }) => {
      const response = await page.goto(route.path)
      expect(response).not.toBeNull()
      expect(response!.status()).toBe(200)
    })
  }

  test('desktop header nav links are present and navigable', async ({ page }) => {
    await page.goto('/')

    const header = page.locator('header')
    await expect(header).toBeVisible()

    // The GalleryNav has three main links in the desktop nav
    const desktopNav = header.locator('nav')
    const navLinks = desktopNav.locator('a')

    // Happenings, Artists, Visit
    await expect(navLinks.filter({ hasText: 'Happenings' })).toBeAttached()
    await expect(navLinks.filter({ hasText: 'Artists' })).toBeAttached()
    await expect(navLinks.filter({ hasText: 'Visit' })).toBeAttached()

    // Click Happenings and verify navigation
    await navLinks.filter({ hasText: 'Happenings' }).click()
    await page.waitForURL('**/happenings')
    expect(page.url()).toContain('/happenings')
  })

  test('footer sitemap links all resolve without 404s', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    // Get all sitemap links from the footer nav
    const footerNav = footer.locator('nav')
    const footerLinks = footerNav.locator('a')
    const linkCount = await footerLinks.count()

    expect(linkCount).toBeGreaterThanOrEqual(4)

    // Collect all hrefs
    const hrefs: string[] = []
    for (let i = 0; i < linkCount; i++) {
      const href = await footerLinks.nth(i).getAttribute('href')
      if (href) {
        hrefs.push(href)
      }
    }

    // Visit each link and verify it doesn't 404
    for (const href of hrefs) {
      const response = await page.goto(href)
      expect(response).not.toBeNull()
      expect(
        response!.status(),
        `Footer link ${href} returned status ${response!.status()}`,
      ).not.toBe(404)
    }
  })

  test('mobile menu opens and closes', async ({ page }) => {
    // Set a mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    const header = page.locator('header')
    await expect(header).toBeVisible()

    // The mobile menu toggle button has aria-label "Toggle menu"
    const menuButton = header.locator('button[aria-label="Toggle menu"]')
    await expect(menuButton).toBeVisible()

    // Desktop nav should be hidden on mobile (it uses 'hidden md:flex')
    const desktopNav = header.locator('nav.hidden')
    // The nav with 'hidden md:flex' class won't be visible at mobile width
    // Instead, we check that the mobile menu button is the way to navigate

    // Open the mobile menu
    await menuButton.click()

    // Mobile nav should appear with the navigation links
    // The AnimatePresence wrapper renders a motion.div with nav inside
    const mobileNav = header.locator('nav').filter({ has: page.locator('a[href="/happenings"]') })
    await expect(mobileNav.last()).toBeVisible()

    // Verify mobile nav contains the expected links
    await expect(mobileNav.last().locator('a[href="/happenings"]')).toBeVisible()
    await expect(mobileNav.last().locator('a[href="/artists"]')).toBeVisible()
    await expect(mobileNav.last().locator('a[href="/visit"]')).toBeVisible()

    // Close the mobile menu
    await menuButton.click()

    // Wait for the animation to complete and verify the mobile nav is hidden
    // The AnimatePresence exit animation removes the element
    await expect(
      header.locator('nav').filter({ has: page.locator('a[href="/happenings"]') }).last(),
    ).toBeHidden({ timeout: 5000 })
  })
})
