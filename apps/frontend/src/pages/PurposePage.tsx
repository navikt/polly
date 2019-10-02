import * as React from "react";
import axios from "axios";
import { Select, Value, TYPE } from "baseui/select";

import PurposeResult from "../components/Purpose/PurposeResult";

import { Block } from "baseui/block";

const server_codelist = process.env.REACT_APP_CODELIST_ENDPOINT;
const server_policy_purpose = process.env.REACT_APP_PURPOSE_ENDPOINT;

const PurposePage = () => {
    const [value, setValue] = React.useState<Value>([]);
    const [codelist, setCodelist] = React.useState();
    const [currentPurpose, setCurrentPurpose] = React.useState();
    const [isLoading, setLoading] = React.useState(false);
    const [isLoadingPurpose, setLoadingPurpose] = React.useState(false);

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

    const handleGetPurposeResponse = (response: any) => {
        if (typeof response.data === "object" && response.data !== null) {
            setCurrentPurpose(response.data);
        } else {
            setError(response.data);
        }
    };

    const handleChange = async (value: any) => {
        setLoadingPurpose(true);
        if (!value) setCurrentPurpose(null);

        await axios
            .get(`${server_policy_purpose}/${value}`)
            .then(handleGetPurposeResponse)
            .catch(handleAxiosError);

        setLoadingPurpose(false);
    };

    const getPurposeSelectItems = () => {
        if (!codelist) return [];
        let parsedItems = Object.keys(codelist["PURPOSE"]).reduce(
            (acc: any, curr: any) => {
                return [...acc, { id: curr }];
            },
            []
        );

        return parsedItems;
    };

    const getPurposeDescription = (purpose: any) => {
        if (!purpose) return null;
        if (!codelist) return null;
        return codelist["PURPOSE"][purpose];
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
            <h1>Formål</h1>
            {isLoading ? null : (
                <Block marginBottom="3rem">
                    {error ? (
                        <p>Feil i henting av formål fra codelist</p>
                    ) : (
                        <Select
                            options={getPurposeSelectItems()}
                            labelKey="id"
                            valueKey="id"
                            placeholder="Velg formål"
                            maxDropdownHeight="250px"
                            isLoading={isLoadingPurpose}
                            onChange={({ value }) => {
                                setValue(value);
                                handleChange(
                                    value && value.length > 0
                                        ? value[0].id
                                        : null
                                );
                            }}
                            value={value}
                        />
                    )}
                </Block>
            )}

            {currentPurpose ? (
                <React.Fragment>
                    <PurposeResult
                        purpose={currentPurpose}
                        description={getPurposeDescription(
                            currentPurpose.purpose
                        )}
                    />
                </React.Fragment>
            ) : null}
        </React.Fragment>
    );
};

export default PurposePage;
