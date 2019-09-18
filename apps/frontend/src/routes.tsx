import * as React from "react";
import { Route, Switch } from "react-router-dom";
import Root from "./components/Root";
import CreatePage from "./pages/CreatePage";
import EditPage from "./pages/EditPage";

const Routes = (): JSX.Element => (
    <Root>
        <Switch>
            <Route exact path="/create" component={CreatePage} />
            <Route exact path="/edit/:id" component={EditPage} />
            <Route exact path="/" component={CreatePage} />
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
