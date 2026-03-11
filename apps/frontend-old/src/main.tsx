import { Theme } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router'
import { Fragment } from 'react/jsx-runtime'
import AppRoutes from './AppRoutes'
import Header from './components/Header'
import SideBar from './components/SideBar/SideBar'
import { CodelistService } from './service/Codelist'
import { user } from './service/User'
import { useAwait } from './util'
import {
  TPermissionMode,
  getInitialPermissionMode,
  setPermissionMode,
} from './util/permissionOverride'
import { TThemeMode, getInitialThemeMode, persistThemeMode } from './util/themeMode'

const Main = () => {
  // all pages need these
  useAwait(user.wait())
  const [codelistUtils] = CodelistService()
  useAwait(codelistUtils.fetchData())

  const [themeMode, setThemeMode] = useState<TThemeMode>(() => getInitialThemeMode())
  const [permissionMode, setPermissionModeState] = useState<TPermissionMode>(() =>
    getInitialPermissionMode()
  )

  useEffect(() => {
    persistThemeMode(themeMode)
  }, [themeMode])

  const handlePermissionModeChange = (value: TPermissionMode) => {
    setPermissionMode(value)
    setPermissionModeState(value)
  }

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
      <BrowserRouter window={window}>
        <Theme theme={themeMode} asChild>
          <div className="flex min-h-screen w-full flex-col">
            <Header
              themeMode={themeMode}
              onThemeModeChange={setThemeMode}
              permissionMode={permissionMode}
              onPermissionModeChange={handlePermissionModeChange}
            />

            <div className="flex w-full flex-1">
              <div className="min-w-60">
                <SideBar />
              </div>

              <div className="mb-48 w-full px-7 py-7">
                <AppRoutes />
              </div>
            </div>
          </div>
        </Theme>
      </BrowserRouter>
    </Fragment>
  )
}

export default Main
