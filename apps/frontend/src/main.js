import {BaseProvider, styled} from 'baseui'
import {Block} from 'baseui/block'
import * as React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {Client as Styletron} from 'styletron-engine-atomic'
import {Provider as StyletronProvider} from 'styletron-react'
import Header from './components/Header'
import SideBar from './components/SideBar'
import Routes from './routes'
import {ampli} from './service/Amplitude'
import {codelist} from './service/Codelist'
import {user} from './service/User'
import {theme, useAwait} from './util'
import {useLang} from './util/intl/intl'

const engine = new Styletron()

const sidebarMargin = `${240 + 60}px` //Width of sidebar + margin

const MainContent = styled('div', {
  height: '100%',
  width: '80%',
  marginLeft: sidebarMargin,
  marginTop: '4rem',
})

const HeaderContent = styled('div', {
  marginLeft: sidebarMargin,
  width:'80%',
  marginBottom: '50px'
})

ampli.logEvent('visit_count_behandlingskatalog')

const Main = props => {
  const { history } = props
  const setLang = useLang()

  // all pages need these
  useAwait(codelist.wait())
  useAwait(user.wait())

  return (
    <React.Fragment>
      <StyletronProvider value={engine}>
        <BaseProvider theme={theme}>
          <Router history={history}>
            <Block display="flex" height="100%">
              <Block>
                <SideBar/>
              </Block>

              <Block width="100%">
                <HeaderContent>
                  <Header setLang={setLang}/>
                </HeaderContent>
                <MainContent>
                  <Routes/>
                </MainContent>
              </Block>
            </Block>
          </Router>
        </BaseProvider>
      </StyletronProvider>
    </React.Fragment>
  )
}

export default Main
