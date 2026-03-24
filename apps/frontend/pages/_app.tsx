import '@/main.css'
import { useAppState } from '@/util/permissionOverride'
import 'json-diff-kit/dist/viewer.css'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'

const Main = dynamic(() => import('@/main'), { ssr: false })

function getFavicon(): string {
  if (typeof window === 'undefined') return '/favicon_Behandlingskatalog_prod.ico'
  const { hostname } = window.location
  if (hostname === 'localhost') return '/favicon_Behandlingskatalog_localhost.ico'
  if (hostname.includes('dev')) return '/favicon_Behandlingskatalog_dev.ico'
  return '/favicon_Behandlingskatalog_prod.ico'
}

function PageWrapper({ Component, pageProps }: Pick<AppProps, 'Component' | 'pageProps'>) {
  useAppState()
  return <Component {...pageProps} />
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Behandlingskatalog</title>
        <link rel="icon" href={getFavicon()} />
      </Head>
      <Main>
        <PageWrapper Component={Component} pageProps={pageProps} />
      </Main>
    </>
  )
}
