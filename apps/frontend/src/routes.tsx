import * as React from "react";
import { Route, Switch } from "react-router-dom";
import Root from "./components/Root";
import CreatePage from "./pages/CreatePage";
import EditPage from "./pages/EditPage";
import PolicyTable from "./components/Policy";

const Routes = (): JSX.Element => (
    <Root>
        <Switch>
            <Route exact path="/create" component={CreatePage} />
            <Route exact path="/edit/:id" component={EditPage} />
            <Route exact path="/" component={CreatePage} />
            <Route exact path="/table" component={PolicyTable} />
        </Switch>
    </Root>
);

export default Routes;
