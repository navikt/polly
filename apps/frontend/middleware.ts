import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.POLLY_BACKEND_URL || 'http://localhost:8080'

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // These are actual Next.js API routes — don't proxy them
  if (pathname === '/api/isAlive' || pathname === '/api/isReady') {
    return NextResponse.next()
  }

  let backendPath = pathname
  if (pathname.startsWith('/api/internal/')) {
    backendPath = pathname.replace(/^\/api\/internal/, '/internal')
  } else if (pathname.startsWith('/api/')) {
    backendPath = pathname.replace(/^\/api/, '')
  }

  const targetUrl = new URL(`${backendPath}${search}`, BACKEND_URL)

  const requestHeaders = new Headers(request.headers)
  const hostHeader = request.headers.get('host')
  if (hostHeader) requestHeaders.set('x-forwarded-host', hostHeader)
  const proto =
    request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '')
  if (proto) requestHeaders.set('x-forwarded-proto', proto)

  return NextResponse.rewrite(targetUrl, { request: { headers: requestHeaders } })
}

export const config: {
  matcher: string[]
} = {
  matcher: [
    '/api/:path*',
    '/login/:path*',
    '/oauth2/:path*',
    '/logout/:path*',
    '/swagger-ui',
    '/swagger-ui/:path*',
    '/swagger-docs',
    '/swagger-docs/:path*',
  ],
}
