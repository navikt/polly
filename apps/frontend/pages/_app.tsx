import '@/main.css'
import { useAppState } from '@/util/permissionOverride'
import 'json-diff-kit/dist/viewer.css'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useEffect } from 'react'

const Main = dynamic(() => import('@/main'), { ssr: false })

function getFavicon(): string {
  const { hostname } = window.location
  if (hostname === 'localhost') return '/favicon_Behandlingskatalog_localhost.ico'
  if (hostname.includes('dev')) return '/favicon_Behandlingskatalog_dev.ico'
  return '/favicon_Behandlingskatalog_prod.ico'
}

function useFavicon() {
  useEffect(() => {
    const link: HTMLLinkElement =
      document.querySelector('link[rel="icon"]') || document.createElement('link')
    link.rel = 'icon'
    link.href = getFavicon()
    document.head.appendChild(link)
  }, [])
}

function PageWrapper({ Component, pageProps }: Pick<AppProps, 'Component' | 'pageProps'>) {
  useAppState()
  return <Component {...pageProps} />
}

export default function App({ Component, pageProps }: AppProps) {
  useFavicon()

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Behandlingskatalog</title>
      </Head>
      <Main>
        <PageWrapper Component={Component} pageProps={pageProps} />
      </Main>
    </>
  )
}
