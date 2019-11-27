
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
import { renderLegalBasis } from "../common/LegalBasis"
import { codelist, ListName } from "../../service/Codelist"
import { Process } from "../../constants"
import { intl } from "../../util/intl/intl"
import { useForceUpdate } from "../../util/customHooks"
import { user } from "../../service/User";
import { useAwait } from "../../util/customHooks";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

type PurposeViewProps = {
    description: string | any | null;
    purpose: string;
    processList: Array<Process> | any | null;
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

const renderLegalBasisList = (list: any) => {
    if (!list) return null
    if (list.length < 1)
        return (<Paragraph2>{intl.legalBasisNotFound}</Paragraph2>)

    return (
        <React.Fragment>
            {list.map((legalBasis: any, i: number) => <li key={i}><Paragraph2>{renderLegalBasis(legalBasis)}</Paragraph2></li>)}
        </React.Fragment>
    )
}

const renderAllSubjectCategories = (processObj: any) => {
    const notFound = (<Paragraph2>{intl.subjectCategoriesNotFound}</Paragraph2>)
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
    const [showEditPolicyModal, setShowEditPolicyModal] = React.useState()
    const [showDeleteModal, setShowDeleteModal] = React.useState()
    const [errorCreatePolicy, setErrorCreatePolicy] = React.useState()
    const [errorCreateProcess, setErrorCreateProcess] = React.useState()
    const [errorEditPolicy, setErrorEditPolicy] = React.useState()
    const update = useForceUpdate()

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
                update()
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
                update()
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
                update()
            }))
            .catch((err: any) => setErrorCreateProcess(err.message));
    }
    const handleEditPolicy = async (values: any) => {
        let body = [{
            ...values,
            legalBases: values.legalBasesInherited ? [] : values.legalBases
        }]
        await axios
            .put(`${server_polly}/policy`, body)
            .then(((res: any) => {
                console.log(res)
                let processIndex = processList.findIndex((process: any) => process.name === res.data.content[0].process.name)
                let process = processList[processIndex]
                if (!process.policies) process.policies = []
                let policyIndex = process.policies.findIndex((policy: any) => policy.id === values.id)
                process.policies[policyIndex] = { ...res.data.content[0] }
                setErrorEditPolicy(null)
                setShowEditPolicyModal(false)
                update()
            }))
            .catch((err: any) => {
                setShowEditPolicyModal(true)
                setErrorEditPolicy(err.message)
            });
    }
    const handleDeletePolicy = async (values: any) => {
        await axios
            .delete(`${server_polly}/policy/${values.id}`)
            .then(((res: any) => {
                let processIndex = processList.findIndex((process: any) => process.name === values.process.name)
                let process = processList[processIndex]
                process.policies = process.policies.filter((policy: any) => policy.id !== values.id)
                setShowDeleteModal(false)
            }))
            .catch((err: any) => {
                console.log(err)
                setShowDeleteModal(false)
            });
    }
    const hasAccess = () => {
        if (user.isLoggedIn())
            return user.canWrite()
        return false
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

    useAwait(user.wait())

    return (
        <React.Fragment>
            <React.Fragment>
                <Block {...blockProps}>
                    <Label2 font="font400">{intl.description}</Label2>
                    <Paragraph2>{description}</Paragraph2>
                </Block>

                <Block marginBottom="1rem" display="flex" justifyContent="space-between">
                    <Label2 font="font400">{intl.processingActivities}</Label2>
                    {hasAccess() && (
                        <React.Fragment>
                            <Button
                                size={ButtonSize.compact}
                                kind={KIND.minimal}
                                onClick={() => setShowProcessModal(true)}
                                startEnhancer={() => <Block display="flex" justifyContent="center"><Plus size={22} /></Block>}
                            >
                                {intl.processingActivitiesNew}
                            </Button>
                            <ModalProcess
                                title={intl.processingActivitiesNew}
                                onClose={() => setShowProcessModal(false)}
                                isOpen={showProcessModal}
                                submit={(values: any) => handleCreateProcess(values)}
                                errorOnCreate={errorCreateProcess}
                                isEdit={false}
                                initialValues={{ name: '', department: '', subDepartment: '', legalBases: [] }}
                            />
                        </React.Fragment>
                    )}
                </Block>

                {processList && (
                    <Accordion onChange={({ expanded }) => {
                        defaultExpandedPanelId = null
                        setCurrentExpanded(expanded)
                    }}>

                        {processList.map((process: Process, index: any) => (
                            <Panel title={process.name} key={process.name} expanded={isExpanded(process)}>
                                <Block {...rowPanelContent} marginBottom="2rem" padding="1rem">
                                    <Block display="flex">
                                        <Block marginRight="6rem">
                                            <Label2>{intl.legalBasis}</Label2>
                                            {renderLegalBasisList(process.legalBases)}
                                        </Block>
                                        <Block>
                                            <Label2>{intl.subjectCategories}</Label2>
                                            {renderAllSubjectCategories(process)}
                                        </Block>
                                    </Block>
                                    {hasAccess() && (
                                        <Block>
                                            <Button
                                                size={ButtonSize.compact}
                                                kind={KIND.secondary}
                                                onClick={() => setShowEditProcessModal(true)}
                                            >
                                                {intl.processingActivitiesEdit}
                                            </Button>
                                            <ModalProcess
                                                title={intl.processingActivitiesEdit}
                                                onClose={() => setShowEditProcessModal(false)}
                                                isOpen={showEditProcessModal}
                                                submit={(values: any) => handleEditProcess(values, process.id)}
                                                errorOnCreate={errorCreateProcess}
                                                isEdit={true}
                                                initialValues={getInitialValuesProcessEdit(process)}

                                            />
                                        </Block>
                                    )}
                                </Block>

                                <Block {...rowPanelContent}>
                                    <Label2 alignSelf="center">{intl.informationTypes}</Label2>
                                    {hasAccess() && (
                                        <React.Fragment>
                                            <Button
                                                size={ButtonSize.compact}
                                                kind={KIND.tertiary}
                                                onClick={() => setIsOpen(true)}
                                                startEnhancer={() => <Block display="flex" justifyContent="center"><Plus size={22} /></Block>}
                                            >
                                                {intl.addNew}
                                            </Button>
                                            <ModalPolicy
                                                title={intl.policyNew}
                                                initialValues={{ legalBases: [] }}
                                                isEdit={false}
                                                onClose={() => {
                                                    setIsOpen(false)
                                                    setErrorCreatePolicy(null)
                                                }}
                                                isOpen={isOpen}
                                                submit={(values: any) => handleCreatePolicy(values, process)}
                                                errorOnCreate={errorCreatePolicy}
                                            />
                                        </React.Fragment>
                                    )}
                                </Block>
                                {process.policies && (
                                    <Block >
                                        <TablePurpose
                                            policies={process.policies}
                                            onSubmitEdit={handleEditPolicy}
                                            errorOnSubmitEdit={errorEditPolicy}
                                            showEditModal={showEditPolicyModal}
                                            showDeleteModal={showDeleteModal}
                                            setShowEditModal={setShowEditPolicyModal}
                                            setShowDeleteModal={setShowDeleteModal}
                                            isLoggedIn={hasAccess()}
                                            onDeletePolicy={handleDeletePolicy}
                                        />
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
