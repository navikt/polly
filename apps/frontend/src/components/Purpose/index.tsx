import * as React from "react";
import {Block, BlockProps} from "baseui/block";
import {Plus} from "baseui/icon";
import {Label2} from "baseui/typography";
import {Button, KIND, SIZE as ButtonSize} from "baseui/button";
import axios from "axios";
import {Process} from "../../constants"
import {intl, useAwait} from "../../util"
import {user} from "../../service/User";
import ModalProcess from './Accordion/ModalProcess'
import { Block, BlockProps } from "baseui/block";
import { Plus } from "baseui/icon";
import { Label2 } from "baseui/typography";
import { Button, KIND, SIZE as ButtonSize } from "baseui/button";

import ModalProcess from './Accordion/ModalProcess'
import { Process } from "../../constants"
import { intl, useAwait } from "../../util"
import { user } from "../../service/User";
import AccordionProcess from "./Accordion";
import { createProcess, getProcessesForPurpose } from "../../api"

const rowBlockProps: BlockProps = {
    marginBottom: 'scale800',
    display: 'flex',
    justifyContent: 'space-between'
}

type ProcessListProps = {
    currentPurpose: string;
}

const ProcessList = ({currentPurpose}: ProcessListProps) => {
    const [showProcessModal, setShowProcessModal] = React.useState(false)
    const [errorProcessModal, setErrorProcessModal] = React.useState(null)
    const [processList, setProcessList] = React.useState<Process[]>([])
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

    const handleCreateProcess = async (process: Process) => {
        if (!process) return
        try {
            const newProcess = await createProcess(process)
            setProcessList([...processList, newProcess])
            setErrorProcessModal(null)
            setShowProcessModal(false)
        } catch (err) {
            setShowProcessModal(false)
            setErrorProcessModal(err.message)
        }
    }

    const hasAccess = () => {
        if (user.isLoggedIn())
            return user.canWrite()
        return false
    }

    useAwait(user.wait())

    React.useEffect(() => {
        const fetchData = async () => {
            await getProcessListByPurpose(currentPurpose)
        };
        fetchData();
    }, [currentPurpose]);

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
                                onClick={() => setShowProcessModal(true)}
                                startEnhancer={() => <Block display="flex" justifyContent="center"><Plus size={22}/></Block>}
                            >
                                {intl.processingActivitiesNew}
                            </Button>
                        </React.Fragment>
                    )}
                </Block>

                {!isLoadingProcessList &&
                <AccordionProcess currentPurpose={currentPurpose} processList={processList}/>
                }


                <ModalProcess
                    title={intl.processingActivitiesNew}
                    onClose={() => setShowProcessModal(false)}
                    isOpen={showProcessModal}
                    submit={(values: any) => handleCreateProcess(values)}
                    errorOnCreate={errorProcessModal}
                    isEdit={false}
                    initialValues={{name: '', department: '', subDepartment: '', purposeCode: currentPurpose, legalBases: []}}
                />

            </React.Fragment>
        </React.Fragment>
    );
};

export default ProcessList;
