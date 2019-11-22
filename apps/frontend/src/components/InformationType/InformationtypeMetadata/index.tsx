import * as React from "react";
import { Block, BlockProps } from 'baseui/block'
import { Card } from 'baseui/card'
import { Label2, Paragraph2 } from "baseui/typography";

import AccordionInformationtype from './AccordionInformationtype'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconDefinition } from "@fortawesome/fontawesome-common-types"
import { faTag, faUserShield } from "@fortawesome/free-solid-svg-icons"
import { sensitivityColor } from "../Sensitivity"
import { Link } from "react-router-dom"
import { InformationType } from "../../../constants"
import { intl } from "../../../util/intl"

const row: BlockProps = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    width: '100%'
}

const purposeBlockProps: BlockProps = {
    marginTop: '3rem'
}

const reduceToList = (list: Array<any> | undefined | null) => {
    if (!list) return []
    return list.reduce((acc: any, curr: any) => {
        acc = [...acc, curr.description]
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
            <Block width="25%" alignSelf="center">
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

                    <Block position="relative" $style={{ float: "right" }}><Link to={`/informationtype/edit/${informationtype.id}`}>{intl.edit}</Link></Block>
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

const InformationtypeMetadata = (props: { informationtype: InformationType, purposeMap: any }) => {
    const { informationtype, purposeMap } = props

    return (
        <React.Fragment>
            {informationtype && (
                <React.Fragment>
                    {renderMetadata(informationtype)}

                    <Block {...purposeBlockProps}>
                        <Label2 marginBottom="2rem" font="font450">{intl.purposeUse}</Label2>
                        <AccordionInformationtype purposeMap={purposeMap} />
                    </Block>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default InformationtypeMetadata;
