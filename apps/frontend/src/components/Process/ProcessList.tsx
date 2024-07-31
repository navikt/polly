import { faFileWord, faPlus } from '@fortawesome/free-solid-svg-icons'
import { SIZE as ButtonSize, KIND } from 'baseui/button'
import { StyledLink } from 'baseui/link'
import { Modal, ModalBody, ModalHeader, SIZE as ModalSize, ROLE } from 'baseui/modal'
import { StatefulSelect } from 'baseui/select'
import { Spinner } from 'baseui/spinner'
import { HeadingXLarge, LabelMedium } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  convertDisclosureToFormValues,
  convertProcessToFormValues,
  createPolicies,
  createPolicy,
  createProcess,
  deletePoliciesByProcessId,
  deletePolicy,
  deleteProcess,
  getCodelistUsage,
  getDisclosuresByProcessId,
  getProcess,
  getProcessesFor,
  updateDisclosure,
  updatePolicy,
  updateProcess,
} from '../../api'
import { AddDocumentToProcessFormValues, LegalBasesUse, PageResponse, Policy, PolicyFormValues, Process, ProcessFormValues, ProcessShort, ProcessStatus } from '../../constants'
import { Section, genProcessPath } from '../../pages/ProcessPage'
import { Code, ListName, codelist } from '../../service/Codelist'
import { user } from '../../service/User'
import { theme, useAwait } from '../../util'
import { env } from '../../util/env'
import Button from '../common/Button'
import AccordionProcess from './Accordion/AccordionProcess'
import ModalProcess from './Accordion/ModalProcess'

type ProcessListProps = {
  section: Section
  filter?: ProcessStatus
  processId?: string
  titleOverride?: string
  hideTitle?: boolean
  code: string
  listName?: ListName
  moveScroll?: Function
  isEditable: boolean
  getCount?: (i: number) => void
}

const sortProcess = (list: ProcessShort[]) => list.sort((p1, p2) => p1.name.localeCompare(p2.name, 'nb'))

