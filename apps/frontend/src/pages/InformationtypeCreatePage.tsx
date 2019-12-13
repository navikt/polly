import * as React from "react";
import { styled } from "baseui";
import { Spinner } from "baseui/spinner";

import InformationtypeForm from "../components/InformationType/InformationtypeForm";
import Banner from "../components/Banner";
import { codelist } from "../service/Codelist";
import { InformationtypeFormValues } from "../constants"
import { intl, useAwait } from "../util"
import { user } from "../service/User";
import ErrorNotAllowed from "../components/common/ErrorNotAllowed";
import { createInformationType } from "../api"
import { RouteComponentProps } from "react-router-dom";

const Centered = styled("div", {
    height: "100%",
    margin: "0 auto",
    width: "80%",
    paddingBottom: "10rem"
});

let initialFormValues: InformationtypeFormValues = {
    term: "",
    name: "",
    sensitivity: undefined,
    navMaster: undefined,
    keywords: [],
    categories: [],
    sources: [],
    description: ""
};

const InformationtypeCreatePage = (props: RouteComponentProps) => {
    const [isLoading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [errorSubmit, setErrorSubmit] = React.useState(null);

    const handleSubmit = async (values: InformationtypeFormValues) => {
        if (!values) return;

        setErrorSubmit(null);
        try {
            const infoType = await createInformationType(values)
            props.history.push(`/informationtype/${infoType.id}`)
        } catch (err) {
            setErrorSubmit(err.message)
        }
    };

    const hasAccess = () => user.canWrite()

    useAwait(user.wait())

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await codelist.wait();
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <React.Fragment>
            {!hasAccess() ? (<ErrorNotAllowed/>)
                : (
                    <React.Fragment>
                        {isLoading ? (
                            <Spinner size={30}/>
                        ) : (
                            <React.Fragment>
                                <Banner title={intl.informationTypeCreate}/>
                                {!error && codelist ? (
                                    <React.Fragment>
                                        <Centered>
                                            <InformationtypeForm
                                                formInitialValues={initialFormValues}
                                                submit={handleSubmit}
                                                isEdit={false}
                                            />
                                            {errorSubmit && <p>{errorSubmit}</p>}
                                        </Centered>
                                    </React.Fragment>
                                ) : (
                                    <p>Feil i henting av codelist</p>
                                )}
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )
            }
        </React.Fragment>
    );
};

export default InformationtypeCreatePage;
