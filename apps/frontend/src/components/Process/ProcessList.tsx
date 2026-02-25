import { PlusIcon } from '@navikt/aksel-icons'
import { Heading, Label, Loader, Select } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
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
} from '../../api/GetAllApi'
import { getAvdelingByNomId } from '../../api/NomApi'
import {
  ELegalBasesUse,
  EProcessStatus,
  IAddDocumentToProcessFormValues,
  IPageResponse,
  IPolicy,
  IPolicyFormValues,
  IProcess,
  IProcessFormValues,
  IProcessShort,
} from '../../constants'
import { ESection, genProcessPath } from '../../pages/ProcessPage'
import { CodelistService, EListName, ICode } from '../../service/Codelist'
import { user } from '../../service/User'
import { theme } from '../../util'
import { env } from '../../util/env'
import Button from '../common/Button/CustomButton'
import AccordionProcess from './Accordion/AccordionProcess'
import ModalProcess from './Accordion/ModalProcess'
import ExportProcessModal from './Export/ExportProcessModal'

type TProcessListProps = {
  section: ESection
  filter?: EProcessStatus
  processId?: string
  titleOverride?: string
  hideTitle?: boolean
  code: string
  listName?: EListName
  moveScroll?: () => void
  isEditable: boolean
  getCount?: (i: number) => void
}

const sortProcess = (list: IProcessShort[]) =>
  list.sort((p1, p2) => p1.name.localeCompare(p2.name, 'nb'))

