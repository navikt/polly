import * as React from "react";
import { Block } from "baseui/block";
import axios from "axios";
import { Card } from "baseui/card";
import { Paragraph2 } from "baseui/typography";
import { Spinner } from "baseui/spinner";

import DatasetForm from "../components/Form";

const server_backend = process.env.REACT_APP_BACKEND_ENDPOINT;
const server_codelist = process.env.REACT_APP_CODELIST_ENDPOINT;

let initialFormValues = {
    title: "",
    contentType: "",
    pi: "",
    spatial: "",
    publisher: "",
    description: "",
    categories: [],
    provenances: [],
    keywords: []
};

function renderSuccessMessage(message: any | object) {
    return (
        <Block marginBottom="2rem">
            <Card>
                <Paragraph2>{message}</Paragraph2>
            </Card>
        </Block>
    );
}

const CreatePage = () => {
    const [isCreated, setCreated] = React.useState<boolean>(false);
    const [codelist, setCodelist] = React.useState();
    const [isLoading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

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

    //TODO - sette opp error handling
    const handleSubmit = (values: object) => {
        let body = [values];
        axios.post(`${server_backend}`, body).then(res => console.log(res));
        setCreated(true);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await axios
                .get(`${server_codelist}`)
                .then(handleGetCodelistResponse)
                .catch(handleAxiosError);

            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <React.Fragment>
            <Block>
                {isCreated
                    ? renderSuccessMessage("Datasettet er nå opprettet.")
                    : null}

                {isLoading ? (
                    <Spinner size={30} />
                ) : (
                    <React.Fragment>
                        <DatasetForm
                            formInitialValues={initialFormValues}
                            submit={handleSubmit}
                            codelist={codelist}
                        />
                    </React.Fragment>
                )}
            </Block>
        </React.Fragment>
    );
};

export default CreatePage;
