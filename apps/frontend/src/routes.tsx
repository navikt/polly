import * as React from "react";
import { Route, Switch } from "react-router-dom";

import Root from "./components/Root";
import PurposePage from "./pages/PurposePage";
import InformationtypeCreatePage from "./pages/InformationtypeCreatePage";
import InformationtypeEditPage from "./pages/InformationtypeEditPage";
import InformationtypePage from './pages/InformationtypePage'
import { Main } from "./pages/MainPage"


const Routes = (): JSX.Element => (
  <Root>
    <Switch>
      <Route exact path="/purpose/:id?/:processid?" component={PurposePage} />

      <Route
        exact
        path="/informationtype/create"
        component={InformationtypeCreatePage}
      />
      <Route
        exact
        path="/informationtype/:id?"
        component={InformationtypePage}
      />
      <Route
        exact
        path="/informationtype/edit/:id"
        component={InformationtypeEditPage}
      />
      <Route
        component={Main}
      />
    </Switch>
  </Root>
);

export default Routes;
