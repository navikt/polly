
import * as React from "react";
import { Block, BlockProps } from "baseui/block";
import { Accordion, Panel } from 'baseui/accordion';
import _includes from 'lodash/includes'
import { Plus } from "baseui/icon";
import { Label2, Paragraph2 } from "baseui/typography";
import { Button, SIZE as ButtonSize, KIND } from "baseui/button";
import axios from "axios";


import { Codelist } from '../../constants'
import TablePurpose from './TablePurpose'
import ModalPolicy from './ModalPolicy'
import ModalProcess from './ModalProcess'
import { Card } from "baseui/card";
import { legalBasisLinkProcessor } from "../../util/string-processor"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

type PurposeViewProps = {
    description: string | any | null;
    purpose: string;
    codelist: Codelist;
    processList: Array<any> | any | null;
};

const blockProps: BlockProps = {
    marginBottom: "3rem"
};

const rowPanelContent: BlockProps = {
    display: 'flex',
    marginBottom: '2rem'
}

const renderListItem = (codelist:Codelist, legalBasis: any | object) => {
    let gdpr = legalBasis.gdpr && legalBasis.gdpr.code
    let nationalLaw = legalBasis.nationalLaw && legalBasis.nationalLaw.code
    let description = legalBasisLinkProcessor(codelist, nationalLaw, legalBasis.description)
    return (
        <li>
            <Paragraph2>{gdpr && gdpr + ': '} {nationalLaw && nationalLaw} {description}</Paragraph2>
        </li>
    )
}
const renderLegalBasisList = (codelist: Codelist, list: any) => {
    if (!list) return null
    if (list.length < 1)
        return (<Paragraph2>Fant ingen rettslige grunnlag</Paragraph2>)

    return (
        <ul>
            {list.map((legalBasis: any) => <li>{renderListItem(codelist, legalBasis)}</li>)}
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

const PurposeResult = ({ description, purpose, processList, codelist }: PurposeViewProps) => {
    const [isOpen, setIsOpen] = React.useState<any>(false);
    const [showProcessModal, setShowProcessModal] = React.useState(false)
    const [errorCreatePolicy, setErrorCreatePolicy] = React.useState()
    const [errorCreateProcess, setErrorCreateProcess] = React.useState()

    const handleCreatePolicy = async (values: any, process: any) => {
        if (!values) return

        let body = [{
            ...values,
            process: process.name,
            purposeCode: process.purposeCode
        }]
        console.log(body, "BODY")

        await axios
            .post(`${server_polly}/policy`, body)
            .then(((res: any) => {
                console.log(res)
                process.policies.push(res.data.content[0])
                setErrorCreatePolicy(null)
                setIsOpen(false)
            }))
            .catch((err: any) => setErrorCreatePolicy(err.message));
    }

    const handleCreateProcess = async (values: any) => {
        if (!values) return
        let body = [{
            ...values,
            purposeCode: purpose
        }]

        await axios
            .post(`${server_polly}/process`, body)
            .then(((res: any) => {
                res.data.content[0].policies = []
                processList.push(res.data.content[0])
                setErrorCreateProcess(null)
                setShowProcessModal(false)
            }))
            .catch((err: any) => setErrorCreateProcess(err.message));
    }

    return (
        <React.Fragment>
            <React.Fragment>
                <Block {...blockProps}>
                    <Label2 font="font400">Beskrivelse</Label2>
                    <Paragraph2>{description}</Paragraph2>
                </Block>

                <Block marginBottom="1rem" display="flex" justifyContent="space-between">
                    <Label2 font="font400">Behandlingsoversikt</Label2>
                    <Button
                        size={ButtonSize.compact}
                        kind={KIND.minimal}
                        onClick={() => setShowProcessModal(true)}
                        startEnhancer={() => <Block display="flex" justifyContent="center"><Plus size={22} /></Block>}
                    >
                        Legg til ny behandling
                    </Button>
                    <ModalProcess
                        onClose={() => setShowProcessModal(false)}
                        isOpen={showProcessModal}
                        submit={(values: any) => handleCreateProcess(values)}
                        errorOnCreate={errorCreateProcess}
                        codelist={codelist}
                    />
                </Block>

                {processList && (
                    <Accordion>
                        {processList.map((process: any, index: any) => (
                            <Panel title={process.name} key={process.name}>
                                <Block {...rowPanelContent}>
                                    <Block marginRight="6rem">
                                        <Label2>Rettslig Grunnlag</Label2>
                                        {renderLegalBasisList(codelist, process.legalBases)}
                                    </Block>
                                    <Block>
                                        <Label2>Kategorier av personer</Label2>
                                        {renderAllSubjectCategories(process)}
                                    </Block>
                                </Block>

                                <Block display="flex" justifyContent="space-between" marginBottom="1rem">
                                    <Label2 alignSelf="center">Opplysningstyper</Label2>
                                    <Button
                                        size={ButtonSize.compact}
                                        kind={KIND.secondary}
                                        onClick={() => setIsOpen(true)}
                                        startEnhancer={() => <Block display="flex" justifyContent="center"><Plus size={22} /></Block>}
                                    >
                                        Legg til ny
                                    </Button>
                                    <ModalPolicy
                                        onClose={() => {
                                            setIsOpen(false)
                                            setErrorCreatePolicy(null)
                                        }}
                                        isOpen={isOpen}
                                        createPolicySubmit={(values: any) => {
                                            handleCreatePolicy(values, process)
                                        }}
                                        codelist={codelist}
                                        errorOnCreate={errorCreatePolicy}
                                    />
                                </Block>
                                {process.policies && (
                                    <Block >
                                        <TablePurpose codelist={codelist} policies={process.policies} />
                                    </Block>
                                )}
                            </Panel>
                        ))}
                    </Accordion>
                )}

            </React.Fragment>
        </React.Fragment>
    );
};

export default PurposeResult;
