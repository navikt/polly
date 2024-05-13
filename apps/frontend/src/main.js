import { BaseProvider } from 'baseui'
import { Block } from 'baseui/block'
import * as React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Client as Styletron } from 'styletron-engine-atomic'
import { Provider as StyletronProvider } from 'styletron-react'
import Header from './components/Header'
import SideBar from './components/SideBar/SideBar'
import AppRoutes from './AppRoutes'
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
    <React.Fragment>
      <StyletronProvider value={engine}>
        <BaseProvider theme={theme}>
          <Router history={history}>
            <Block display="flex" height="100%" minHeight={'100vh'} width={'100%'} backgroundColor="#F1F1F1">
              <Block minWidth={'240px'} minHeight={'100%'}>
                <SideBar />
              </Block>
              <Block minHeight={'100%'} width={'100%'} marginBottom={'200px'}>
                <Block>
                  <Header setLang='nb' />
                </Block>
                <Block marginTop={'4rem'} paddingRight={'30px'} paddingLeft={'30px'}>
                  <AppRoutes />
                </Block>
              </Block>
            </Block>
          </Router>
        </BaseProvider>
      </StyletronProvider>
    </React.Fragment>
  )
}

export default Main