const ProcessList = ({
  code,
  listName,
  filter,
  processId,
  section,
  moveScroll,
  titleOverride,
  hideTitle,
  isEditable,
  getCount,
}: TProcessListProps) => {
  const navigate = useNavigate()
  const [codelistUtils, lists] = CodelistService()

  const [processList, setProcessList] = useState<IProcessShort[]>([])
  const [currentProcess, setCurrentProcess] = useState<IProcess | undefined>()
  const [showCreateProcessModal, setShowCreateProcessModal] = useState(false)
  const [createProcessModalKey, setCreateProcessModalKey] = useState(0)
  const [errorProcessModal, setErrorProcessModal] = useState<string>('')
  const [errorPolicyModal, setErrorPolicyModal] = useState(null)
  const [errorDocumentModal, setErrorDocumentModal] = useState(null)
  const [isLoadingProcessList, setIsLoadingProcessList] = useState(true)
  const [isLoadingProcess, setIsLoadingProcess] = useState(true)
  const current_location = useLocation()
  const [codelistLoading, setCodelistLoading] = useState(true)
  const [exportHref, setExportHref] = useState<string>('')
  const [nomAvdelingName, setNomAvdelingName] = useState<string>('')

  useEffect(() => getCount && getCount(processList.length), [processList.length])

  useEffect(() => {
    ;(async () => {
      if (section === ESection.department) {
        await getAvdelingByNomId(code).then((response) => setNomAvdelingName(response.navn))
      }
    })()
  }, [section])

  useEffect(() => {
    if (processId) {
      getProcessById(processId)
    }
  }, [processId])

  useEffect(() => {
    if (lists) {
      setCodelistLoading(!codelistUtils.isLoaded())
    }
  }, [lists])

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

  const handleChangePanel: (process?: Partial<IProcess>) => void = (
    process?: Partial<IProcess>
  ) => {
    if (process?.id !== currentProcess?.id) {
      navigate(genProcessPath(section, code, process, filter))
    }
    // reuse method to reload a process
    else if (process?.id) {
      getProcessById(process.id).catch(setErrorProcessModal)
      navigate(genProcessPath(section, code, process, filter))
    }
  }

  const hasAccess = (): boolean => user.canWrite() || user.isAdmin()

  const getProcessList = async (): Promise<void> => {
    try {
      let list: IProcessShort[]

      if (current_location.pathname.includes('team')) {
        const response: IPageResponse<IProcess> = await getProcessesFor({ productTeam: code })
        if (response.content) {
          list = response.content as IProcessShort[]
        } else {
          list = []
        }
      } else if (current_location.pathname.includes('productarea')) {
        const response: IPageResponse<IProcess> = await getProcessesFor({ productArea: code })
        if (response.content) {
          list = response.content as IProcessShort[]
        } else {
          list = []
        }
      } else {
        list = (await getCodelistUsage(listName as EListName, code)).processes
      }
      setProcessList(
        sortProcess(list).filter((process: IProcessShort) => !filter || process.status === filter)
      )
    } catch (error: any) {
      console.debug(error)
    }
  }

  const getProcessById = async (id: string) => {
    try {
      setIsLoadingProcess(true)
      setCurrentProcess(await getProcess(id))
    } catch (error: any) {
      console.debug(error)
    }
    setIsLoadingProcess(false)
  }

  const handleCreateProcess = async (process: IProcessFormValues): Promise<void> => {
    if (!process) return
    try {
      const newProcess = await createProcess(process)
      setProcessList(sortProcess([...processList, newProcess]))
      setErrorProcessModal('')
      setShowCreateProcessModal(false)
      setCurrentProcess(newProcess)
      // todo uh multipurpose url....
      navigate(
        genProcessPath(ESection.purpose, newProcess.purposes[0].code, newProcess, undefined, true)
      )
      process.disclosures.forEach((d) => {
        updateDisclosure(
          convertDisclosureToFormValues({
            ...d,
            processIds: [...d.processIds, newProcess.id ? newProcess.id : ''],
          })
        )
      })
    } catch (error: any) {
      if (error.response.data.message && error.response.data.message.includes('already exists')) {
        setErrorProcessModal('Behandlingen eksisterer allerede.')
        return
      }
      setErrorProcessModal(error.response.data.message)
    }
  }

  const handleEditProcess = async (values: IProcessFormValues): Promise<boolean> => {
    try {
      const updatedProcess = await updateProcess(values)
      const disclosures = await getDisclosuresByProcessId(updatedProcess.id)
      const removedDisclosures = disclosures.filter(
        (disclosure) => !values.disclosures.map((value) => value.id).includes(disclosure.id)
      )
      const addedDisclosures = values.disclosures.filter(
        (disclosure) => !disclosures.map((value) => value.id).includes(disclosure.id)
      )
      removedDisclosures.forEach((disclosure) =>
        updateDisclosure(
          convertDisclosureToFormValues({
            ...disclosure,
            processIds: [
              ...disclosure.processIds.filter((process) => process !== updatedProcess.id),
            ],
          })
        )
      )
      addedDisclosures.forEach((disclosure) =>
        updateDisclosure(
          convertDisclosureToFormValues({
            ...disclosure,
            processIds: [...disclosure.processIds, updatedProcess.id],
          })
        )
      )
      setCurrentProcess(updatedProcess)
      setProcessList(
        sortProcess([
          ...processList.filter((process) => process.id !== updatedProcess.id),
          updatedProcess,
        ])
      )
      handleChangePanel(updatedProcess)
      return true
    } catch (error: any) {
      console.debug(error)
      return false
    }
  }

  const handleDeleteProcess = async (processToDelete: IProcess): Promise<boolean> => {
    try {
      await deleteProcess(processToDelete.id)
      setProcessList(
        sortProcess(
          processList.filter((process: IProcessShort) => process.id !== processToDelete.id)
        )
      )
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

  const handleCreatePolicy = async (values: IPolicyFormValues): Promise<boolean> => {
    if (!values || !currentProcess) return false

    try {
      const policy: IPolicy = await createPolicy(values)
      await getProcessById(policy.process.id)
      setErrorPolicyModal(null)
      return true
    } catch (error: any) {
      setErrorPolicyModal(error.message)
      return false
    }
  }
  const handleEditPolicy = async (values: IPolicyFormValues) => {
    try {
      const policy: IPolicy = await updatePolicy(values)
      if (currentProcess) {
        setCurrentProcess({
          ...currentProcess,
          policies: [
            ...currentProcess.policies.filter((policy: IPolicy) => policy.id !== policy.id),
            policy,
          ],
        })
        setErrorPolicyModal(null)
      }
      return true
    } catch (error: any) {
      setErrorPolicyModal(error.message)
      return false
    }
  }
  const handleDeletePolicy = async (policyToDelete?: IPolicy): Promise<boolean> => {
    if (!policyToDelete) return false
    try {
      await deletePolicy(policyToDelete.id)
      if (currentProcess) {
        setCurrentProcess({
          ...currentProcess,
          policies: [
            ...currentProcess.policies.filter((policy: IPolicy) => policy.id !== policyToDelete.id),
          ],
        })
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

  const handleAddDocument = async (
    formValues: IAddDocumentToProcessFormValues
  ): Promise<boolean> => {
    try {
      const policies: IPolicyFormValues[] = formValues.informationTypes.map((infoType) => ({
        subjectCategories: infoType.subjectCategories.map((category) => category.code),
        informationType: infoType.informationType,
        process: { ...formValues.process, legalBases: [] },
        purposes: formValues.process.purposes.map((purpose) => purpose.code),
        legalBases: [],
        legalBasesOpen: false,
        legalBasesUse: ELegalBasesUse.INHERITED_FROM_PROCESS,
        documentIds: !formValues.linkDocumentToPolicies
          ? []
          : [formValues.document ? formValues.document.id : ''],
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
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="min-w-0 sm:mr-auto">
          {!hideTitle && (
            <Heading size="xlarge" level="2">
              {titleOverride || 'Behandlinger'} ({processList.length})
            </Heading>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Label style={{ color: theme.colors.primary, marginRight: '1rem' }}>Filter</Label>

          <div className="w-full sm:w-72 min-w-0">
            <Select
              label="Status filter"
              hideLabel
              onChange={(event: any) =>
                navigate(genProcessPath(section, code, undefined, event.target.value))
              }
            >
              <option value="">Alle behandlinger</option>
              <option value={EProcessStatus.IN_PROGRESS}>Behandlinger under arbeid</option>
              <option value={EProcessStatus.NEEDS_REVISION}>Trenger revidering</option>
              <option value={EProcessStatus.COMPLETED}>Ferdig dokumenterte behandlinger</option>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 justify-start sm:justify-end w-full sm:w-auto">
            <ExportProcessModal
              listName={listName}
              code={code}
              marginRight={true}
              exportHref={exportHref}
            />
            {isEditable && hasAccess() && (
              <Button
                size="xsmall"
                kind="tertiary"
                icon={
                  <span className="flex items-center leading-none">
                    <PlusIcon aria-hidden className="block" />
                  </span>
                }
                onClick={() => {
                  setErrorProcessModal('')
                  setCreateProcessModalKey((k) => k + 1)
                  setShowCreateProcessModal(true)
                }}
              >
                Opprett ny behandling
              </Button>
            )}
          </div>
        </div>
      </div>

      {isLoadingProcessList && (
        <div className="flex w-full justify-center">
          <Loader size="3xlarge" />
        </div>
      )}

      {!isLoadingProcessList && (
        <AccordionProcess
          codelistUtils={codelistUtils}
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
          key={createProcessModalKey}
          codelistUtils={codelistUtils}
          title="Opprett ny behandling"
          onClose={() => {
            setErrorProcessModal('')
            setShowCreateProcessModal(false)
          }}
          isOpen={showCreateProcessModal}
          submit={(values: IProcessFormValues) => handleCreateProcess(values)}
          errorOnCreate={errorProcessModal}
          isEdit={false}
          initialValues={convertProcessToFormValues({
            purposes:
              section === ESection.purpose
                ? [codelistUtils.getCode(EListName.PURPOSE, code) as ICode]
                : [],
            affiliation: {
              department:
                section === ESection.department
                  ? codelistUtils.getCode(EListName.DEPARTMENT, code)
                  : undefined,
              nomDepartmentId: section === ESection.department ? code : undefined,
              nomDepartmentName: nomAvdelingName,
              seksjoner: [],
              fylker: [],
              navKontorer: [],
              subDepartments:
                section === ESection.subdepartment
                  ? [codelistUtils.getCode(EListName.SUB_DEPARTMENT, code) as ICode]
                  : [],
              products:
                section === ESection.system
                  ? [codelistUtils.getCode(EListName.SYSTEM, code) as ICode]
                  : [],
              productTeams: section === ESection.team ? [code] : [],
              disclosureDispatchers:
                section === ESection.system
                  ? [codelistUtils.getCode(EListName.SYSTEM, code) as ICode]
                  : [],
            },
          })}
        />
      )}
    </>
  )
}

export default ProcessList
