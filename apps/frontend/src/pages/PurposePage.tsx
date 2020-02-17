import * as React from "react";
import { useEffect, useState } from "react";
import { Option, StatefulSelect } from 'baseui/select';

import ProcessList from "../components/Purpose";
import Banner from "../components/Banner";
import { Block } from "baseui/block";
import { codelist, ListName } from "../service/Codelist";
import { intl, theme } from "../util"
import illustration from "../resources/purpose_illustration.svg"
import { Spinner } from "baseui/spinner";
import { Label2, Paragraph2 } from "baseui/typography";
import { generatePath } from "react-router";
import { getProcessPurposeCount } from "../api"
import { RouteComponentProps } from "react-router-dom";

const renderDescription = (description: string) => (
    <Block marginBottom="scale1000">
        <Label2 font="font400">{intl.purposeDescription}</Label2>
        <Paragraph2>{description}</Paragraph2>
    </Block>
)

export type PathParams = { purposeCode?: string, processId?: string }

const PurposePage = (props: RouteComponentProps<PathParams>) => {
    const [currentPurposeValue, setCurrentPurposeValue] = React.useState<string | null>(null);
    const [isLoading, setLoading] = React.useState(false);
    const [isLoadingPurpose, setLoadingPurpose] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [processCount, setProcessCount] = React.useState<{ [purpose: string]: number }>(({}));
    const [statefulSelectOptions,setStatefulSelectOptions] = useState<{ id: string, label: string }[] >();
    const updatePath = (params?: PathParams) => {
        let nextPath
        if (!params) nextPath = generatePath(props.match.path)
        else nextPath = generatePath(props.match.path, params)
        props.history.push(nextPath)
    }

    const handleChangePurpose = async (purposeCode?: string, processId?: string) => {
        setLoadingPurpose(true);
        if (!purposeCode) {
            setCurrentPurposeValue(null);
            updatePath()
        } else {
            setCurrentPurposeValue(purposeCode)
            updatePath({purposeCode: purposeCode, processId: processId})
        }
        setLoadingPurpose(false);
    }

    const purposeLabelView = (option: Option) => {
        return {
            id: option.label!.toString(),
            label: <Block display="flex" justifyContent="space-between" width="100%">
                <span>{option.label}</span>
                <Block $style={{opacity: .5}}>{option.id && `${intl.processes}: ${processCount[option.id]}`}</Block>
            </Block>
        }
    }

    useEffect(() => {
        (async () => {
            setLoading(true);
            await codelist.wait();
            setProcessCount((await getProcessPurposeCount()).purposes)
            if (props.match.params.purposeCode) await handleChangePurpose(props.match.params.purposeCode, props.match.params.processId)
            setLoading(false);
            setStatefulSelectOptions(codelist.getParsedOptions(ListName.PURPOSE));
        })();
    }, []);

    return (
        <React.Fragment>
            {!isLoading && (
                <Block marginBottom="3rem">
                    {error && <p>{error}</p>}
                    {!error && (
                        <StatefulSelect
                            options={codelist.getParsedOptions(ListName.PURPOSE).map(purposeLabelView)}
                            initialState={{value: currentPurposeValue ? [{id: currentPurposeValue, label: codelist.getShortname(ListName.PURPOSE, currentPurposeValue)} as Option] : []}}
                            placeholder={intl.purposeSelect}
                            maxDropdownHeight="350px"
                            onChange={
                                (event) => {
                                    if(statefulSelectOptions?.filter(option=>option.label===event.option?.id).length){
                                        handleChangePurpose(statefulSelectOptions?.filter(option=>option.label===event.option?.id)[0].id)
                                    } else {
                                        handleChangePurpose()
                                    }
                                }
                            }
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

            {isLoadingPurpose && <Spinner/>}
            {!isLoadingPurpose && currentPurposeValue && (
                <React.Fragment>
                    {renderDescription(codelist.getDescription(ListName.PURPOSE, currentPurposeValue))}
                    <ProcessList purposeCode={currentPurposeValue} />
                </React.Fragment>
            )
            }
            {!currentPurposeValue && (
                <Block display="flex" justifyContent="center" alignContent="center" marginTop={theme.sizing.scale2400}>
                    <img src={illustration} alt={intl.treasureIllustration} style={{maxWidth: "65%"}}/>
                </Block>
            )}
        </React.Fragment>
    );
};

export default PurposePage;
