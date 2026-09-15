import { FunctionComponent, ReactNode, Suspense } from 'react'
import './main.css'
import PageThemeWrapper from './pageThemeWrapper'
import { CodelistProvider } from './provider/kodeverkProvider'
import { UserProvider } from './service/User'

type TProps = {
  children: ReactNode
}

const Main: FunctionComponent<TProps> = async ({ children }) => {
  return (
    <html lang='nb'>
      <head>
        <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
        <meta charSet='utf-8' />
        <title>Behandlingskatalog</title>
      </head>
      <body>
        <UserProvider>
          <CodelistProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <PageThemeWrapper>{children}</PageThemeWrapper>
            </Suspense>
          </CodelistProvider>
        </UserProvider>
      </body>
    </html>
  )
}

export default Main
