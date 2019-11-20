import * as React from "react";
import { styled } from "baseui";
import { Spinner } from "baseui/spinner";
import axios from "axios";

import InformationtypeForm from "../components/InformationType/InformationtypeForm";
import Banner from "../components/Banner";
import {codelist} from "../service/Codelist";
import { InformationtypeFormValues, InformationTypeIdName, PageResponse } from "../constants"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

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

const InformationtypeCreatePage = (props: any) => {
    const [isLoading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [errorSubmit, setErrorSubmit] = React.useState(null);

    const handleAxiosError = (error: any) => {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else {
            console.log(error.message);
            setError(error.message);
        }
    };

    const handleSubmitResponse = (response: { data: PageResponse<InformationTypeIdName> }) => {
        props.history.push(`/informationtype/${response.data.content[0].id}`)
    };

    const handleSubmit = async (values: any) => {
        if (!values) return;

        setErrorSubmit(null);
        let body = [values];

        await axios
            .post(`${server_polly}/informationtype`, body)
            .then(handleSubmitResponse)
            .catch(err => setErrorSubmit(err.message));
    };

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
            {isLoading ? (
                <Spinner size={30} />
            ) : (
                    <React.Fragment>
                        <Banner title="Opprett ny opplysningstype" />
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
    );
};

export default InformationtypeCreatePage;
