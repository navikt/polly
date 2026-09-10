'use client'

import { Theme } from '@navikt/ds-react'
import { Fragment, FunctionComponent, ReactNode, useEffect, useState } from 'react'
import Header from './components/Header'
import SideBar from './components/SideBar/SideBar'
import { TThemeMode, getInitialThemeMode, persistThemeMode } from './util/themeMode'

type TProps = {
  children: ReactNode
}

const PageThemeWrapper: FunctionComponent<TProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<TThemeMode>(() => getInitialThemeMode())

  useEffect(() => {
    persistThemeMode(themeMode)
  }, [themeMode])

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.body.classList.remove('light', 'dark')

    document.documentElement.classList.add(themeMode)
    document.body.classList.add(themeMode)

    return () => {
      document.documentElement.classList.remove('light', 'dark')
      document.body.classList.remove('light', 'dark')
    }
  }, [themeMode])

  return (
    <Fragment>
      <Theme theme={themeMode} asChild>
        <div className='flex min-h-screen w-full flex-col'>
          <Header themeMode={themeMode} onThemeModeChange={setThemeMode} />

          <div className='flex w-full flex-1'>
            <div className='min-w-60'>
              <SideBar />
            </div>

            <div className='mb-48 w-full min-w-0 px-7 py-7'>{children}</div>
          </div>
        </div>
      </Theme>
    </Fragment>
  )
}

export default PageThemeWrapper
