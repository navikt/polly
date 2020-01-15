import * as React from "react";
import {Route, Switch} from "react-router-dom";

import Root from "./components/Root";
import PurposePage from "./pages/PurposePage";
import InformationtypeCreatePage from "./pages/InformationtypeCreatePage";
import InformationtypeEditPage from "./pages/InformationtypeEditPage";
import InformationtypePage from './pages/InformationtypePage'
import ThirdPartySearchPage from "./pages/ThirdPartySearchPage";
import ThirdPartyMetadataPage from './pages/ThirdPartyPage'
import {Main} from "./pages/MainPage"
import CodelistPage from "./pages/CodelistPage"
import { AuditPage } from "./pages/AuditPage"


const Routes = (): JSX.Element => (
    <Root>
        <Switch>
            <Route exact path="/purpose/:purposeCode?/:processId?" component={PurposePage}/>
            <Route exact path="/thirdparty" component={ThirdPartySearchPage} />
            <Route exact path="/thirdparty/:sourceCode" component={ThirdPartyMetadataPage} />
            <Route
                exact
                path="/informationtype/create"
                component={InformationtypeCreatePage}
            />
            <Route
                exact
                path="/informationtype/edit/:id"
                component={InformationtypeEditPage}
            />
            <Route
                exact
                path="/informationtype/:id?/:purpose?"
                component={InformationtypePage}
            />
            <Route
                exact
                path="/admin/codelist/:listname?"
                component={CodelistPage}
            />
            <Route
                exact
                path="/admin/audit/:id?/:auditId?"
                component={AuditPage}
            />
            <Route>
                <Main/>
            </Route>

        </Switch>
    </Root>
);

export default Routes;
