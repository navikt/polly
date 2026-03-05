import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    const backendUrl = process.env.POLLY_BACKEND_URL || 'http://localhost:8080'
    return [
      {
        source: '/api/internal/:path*',
        destination: `${backendUrl}/internal/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
      {
        source: '/login',
        destination: `${backendUrl}/login`,
      },
      {
        source: '/oauth2/:path*',
        destination: `${backendUrl}/oauth2/:path*`,
      },
      {
        source: '/logout',
        destination: `${backendUrl}/logout`,
      },
    ]
  },
}

export default nextConfig
