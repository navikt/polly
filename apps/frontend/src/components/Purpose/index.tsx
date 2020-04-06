import * as React from 'react'
import {useEffect} from 'react'

import {Block, BlockProps} from 'baseui/block'
import {Label1} from 'baseui/typography'
import {KIND, SIZE as ButtonSize} from 'baseui/button'
import {AddDocumentToProcessFormValues, LegalBasesStatus, Policy, PolicyFormValues, Process, ProcessFormValues, UseWithPurpose} from '../../constants'
import {intl, theme, useAwait} from '../../util'
import {user} from '../../service/User'
import ModalProcess from './Accordion/ModalProcess'
import AccordionProcess from './Accordion'
import {
  convertProcessToFormValues,
  createPolicies,
  createPolicy,
  createProcess,
  deletePolicy,
  deleteProcess,
  getCodelistUsage,
  getProcess,
  getProcessesForTeam,
  updatePolicy,
  updateProcess
} from '../../api'
import {StyledSpinnerNext} from 'baseui/spinner'
import {ListName} from '../../service/Codelist'
import {useLocation} from 'react-router'
import {StyledLink} from 'baseui/link'
import {env} from '../../util/env'
import {faFileWord, faPlus} from '@fortawesome/free-solid-svg-icons'
import Button from '../common/Button'
import {Select} from "baseui/select";

const rowBlockProps: BlockProps = {
  marginBottom: 'scale800',
  display: 'flex',
  justifyContent: 'space-between'
}

type ProcessListProps = {
  code: string;
  listName?: string;
}

const sortProcess = (list: UseWithPurpose[]) => list.sort((p1, p2) => p1.name.localeCompare(p2.name, intl.getLanguage()))

