import * as React from "react";
import { Route, Switch } from "react-router-dom";

import Root from "./components/Root";
import PurposePage from "./pages/PurposePage";
import InformationtypeCreatePage from "./pages/InformationtypeCreatePage";
import InformationtypeEditPage from "./pages/InformationtypeEditPage";

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
                component={() => (
                    <div>
                        Datacatalog id parameter missing. Format https://url/id
                    </div>
                )}
            />
        </Switch>
    </Root>
);

export default Routes;
