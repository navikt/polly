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
    width: "100%",
    height: '100%',
})

const MainContent = styled('div', {
    width: "100%",
})


const Main = props => {
    const { history } = props;
    const setLang = useLang();

    return (
        <React.Fragment>
            <StyletronProvider value={engine}>
                <BaseProvider theme={theme}>
                    <Router history={history}>
                        <Layout>
                            <SideBar />
                            <MainContent>
                                <TempHeader />
                                <Block margin="2rem">
                                    <Routes />
                                </Block>
                            </MainContent>
                        </Layout>
                    </Router>
                </BaseProvider>
            </StyletronProvider>
        </React.Fragment>
    );
};

export default Main;
