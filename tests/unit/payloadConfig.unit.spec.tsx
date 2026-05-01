import { describe, it, expect, vi } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * Tests that verify the payload.config.ts has all expected globals and collections
 * registered after the multi-branch merge. These are structural tests that catch
 * merge-related regressions where a global or collection import might be dropped.
 */

describe('Payload Config Structure', () => {
  const configSource = readFileSync(
    resolve(__dirname, '../../src/payload.config.ts'),
    'utf-8',
  )

  describe('globals registration', () => {
    const expectedGlobals = ['Home', 'Visit', 'Policies', 'OurStory', 'SiteSettings']

    it('has all expected globals in the globals array', () => {
      const globalsMatch = configSource.match(/globals:\s*\[([^\]]+)\]/)
      expect(globalsMatch).toBeTruthy()
      const globalsLine = globalsMatch![1]

      for (const global of expectedGlobals) {
        expect(globalsLine).toContain(global)
      }
    })

    it('imports all global configs', () => {
      for (const global of expectedGlobals) {
        const importPattern = new RegExp(`import\\s*\\{\\s*${global}\\s*\\}`)
        expect(configSource).toMatch(importPattern)
      }
    })
  })

  describe('collections registration', () => {
    const expectedCollections = [
      'Posts',
      'Media',
      'Categories',
      'Users',
      'Artists',
      'Happenings',
      'HappeningTypes',
    ]

    it('has all expected collections', () => {
      const collectionsMatch = configSource.match(/collections:\s*\[([^\]]+)\]/)
      expect(collectionsMatch).toBeTruthy()
      const collectionsLine = collectionsMatch![1]

      for (const collection of expectedCollections) {
        expect(collectionsLine).toContain(collection)
      }
    })
  })

  describe('plugin configuration', () => {
    it('has vercelBlobStorage with clientUploads enabled', () => {
      expect(configSource).toContain('vercelBlobStorage')
      expect(configSource).toContain('clientUploads: true')
    })

    it('spreads plugins from plugins/index', () => {
      expect(configSource).toContain('...plugins')
    })
  })

  describe('onInit hook', () => {
    it('has the happening-types empty collection warning', () => {
      expect(configSource).toContain('happening-types')
      expect(configSource).toContain('totalDocs')
    })
  })
})
