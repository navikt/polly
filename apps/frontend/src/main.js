import * as React from "react";
import { Block } from "baseui/block";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@data-catalog/theme";
import Header from "./components/Header";
import Routes from "./routes";
import { theme } from "./util/theme";
import { useLang } from "./util/intl/intl";
import { BaseProvider } from "baseui";
import { Client } from "styletron-engine-atomic";
import { Provider } from "styletron-react";

const engine = new Client()

const Main = props => {
    const { history } = props;
    const setLang = useLang();

    return (
        <React.Fragment>
            <Provider value={engine}>

            <BaseProvider theme={theme}>
                <Router history={history}>
                    <Header setLang={setLang} history={history}/>
                    <Block margin="0 auto" width="80%" height="100%">
                        <Routes/>
                    </Block>
                </Router>
            </BaseProvider>
            
            </Provider>
        </React.Fragment>
    );
};

export default Main;
