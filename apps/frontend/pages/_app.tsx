import '@/main.css'
import 'json-diff-kit/dist/viewer.css'
import 'moment/locale/nb'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'

const Main = dynamic(() => import('@/main'), { ssr: false })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Behandlingskatalog</title>
      </Head>
      <Main>
        <Component {...pageProps} />
      </Main>
    </>
  )
}
