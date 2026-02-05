import { BaseProvider } from 'baseui'
import { BrowserRouter } from 'react-router'
import { Fragment } from 'react/jsx-runtime'
import { Client as Styletron } from 'styletron-engine-atomic'
import { Provider as StyletronProvider } from 'styletron-react'
import AppRoutes from './AppRoutes'
import Header from './components/Header'
import SideBar from './components/SideBar/SideBar'
import { CodelistService } from './service/Codelist'
import { user } from './service/User'
import { theme, useAwait } from './util'

const engine = new Styletron()

const Main = () => {
  // all pages need these
  useAwait(user.wait())
  const [codelistUtils] = CodelistService()
  useAwait(codelistUtils.fetchData())

  return (
    <Fragment>
      <StyletronProvider value={engine}>
        <BaseProvider theme={theme}>
          <BrowserRouter window={window}>
            <div className="flex min-h-screen w-full flex-col bg-white">
              <Header />

              <div className="flex w-full flex-1">
                <div className="min-w-60">
                  <SideBar />
                </div>

                <div className="w-full mb-48 px-7 py-7">
                  <AppRoutes />
                </div>
              </div>
            </div>
          </BrowserRouter>
        </BaseProvider>
      </StyletronProvider>
    </Fragment>
  )
}

export default Main
