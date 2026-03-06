import { type NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.POLLY_BACKEND_URL || 'http://localhost:8080'

function splitHostAndPort(hostHeader: string | null): { host: string | null; port: string | null } {
  if (!hostHeader) return { host: null, port: null }
  // Handles "localhost:3000" and "example.com" (no port)
  const idx = hostHeader.lastIndexOf(':')
  if (idx > -1 && hostHeader.indexOf(']') === -1) {
    const host = hostHeader.slice(0, idx)
    const port = hostHeader.slice(idx + 1)
    if (host && port) return { host: hostHeader, port }
  }
  return { host: hostHeader, port: null }
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  const shouldProxy =
    pathname === '/login' || pathname === '/logout' || pathname.startsWith('/oauth2/')
  if (!shouldProxy) {
    return NextResponse.next()
  }

  const targetUrl = new URL(`${pathname}${search}`, BACKEND_URL)

  const requestHeaders = new Headers(request.headers)

  const hostHeader = request.headers.get('host')
  const { port } = splitHostAndPort(hostHeader)

  // Ensure Spring sees the original (frontend) host when it builds callback URLs.
  if (hostHeader) requestHeaders.set('x-forwarded-host', hostHeader)

  // Prefer existing forwarded proto (e.g. from ingress), else fall back to URL scheme.
  const proto =
    request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '')
  if (proto) requestHeaders.set('x-forwarded-proto', proto)

  // Some setups use X-Forwarded-Port directly.
  if (port) requestHeaders.set('x-forwarded-port', port)

  return NextResponse.rewrite(targetUrl, {
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ['/login', '/logout', '/oauth2/:path*'],
}
