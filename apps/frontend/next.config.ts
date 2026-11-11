import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Gamle URL-er for databehandler (tidligere /processor) skal fortsatt virke for lagrede lenker.
  // Midlertidig redirect (307) i stedet for permanent, slik at en eventuell tilbakerulling ikke hindres av nettleser-cache.
  async redirects() {
    return [
      { source: '/processor', destination: '/databehandler', permanent: false },
      { source: '/processor/:id', destination: '/databehandler/:id', permanent: false },
    ]
  },
}

export default nextConfig
