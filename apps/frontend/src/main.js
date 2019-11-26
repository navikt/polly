import * as React from "react";
import { Block } from "baseui/block";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@data-catalog/theme";
//import {Header} from "@data-catalog/header";
import Header from "./components/Header";
import Routes from "./routes";
import { theme } from "./util/theme";
import { useLang } from "./util/intl/intl";

const Main = props => {
    const { history } = props;
    const setLang = useLang();

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
                <Header setLang={setLang}/>
                <Block margin="0 auto" width="80%" height="100%">
                    <Router history={history}>
                        <Routes />
                    </Router>
                </Block>
            </ThemeProvider>
        </React.Fragment>
    );
};

export default Main;
