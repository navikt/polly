import { BrowserRouter } from 'react-router'
import { Fragment } from 'react/jsx-runtime'
import AppRoutes from './AppRoutes'
import Header from './components/Header'
import SideBar from './components/SideBar/SideBar'
import { CodelistService } from './service/Codelist'
import { user } from './service/User'
import { useAwait } from './util'

const Main = () => {
  // all pages need these
  useAwait(user.wait())
  const [codelistUtils] = CodelistService()
  useAwait(codelistUtils.fetchData())

  return (
    <Fragment>
      <BrowserRouter window={window}>
        <div className="flex min-h-screen w-full flex-col bg-white">
          <Header />

          <div className="flex w-full flex-1">
            <div className="min-w-60">
              <SideBar />
            </div>

            <div className="mb-48 w-full px-7 py-7">
              <AppRoutes />
            </div>
          </div>
        </div>
      </BrowserRouter>
    </Fragment>
  )
}

export default Main
