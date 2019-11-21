import * as React from "react";
import {Block} from "baseui/block";
import {BrowserRouter as Router} from "react-router-dom";
import {ThemeProvider} from "@data-catalog/theme";
import {Header} from "@data-catalog/header";

import Routes from "./routes";
import {theme} from "./util/theme"
import {useLang} from "./util/intl"

const Main = (props) => {
  const {history} = props;
  const setLang = useLang();

  return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <Block margin="scale600">
            <Header nav about/>
          </Block>
          <Block margin="0 auto" width="80%" height="100%">
            <Router history={history}>
              <Routes setLang={setLang}/>
            </Router>
          </Block>
        </ThemeProvider>
      </React.Fragment>
  )
}

export default Main;
