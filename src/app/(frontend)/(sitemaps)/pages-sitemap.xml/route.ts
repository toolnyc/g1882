import { getServerSideSitemap } from 'next-sitemap'
import { unstable_cache } from 'next/cache'

const getPagesSitemap = unstable_cache(
  async () => {
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const dateFallback = new Date().toISOString()

    // Static routes only (no dynamic pages collection)
    const staticRoutes = [
      {
        loc: `${SITE_URL}/`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/search`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/news`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/artists`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/exhibitions`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/happenings`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/visit`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/space`,
        lastmod: dateFallback,
      },
    ]

    return staticRoutes
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
