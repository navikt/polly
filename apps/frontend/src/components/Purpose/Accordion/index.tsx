import * as React from 'react'
import { Accordion, Panel } from 'baseui/accordion'
import { withRouter, RouteComponentProps } from 'react-router'
import { generatePath } from "react-router";
import axios from 'axios';
import { Button, SIZE as ButtonSize, KIND } from "baseui/button";
import { Spinner } from 'baseui/spinner';
import { Block, BlockProps } from 'baseui/block';
import { Label2, Paragraph2 } from 'baseui/typography';
import { intl } from '../../../util';
import _includes from 'lodash/includes'
import { user } from "../../../service/User";
import { useAwait } from "../../../util/customHooks";
import { Plus } from 'baseui/icon'
import { LegalBasesStatus, PolicyFormValues, Process } from "../../../constants"


import { LegalBasisView } from "../../common/LegalBasis"
import { codelist, ListName } from "../../../service/Codelist"
import ModalProcess from './ModalProcess';
import ModalPolicy from './ModalPolicy'
import TablePurpose from './TablePurpose';

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

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
    const [process, setProcess] = React.useState<Process | null>(null)
    const { currentPurpose } = props

    const updatePath = (params: { id: string, processid?: string } | null) => {
        let nextPath
        if (!params) nextPath = generatePath(props.match.path)
        else nextPath = generatePath(props.match.path, params)
        props.history.push(nextPath)
    }
    function mapPolicyFromForm(values: PolicyFormValues) {
        return {
            ...values,
            informationType: undefined,
            informationTypeName: values.informationType && values.informationType.name,
            process: values.process.name,
            legalBases: values.legalBasesStatus !== LegalBasesStatus.OWN ? [] : values.legalBases,
            legalBasesInherited: values.legalBasesStatus === LegalBasesStatus.INHERITED,
            legalBasesStatus: undefined
        }
    }

    const handleEditProcess = async (values: any, id: any) => {
        let body = {
            id: id,
            name: values.name,
            department: values.department ? values.department : undefined,
            subDepartment: values.subDepartment ? values.subDepartment : undefined,
            legalBases: values.legalBases ? values.legalBases : [],
            purposeCode: currentPurpose
        }

        await axios
            .put(`${server_polly}/process/${id}`, body)
            .then(((res: any) => {
                let currentPolicies = process && process.policies ? process.policies : []
                setProcess({ ...res.data, policies: currentPolicies })
                setShowEditProcessModal(false)
            }))
            .catch((err: any) => console.log(err));
    }
    const handleCreatePolicy = async (values: any, process: any) => {
        if (!values) return
        let body = [mapPolicyFromForm(values)]

        await axios
            .post(`${server_polly}/policy`, body)
            .then(((res: any) => {
                setProcess({ ...process, policies: [...process.policies, res.data.content[0]] })
                setErrorCreatePolicy(null)
                setShowCreatePolicyModal(false)
            }))
            .catch((err: any) => {
                setShowCreatePolicyModal(true)
                setErrorCreatePolicy(err.message)
            });
    }
    const handleChangePanel = async (value: string | null) => {
        if (!value)
            updatePath({ id: currentPurpose })
        else {
            updatePath({ id: currentPurpose, processid: value })
            await getProcessById(value)
        }
    }

    const getProcessById = async (processid: string) => {
        setLoading(true);
        await axios
            .get(`${server_polly}/process/${processid}`)
            .then((res) => {
                setProcess(res.data)
            })
            .catch((err) => console.log(err));
        setLoading(false);
    }
    const getInitialValuesProcessEdit = (process: any) => {
        const { name, department, subDepartment, legalBases } = process
        let parsedLegalBases = legalBases && legalBases.map((legalBasis: any) => ({
            gdpr: legalBasis.gdpr && legalBasis.gdpr.code,
            nationalLaw: (legalBasis.nationalLaw && legalBasis.nationalLaw.code) || undefined,
            description: legalBasis.description || undefined,
            start: legalBasis.start || undefined,
            end: legalBasis.end || undefined
        }))

        return {
            name: name,
            department: department && department.code,
            subDepartment: subDepartment && subDepartment.code,
            legalBases: parsedLegalBases
        }
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
                                    submit={(values: any) => handleEditProcess(values, process.id)}
                                    errorOnCreate={null}
                                    isEdit={true}
                                    initialValues={getInitialValuesProcessEdit(process)}
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
                                    submit={(values: any) => handleCreatePolicy(values, process)}
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