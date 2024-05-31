import * as React from 'react'
import { Helmet } from 'react-helmet'
import { useEffect } from 'react'

interface RootProps {
  children: JSX.Element | Array<JSX.Element>
}

const Root = ({ children }: RootProps): JSX.Element => {
    document.title = 'Behandlingskatalog'
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Behandlingskatalog</title>
      </Helmet>
      {children}
    </div>
  )
}

export default Root
