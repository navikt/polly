import * as React from 'react'
import { Accordion, Panel } from 'baseui/accordion'
import { generatePath, RouteComponentProps, withRouter } from 'react-router'
import { Button, KIND, SIZE as ButtonSize } from "baseui/button";
import { Spinner } from 'baseui/spinner';
import { Block, BlockProps } from 'baseui/block';
import { Label2, Paragraph2 } from 'baseui/typography';
import { intl, useAwait } from '../../../util';
import _includes from 'lodash/includes'
import { user } from "../../../service/User";
import { Plus } from 'baseui/icon'
import { PolicyFormValues, Process, ProcessFormValues } from "../../../constants"


import { LegalBasisView } from "../../common/LegalBasis"
import { codelist, ListName } from "../../../service/Codelist"
import ModalProcess from './ModalProcess';
import ModalPolicy from './ModalPolicy'
import TablePurpose from './TablePurpose';
import { createPolicy } from "../../../api"
import { convertProcessToFormValues, getProcess, updateProcess } from "../../../api/ProcessApi"

const rowPanelContent: BlockProps = {
    display: 'flex',
    marginBottom: '1rem',
    justifyContent: 'space-between'
}

type AccordionProcessProps = {
    currentPurpose: string;
    processList: Process[];
}

const AccordionProcess = (props: AccordionProcessProps & RouteComponentProps) => {
    const [isLoading, setLoading] = React.useState(false);
    const [showEditProcessModal, setShowEditProcessModal] = React.useState(false)
    const [showCreatePolicyModal, setShowCreatePolicyModal] = React.useState(false)
    const [errorCreatePolicy, setErrorCreatePolicy] = React.useState(null)
    const [process, setProcess] = React.useState<Process | undefined>()
    const { currentPurpose } = props

    const updatePath = (params: { id: string, processid?: string } | null) => {
        let nextPath
        if (!params) nextPath = generatePath(props.match.path)
        else nextPath = generatePath(props.match.path, params)
        props.history.push(nextPath)
    }
    // todo noe rar interasksjon mellom create policy og edit policy som gjør at vi bør reloade hele process (edit og create burde være samme sted?)

    const handleEditProcess = async (values: ProcessFormValues) => {
        try {
            const updatedProcess = await updateProcess(values)
            // todo backend for update burde nok returnere med policies
            await getProcessById(updatedProcess.id)
            setShowEditProcessModal(false)
        } catch (err) {
            console.log(err)
        }
    }

    const handleCreatePolicy = async (values: PolicyFormValues) => {
        if (!values || !process) return

        try {
            const policy = await createPolicy(values)
            // todo
            await getProcessById(policy.process.id)
            setErrorCreatePolicy(null)
            setShowCreatePolicyModal(false)
        } catch (err) {
            setShowCreatePolicyModal(true)
            setErrorCreatePolicy(err.message)
        }
    }

    const handleChangePanel = async (value: string | null) => {
        if (!value)
            updatePath({ id: currentPurpose })
        else {
            updatePath({ id: currentPurpose, processid: value })
            await getProcessById(value)
        }
    }

    const getProcessById = async (processId: string) => {
        setLoading(true);
        try {
            setProcess(await getProcess(processId))
        } catch (err) {
            console.log(err)
        }
        setLoading(false);
    }

    const renderLegalBasisListForProcess = (list: any) => (
        <Block marginRight="scale1200">
            <Label2>{intl.legalBasis}</Label2>
            {list && list.length < 1 && <Paragraph2>{intl.legalBasisNotFound}</Paragraph2>}
            {list && list.length > 0 && (
                <ul style={{ listStyle: "none", paddingInlineStart: 0 }}>
                    {list.map((legalBasis: any, i: number) => <li key={i}><Paragraph2><LegalBasisView legalBasis={legalBasis} /></Paragraph2></li>)}
                </ul>
            )}
        </Block>
    )
    const renderSubjectCategoriesForProcess = (processObj: any) => {
        const notFound = (<Paragraph2>{intl.subjectCategoriesNotFound}</Paragraph2>)
        let display
        if (!processObj) display = notFound
        else if (!processObj.policies) {
            display = notFound
        } else {
            if (processObj.policies.length < 1) display = notFound
            else {
                const subjectCategories = processObj.policies.reduce((acc: any, curr: any) => {
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
            <Block>
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
        >
            {intl.processingActivitiesEdit}
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

    const hasAccess = () => {
        if (user.isLoggedIn())
            return user.canWrite()
        return false
    }
    useAwait(user.wait())

    return (
        <React.Fragment>
            <Accordion onChange={({ expanded }) => handleChangePanel(expanded.length < 1 ? null : expanded[0].toString())}>
                {props.processList && props.processList.map((p: Process) => (
                    <Panel title={p.name} key={p.id}>
                        {isLoading && <Spinner size={18} />}

                        {!isLoading && process && (
                            <React.Fragment>
                                <Block {...rowPanelContent}>
                                    <Block display="flex">
                                        {renderLegalBasisListForProcess(process.legalBases)}
                                        {renderSubjectCategoriesForProcess(process)}
                                    </Block>
                                    {hasAccess() && (
                                        <Block>
                                            {renderEditProcessButton()}
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
                                {process.policies && (
                                    <Block>
                                        <TablePurpose
                                            process={process}
                                            isLoggedIn={hasAccess()}
                                            updateProcess={() => getProcessById(process.id)}
                                        />
                                    </Block>
                                )}

                                <ModalProcess
                                    title={intl.processingActivitiesEdit}
                                    onClose={() => setShowEditProcessModal(false)}
                                    isOpen={showEditProcessModal}
                                    submit={(values: ProcessFormValues) => handleEditProcess(values)}
                                    errorOnCreate={null}
                                    isEdit={true}
                                    initialValues={convertProcessToFormValues(process)}
                                />
                                <ModalPolicy
                                    title={intl.policyNew}
                                    initialValues={{
                                        informationType: undefined,
                                        legalBasesStatus: undefined,
                                        process: process,
                                        purposeCode: process.purposeCode,
                                        subjectCategory: undefined,
                                        legalBases: []
                                    }}
                                    isEdit={false}
                                    onClose={() => setShowCreatePolicyModal(false)}
                                    isOpen={showCreatePolicyModal}
                                    submit={(values: PolicyFormValues) => handleCreatePolicy(values)}
                                    errorOnCreate={errorCreatePolicy}
                                />
                            </React.Fragment>
                        )}
                    </Panel>
                ))}
            </Accordion>

        </React.Fragment>

    )
}

export default withRouter(AccordionProcess)