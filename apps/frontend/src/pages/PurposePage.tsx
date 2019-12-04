import * as React from "react";
import axios from "axios";
import {Option, StatefulSelect} from 'baseui/select';

import PurposeResult from "../components/Purpose";
import Banner from "../components/Banner";

import {Block} from "baseui/block";
import {codelist, ListName} from "../service/Codelist";
import {Process} from "../constants"
import {intl} from "../util/intl/intl"
import {theme} from "../util/theme"
import illustration from "../resources/purpose_illustration.svg"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

const PurposePage = (props: any) => {
    const [currentPurposeValue, setCurrentPurposeValue] = React.useState<string | null>();
    const [purposeData, setPurposeData] = React.useState<Process[] | null>();
    const [purposeCount, setPurposeCount] = React.useState<{[purpose:string]:number}>(({}));
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
        if (typeof response.data === "object" && response.data !== null) {
            if (response.data.content.length > 0)
                setPurposeData(response.data.content);
            else
                setPurposeData(null)
        } else {
            setError(response.data);
        }
    };

    const handleGetPurposeCountResponse = (response: any) => {
        if (typeof response.data === "object" && response.data !== null) {
            setPurposeCount(response.data.purposes)
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

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await codelist.wait();
            await axios
                .get(`${server_polly}/process/count/purpose`)
                .then(handleGetPurposeCountResponse)
            if (props.match.params.id) await getPurpose(props.match.params.id)
            setLoading(false);
        };
        fetchData();
    }, []);

    const purposeLabelView = (option: Option) => {
        return {
            ...option,
            label: <Block display="flex" justifyContent="space-between" width="100%">
                <span>{option.label}</span>
                <Block $style={{opacity:.5}}>{option.id && `${intl.processes}: ${purposeCount[option.id]}`}</Block>
            </Block>
        }
    }

    return (
        <React.Fragment>
            <Banner title={intl.purpose} />
            {isLoading ? null : (
                <Block marginBottom="3rem">
                    {error ? (
                        <p>Feil i henting av formål fra codelist</p>
                    ) : (
                            <StatefulSelect
                                options={codelist.getParsedOptions(ListName.PURPOSE).map(purposeLabelView)}
                                initialState={{ value: currentPurposeValue ? [{ id: currentPurposeValue, label: currentPurposeValue } as Option] : [] }}
                                placeholder={intl.purposeSelect}
                                maxDropdownHeight="350px"
                                onChange={(event) => getPurpose(event.option ? event.option.id : null)}
                                overrides={{
                                    SingleValue: {
                                        style: {
                                            width: '100%',
                                            paddingRight: theme.sizing.scale600
                                        }
                                    }
                                }}
                            />
                        )}
                </Block>
            )}

            {currentPurposeValue ? (
                <React.Fragment>
                    <PurposeResult
                        processList={!purposeData ? [] : purposeData}
                        purpose={currentPurposeValue}
                        description={codelist.getDescription(ListName.PURPOSE, currentPurposeValue)}
                        defaultExpandedPanelId={props.match.params.processid}
                    />
                </React.Fragment>
            ) :
                <Block display="flex" justifyContent="center" alignContent="center" marginTop={theme.sizing.scale2400}>
                    <img src={illustration} alt={intl.treasureIllustration} style={{maxWidth: "65%"}}/>
                </Block>
            }
        </React.Fragment>
    );
};

export default PurposePage;
