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
import DocumentCreatePage from "./pages/DocumentCreatePage";
import DocumentPage from "./pages/DocumentPage";
import DocumentEditPage from "./pages/DocumentEditPage";
import { PurposeListPage } from './pages/PurposeListPage'
import { AlertEventPage } from './pages/AlertEventPage'


const Routes = (): JSX.Element => (
  <Root>
    <Switch>
      <Route exact path="/thirdparty" component={ThirdPartySearchPage}/>
      <Route exact path="/thirdparty/:thirdPartyCode" component={ThirdPartyMetadataPage}/>
      <Route exact path="/process" component={PurposeListPage}/>
      <Route exact path="/process/purpose/:code?/:processId?" component={PurposePage}/>
      <Route exact path="/process/department/:code?/:processId?" component={PurposePage}/>
      <Route exact path="/process/subdepartment/:code?/:processId?" component={PurposePage}/>
      <Route exact path="/process/team/:code?/:processId?" component={PurposePage}/>

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
        path="/document/create"
        component={DocumentCreatePage}
      />
      <Route
        exact
        path="/document/:id?"
        component={DocumentPage}
      />
      <Route
        exact
        path="/document/edit/:id?"
        component={DocumentEditPage}
      />
      <Route
        exact
        path="/alert/events"
        component={AlertEventPage}
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
