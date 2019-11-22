import * as React from "react";
import { styled } from "baseui";
import { Spinner } from "baseui/spinner";
import axios from "axios";

import InformationtypeForm from "../components/InformationType/InformationtypeForm";
import Banner from "../components/Banner";
import { InformationType, InformationtypeFormValues } from "../constants"
import { Code, codelist } from "../service/Codelist";
import { intl } from "../util/intl"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

const Centered = styled("div", {
    height: "100%",
    margin: "0 auto",
    width: "80%",
    paddingBottom: "10rem"
});

const reduceCodelist = (list: Code[]) => {
    if (!list) return;
    return list.reduce((acc: any, curr: any) => {
        return [...acc, !curr ? null : curr.code];
    }, []);
};

const initFormValues = (data: InformationType) => {
    return {
        name: data.name,
        term: !data.term ? '' : data.term.name,
        navMaster: !data.navMaster ? '' : data.navMaster.code,
        categories: reduceCodelist(data.categories),
        sources: reduceCodelist(data.sources),
        sensitivity: !data.sensitivity ? '' : data.sensitivity.code,
        keywords: data.keywords,
        description: data.description,
    } as InformationtypeFormValues;
};

const InformationtypeEditPage = (props: any) => {
    const [isLoading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [isUpdated, setIsUpdated] = React.useState(null);
    const [errorSubmit, setErrorSubmit] = React.useState(null);
    const [informationtype, setInformationType] = React.useState<InformationType>();

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
                        <Banner title={intl.edit} />

                        {!error && informationtype ? (
                            <Centered>
                                <InformationtypeForm
                                    formInitialValues={initFormValues(
                                        informationtype
                                    )}
                                    isEdit
                                    submit={handleSubmit}
                                />
                                {errorSubmit && <p>{errorSubmit}</p>}
                                {isUpdated && <p>{intl.informationTypeUpdated}</p>}
                            </Centered>
                        ) : (
                                <p>{intl.couldntLoad}</p>
                            )}
                    </React.Fragment>
                )}
        </React.Fragment>
    );
};

export default InformationtypeEditPage;
