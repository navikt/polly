import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="nb">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon_Behandlingskatalog_prod.ico" id="favicon" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
