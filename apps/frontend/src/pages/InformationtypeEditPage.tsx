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


const reduceCodelist = (list: any) => {
    if (!list) return;
    return list.reduce((acc: any, curr: any) => {
        return [...acc, !curr ? null : curr.code];
    }, []);
};

const initFormValues = (data: any) => {
    console.log(data);
    return {
        term: data.term,
        pii: data.pii,
        name: data.name,
        categories: reduceCodelist(data.categories),
        sources: reduceCodelist(data.sources),
        sensitivity: data.sensitivity.code,
        keywords: data.keywords,
        description: data.description,
    };
};

const InformationtypeEditPage = (props: any) => {
    const [isLoading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [isUpdated, setIsUpdated] = React.useState(null);
    const [errorSubmit, setErrorSubmit] = React.useState(null);
    const [codelist, setCodelist] = React.useState();
    const [informationtype, setInformationType] = React.useState();

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
        setIsUpdated(response);
    };

    const handleSubmit = async (values: any) => {
        if (!values) return;

        setErrorSubmit(null);
        setIsUpdated(null);
        let body = { ...values, id: props.match.params.id };

        await axios
            .put(`${server_polly}/informationtype`, [body])
            .then(handleSubmitResponse)
            .catch(err => setErrorSubmit(err.message));
    };

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            await axios
                .get(`${server_polly}/informationtype/${props.match.params.id}`)
                .then(res => {
                    console.log(res);
                    setInformationType(res.data);
                })
                .catch(handleAxiosError);

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
                        <Banner title="Rediger" />

                        {!error && informationtype ? (
                            <Centered>
                                <InformationtypeForm
                                    formInitialValues={initFormValues(
                                        informationtype
                                    )}
                                    isEdit
                                    codelist={codelist}
                                    submit={handleSubmit}
                                />
                                {errorSubmit && <p>{errorSubmit}</p>}
                                {isUpdated && <p>Opplysningstypen er oppdatert.</p>}
                            </Centered>
                        ) : (
                                <p>Kunne ikke laste inn siden.</p>
                            )}
                    </React.Fragment>
                )}
        </React.Fragment>
    );
};

export default InformationtypeEditPage;
