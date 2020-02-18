import * as React from "react";
import { Block, BlockProps } from "baseui/block";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";
import { theme } from "./util/theme";
import { useLang } from "./util/intl/intl";
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider, styled } from 'baseui';
import { Client as Styletron } from 'styletron-engine-atomic';
import SideBar from "./components/SideBar";
import TempHeader from "./components/TempHeader";

const engine = new Styletron();

const Layout = styled('div', {
    display: 'flex',
    alignItems: 'flex-start',
    height: '100%',
    width: '100%'
})

const MainContent = styled('div', {
    height: '100%',
    width: '80%',
    marginLeft: '240px', //Width of sidebar
    marginTop: '2rem'
})


const Main = props => {
    const { history } = props;
    const setLang = useLang();

    return (
        <React.Fragment>
            <StyletronProvider value={engine}>
                <BaseProvider theme={theme}>
                    <Router history={history}>
                        <Block display="flex" height="100%">
                            <Block marginRight="2rem">
                                 <SideBar />
                            </Block>

                            <Block width="100%">
                                <TempHeader setLang={setLang}/>
                                <MainContent>
                                    <Routes />
                                </MainContent>
                            </Block>
                        </Block>
                    </Router>
                </BaseProvider>
            </StyletronProvider>
        </React.Fragment>
    );
};

export default Main;
