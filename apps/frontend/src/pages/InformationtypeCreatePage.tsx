import * as React from "react";
import { styled } from "baseui";
import { Spinner } from "baseui/spinner";
import axios from "axios";

import InformationtypeForm from "../components/InformationType/InformationtypeForm";
import Banner from "../components/Banner";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;
const server_codelist = process.env.REACT_APP_CODELIST_ENDPOINT;

const Centered = styled("div", {
    height: "100%",
    margin: "0 auto",
    width: "80%",
    paddingBottom: "10rem"
});

let initialFormValues = {
    term: "",
    pii: false,
    name: "",
    sensitivity: null,
    keywords: [],
    categories: [],
    sources: [],
    description: ""
};

const InformationtypeCreatePage = () => {
    const [isLoading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [isCreated, setIsCreated] = React.useState(null);
    const [errorSubmit, setErrorSubmit] = React.useState(null);
    const [codelist, setCodelist] = React.useState();

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

    const handleGetCodelistResponse = (response: any) => {
        if (typeof response.data === "object" && response.data !== null) {
            setCodelist(response.data);
        } else {
            setError(response.data);
        }
    };

    const handleSubmitResponse = (response: any) => {
        setIsCreated(response);
    };

    const handleSubmit = async (values: any) => {
        if (!values) return;

        setErrorSubmit(null);
        setIsCreated(null);
        let body = [values];

        await axios
            .post(`${server_polly}/informationtype`, body)
            .then(handleSubmitResponse)
            .catch(err => setErrorSubmit(err.message));
    };

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await axios
                .get(`${server_codelist}`)
                .then(handleGetCodelistResponse)
                .catch(err => setError(err.message));

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
                                        codelist={codelist}
                                    />
                                    {errorSubmit && <p>{errorSubmit}</p>}
                                    {isCreated && (
                                        <p>Opplysningstypen er nå opprettet.</p>
                                    )}
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
