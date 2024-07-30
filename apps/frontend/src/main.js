import { BaseProvider } from 'baseui'
import { BrowserRouter as Router } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import { Client as Styletron } from 'styletron-engine-atomic'
import { Provider as StyletronProvider } from 'styletron-react'
import AppRoutes from './AppRoutes'
import Header from './components/Header'
import SideBar from './components/SideBar/SideBar'
import { codelist } from './service/Codelist'
import { user } from './service/User'
import { theme, useAwait } from './util'

const engine = new Styletron()

const Main = (props) => {
  const { history } = props

  // all pages need these
  useAwait(codelist.wait())
  useAwait(user.wait())

  return (
    <Fragment>
      <StyletronProvider value={engine}>
        <BaseProvider theme={theme}>
          <Router history={history}>
            <div className="flex h-full min-h-screen w-full bg-[#F1F1F1]"  >
              <div className="min-w-60 min-h-full">
                <SideBar />
              </div>
              <div className="min-h-full w-full mb-48">
                <div>
                  <Header/>
                </div>
                <div className="mt-16 px-7">
                  <AppRoutes />
                </div>
              </div>
            </div>
          </Router>
        </BaseProvider>
      </StyletronProvider>
    </Fragment>
  )
}

export default Main
