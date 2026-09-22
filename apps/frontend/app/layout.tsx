import { headers } from 'next/headers'
import { FunctionComponent, ReactNode, Suspense } from 'react'
import './main.css'
import PageThemeWrapper from './pageThemeWrapper'
import { CodelistProvider } from './provider/kodeverkProvider'
import { UserProvider } from './provider/userProvider'

type TProps = {
  children: ReactNode
}

const Main: FunctionComponent<TProps> = async ({ children }) => {
  const requestHeaders = await headers()
  const host = requestHeaders.get('host') ?? ''
  const proto =
    requestHeaders.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  const origin = host ? `${proto}://${host}` : undefined

  return (
    <html lang='nb'>
      <head>
        <link rel='icon' href='/favicon.ico' type='image/x-icon' />
        <meta charSet='utf-8' />
        <title>Behandlingskatalog</title>
      </head>
      <body>
        <UserProvider>
          <CodelistProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <PageThemeWrapper origin={origin}>{children}</PageThemeWrapper>
            </Suspense>
          </CodelistProvider>
        </UserProvider>
      </body>
    </html>
  )
}

export default Main
