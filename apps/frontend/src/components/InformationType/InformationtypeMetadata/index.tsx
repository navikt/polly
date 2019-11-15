import * as React from "react";
import { Block, BlockProps } from 'baseui/block'
import { Card } from 'baseui/card'
import { Label2, Paragraph2, Label1 } from "baseui/typography";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";

import AccordionInformationtype from './AccordionInformationtype'

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;
const server_codelist = process.env.REACT_APP_CODELIST_ENDPOINT;

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

const renderTextWithLabel2 = (label: string, text: string) => {
    return (
        <Block display="flex">
            <Block width="20%" alignSelf="center">
                <Label2>{label}</Label2>
            </Block>
            <Paragraph2>{text}</Paragraph2>
        </Block>
    )
}

const renderTextWithLabel3 = (label: string, text: string) => {
    return (
        <Block display="flex">
            <Block width="20%" alignSelf="center">
                <Label2 marginBottom="1rem">{label}</Label2>
            </Block>
            <Paragraph2>{text}</Paragraph2>
        </Block>
    )
}

const renderMetadata = (informationtype: any) => {
    return (
        <Block display="flex" width="100%" marginBottom="5rem">
            <Block width="40%" marginRight="5rem">
                <Card>
                    {renderTextWithLabel2('Navn: ', informationtype.name)}
                    {renderTextWithLabel2('Begrep: ', informationtype.term ? informationtype.term.name : '')}
                    {renderTextWithLabel2('Beskrivelse', informationtype.description)}

                </Card>
            </Block>
            <Block width="60%">
                <Card>
                    {renderTextWithLabel2('Master i NAV', informationtype.navMaster ? informationtype.navMaster.description : '')}
                    {renderTextWithLabel2('Kilder', reduceToList(informationtype.sources).join(', '))}
                    {renderTextWithLabel2('Kategorier', reduceToList(informationtype.categories).join(', '))}
                    {renderTextWithLabel2('Nøkkelord', arrayToString(informationtype.keywords))}
                    {renderTextWithLabel2('Personopplysning', informationtype.pii ? 'Ja' : 'Nei')}
                    {renderTextWithLabel2('Type personopplysning', informationtype.sensitivity.description)}
                </Card>
            </Block>
        </Block>
    )
}

const InformationtypeMetadata = (props: any) => {
    const { informationtype, purposeMap, codelist } = props

    return (
        <React.Fragment>
            {informationtype && (
                <React.Fragment>
                    {renderMetadata(informationtype)}

                    <Block {...purposeBlockProps}>
                        <Label2 marginBottom="2rem" font="font450">Brukes til formål</Label2>
                        <AccordionInformationtype purposeMap={purposeMap} codelist={codelist} />
                    </Block>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default InformationtypeMetadata;
