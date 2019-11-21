import * as React from "react";
import { Link, Route, Switch } from "react-router-dom";

import Root from "./components/Root";
import PurposePage from "./pages/PurposePage";
import InformationtypeCreatePage from "./pages/InformationtypeCreatePage";
import InformationtypeEditPage from "./pages/InformationtypeEditPage";
import InformationtypePage from './pages/InformationtypePage'
import { user } from "./service/User"
import { useAwait } from "./util/customHooks"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

const Main = () => {
  useAwait(user.wait())

  return (
      <div>
        <div>
          <div>
            <p> Du er {!user.isLoggedIn() && 'ikke'} logget inn {user.isLoggedIn() ? 'og' : 'men'} kan
              <b> {user.canRead() && 'lese'} {user.canWrite() && 'skrive'} {user.isAdmin() && 'administrere'} </b>
            </p>
            {user.isLoggedIn() &&
            <p>Hei {user.getNavIdent()} {user.getGivenName()} {user.getFamilyName()} <a href={`${server_polly}/logout?redirect_uri=${window.location.href}`}>logout</a></p>}
            {!user.isLoggedIn() && <p><a href={`${server_polly}/login?redirect_uri=${window.location.href}`}>login</a></p>}
          </div>
          <div>
            <p><Link to="/informationtype">Opplysningstyper</Link></p>
            <p><Link to="/informationtype/create">Ny Opplysningstype</Link></p>
            <p><Link to="/purpose">Formål</Link></p>
          </div>
        </div>
      </div>
  )
}

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
