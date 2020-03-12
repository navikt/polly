import * as React from 'react'
import {Block} from 'baseui/block'
import {BrowserRouter as Router} from 'react-router-dom'
import Routes from './routes'
import {theme} from './util/theme'
import {useLang} from './util/intl/intl'
import {Provider as StyletronProvider} from 'styletron-react'
import {BaseProvider, styled} from 'baseui'
import {Client as Styletron} from 'styletron-engine-atomic'
import SideBar from './components/SideBar'
import Header from './components/Header'

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

const Main = props => {
  const { history } = props
  const setLang = useLang()

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
