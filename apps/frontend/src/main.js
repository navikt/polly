import * as React from "react";
import { Block } from "baseui/block";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@data-catalog/theme";
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
                <Router history={history}>
                    <Header setLang={setLang} history={history}/>
                    <Block margin="0 auto" width="80%" height="100%">
                        <Routes/>
                    </Block>
                </Router>
            </ThemeProvider>
        </React.Fragment>
    );
};

export default Main;
