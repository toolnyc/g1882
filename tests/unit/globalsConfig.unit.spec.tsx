import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

/**
 * Structural tests for all new global configs added by feature branches.
 * Verifies that config files exist, export correctly, and have expected fields.
 */

const srcDir = resolve(__dirname, '../../src')

describe('Policies global', () => {
  const configPath = resolve(srcDir, 'globals/Policies/config.ts')

  it('config file exists', () => {
    expect(existsSync(configPath)).toBe(true)
  })

  it('revalidation hook is configured', () => {
    const source = readFileSync(configPath, 'utf-8')
    expect(source).toContain('createRevalidateHook')
  })

  it('exports Policies with correct slug', () => {
    const source = readFileSync(configPath, 'utf-8')
    expect(source).toContain("slug: 'policies'")
  })

  it('has privacy, cookies, terms, and landAcknowledgement fields', () => {
    const source = readFileSync(configPath, 'utf-8')
    for (const field of ['privacyContent', 'cookiesContent', 'termsContent', 'landAcknowledgementContent']) {
      expect(source).toContain(`'${field}'`)
    }
  })
})

describe('OurStory global', () => {
  const configPath = resolve(srcDir, 'globals/OurStory/config.ts')

  it('config file exists', () => {
    expect(existsSync(configPath)).toBe(true)
  })

  it('revalidation hook is configured', () => {
    const source = readFileSync(configPath, 'utf-8')
    expect(source).toContain('createRevalidateHook')
  })

  it('exports OurStory with correct slug', () => {
    const source = readFileSync(configPath, 'utf-8')
    expect(source).toContain("slug: 'our-story'")
  })

  it('has photos array field', () => {
    const source = readFileSync(configPath, 'utf-8')
    expect(source).toContain("name: 'photos'")
    expect(source).toContain("type: 'array'")
  })
})

describe('SiteSettings global', () => {
  const configPath = resolve(srcDir, 'globals/SiteSettings/config.ts')

  it('config file exists', () => {
    expect(existsSync(configPath)).toBe(true)
  })

  it('exports SiteSettings with correct slug', () => {
    const source = readFileSync(configPath, 'utf-8')
    expect(source).toContain("slug: 'site-settings'")
  })

  it('has search configuration fields', () => {
    const source = readFileSync(configPath, 'utf-8')
    expect(source).toContain('artistsShowSearch')
    expect(source).toContain('happeningsShowSearch')
  })
})

describe('New pages exist', () => {
  const pages = [
    'app/(frontend)/our-story/page.tsx',
    'app/(frontend)/terms/page.tsx',
    'app/(frontend)/privacy/page.tsx',
    'app/(frontend)/cookies/page.tsx',
    'app/(frontend)/land-acknowledgement/page.tsx',
  ]

  for (const page of pages) {
    it(`${page} exists`, () => {
      expect(existsSync(resolve(srcDir, page))).toBe(true)
    })
  }
})

describe('New components exist', () => {
  const components = [
    'components/AccessibilityWidget/index.tsx',
    'components/PhotoCarousel/index.tsx',
    'components/WorksMasonryGrid/index.tsx',
  ]

  for (const component of components) {
    it(`${component} exists`, () => {
      expect(existsSync(resolve(srcDir, component))).toBe(true)
    })
  }
})

describe('Home global config', () => {
  const configPath = resolve(srcDir, 'globals/Home/config.ts')

  it('has Newsletter Popup tab', () => {
    const source = readFileSync(configPath, 'utf-8')
    expect(source).toContain('Newsletter Popup')
    expect(source).toContain('popupHeadline')
    expect(source).toContain('popupDescription')
    expect(source).toContain('popupButtonText')
    expect(source).toContain('popupSuccessMessage')
  })

  it("has What's Happening tab", () => {
    const source = readFileSync(configPath, 'utf-8')
    expect(source).toContain("What's Happening")
    expect(source).toContain('whatsHappeningEnabled')
    expect(source).toContain('whatsHappeningTitle')
    expect(source).toContain('whatsHappeningIcon')
  })

  it('has hero video fields', () => {
    const source = readFileSync(configPath, 'utf-8')
    expect(source).toContain('heroVideo')
    expect(source).toContain('heroVideoPoster')
  })
})

describe('No merge conflict markers in source files', () => {
  const criticalFiles = [
    'payload.config.ts',
    'globals/Home/config.ts',
    'components/GalleryHero/index.tsx',
    'components/HomePage/HomePageClient.tsx',
    'app/(frontend)/page.tsx',
    'components/WorksMasonryGrid/index.tsx',
  ]

  for (const file of criticalFiles) {
    it(`${file} has no conflict markers`, () => {
      const source = readFileSync(resolve(srcDir, file), 'utf-8')
      expect(source).not.toContain('<<<<<<<')
      expect(source).not.toContain('=======')
      expect(source).not.toContain('>>>>>>>')
    })
  }
})
