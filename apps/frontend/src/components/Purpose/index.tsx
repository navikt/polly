import * as React from 'react'
import {useEffect} from 'react'

import {Block, BlockProps} from 'baseui/block'
import {HeadingSmall, Label2} from 'baseui/typography'
import {KIND, SIZE as ButtonSize} from 'baseui/button'
import {AddDocumentToProcessFormValues, LegalBasesUse, Policy, PolicyFormValues, Process, ProcessFormValues, ProcessShort, ProcessStatus} from '../../constants'
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
  getProcessesForProductArea,
  getProcessesForTeam,
  updatePolicy,
  updateProcess
} from '../../api'
import {StyledSpinnerNext} from 'baseui/spinner'
import {codelist, ListName} from '../../service/Codelist'
import {RouteComponentProps, useLocation} from 'react-router'
import {StyledLink} from 'baseui/link'
import {env} from '../../util/env'
import {faFileWord, faPlus} from '@fortawesome/free-solid-svg-icons'
import Button from '../common/Button'
import {Select} from 'baseui/select'
import {genProcessPath, Section} from '../../pages/ProcessPage'
import {withRouter} from 'react-router-dom'

const rowBlockProps: BlockProps = {
  marginBottom: 'scale800',
  display: 'flex',
  justifyContent: 'space-between'
}

type ProcessListProps = {
  section: Section;
  filter?: ProcessStatus;
  processId?: string;
  code: string;
  listName?: ListName;
}

const sortProcess = (list: ProcessShort[]) => list.sort((p1, p2) => p1.name.localeCompare(p2.name, intl.getLanguage()))

