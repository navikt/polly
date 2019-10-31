import * as React from "react";
import { Route, Switch } from "react-router-dom";

import Root from "./components/Root";
import CreatePage from "./pages/CreatePage";
import EditPage from "./pages/EditPage";
import PurposePage from "./pages/PurposePage";
import TempPurposePage from "./pages/temp/TempPurposePage";
import TempPurposePageSec from "./pages/temp/TempPurposePageSec";
import InformationtypeCreatePage from "./pages/InformationtypeCreatePage";

const Routes = (): JSX.Element => (
    <Root>
        <Switch>
            <Route exact path="/tempPurpose" component={TempPurposePage} />
            <Route exact path="/tempPurpose2" component={TempPurposePageSec} />

            <Route
                exact
                path="/informationtype/create"
                component={InformationtypeCreatePage}
            />
            <Route exact path="/create" component={CreatePage} />
            <Route exact path="/edit/:id" component={EditPage} />
            <Route exact path="/purpose" component={PurposePage} />
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
