import * as React from "react";
import axios from "axios";
import { StatefulSelect } from 'baseui/select';

import PurposeResult from "../components/Purpose";
import Banner from "../components/Banner";

import { Block } from "baseui/block";
import { ListName, codelist } from "../codelist";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

const PurposePage = (props: any) => {
    const [currentPurposeValue, setCurrentPurposeValue] = React.useState();
    const [purposeData, setPurposeData] = React.useState();
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

    const handleGetPurposeResponse = (response: any) => {
        console.log(response)
        if (typeof response.data === "object" && response.data !== null) {
            if (response.data.content.length > 0)
                setPurposeData(response.data.content);
            else
                setPurposeData(null)
        } else {
            setError(response.data);
        }
    };

    const getPurpose = async (value: any) => {
        setLoadingPurpose(true);
        if (!value) setCurrentPurposeValue(null);

        setCurrentPurposeValue(value)

        await axios
            .get(`${server_polly}/process/purpose/${value}`)
            .then(handleGetPurposeResponse)
            .catch(handleAxiosError);

        setLoadingPurpose(false);
    };

    const getPurposeSelectItems = () => {
        if (!codelist.isLoaded()) return [];
        return Object.keys(codelist.getCodes(ListName.PURPOSE)).reduce(
            (acc: any, curr: any) => {
                return [...acc, { id: curr }];
            },
            []
        );
    };

    const getPurposeDescription = () => {
        if (!codelist.isLoaded()) return null;
        return codelist.getDescription(ListName.PURPOSE, currentPurposeValue);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await codelist.wait();
            if (props.match.params.id) getPurpose(props.match.params.id)
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <React.Fragment>
            <Banner title="Formål" />
            {isLoading ? null : (
                <Block marginBottom="3rem">
                    {error ? (
                        <p>Feil i henting av formål fra codelist</p>
                    ) : (
                            <StatefulSelect
                                options={getPurposeSelectItems()}
                                labelKey="id"
                                valueKey="id"
                                placeholder="Velg formål"
                                maxDropdownHeight="250px"
                                onChange={(event) => getPurpose(event.option ? event.option.id : null)}
                            />
                        )}
                </Block>
            )}

            {currentPurposeValue ? (
                <React.Fragment>
                    <PurposeResult
                        processList={!purposeData ? [] : purposeData}
                        purpose={currentPurposeValue}
                        description={getPurposeDescription()}
                        defaultExpandedPanelId={props.match.params.processid}

                    />
                </React.Fragment>
            ) : null}
        </React.Fragment>
    );
};

export default PurposePage;