const ProcessList = ({code, listName, filter, processId, section, history}: ProcessListProps & RouteComponentProps<any>) => {
  const [processList, setProcessList] = React.useState<ProcessShort[]>([])
  const [currentProcess, setCurrentProcess] = React.useState<Process | undefined>()
  const [showCreateProcessModal, setShowCreateProcessModal] = React.useState(false)
  const [errorProcessModal, setErrorProcessModal] = React.useState<string>('')
  const [errorPolicyModal, setErrorPolicyModal] = React.useState(null)
  const [errorDocumentModal, setErrorDocumentModal] = React.useState(null)
  const [isLoadingProcessList, setIsLoadingProcessList] = React.useState(true)
  const [isLoadingProcess, setIsLoadingProcess] = React.useState(true)
  const current_location = useLocation()
  const [status, setStatus] = React.useState([{
    label: !filter ? intl.allProcesses : filter === ProcessStatus.COMPLETED ? intl.showCompletedProcesses : intl.inProgressProcesses,
    id: filter
  }])
  const [codelistLoading, setCodelistLoading] = React.useState(true)
  useAwait(codelist.wait(), setCodelistLoading)

  useEffect(() => {
    processId && getProcessById(processId)
  }, [processId])

  useEffect(() => {
    (async () => {
      setIsLoadingProcessList(true)
      await getProcessList()
      setIsLoadingProcessList(false)
    })()
  }, [code, status])

  const handleChangePanel = (process?: Partial<Process>) => {
    history.push(genProcessPath(section, code, process, status[0].id))
  }

  const hasAccess = () => user.canWrite()

  const listNameToUrl = () => listName && ({
    'DEPARTMENT': 'department',
    'SUB_DEPARTMENT': 'subDepartment',
    'PURPOSE': 'purpose',
    'SYSTEM': 'system'
  } as {[l: string]: string})[listName]

  const getProcessList = async () => {
    try {
      let list: ProcessShort[]

      if (current_location.pathname.includes('team')) {
        let res = await getProcessesForTeam(code)
        res.content ? list = res.content as ProcessShort[] : list = []
      } else if (current_location.pathname.includes('productarea')) {
        let res = await getProcessesForProductArea(code)
        res.content ? list = res.content as ProcessShort[] : list = []
      } else {
        list = (await getCodelistUsage(listName as ListName, code)).processes
      }
      if (!status[0].id) {
        setProcessList(sortProcess(list))
      } else {
        setProcessList(sortProcess(list).filter(p => p.status === status[0].id))
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getProcessById = async (id: string) => {
    try {
      setIsLoadingProcess(true)
      setCurrentProcess(await getProcess(id))
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
      setErrorProcessModal('')
      setShowCreateProcessModal(false)
      setCurrentProcess(newProcess)
      history.push(`/process/purpose/${newProcess.purpose.code}/${newProcess.id}?create`)
    } catch (err) {
      if (err.response.data.message.includes('already exists')) {
        setErrorProcessModal('Behandlingen eksisterer allerede.')
        return
      }
      setErrorProcessModal(err.response.data.message)
    }
  }

  const handleEditProcess = async (values: ProcessFormValues) => {
    try {
      const updatedProcess = await updateProcess(values)
      setCurrentProcess(updatedProcess)
      setProcessList(sortProcess([...processList.filter(p => p.id !== updatedProcess.id), updatedProcess]))
      handleChangePanel(updatedProcess)
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
  const handleDeleteProcess = async (process: Process) => {
    try {
      await deleteProcess(process.id)
      setProcessList(sortProcess(processList.filter((p: ProcessShort) => p.id !== process.id)))
      setErrorProcessModal('')
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
        purposeCode: formValues.process.purpose.code,
        legalBases: [],
        legalBasesOpen: false,
        legalBasesUse: LegalBasesUse.INHERITED_FROM_PROCESS,
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

  return (
    <>
      <Block {...rowBlockProps}>
        <Block>
          <HeadingSmall>
            {intl.processes}
          </HeadingSmall>
        </Block>
      </Block>

      <Block display={'flex'} flexDirection={'row-reverse'} alignItems={'center'}>
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
        <Block width={'25%'}>
          <Select
            backspaceRemoves={false}
            clearable={false}
            deleteRemoves={false}
            escapeClearsValue={false}
            options={[
              {label: intl.allProcesses, id: undefined},
              {label: intl.inProgressProcesses, id: 'IN_PROGRESS'},
              {label: intl.showCompletedProcesses, id: 'COMPLETED'},
            ]}
            value={status}
            filterOutSelected={false}
            searchable={false}
            onChange={(params: any) => {
              setStatus(params.value)
              history.push(genProcessPath(section, code, undefined, params.value[0].id))
            }
            }/>
        </Block>
        <Block>
          <Label2 color={theme.colors.primary} marginRight={'1rem'}>
            {intl.filter}
          </Label2>
        </Block>
      </Block>

      {isLoadingProcessList && <StyledSpinnerNext size={theme.sizing.scale2400}/>}

      {!isLoadingProcessList &&
      <AccordionProcess
        isLoading={isLoadingProcess}
        processList={processList}
        setProcessList={setProcessList}
        currentProcess={currentProcess}
        onChangeProcess={id => handleChangePanel({id})}
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
      {!codelistLoading &&
      <ModalProcess
        title={intl.processingActivitiesNew}
        onClose={() => setShowCreateProcessModal(false)}
        isOpen={showCreateProcessModal}
        submit={(values: ProcessFormValues) => handleCreateProcess(values)}
        errorOnCreate={errorProcessModal}
        isEdit={false}
        initialValues={convertProcessToFormValues({
          purpose: section === Section.purpose ? codelist.getCode(ListName.PURPOSE, code) : undefined,
          department: section === Section.department ? codelist.getCode(ListName.DEPARTMENT, code) : undefined,
          subDepartments: section === Section.subdepartment ? [codelist.getCode(ListName.SUB_DEPARTMENT, code)!] : [],
          products: section === Section.system ? [codelist.getCode(ListName.SYSTEM, code)!] : [],
          productTeams: section === Section.team ? [code] : []
        })}
      />}
    </>
  )
}

export default withRouter(ProcessList)
