import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/oauth2') ||
    pathname.startsWith('/logout')
  ) {
    const requestHeaders = new Headers(request.headers)
    const hostHeader = request.headers.get('host')
    if (hostHeader) requestHeaders.set('x-forwarded-host', hostHeader)
    const proto =
      request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '')
    if (proto) requestHeaders.set('x-forwarded-proto', proto)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }
}

export const config: {
  matcher: string[]
} = {
  matcher: ['/api/:path*', '/login/:path*', '/oauth2/:path*', '/logout/:path*'],
}
