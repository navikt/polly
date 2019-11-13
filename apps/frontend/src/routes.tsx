import * as React from "react";
import { Route, Switch } from "react-router-dom";

import Root from "./components/Root";
import PurposePage from "./pages/PurposePage";
import InformationtypeCreatePage from "./pages/InformationtypeCreatePage";
import InformationtypeEditPage from "./pages/InformationtypeEditPage";
import axios from "axios"
import { UserInfo } from "./constants"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;
axios.defaults.withCredentials = true;

const Main = () => {
  const [user, setUser] = React.useState<UserInfo>();

  React.useEffect(() => {
    const fetchData = async () => {
      await axios
      .get(`${server_polly}/userinfo`)
      .then(res => {
        console.log(res);
        setUser(res.data);
      });

    };
    fetchData();
  }, []);

  return (
      <div>
        <div>
          {!user && <p><a href={`${server_polly}/login?redirect_uri=${window.location.href}`}>login</a></p>}
          {user && <p>Hei {user.navIdent} {user.givenName} {user.familyName} <a href={`${server_polly}/logout?redirect_uri=${window.location.href}`}>logout</a></p>}
        </div>
        <div>
          Datacatalog id parameter missing. Format https://url/id
        </div>
      </div>
  )
}

const Routes = (): JSX.Element => (
    <Root>
        <Switch>
            <Route exact path="/purpose" component={PurposePage} />

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
                component={Main}
            />
        </Switch>
    </Root>
);

export default Routes;
