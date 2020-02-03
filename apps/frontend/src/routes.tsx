import * as React from "react";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";

import Root from "./components/Root";
import PurposePage from "./pages/PurposePage";
import InformationtypeCreatePage from "./pages/InformationtypeCreatePage";
import InformationtypeEditPage from "./pages/InformationtypeEditPage";
import InformationtypePage from './pages/InformationtypePage'
import ThirdPartySearchPage from "./pages/ThirdPartySearchPage";
import ThirdPartyMetadataPage from './pages/ThirdPartyPage'
import { Main } from "./pages/MainPage"
import CodelistPage from "./pages/admin/CodelistPage"
import { AuditPage } from "./pages/admin/AuditPage"
import { intl, theme } from "./util"
import { Block } from "baseui/block"
import { Paragraph1 } from "baseui/typography"
import notFound from "./resources/notfound.svg"
import { SettingsPage } from "./pages/admin/SettingsPage"


const Routes = (): JSX.Element => (
  <Root>
    <Switch>
      <Route exact path="/purpose/:purposeCode?/:processId?" component={PurposePage}/>
      <Route exact path="/thirdparty" component={ThirdPartySearchPage}/>
      <Route exact path="/thirdparty/:sourceCode" component={ThirdPartyMetadataPage}/>
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
      <Route
        exact
        path="/admin/settings"
        component={SettingsPage}
      />
      <Route
        exact
        path="/"
        component={Main}
      />
      <Route component={withRouter(NotFound)}/>
    </Switch>
  </Root>
)

const NotFound = (props: RouteComponentProps<any>) => (
  <Block display="flex" justifyContent="center" alignContent="center" marginTop={theme.sizing.scale4800}>
    <Paragraph1>{intl.pageNotFound} - {props.location.pathname}</Paragraph1>
    <img src={notFound} alt={intl.pageNotFound} style={{maxWidth: "65%"}}/>
  </Block>
)

export default Routes
