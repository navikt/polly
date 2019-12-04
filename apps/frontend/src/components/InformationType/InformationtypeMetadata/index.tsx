import * as React from "react";
import {Block, BlockProps} from 'baseui/block'
import {Card} from 'baseui/card'
import {Label2, Paragraph2} from "baseui/typography";

import AccordionInformationtype from './AccordionInformationtype'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {IconDefinition} from "@fortawesome/fontawesome-common-types"
import {faTag, faUserShield} from "@fortawesome/free-solid-svg-icons"
import {sensitivityColor} from "../Sensitivity"
import {InformationType} from "../../../constants"
import {intl} from "../../../util/intl/intl"

const purposeBlockProps: BlockProps = {
    marginTop: '3rem'
}

const reduceToList = (list: Array<any> | undefined | null) => {
    if (!list) return []
    return list.reduce((acc: any, curr: any) => {
        acc = [...acc, curr.shortName]
        return acc
    }, [])
}

const arrayToString = (list: any) => {
    if (!list) return []
    return list.join(', ')
}

const renderTextWithLabel = (label: string, text: string, icon?: IconDefinition, iconColor?: string) => {
    return (
        <Block display="flex">
            <Block width="25%" alignSelf="self-start" marginTop="1rem">
                <Label2>{icon && <FontAwesomeIcon icon={icon} color={iconColor} />} {label}</Label2>
            </Block>
            <Paragraph2>{text}</Paragraph2>
        </Block>
    )
}

const renderMetadata = (informationtype: InformationType) => {
    return (
        <Block display="flex" width="100%" marginBottom="5rem">
            <Block width="40%" marginRight="5rem">
                <Card>
                    {renderTextWithLabel(intl.name, informationtype.name, faTag)}
                    {renderTextWithLabel(intl.term, informationtype.term ? informationtype.term.description || informationtype.term.name : '')}
                    {renderTextWithLabel(intl.description, informationtype.description)}
                </Card>
            </Block>
            <Block width="60%">
                <Card>
                    {renderTextWithLabel(intl.navMaster, informationtype.navMaster ? informationtype.navMaster.description : '')}
                    {renderTextWithLabel(intl.sources, reduceToList(informationtype.sources).join(', '))}
                    {renderTextWithLabel(intl.categories, reduceToList(informationtype.categories).join(', '))}
                    {renderTextWithLabel(intl.keywords, arrayToString(informationtype.keywords))}
                    {renderTextWithLabel(intl.sensitivity, informationtype.sensitivity.description, faUserShield, sensitivityColor(informationtype.sensitivity.code))}
                </Card>
            </Block>
        </Block>
    )
}

interface InformationtypeMetadataProps {
    informationtype: InformationType;
    purposeMap: any;
    expanded: string[];
    onSelectPurpose: (purpose: string) => void
}

const InformationtypeMetadata = (props: InformationtypeMetadataProps) => {
    const { informationtype, purposeMap, expanded, onSelectPurpose } = props

    return (
        <React.Fragment>
            {informationtype && (
                <React.Fragment>
                    {renderMetadata(informationtype)}

                    <Block {...purposeBlockProps}>
                        <Label2 marginBottom="2rem" font="font450">{intl.purposeUse}</Label2>
                        <AccordionInformationtype purposeMap={purposeMap} expaneded={expanded}
                            onChange={args => args.expanded.length && onSelectPurpose(args.expanded[0] as string)} />
                    </Block>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default InformationtypeMetadata;
