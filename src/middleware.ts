import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const formRateLimitMap = new Map<string, { count: number; resetAt: number }>()
const FORM_RATE_LIMIT_MAX = 5
const FORM_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000

function isFormRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = formRateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    formRateLimitMap.set(ip, { count: 1, resetAt: now + FORM_RATE_LIMIT_WINDOW_MS })
    return false
  }

  entry.count++
  return entry.count > FORM_RATE_LIMIT_MAX
}

setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of formRateLimitMap) {
    if (now > entry.resetAt) formRateLimitMap.delete(ip)
  }
}, FORM_RATE_LIMIT_WINDOW_MS)

export function middleware(request: NextRequest) {
  if (request.method === 'POST' && request.nextUrl.pathname === '/api/form-submissions') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isFormRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      )
    }
  }

  const response = NextResponse.next()

  const pathname = request.nextUrl.pathname

  // Cache-Control for font files and static assets served through middleware
  if (pathname.match(/\.(woff2?|ttf|otf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  } else if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store')
  } else if (!pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300')
  }

  // Security headers (applied to all routes)
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload',
  )

  // CSP only for public frontend — the admin panel is behind auth and needs
  // Server Actions, Lexical editor, Blob uploads, etc. that a strict CSP blocks.
  if (!pathname.startsWith('/admin')) {
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        // Scripts: self + inline for Next.js hydration + eval for dev
        `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}`,
        // Styles: self + inline for Tailwind/Next.js
        "style-src 'self' 'unsafe-inline'",
        // Images: self + Vercel Blob + data URIs
        "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
        // Fonts: self
        "font-src 'self'",
        // Connect: self + weather API
        "connect-src 'self' https://api.open-meteo.com",
        // Media: self + Vercel Blob
        "media-src 'self' https://*.public.blob.vercel-storage.com",
        // Frames: Cloudflare Stream for hero video
        "frame-src 'self' https://*.cloudflarestream.com https://iframe.cloudflarestream.com",
        // Frame ancestors: only self (prevents clickjacking)
        "frame-ancestors 'self'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; '),
    )
  }

  return response
}

export const config = {
  // Apply to all routes except static files and Next.js internals
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