const ProcessList = ({ code, listName, filter, processId, section, moveScroll, titleOverride, hideTitle, isEditable, getCount }: ProcessListProps) => {
  const [processList, setProcessList] = useState<ProcessShort[]>([])
  const [currentProcess, setCurrentProcess] = useState<Process | undefined>()
  const [showCreateProcessModal, setShowCreateProcessModal] = useState(false)
  const [errorProcessModal, setErrorProcessModal] = useState<string>('')
  const [errorPolicyModal, setErrorPolicyModal] = useState(null)
  const [errorDocumentModal, setErrorDocumentModal] = useState(null)
  const [isLoadingProcessList, setIsLoadingProcessList] = useState(true)
  const [isLoadingProcess, setIsLoadingProcess] = useState(true)
  const current_location = useLocation()
  const [codelistLoading, setCodelistLoading] = useState(true)
  const navigate = useNavigate()
  const [exportHref, setExportHref] = useState<string>('')
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false)

  useAwait(codelist.wait(), setCodelistLoading)

  useEffect(() => getCount && getCount(processList.length), [processList.length])

  useEffect(() => {
    processId && getProcessById(processId)
  }, [processId])

  useEffect(() => {
    ;(async () => {
      setIsLoadingProcessList(true)
      await getProcessList()
      setIsLoadingProcessList(false)
      if (moveScroll) moveScroll()
    })()
    const pathName: string = current_location.pathname.split('/')[1]
    if (pathName === 'productarea') {
      setExportHref(`${env.pollyBaseUrl}/export/process?productArea=${code}`)
    } else if (pathName === 'team') {
      setExportHref(`${env.pollyBaseUrl}/export/process?productTeam=${code}`)
    }
  }, [code, filter])

  const handleChangePanel: (process?: Partial<Process>) => void = (process?: Partial<Process>) => {
    if (process?.id !== currentProcess?.id) {
      navigate(genProcessPath(section, code, process, filter))
    }
    // reuse method to reload a process
    else if (process?.id) {
      getProcessById(process.id).catch(setErrorProcessModal)
      navigate(genProcessPath(section, code, process, filter))
    }
  }

  const hasAccess = (): boolean => user.canWrite()

  const listNameToUrl = () =>
    listName &&
    (
      {
        DEPARTMENT: 'department',
        SUB_DEPARTMENT: 'subDepartment',
        PURPOSE: 'purpose',
        SYSTEM: 'system',
        DATA_PROCESSOR: 'processor',
        THIRD_PARTY: 'thirdparty',
      } as { [l: string]: string }
    )[listName]

  const getProcessList = async (): Promise<void> => {
    try {
      let list: ProcessShort[]

      if (current_location.pathname.includes('team')) {
        let response: PageResponse<Process> = await getProcessesFor({ productTeam: code })
        response.content ? (list = response.content as ProcessShort[]) : (list = [])
      } else if (current_location.pathname.includes('productarea')) {
        let response: PageResponse<Process> = await getProcessesFor({ productArea: code })
        response.content ? (list = response.content as ProcessShort[]) : (list = [])
      } else {
        list = (await getCodelistUsage(listName as ListName, code)).processes
      }
      setProcessList(sortProcess(list).filter((process: ProcessShort) => !filter || process.status === filter))
    } catch (error: any) {
      console.log(error)
    }
  }

  const getProcessById = async (id: string) => {
    try {
      setIsLoadingProcess(true)
      setCurrentProcess(await getProcess(id))
    } catch (error: any) {
      console.log(error)
    }
    setIsLoadingProcess(false)
  }

  const handleCreateProcess = async (process: ProcessFormValues): Promise<void> => {
    if (!process) return
    try {
      const newProcess = await createProcess(process)
      setProcessList(sortProcess([...processList, newProcess]))
      setErrorProcessModal('')
      setShowCreateProcessModal(false)
      setCurrentProcess(newProcess)
      // todo uh multipurpose url....
      navigate(genProcessPath(Section.purpose, newProcess.purposes[0].code, newProcess, undefined, true))
      process.disclosures.forEach((d) => {
        updateDisclosure(convertDisclosureToFormValues({ ...d, processIds: [...d.processIds, newProcess.id ? newProcess.id : ''] }))
      })
    } catch (error: any) {
      if (error.response.data.message && error.response.data.message.includes('already exists')) {
        setErrorProcessModal('Behandlingen eksisterer allerede.')
        return
      }
      setErrorProcessModal(error.response.data.message)
    }
  }

  const handleEditProcess = async (values: ProcessFormValues): Promise<boolean> => {
    try {
      const updatedProcess = await updateProcess(values)
      const disclosures = await getDisclosuresByProcessId(updatedProcess.id)
      const removedDisclosures = disclosures.filter((disclosure) => !values.disclosures.map((value) => value.id).includes(disclosure.id))
      const addedDisclosures = values.disclosures.filter((disclosure) => !disclosures.map((value) => value.id).includes(disclosure.id))
      removedDisclosures.forEach((disclosure) =>
        updateDisclosure(convertDisclosureToFormValues({ ...disclosure, processIds: [...disclosure.processIds.filter((process) => process !== updatedProcess.id)] })),
      )
      addedDisclosures.forEach((disclosure) => updateDisclosure(convertDisclosureToFormValues({ ...disclosure, processIds: [...disclosure.processIds, updatedProcess.id] })))
      setCurrentProcess(updatedProcess)
      setProcessList(sortProcess([...processList.filter((process) => process.id !== updatedProcess.id), updatedProcess]))
      handleChangePanel(updatedProcess)
      return true
    } catch (error: any) {
      console.log(error)
      return false
    }
  }

  const handleDeleteProcess = async (process: Process): Promise<boolean> => {
    try {
      await deleteProcess(process.id)
      setProcessList(sortProcess(processList.filter((process: ProcessShort) => process.id !== process.id)))
      setErrorProcessModal('')
      return true
    } catch (error: any) {
      if (error.response.data.message.includes('disclosure(s)')) {
        setErrorProcessModal('Du kan ikke slette behandlinger med eksisterende utleveringer.')
        return false
      }
      setErrorProcessModal(error.response.data.message)
      return false
    }
  }

  const handleCreatePolicy = async (values: PolicyFormValues): Promise<boolean> => {
    if (!values || !currentProcess) return false

    try {
      const policy: Policy = await createPolicy(values)
      await getProcessById(policy.process.id)
      setErrorPolicyModal(null)
      return true
    } catch (error: any) {
      setErrorPolicyModal(error.message)
      return false
    }
  }
  const handleEditPolicy = async (values: PolicyFormValues) => {
    try {
      const policy: Policy = await updatePolicy(values)
      if (currentProcess) {
        setCurrentProcess({
          ...currentProcess,
          policies: [...currentProcess.policies.filter((policy: Policy) => policy.id !== policy.id), policy],
        })
        setErrorPolicyModal(null)
      }
      return true
    } catch (error: any) {
      setErrorPolicyModal(error.message)
      return false
    }
  }
  const handleDeletePolicy = async (policy?: Policy): Promise<boolean> => {
    if (!policy) return false
    try {
      await deletePolicy(policy.id)
      if (currentProcess) {
        setCurrentProcess({ ...currentProcess, policies: [...currentProcess.policies.filter((policy: Policy) => policy.id !== policy.id)] })
        setErrorPolicyModal(null)
      }
      return true
    } catch (error: any) {
      setErrorPolicyModal(error.message)
      return false
    }
  }

  const handleDeleteAllPolicies = async (processId: string): Promise<boolean> => {
    if (!processId) return false
    try {
      await deletePoliciesByProcessId(processId)
      if (currentProcess) {
        setCurrentProcess({ ...currentProcess, policies: [] })
        setErrorPolicyModal(null)
      }
      return true
    } catch (error: any) {
      setErrorPolicyModal(error.message)
      return false
    }
  }

  const handleAddDocument = async (formValues: AddDocumentToProcessFormValues): Promise<boolean> => {
    try {
      const policies: PolicyFormValues[] = formValues.informationTypes.map((infoType) => ({
        subjectCategories: infoType.subjectCategories.map((category) => category.code),
        informationType: infoType.informationType,
        process: { ...formValues.process, legalBases: [] },
        purposes: formValues.process.purposes.map((purpose) => purpose.code),
        legalBases: [],
        legalBasesOpen: false,
        legalBasesUse: LegalBasesUse.INHERITED_FROM_PROCESS,
        documentIds: !formValues.linkDocumentToPolicies ? [] : [formValues.document!.id],
        otherPolicies: [],
      }))
      await createPolicies(policies)
      await getProcessById(formValues.process.id)
    } catch (error: any) {
      setErrorDocumentModal(error.message)
      return false
    }
    return true
  }

  return (
    <>
      <div className="flex flex-row-reverse items-center">
        <div>
          <Button onClick={() => setIsExportModalOpen(true)} kind={'outline'} size={ButtonSize.compact} icon={faFileWord} marginRight>
            Eksportér
          </Button>
          {isEditable && hasAccess() && (
            <Button size={ButtonSize.compact} kind={KIND.tertiary} icon={faPlus} onClick={() => setShowCreateProcessModal(true)}>
              Opprett ny behandling
            </Button>
          )}
        </div>
        <Modal closeable animate autoFocus size={ModalSize.auto} role={ROLE.dialog} isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)}>
          <ModalHeader>Velg eksport metode</ModalHeader>
          <ModalBody>
            <StyledLink style={{ textDecoration: 'none' }} href={exportHref ? exportHref : `${env.pollyBaseUrl}/export/process?${listNameToUrl()}=${code}`}>
              <Button kind="outline" size={ButtonSize.compact} icon={faFileWord} marginRight>
                Eksport for intern bruk
              </Button>
            </StyledLink>
            <StyledLink style={{ textDecoration: 'none' }} href={exportHref ? exportHref : `${env.pollyBaseUrl}/export/process?${listNameToUrl()}=${code}&documentAccess=EXTERNAL`}>
              <Button kind="outline" size={ButtonSize.compact} icon={faFileWord} marginRight>
                Eksport for ekstern bruk
              </Button>
            </StyledLink>
          </ModalBody>
        </Modal>
        <div className="w-1/4">
          <StatefulSelect
            backspaceRemoves={false}
            clearable={false}
            deleteRemoves={false}
            escapeClearsValue={false}
            options={[
              { label: 'Alle behandlinger', id: undefined },
              { label: 'Behandlinger under arbeid', id: ProcessStatus.IN_PROGRESS },
              { label: 'Trenger revidering', id: ProcessStatus.NEEDS_REVISION },
              { label: 'Ferdig dokumenterte behandlinger', id: ProcessStatus.COMPLETED },
            ]}
            initialState={{ value: [{ id: filter }] }}
            filterOutSelected={false}
            searchable={false}
            onChange={(params: any) => navigate(genProcessPath(section, code, undefined, params.value[0].id))}
          />
        </div>
        <div>
          <LabelMedium color={theme.colors.primary} marginRight={'1rem'}>
            Filter
          </LabelMedium>
        </div>
        <div className="mr-auto">
          {!hideTitle && (
            <HeadingXLarge>
              {titleOverride || 'Behandlinger'} ({processList.length})
            </HeadingXLarge>
          )}
        </div>
      </div>

      {isLoadingProcessList && <Spinner $size={theme.sizing.scale2400} />}

      {!isLoadingProcessList && (
        <AccordionProcess
          isLoading={isLoadingProcess}
          processList={processList}
          setProcessList={setProcessList}
          currentProcess={currentProcess}
          onChangeProcess={(id) => handleChangePanel({ id })}
          submitDeleteProcess={handleDeleteProcess}
          submitEditProcess={handleEditProcess}
          submitCreatePolicy={handleCreatePolicy}
          submitEditPolicy={handleEditPolicy}
          submitDeletePolicy={handleDeletePolicy}
          submitDeleteAllPolicy={handleDeleteAllPolicies}
          submitAddDocument={handleAddDocument}
          errorProcessModal={errorProcessModal}
          errorPolicyModal={errorPolicyModal}
          errorDocumentModal={errorDocumentModal}
        />
      )}
      {!codelistLoading && (
        <ModalProcess
          title="Opprett ny behandling"
          onClose={() => {
            setErrorProcessModal('')
            setShowCreateProcessModal(false)
          }}
          isOpen={showCreateProcessModal}
          submit={(values: ProcessFormValues) => handleCreateProcess(values)}
          errorOnCreate={errorProcessModal}
          isEdit={false}
          initialValues={convertProcessToFormValues({
            purposes: section === Section.purpose ? [codelist.getCode(ListName.PURPOSE, code) as Code] : undefined,
            affiliation: {
              department: section === Section.department ? codelist.getCode(ListName.DEPARTMENT, code) : undefined,
              subDepartments: section === Section.subdepartment ? [codelist.getCode(ListName.SUB_DEPARTMENT, code)!] : [],
              products: section === Section.system ? [codelist.getCode(ListName.SYSTEM, code)!] : [],
              productTeams: section === Section.team ? [code] : [],
              disclosureDispatchers: section === Section.system ? [codelist.getCode(ListName.SYSTEM, code)!] : [],
            },
          })}
        />
      )}
    </>
  )
}

export default ProcessList
