import { FunctionComponent, ReactNode } from 'react'
import './main.css'
import PageWrapper from './pageWrapper'
import { CodelistProvider } from './provider/kodeverkProvider'

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
        <CodelistProvider>
          <PageWrapper>{children}</PageWrapper>
        </CodelistProvider>
      </body>
    </html>
  )
}

export default Main
