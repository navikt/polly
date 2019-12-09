import * as React from "react";
import axios from "axios";
import {Option, StatefulSelect} from 'baseui/select';

import PurposeResult from "../components/Purpose";
import { Option, StatefulSelect, Value } from 'baseui/select';
import ProcessList from "../components/Purpose";
import Banner from "../components/Banner";

import {Block} from "baseui/block";
import {codelist, ListName} from "../service/Codelist";
import {Process} from "../constants"
import {intl} from "../util/intl/intl"
import {theme} from "../util/theme"
import { Block } from "baseui/block";
import { ListName, codelist } from "../service/Codelist";
import { Process } from "../constants"
import { intl } from "../util/intl/intl"
import { theme } from "../util/theme"
import illustration from "../resources/purpose_illustration.svg"
import { Spinner } from "baseui/spinner";
import { Label2, Paragraph2 } from "baseui/typography";
import { generatePath } from "react-router";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

const renderDescription = (description: string) => (
    <Block marginBottom="scale1000">
        <Label2 font="font400">{intl.description}</Label2>
        <Paragraph2>{description}</Paragraph2>
    </Block>
)

const PurposePage = (props: any) => {
    const [currentPurposeValue, setCurrentPurposeValue] = React.useState<string | null>(null);
    const [isLoading, setLoading] = React.useState(false);
    const [isLoadingPurpose, setLoadingPurpose] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [processCount, setProcessCount] = React.useState<{ [purpose: string]: number }>(({}));

    const updatePath = (params: { id: string } | null) => {
        let nextPath
        if (!params) nextPath = generatePath(props.match.path)
        else nextPath = generatePath(props.match.path, params)
        props.history.push(nextPath)
    }
    const handleGetPurposeCountResponse = (response: any) => {
        if (typeof response.data === "object" && response.data !== null) {
            setProcessCount(response.data.purposes)
        }
    };
    const handleChangePurpose = async (value: any) => {
        setLoadingPurpose(true);
        if (!value) {
            setCurrentPurposeValue(null);
            updatePath(null)
        }
        else {
            setCurrentPurposeValue(value)
            updatePath({ id: value })
        }
        setLoadingPurpose(false);
    };
    const purposeLabelView = (option: Option) => {
        return {
            ...option,
            label: <Block display="flex" justifyContent="space-between" width="100%">
                <span>{option.label}</span>
                <Block $style={{ opacity: .5 }}>{option.id && `${intl.processes}: ${processCount[option.id]}`}</Block>
            </Block>
        }
    }

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await codelist.wait();
            await axios
                .get(`${server_polly}/process/count/purpose`)
                .then(handleGetPurposeCountResponse)
            if (props.match.params.id) await handleChangePurpose(props.match.params.id)
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <React.Fragment>
            <Banner title={intl.purpose} />
            {!isLoading && (
                <Block marginBottom="3rem">

                    {error && <p>{error}</p>}
                    {!error && (
                        <StatefulSelect
                            options={codelist.getParsedOptions(ListName.PURPOSE).map(purposeLabelView)}
                            initialState={{ value: currentPurposeValue ? [{ id: currentPurposeValue, label: currentPurposeValue } as Option] : [] }}
                            placeholder={intl.purposeSelect}
                            maxDropdownHeight="350px"
                            onChange={(event) => handleChangePurpose(event.option ? event.option.id : null)}
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
                </Block >
            )}

            {isLoadingPurpose && <Spinner />}
            {!isLoadingPurpose && currentPurposeValue && (
                <React.Fragment>
                    {renderDescription(codelist.getDescription(ListName.PURPOSE, currentPurposeValue))}
                    <ProcessList
                        currentPurpose={currentPurposeValue}
                    />
                </React.Fragment>
            )
            }
            {!currentPurposeValue && (
                <Block display="flex" justifyContent="center" alignContent="center" marginTop={theme.sizing.scale2400}>
                    <img src={illustration} alt={intl.treasureIllustration} style={{ maxWidth: "65%" }} />
                </Block>
            )}
        </React.Fragment>
    );
};

export default PurposePage;
