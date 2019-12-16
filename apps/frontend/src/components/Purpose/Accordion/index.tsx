import * as React from 'react'
import { Accordion, Panel } from 'baseui/accordion'
import { generatePath, RouteComponentProps, withRouter } from 'react-router'
import { Button, KIND, SIZE as ButtonSize } from "baseui/button";
import { Spinner } from 'baseui/spinner';
import { Block, BlockProps } from 'baseui/block';
import { Label1, Label2, Paragraph2 } from 'baseui/typography';
import { intl, useAwait, theme } from '../../../util';
import _includes from 'lodash/includes'
import { user } from "../../../service/User";
import { Plus } from 'baseui/icon'
import { LegalBasis, PolicyFormValues, Process, ProcessFormValues } from "../../../constants"
import { LegalBasisView } from "../../common/LegalBasis"
import { codelist, ListName } from "../../../service/Codelist"
import ModalProcess from './ModalProcess';
import ModalPolicy from './ModalPolicy'
import TablePurpose from './TablePurpose';
import { convertProcessToFormValues, createPolicy, getProcess, updateProcess, deleteProcess } from "../../../api"
import { PathParams } from "../../../pages/PurposePage"
import { useEffect } from "react"
import { ActiveIndicator } from "../../common/Durations"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrash, faPen, faChevronDown, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'baseui/modal';

const rowPanelContent: BlockProps = {
    display: 'flex',
    marginBottom: '1rem',
    justifyContent: 'space-between'
}

type AccordionProcessProps = {
    purposeCode: string;
    processList: Process[];
    currentProcess: Process | undefined;
    errorProcessModal: any | null;
    errorPolicyModal: string | null;
    setProcessList: Function;
    onChangeProcess: Function;
    submitDeleteProcess: Function;
    submitEditProcess: Function;
    submitCreatePolicy: Function;
    submitEditPolicy: Function;
    submitDeletePolicy: Function;
}

