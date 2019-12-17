import * as React from "react";

import { Block, BlockProps } from "baseui/block";
import { Plus } from "baseui/icon";
import { Label2 } from "baseui/typography";
import { Button, KIND, SIZE as ButtonSize } from "baseui/button";
import { Process, ProcessFormValues, PolicyFormValues, Policy } from "../../constants"
import { intl, useAwait } from "../../util"
import { user } from "../../service/User";
import ModalProcess from './Accordion/ModalProcess'
import AccordionProcess from "./Accordion";
import {
    createProcess, createPolicy, getProcessesForPurpose, getProcess, updateProcess, updatePolicy,
    deleteProcess, deletePolicy, mapProcessFromForm
} from "../../api"

const rowBlockProps: BlockProps = {
    marginBottom: 'scale800',
    display: 'flex',
    justifyContent: 'space-between'
}

type ProcessListProps = {
    purposeCode: string;
}

const ProcessList = ({ purposeCode }: ProcessListProps) => {
    const [processList, setProcessList] = React.useState<Process[]>([])
    const [currentProcess, setCurrentProcess] = React.useState<Process | undefined>()
    const [showCreateProcessModal, setShowCreateProcessModal] = React.useState(false)
    const [errorProcessModal, setErrorProcessModal] = React.useState(null)
    const [errorPolicyModal, setErrorPolicyModal] = React.useState(null)


    const [isLoadingProcessList, setIsLoadingProcessList] = React.useState(true)

    const getProcessListByPurpose = async (purpose: string) => {
        setIsLoadingProcessList(true)
        try {
            setProcessList((await getProcessesForPurpose(purpose)).content)
        } catch (err) {
            console.log(err)
        }

        setIsLoadingProcessList(false)
    }

    const getProcessById = async (processId: string) => {
        try {
            setCurrentProcess(await getProcess(processId))
        } catch (err) {
            console.log(err)
        }
    }

    const handleCreateProcess = async (process: ProcessFormValues) => {
        if (!process) return
        try {
            const newProcess = await createProcess(process)
            setProcessList([...processList, newProcess])
            setErrorProcessModal(null)
            setShowCreateProcessModal(false)
        } catch (err) {
            setShowCreateProcessModal(false)
            setErrorProcessModal(err.message)
        }
    }
    const handleEditProcess = async (values: ProcessFormValues) => {
        try {
            setCurrentProcess(await updateProcess(values))
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }
    const handleDeleteProcess = async (process: Process) => {
        try {
            await deleteProcess(process.id)
            setProcessList(processList.filter((p: Process) => p.id !== process.id))
            setErrorProcessModal(null)
            return true
        } catch (err) {
            setErrorProcessModal(err)
            return false
        }
    }

    const handleCreatePolicy = async (values: PolicyFormValues) => {
        if (!values || !currentProcess) return

        try {
            const policy = await createPolicy(values)
            await getProcessById(policy.process.id)
            setErrorPolicyModal(null)
            return true
        } catch (err) {
            setErrorPolicyModal(err.message)
            return false
        }
    }
    const handleEditPolicy = async (values: PolicyFormValues) => {
        try {
            const policy = await updatePolicy(values)
            if (currentProcess) {
                setCurrentProcess({
                    ...currentProcess,
                    policies: [...currentProcess.policies.filter((p: Policy) => p.id !== policy.id), policy]
                })
                setErrorPolicyModal(null)
            }
            return true
        } catch (err) {
            setErrorPolicyModal(err.message)
        }
    }
    const handleDeletePolicy = async (policy?: Policy) => {
        if (!policy) return
        try {
            await deletePolicy(policy.id)
            if (currentProcess) {
                setCurrentProcess({ ...currentProcess, policies: [...currentProcess.policies.filter((p: Policy) => p.id !== policy.id)] })
                setErrorPolicyModal(null)
            }
            return true

        } catch (err) {
            setErrorPolicyModal(err.message)
            return false
        }
    }

    const hasAccess = () => user.canWrite()

    useAwait(user.wait())

    React.useEffect(() => {
        const fetchData = async () => {
            await getProcessListByPurpose(purposeCode)
        };
        fetchData();
    }, [purposeCode]);

    return (
        <React.Fragment>
            <React.Fragment>
                <Block {...rowBlockProps}>
                    <Label2 font="font400">{intl.processingActivities}</Label2>
                    {hasAccess() && (
                        <React.Fragment>
                            <Button
                                size={ButtonSize.compact}
                                kind={KIND.minimal}
                                onClick={() => setShowCreateProcessModal(true)}
                                startEnhancer={() => <Block display="flex" justifyContent="center"><Plus size={22} /></Block>}
                            >
                                {intl.processingActivitiesNew}
                            </Button>
                        </React.Fragment>
                    )}
                </Block>

                {!isLoadingProcessList &&
                    <AccordionProcess
                        isLoading={isLoadingProcessList}
                        purposeCode={purposeCode}
                        processList={processList}
                        setProcessList={setProcessList}
                        currentProcess={currentProcess}
                        onChangeProcess={getProcessById}
                        submitDeleteProcess={handleDeleteProcess}
                        submitEditProcess={handleEditProcess}
                        submitCreatePolicy={handleCreatePolicy}
                        submitEditPolicy={handleEditPolicy}
                        submitDeletePolicy={handleDeletePolicy}
                        errorProcessModal={errorProcessModal}
                        errorPolicyModal={errorPolicyModal}
                    />
                }

                <ModalProcess
                    title={intl.processingActivitiesNew}
                    onClose={() => setShowCreateProcessModal(false)}
                    isOpen={showCreateProcessModal}
                    submit={(values: ProcessFormValues) => handleCreateProcess(values)}
                    errorOnCreate={errorProcessModal}
                    isEdit={false}
                    initialValues={{ name: '', department: '', subDepartment: '', purposeCode: purposeCode, legalBases: [] }}
                />
            </React.Fragment>
        </React.Fragment>
    );
};

export default ProcessList;
