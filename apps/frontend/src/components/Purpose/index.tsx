
import * as React from "react";
import { Block, BlockProps } from "baseui/block";
import { Accordion, Panel } from 'baseui/accordion';
import _includes from 'lodash/includes'
import { Plus } from "baseui/icon";
import { Label2, Paragraph2 } from "baseui/typography";
import { Button, SIZE as ButtonSize, KIND } from "baseui/button";
import axios from "axios";


import TablePurpose from './TablePurpose'
import ModalPolicy from './ModalPolicy'
import ModalProcess from './ModalProcess'
import { renderLegalBasis } from "../../util/LegalBasis"
import { codelist, ListName } from "../../service/Codelist"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

type PurposeViewProps = {
    description: string | any | null;
    purpose: string;
    processList: Array<any> | any | null;
    defaultExpandedPanelId: string | null | undefined;
};

const blockProps: BlockProps = {
    marginBottom: "3rem"
};

const rowPanelContent: BlockProps = {
    display: 'flex',
    marginBottom: '1rem',
    justifyContent: 'space-between'
}

const renderListItem = (legalBasis: any | object) => {
    return (
        <li>
            <Paragraph2>{renderLegalBasis(legalBasis)}</Paragraph2>
        </li>
    )
}
const renderLegalBasisList = (list: any) => {
    if (!list) return null
    if (list.length < 1)
        return (<Paragraph2>Fant ingen rettslige grunnlag</Paragraph2>)

    return (
        <ul>
            {list.map((legalBasis: any, i: number) => <li key={i}>{renderListItem(legalBasis)}</li>)}
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
        const subjectCategory = codelist.getShortname(ListName.SUBJECT_CATEGORY, curr.subjectCategory.code)
        if (!_includes(acc, subjectCategory) && subjectCategory)
            acc = [...acc, subjectCategory]
        return acc
    }, [])

    if (subjectCategories.length < 1) return notFound

    return (<Paragraph2>{subjectCategories.join(', ')}</Paragraph2>)
}

const PurposeResult = ({ description, purpose, processList, defaultExpandedPanelId }: PurposeViewProps) => {

    const [isOpen, setIsOpen] = React.useState<any>(false);
    const [currentExpanded, setCurrentExpanded] = React.useState<any>();
    const [showProcessModal, setShowProcessModal] = React.useState(false)
    const [showEditProcessModal, setShowEditProcessModal] = React.useState(false)
    const [errorCreatePolicy, setErrorCreatePolicy] = React.useState()
    const [errorCreateProcess, setErrorCreateProcess] = React.useState()

    const handleCreatePolicy = async (values: any, process: any) => {
        if (!values) return

        let body = [{
            ...values,
            process: process.name,
            purposeCode: process.purposeCode
        }]

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

    const handleEditProcess = async (values: any, id: any) => {
        let body = {
            id: id,
            name: values.name,
            department: values.department ? values.department : null,
            subDepartment: values.subDepartment ? values.subDepartment : null,
            legalBases: values.legalBases ? values.legalBases : [],
            purposeCode: purpose
        }

        await axios
            .put(`${server_polly}/process/${id}`, body)
            .then(((res: any) => {
                let index = processList.findIndex((process: any) => process.name === res.data.name)
                let policies = processList[index].policies
                processList[index] = { ...res.data, policies: policies }
                setErrorCreateProcess(null)
                setShowEditProcessModal(false)
            }))
            .catch((err: any) => setErrorCreateProcess(err.message));
    }

    const isExpanded = (process: any) => {
        if (process.id === defaultExpandedPanelId && !currentExpanded) {
            setCurrentExpanded([process.name])
            return true
        }
        if (!currentExpanded) return false
        else if (process.name === currentExpanded[0]) return true
        else return false
    }

    const getInitialValuesProcessEdit = (process: any) => {
        const { name, department, subDepartment, legalBases } = process
        let parsedLegalBases = legalBases && legalBases.map((legalBasis: any) => ({
            gdpr: legalBasis.gdpr && legalBasis.gdpr.code,
            nationalLaw: legalBasis.nationalLaw && legalBasis.nationalLaw.code,
            description: legalBasis.description
        }))

        return {
            name: name,
            department: department && department.code,
            subDepartment: subDepartment && subDepartment.code,
            legalBases: parsedLegalBases
        }
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
                        isEdit={false}
                        initialValues={{ name: '', department: '', subDepartment: '', legalBases: [] }}
                    />
                </Block>

                {processList && (
                    <Accordion onChange={({ expanded }) => {
                        defaultExpandedPanelId = null
                        setCurrentExpanded(expanded)
                    }}>

                        {processList.map((process: any, index: any) => (
                            <Panel title={process.name} key={process.name} expanded={isExpanded(process)}>
                                <Block {...rowPanelContent} marginBottom="2rem">
                                    <Block display="flex">
                                        <Block marginRight="6rem">
                                            <Label2>Rettslig grunnlag for behandlingen</Label2>
                                            {renderLegalBasisList(process.legalBases)}
                                        </Block>
                                        <Block>
                                            <Label2>Kategorier av personer</Label2>
                                            {renderAllSubjectCategories(process)}
                                        </Block>
                                    </Block>
                                    <Block>
                                        <Button
                                            size={ButtonSize.compact}
                                            kind={KIND.secondary}
                                            onClick={() => setShowEditProcessModal(true)}
                                        >
                                            Rediger behandling
                                        </Button>
                                        <ModalProcess
                                            onClose={() => setShowEditProcessModal(false)}
                                            isOpen={showEditProcessModal}
                                            submit={(values: any) => handleEditProcess(values, process.id)}
                                            errorOnCreate={errorCreateProcess}
                                            isEdit={true}
                                            initialValues={getInitialValuesProcessEdit(process)}

                                        />
                                    </Block>
                                </Block>

                                <Block {...rowPanelContent}>
                                    <Label2 alignSelf="center">Opplysningstyper</Label2>
                                    <Button
                                        size={ButtonSize.compact}
                                        kind={KIND.tertiary}
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
                                        errorOnCreate={errorCreatePolicy}
                                    />
                                </Block>
                                {process.policies && (
                                    <Block >
                                        <TablePurpose policies={process.policies} />
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
