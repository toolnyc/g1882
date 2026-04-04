/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* Modified to add server-side diagnostics for blank page debugging. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = async ({ params, searchParams }: Args) => {
  const resolvedParams = await params
  const segments = resolvedParams?.segments || []
  const route = `/admin/${segments.join('/')}`

  // Diagnostic: log which admin route is being rendered server-side
  console.log(`[g1882-admin-diagnostics] Rendering admin route: ${route}`)

  try {
    const result = RootPage({ config, params, searchParams, importMap })
    console.log(`[g1882-admin-diagnostics] RootPage returned successfully for: ${route}`)
    return result
  } catch (err) {
    console.error(`[g1882-admin-diagnostics] RootPage threw during server render:`, {
      route,
      error: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err,
    })
    throw err
  }
}

export default Page