const ProcessList = ({code, listName}: ProcessListProps) => {
  const [processList, setProcessList] = React.useState<UseWithPurpose[]>([])
  const [currentProcess, setCurrentProcess] = React.useState<Process | undefined>()
  const [showCreateProcessModal, setShowCreateProcessModal] = React.useState(false)
  const [errorProcessModal, setErrorProcessModal] = React.useState(null)
  const [errorPolicyModal, setErrorPolicyModal] = React.useState(null)
  const [errorDocumentModal, setErrorDocumentModal] = React.useState(null)
  const [isLoadingProcessList, setIsLoadingProcessList] = React.useState(true)
  const [isLoadingProcess, setIsLoadingProcess] = React.useState(true)
  const current_location = useLocation()
  const [status, setStatus] = React.useState([{label: intl.all, id: "ALL"}]);

  const getProcessList = async () => {
    try {
      let list: UseWithPurpose[] = []

      if (current_location.pathname.includes('team')) {
        let res = await getProcessesForTeam(code)
        res.content ? list = res.content as UseWithPurpose[] : list = []
      } else {
        list = (await getCodelistUsage(listName as ListName, code)).processes
      }
      if (status[0].id === "ALL") {
        setProcessList(sortProcess(list))
      } else {
        let listTemp: UseWithPurpose[] = []
        for (const value of sortProcess(list)) {
          if ((await getProcess(value.id)).status === status[0].id) {
            listTemp = [...listTemp, {id: value.id, purposeCode: value.purposeCode, name: value.name} as UseWithPurpose]
          }
        }
        setProcessList(listTemp)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getProcessById = async (processId: string) => {
    try {
      setIsLoadingProcess(true)
      setCurrentProcess(await getProcess(processId))
    } catch (err) {
      console.log(err)
    }
    setIsLoadingProcess(false)
  }

  const handleCreateProcess = async (process: ProcessFormValues) => {
    if (!process) return
    try {
      const newProcess = await createProcess(process)
      setProcessList(sortProcess([...processList, newProcess]))
      setErrorProcessModal(null)
      setShowCreateProcessModal(false)
    } catch (err) {
      setErrorProcessModal(err.message)
    }
  }

  const handleEditProcess = async (values: ProcessFormValues) => {
    try {
      const updatedProcess = await updateProcess(values)
      setCurrentProcess(updatedProcess)
      setProcessList(sortProcess([...processList.filter(p => p.id !== updatedProcess.id), updatedProcess]))
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
  const handleDeleteProcess = async (process: Process) => {
    try {
      await deleteProcess(process.id)
      setProcessList(sortProcess(processList.filter((p: UseWithPurpose) => p.id !== process.id)))
      setErrorProcessModal(null)
      return true
    } catch (err) {
      setErrorProcessModal(err)
      return false
    }
  }

  const handleCreatePolicy = async (values: PolicyFormValues) => {
    if (!values || !currentProcess) return false

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
      return false
    }
  }
  const handleDeletePolicy = async (policy?: Policy) => {
    if (!policy) return false
    try {
      await deletePolicy(policy.id)
      if (currentProcess) {
        setCurrentProcess({...currentProcess, policies: [...currentProcess.policies.filter((p: Policy) => p.id !== policy.id)]})
        setErrorPolicyModal(null)
      }
      return true

    } catch (err) {
      setErrorPolicyModal(err.message)
      return false
    }
  }

  const handleAddDocument = async (formValues: AddDocumentToProcessFormValues) => {
    try {
      const policies: PolicyFormValues[] = formValues.informationTypes.map(infoType => ({
        subjectCategories: infoType.subjectCategories.map(c => c.code),
        informationType: infoType.informationType,
        process: {...formValues.process, legalBases: []},
        purposeCode: formValues.process.purposeCode,
        legalBases: [],
        legalBasesOpen: false,
        legalBasesStatus: LegalBasesStatus.INHERITED,
        documentIds: formValues.defaultDocument ? [] : [formValues.document!.id]
      }))
      await createPolicies(policies)
      await getProcessById(formValues.process.id)
    } catch (e) {
      console.log(e)
      setErrorDocumentModal(e.message)
      return false
    }
    return true
  }

  const hasAccess = () => user.canWrite()

  useAwait(user.wait())

  useEffect(() => {
    (async () => {
      setIsLoadingProcessList(true)
      await getProcessList()
      setIsLoadingProcessList(false)
    })()
  }, [code, status])

  const listNameToUrl = () => listName && ({
    'DEPARTMENT': 'department',
    'SUB_DEPARTMENT': 'subDepartment',
    'PURPOSE': 'purpose'
  } as { [l: string]: string })[listName]

  return (
    <>
      <Block {...rowBlockProps}>
        <Block>
          <Label1 font="font400">
            {intl.processes}
          </Label1>
        </Block>
      </Block>

      <Block display={"flex"} flexDirection={"row-reverse"}>
        <Block width={"15%"}>
          <Select
            backspaceRemoves={false}
            clearable={false}
            deleteRemoves={false}
            escapeClearsValue={false}
            options={[
              {label: intl.all, id: "ALL"},
              {label: intl.inProgress, id: "IN_PROGRESS"},
              {label: intl.completed, id: "COMPLETED"},
            ]}
            value={status}
            filterOutSelected={false}
            searchable={false}
            onChange={(params: any) => {
              setStatus(params.value)
            }}
          />
        </Block>
        <Block>
          <StyledLink
            style={{textDecoration: 'none'}}
            href={`${env.pollyBaseUrl}/export/process?${listNameToUrl()}=${code}`}>
            <Button
              kind={KIND.minimal}
              size={ButtonSize.compact}
              icon={faFileWord}
              tooltip={intl.export}
              marginRight
            >
              {intl.export}
            </Button>
          </StyledLink>
          {hasAccess() && (
            <Button
              size={ButtonSize.compact}
              kind={KIND.minimal}
              icon={faPlus}
              onClick={() => setShowCreateProcessModal(true)}
            >
              {intl.processingActivitiesNew}
            </Button>
          )}
        </Block>
      </Block>

      {isLoadingProcessList && <StyledSpinnerNext size={theme.sizing.scale2400}/>}

      {!isLoadingProcessList &&
      <AccordionProcess
        isLoading={isLoadingProcess}
        code={code}
        processList={processList}
        setProcessList={setProcessList}
        currentProcess={currentProcess}
        onChangeProcess={getProcessById}
        submitDeleteProcess={handleDeleteProcess}
        submitEditProcess={handleEditProcess}
        submitCreatePolicy={handleCreatePolicy}
        submitEditPolicy={handleEditPolicy}
        submitDeletePolicy={handleDeletePolicy}
        submitAddDocument={handleAddDocument}
        errorProcessModal={errorProcessModal}
        errorPolicyModal={errorPolicyModal}
        errorDocumentModal={errorDocumentModal}
      />
      }

      <ModalProcess
        title={intl.processingActivitiesNew}
        onClose={() => setShowCreateProcessModal(false)}
        isOpen={showCreateProcessModal}
        submit={(values: ProcessFormValues) => handleCreateProcess(values)}
        errorOnCreate={errorProcessModal}
        isEdit={false}
        initialValues={convertProcessToFormValues({purposeCode: code})}
      />
    </>
  )
}

export default ProcessList
