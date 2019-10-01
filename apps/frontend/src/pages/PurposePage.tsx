import * as React from "react";
import axios from "axios";
import { Spinner } from "baseui/spinner";

import PurposeView from "../components/Purpose/PurposeView";
import MockCodelist from "./mock/MockCodelist";

const server_codelist = process.env.REACT_APP_CODELIST_ENDPOINT;
const server_policy_purpose = process.env.REACT_APP_PURPOSE_ENDPOINT;

const PurposePage = () => {
    const [codelist, setCodelist] = React.useState();
    const [currentPurpose, setCurrentPurpose] = React.useState(null);
    const [isLoading, setLoading] = React.useState(false);
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
            console.log(response);
            setCodelist(response.data);
        } else {
            setError(response.data);
        }
    };

    const handleGetPurposeResponse = (response: any) => {
        console.log(response, "RESPONSE");
        if (typeof response.data === "object" && response.data !== null) {
            console.log(response);
            setCurrentPurpose(response);
        } else {
            setError(response.data);
        }
    };

    const handleChange = async (value: any) => {
        console.log("Changed", value);
        if (!value) setCurrentPurpose(null);

        await axios
            .get(`${server_policy_purpose}/${value}`)
            .then(handleGetPurposeResponse)
            .catch(handleAxiosError);
    };

    const getPurposeSelectItems = () => {
        console.log(codelist, "CODELIST");
        if (!codelist) return [];
        let parsedItems = Object.keys(codelist["PURPOSE"]).reduce(
            (acc: any, curr: any) => {
                return [...acc, { id: curr }];
            },
            []
        );

        return parsedItems;
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
            {isLoading ? (
                <Spinner size={30} />
            ) : (
                <React.Fragment>
                    {error ? (
                        <p>Feil i henting av formål fra codelist</p>
                    ) : (
                        <PurposeView
                            optionsSelect={getPurposeSelectItems()}
                            handleChange={handleChange}
                            purpose={currentPurpose}
                        />
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default PurposePage;
