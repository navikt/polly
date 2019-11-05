import * as React from "react";
import { Block, BlockProps } from "baseui/block";
import { Accordion, Panel } from 'baseui/accordion';
import _includes from 'lodash/includes'
import { Label2, Paragraph2 } from "baseui/typography";

import TablePurpose from './TablePurpose'
import ModalPolicy from './ModalPolicy'

type PurposeViewProps = {
    description: string | any | null;
    purpose: Array<any> | any | null;
};

const blockProps: BlockProps = {
    marginBottom: "3rem"
};

const rowPanelContent: BlockProps = {
    display: 'flex',
    marginBottom: '2rem'
}

const renderListItem = (legalBasis: any | object) => {
    let gdpr = legalBasis.gdpr
    let nationalLaw = legalBasis.nationalLaw && legalBasis.nationalLaw.code
    return (
        <li>
            {gdpr && gdpr + ': '} {nationalLaw && nationalLaw} {legalBasis.description}
        </li>
    )
}

const renderLegalBasisList = (list: any) => {
    if (!list) return null
    if (list.length < 1)
        return (<Paragraph2>Fant ingen rettslige grunnlag</Paragraph2>)

    return (
        <ul>
            {list.map((legalBasis: any) => <li>{renderListItem(legalBasis)}</li>)}
        </ul>
    )
}

const renderAllSubjectCategories = (processObj: any) => {
    const notFound = (<Paragraph2>Fant ingen kategorier av personer</Paragraph2>)
    if (!processObj) return notFound

    const { policies } = processObj
    if (!policies) return notFound
    if (policies.length < 1) return notFound

    const subjectCategories = policies.reduce((acc: any, curr: any) => {
        const subjectCategory = curr.subjectCategory && (curr.subjectCategory.code)
        if (!_includes(acc, subjectCategory) && subjectCategory)
            acc = [...acc, subjectCategory]
        return acc
    }, [])

    if (subjectCategories.length < 1) return notFound

    return (<Paragraph2>{subjectCategories.join(', ')}</Paragraph2>)
}

const PurposeResult = ({ description, purpose }: PurposeViewProps) => {
    const [isOpen, setIsOpen] = React.useState<any>(false);

    return (
        <React.Fragment>
            <React.Fragment>
                <Block {...blockProps}>
                    <Label2 font="font400">Beskrivelse</Label2>
                    <Paragraph2>{description}</Paragraph2>
                </Block>

                {purpose && (
                    <Block {...blockProps}>
                        <Block marginBottom="1rem"><Label2 font="font400">Behandlingsoversikt</Label2></Block>
                        <Accordion>
                            {purpose.map((process: any) => (
                                <Panel title={process.name} key={process.name}>
                                    <Block {...rowPanelContent}>
                                        <Block marginRight="6rem">
                                            <Label2>Rettslig Grunnlag</Label2>
                                            {renderLegalBasisList(process.legalBases)}

                                        </Block>
                                        <Block>
                                            <Label2>Kategorier av personer</Label2>
                                            {renderAllSubjectCategories(process)}

                                        </Block>
                                    </Block>

                                    {process.policies && (
                                        <Block >
                                            <Block display="flex" justifyContent="space-between" marginBottom="1rem">
                                                <Label2>Opplysningstyper</Label2>
                                                <button onClick={() => setIsOpen(true)}>Legg til ny</button>
                                                <ModalPolicy ></ModalPolicy>
                                            </Block>
                                            <TablePurpose policies={process.policies} />
                                        </Block>
                                    )}
                                </Panel>
                            ))}
                        </Accordion>
                    </Block>
                )}

            </React.Fragment>
        </React.Fragment>
    );
};

export default PurposeResult;
