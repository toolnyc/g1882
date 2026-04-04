import { withSentryConfig } from '@sentry/nextjs'
import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
      },
    ],
  },
  webpack: (webpackConfig, { isServer }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Exclude server-only packages from client bundle
    if (!isServer) {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      }

      // Exclude nodemailer and related packages from client bundle
      webpackConfig.externals = webpackConfig.externals || []
      webpackConfig.externals.push({
        nodemailer: 'commonjs nodemailer',
        'nodemailer/lib/dkim': 'commonjs nodemailer/lib/dkim',
      })
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
}

const isProduction = process.env.VERCEL_ENV === 'production'

export default withSentryConfig(withPayload(nextConfig, { devBundleServerPackages: false }), {
  // Suppresses source map upload logs during build
  silent: true,
  // Only upload source maps for production deploys (saves ~15-30s on preview builds)
  disableServerWebpackPlugin: !isProduction,
  disableClientWebpackPlugin: !isProduction,
  widenClientFileUpload: isProduction,
  hideSourceMaps: true,
  // Tree-shakes Sentry debug logging statements to reduce bundle size
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
})
