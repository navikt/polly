import { BaseProvider } from 'baseui'
import { BrowserRouter } from 'react-router-dom'
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
            <div className="flex h-full min-h-screen w-full bg-bg-default">
              <div className="min-w-60 min-h-full">
                <SideBar />
              </div>
              <div className="min-h-full w-full mb-48">
                <div>
                  <Header />
                </div>
                <div className="mt-16 px-7">
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