const AccordionProcess = (props: AccordionProcessProps & RouteComponentProps<PathParams>) => {
    const [isLoading, setLoading] = React.useState(false);
    const [showEditProcessModal, setShowEditProcessModal] = React.useState(false)
    const [showCreatePolicyModal, setShowCreatePolicyModal] = React.useState(false)
    const [showDeleteModal, setShowDeleteModal] = React.useState(false)
    const [errorDeleteModal, setErrorDeleteModal] = React.useState(false)

    const {
        purposeCode,
        currentProcess,
        onChangeProcess,
        submitDeleteProcess,
        submitEditProcess,
        submitCreatePolicy,
        submitEditPolicy,
        errorProcessModal,
        errorPolicyModal,
        submitDeletePolicy
    } = props

    const updatePath = (params: PathParams | null) => {
        let nextPath
        if (!params) nextPath = generatePath(props.match.path)
        else nextPath = generatePath(props.match.path, params)
        props.history.push(nextPath)
    }

    const handleChangePanel = async (processId?: string) => {
        if (!processId)
            updatePath({ purposeCode: purposeCode })
        else {
            updatePath({ purposeCode: purposeCode, processId: processId })
        }
    }

    const renderActiveForProcess = (process: Process) =>
        <Block marginRight="scale1200">
            <Label2>{intl.active}</Label2>
            <ActiveIndicator alwaysShow={true} withText={true} {...process} />
        </Block>

    const renderLegalBasisListForProcess = (list: LegalBasis[]) => (
        <Block marginRight="scale1200">
            <Label2>{intl.legalBasis}</Label2>
            {list && list.length < 1 && <Paragraph2>{intl.legalBasisNotFound}</Paragraph2>}
            {list && list.length > 0 && (
                <ul style={{ listStyle: "none", paddingInlineStart: 0 }}>
                    {list.map((legalBasis, i) => <li key={i}><Paragraph2><LegalBasisView legalBasis={legalBasis} /></Paragraph2></li>)}
                </ul>
            )}
        </Block>
    )
    const renderSubjectCategoriesForProcess = (processObj: Process) => {
        const notFound = (<Paragraph2>{intl.subjectCategoriesNotFound}</Paragraph2>)
        let display
        if (!processObj) display = notFound
        else if (!processObj.policies) {
            display = notFound
        } else {
            if (processObj.policies.length < 1) display = notFound
            else {
                const subjectCategories = processObj.policies.reduce((acc: string[], curr) => {
                    const subjectCategory = codelist.getShortname(ListName.SUBJECT_CATEGORY, curr.subjectCategory.code)
                    if (!_includes(acc, subjectCategory) && subjectCategory)
                        acc = [...acc, subjectCategory]
                    return acc
                }, [])
                if (subjectCategories.length < 1) display = notFound
                else display = <Paragraph2>{subjectCategories.join(', ')}</Paragraph2>
            }
        }

        return (
            <Block marginRight="scale1200">
                <Label2>{intl.subjectCategories}</Label2>
                {display}
            </Block>
        )
    }
    const renderEditProcessButton = () => (
        <Button
            size={ButtonSize.compact}
            kind={KIND.secondary}
            onClick={() => setShowEditProcessModal(true)}
            overrides={{
                BaseButton: {
                    style: () => {
                        return { marginRight: theme.sizing.scale500 }
                    }
                }
            }}
        >
            <FontAwesomeIcon icon={faPen} />
        </Button>
    )
    const renderDeleteProcessButton = () => (
        <Button
            size={ButtonSize.compact}
            kind={KIND.secondary}
            onClick={() => setShowDeleteModal(true)}
        >
            <FontAwesomeIcon icon={faTrash} />
        </Button>
    )
    const renderCreatePolicyButton = () => (
        <Button
            size={ButtonSize.compact}
            kind={KIND.tertiary}
            onClick={() => setShowCreatePolicyModal(true)}
            startEnhancer={() => <Block display="flex" justifyContent="center"><Plus size={22} /></Block>}
        >
            {intl.addNew}
        </Button>
    )

    const hasAccess = () => user.canWrite()
    useAwait(user.wait())

    useEffect(() => {
        onChangeProcess(props.match.params.processId!)
    }, [props.match.params.processId])

    return (
        <React.Fragment>
            <Accordion onChange={({ expanded }) => handleChangePanel(expanded.length ? expanded[0].toString() : undefined)}
                initialState={{ expanded: props.match.params.processId ? [props.match.params.processId] : [] }} >
                {props.processList && props.processList.map((p: Process) => (
                    <Panel
                        title={p.name}
                        key={p.id}
                        overrides={{
                            ToggleIcon: {component: (iconProps) => !!iconProps.$expanded ? <FontAwesomeIcon icon={faChevronDown}/> : <FontAwesomeIcon icon={faChevronRight}/>}
                        }}
                    >
                        {isLoading && <Spinner size={18} />}

                        {!isLoading && currentProcess && (
                            <React.Fragment>
                                <Block {...rowPanelContent}>
                                    <Block display="flex">
                                        {renderLegalBasisListForProcess(currentProcess.legalBases)}
                                        {renderSubjectCategoriesForProcess(currentProcess)}
                                        {renderActiveForProcess(currentProcess)}
                                    </Block>
                                    {hasAccess() && (
                                        <Block>
                                            {renderEditProcessButton()}
                                            {renderDeleteProcessButton()}
                                        </Block>
                                    )}
                                </Block>

                                <Block {...rowPanelContent}>
                                    <Label2 alignSelf="center">{intl.informationTypes}</Label2>
                                    {hasAccess() && (
                                        <React.Fragment>
                                            {renderCreatePolicyButton()}
                                        </React.Fragment>
                                    )}
                                </Block>
                                {currentProcess.policies && (
                                    <Block>
                                        <TablePurpose
                                            process={currentProcess}
                                            hasAccess={hasAccess()}
                                            errorPolicyModal={errorPolicyModal}
                                            errorDeleteModal={errorPolicyModal}
                                            submitEditPolicy={submitEditPolicy}
                                            submitDeletePolicy={submitDeletePolicy}
                                        />
                                    </Block>
                                )}

                                <ModalProcess
                                    title={intl.processingActivitiesEdit}
                                    onClose={() => setShowEditProcessModal(false)}
                                    isOpen={showEditProcessModal}
                                    submit={async (values: ProcessFormValues) => {
                                        await submitEditProcess(values) ? setShowEditProcessModal(false) : setShowEditProcessModal(true)
                                    }}
                                    errorOnCreate={errorProcessModal}
                                    isEdit={true}
                                    initialValues={convertProcessToFormValues(currentProcess)}
                                />
                                <ModalPolicy
                                    title={intl.policyNew}
                                    initialValues={{
                                        informationType: undefined,
                                        legalBasesStatus: undefined,
                                        process: currentProcess,
                                        purposeCode: currentProcess.purposeCode,
                                        subjectCategory: undefined,
                                        start: undefined,
                                        end: undefined,
                                        legalBases: []
                                    }}
                                    isEdit={false}
                                    onClose={() => setShowCreatePolicyModal(false)}
                                    isOpen={showCreatePolicyModal}
                                    submit={(values: PolicyFormValues) => {
                                        submitCreatePolicy(values) ? setShowCreatePolicyModal(false) : setShowCreatePolicyModal(true)
                                    }}
                                    errorOnCreate={errorPolicyModal}
                                />

                                <Modal
                                    onClose={() => setShowDeleteModal(false)}
                                    isOpen={showDeleteModal}
                                    animate
                                    size="default"
                                >
                                    <ModalHeader>{intl.confirmDeleteHeader}</ModalHeader>
                                    <ModalBody>
                                        <Paragraph2>{intl.confirmDeleteProcessText}  {currentProcess.name}</Paragraph2>
                                    </ModalBody>

                                    <ModalFooter>
                                        <Block display="flex" justifyContent="flex-end">
                                            <Block alignSelf="flex-end">{errorProcessModal && <p>{errorProcessModal}</p>}</Block>
                                            <Button
                                                kind="secondary"
                                                onClick={() => setShowDeleteModal(false)}
                                                overrides={{ BaseButton: { style: { marginRight: '1rem', marginLeft: '1rem' } } }}
                                            >
                                                {intl.abort}
                                            </Button>
                                            <Button onClick={() =>
                                                submitDeleteProcess(currentProcess) ? setShowDeleteModal(false) : setShowDeleteModal(true)
                                            }>
                                                {intl.delete}
                                            </Button>
                                        </Block>
                                    </ModalFooter>
                                </Modal>
                            </React.Fragment>
                        )}
                    </Panel>
                ))}
            </Accordion>

        </React.Fragment>

    )
}

export default withRouter(AccordionProcess)