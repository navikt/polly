import * as React from "react";
import { Helmet } from "react-helmet";

interface RootProps {
    children: JSX.Element | Array<JSX.Element>;
}

const TITLE = "Datacatalog edit";

const Root = ({ children }: RootProps): JSX.Element => (
    <div>
        <Helmet>
            <meta charSet="utf-8" />
            <title>{TITLE}</title>
        </Helmet>
        {children}
    </div>
);

export default Root;
