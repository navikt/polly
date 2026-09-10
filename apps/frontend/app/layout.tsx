import { FunctionComponent, ReactNode } from 'react'
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
            <PageThemeWrapper>{children}</PageThemeWrapper>
          </CodelistProvider>
        </UserProvider>
      </body>
    </html>
  )
}

export default Main
