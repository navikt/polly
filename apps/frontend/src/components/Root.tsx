import * as React from "react";
import {useEffect} from "react";
import {Helmet} from "react-helmet";
import {intl} from "../util/intl/intl"

interface RootProps {
    children: JSX.Element | Array<JSX.Element>;
}

const Root = ({children}: RootProps): JSX.Element => {
    let language = intl.getLanguage()
    useEffect(() => {
        document.title = intl.appName
    }, [language])

    return (
        <div>
          <Helmet>
                <meta charSet="utf-8"/>
                <title>{intl.appName}</title>
            </Helmet>
            {children}
        </div>
    );
}

export default Root;
