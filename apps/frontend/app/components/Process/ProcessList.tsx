'use client'

import { Heading, Loader } from '@navikt/ds-react'
import { useContext, useEffect, useState } from 'react'
import { EListName, ICode } from '@/constants/codelistConstant'
import { CodelistContext } from '@/provider/kodeverkProvider'
import {
  genProcessPath,
  handleAddDocument,
  handleCreatePolicy,
  handleDeleteAllPolicies,
  handleDeletePolicy,
  handleDeleteProcess,
  handleEditPolicy,
  handleEditProcess,
  sortProcess,
} from '@/util/processUtils'
import { useLocation, useNavigate } from '@/util/router'
import {
  convertDisclosureToFormValues,
  convertProcessToFormValues,
  createProcess,
  getCodelistUsage,
  getProcess,
  getProcessesFor,
  updateDisclosure,
} from '../../api/GetAllApi'
import { getAvdelingByNomId } from '../../api/NomApi'
import { getProcessesWithNoDepartment } from '../../api/ProcessApi'
import {
  EBehandlingsNivaa,
  EProcessStatus,
  IAddDocumentToProcessFormValues,
  IPageResponse,
  IPolicy,
  IPolicyFormValues,
  IProcess,
  IProcessFormValues,
  IProcessShort,
} from '../../constants'
import { env } from '../../util/env'
import { ESection } from '../mainPages/ProcessPage'
import AccordionProcess from './Accordion/AccordionProcess'
import ModalProcess from './Accordion/ModalProcess'
import ProcessPageButtonGroup from './common/processPageButtonGroup'

type TProcessListProps = {
  section: ESection
  filter?: EProcessStatus
  seksjonFilter?: string
  processId?: string
  titleOverride?: string
  hideTitle?: boolean
  code: string
  listName?: EListName
  isEditable: boolean
  getCount?: (i: number) => void
}

const ProcessList = ({
  code,
  listName,
  filter,
  seksjonFilter,
  processId,
  section,
  titleOverride,
  hideTitle,
  isEditable,
  getCount,
}: TProcessListProps) => {
  const navigate = useNavigate()
  const { utils: codelistUtils, lists } = useContext(CodelistContext)

  const [processList, setProcessList] = useState<IProcessShort[]>([])
  const [fullProcessList, setFullProcessList] = useState<IProcessShort[]>([])
  const [currentProcess, setCurrentProcess] = useState<IProcess | undefined>()
  const [showCreateProcessModal, setShowCreateProcessModal] = useState(false)
  const [createProcessModalKey, setCreateProcessModalKey] = useState(0)
  const [errorProcessModal, setErrorProcessModal] = useState<string>('')
  const [errorPolicyModal, setErrorPolicyModal] = useState<string | null>(null)
  const [errorDocumentModal, setErrorDocumentModal] = useState<string | null>(null)
  const [isLoadingProcessList, setIsLoadingProcessList] = useState(true)
  const [isLoadingProcess, setIsLoadingProcess] = useState(true)
  const current_location = useLocation()
  const [codelistLoading, setCodelistLoading] = useState(true)
  const [exportHref, setExportHref] = useState<string>('')
  const [nomAvdelingName, setNomAvdelingName] = useState<string>('')

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
      } else if (current_location.pathname.includes('seksjon')) {
        const response: IPageResponse<IProcess> = await getProcessesFor({ seksjonId: code })
        if (response.content) {
          list = response.content as IProcessShort[]
        } else {
          list = []
        }
      } else if (section === ESection.department && !code) {
        const response = await getProcessesWithNoDepartment()
        list = response.content ?? []
      } else {
        list = (await getCodelistUsage(listName as EListName, code)).processes
      }
      const filtered = sortProcess(list).filter(
        (process: IProcessShort) =>
          (!filter || process.status === filter) &&
          process.behandlingsNivaa !== EBehandlingsNivaa.UNDERORDNET
      )
      setFullProcessList(filtered)
    } catch (error: any) {
      console.debug(error)
    }
  }

  const navCode = section === ESection.department && !code ? 'Ingen avdeling' : code

  const handleChangePanel: (process?: Partial<IProcess>) => void = (
    process?: Partial<IProcess>
  ) => {
    if (process?.id !== currentProcess?.id) {
      navigate(genProcessPath(section, navCode, process, filter), { scroll: false })
    }
    // reuse method to reload a process
    else if (process?.id) {
      getProcessById(process.id).catch(setErrorProcessModal)
      navigate(genProcessPath(section, navCode, process, filter), { scroll: false })
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

  useEffect(() => getCount && getCount(processList.length), [processList.length])

  useEffect(() => {
    ;(async () => {
      setProcessList(
        fullProcessList.filter(
          (process: IProcessShort) =>
            !seksjonFilter ||
            (seksjonFilter === '__INGEN_SEKSJON__'
              ? process.affiliation.seksjoner.length === 0
              : process.affiliation.seksjoner.some((s) => s.nomSeksjonId === seksjonFilter))
        )
      )
    })()
  }, [seksjonFilter, fullProcessList])

  useEffect(() => {
    ;(async () => {
      if (section === ESection.department && code) {
        await getAvdelingByNomId(code).then((response) => setNomAvdelingName(response.navn))
      }
    })()
  }, [section])

  useEffect(() => {
    ;(async () => {
      if (processId) {
        getProcessById(processId)
      }
    })()
  }, [processId])

  useEffect(() => {
    ;(async () => {
      if (lists.codelist) {
        setCodelistLoading(!codelistUtils.isLoaded())
      }
    })()
  }, [lists])

  useEffect(() => {
    ;(async () => {
      setIsLoadingProcessList(true)
      await getProcessList()
      setIsLoadingProcessList(false)
      const pathName: string = current_location.pathname.split('/')[1]
      if (pathName === 'seksjon') {
        setExportHref(`${env.pollyBaseUrl}/export/process?section=${code}`)
      } else if (pathName === 'team') {
        setExportHref(`${env.pollyBaseUrl}/export/process?productTeam=${code}`)
      }
    })()
  }, [code, filter])

  return (
    <>
      <div className='flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center'>
        <div className='min-w-0 sm:mr-auto'>
          {!hideTitle && (
            <Heading size='small' level='2'>
              {titleOverride || 'Behandlinger'} ({processList.length})
            </Heading>
          )}
        </div>

        <ProcessPageButtonGroup
          isEditable={isEditable}
          exportHref={exportHref}
          setErrorProcessModal={setErrorProcessModal}
          setCreateProcessModalKey={setCreateProcessModalKey}
          setShowCreateProcessModal={setShowCreateProcessModal}
          forUnderordnetBehandling={false}
        />
      </div>

      {isLoadingProcessList && (
        <div className='flex w-full justify-center'>
          <Loader size='3xlarge' />
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
          submitDeleteProcess={(processTodelete) =>
            handleDeleteProcess(processTodelete, processList, setProcessList, setErrorProcessModal)
          }
          submitEditProcess={(process: IProcessFormValues) =>
            handleEditProcess(process, setCurrentProcess, processList, setProcessList)
          }
          submitCreatePolicy={(process: IPolicyFormValues) =>
            handleCreatePolicy(process, currentProcess, getProcessById, setErrorPolicyModal)
          }
          submitEditPolicy={(values: IPolicyFormValues) =>
            handleEditPolicy(values, currentProcess, setCurrentProcess, setErrorPolicyModal)
          }
          submitDeletePolicy={(values: IPolicy) =>
            handleDeletePolicy(values, currentProcess, setCurrentProcess, setErrorPolicyModal)
          }
          submitDeleteAllPolicy={(processId: string) =>
            handleDeleteAllPolicies(
              processId,
              currentProcess,
              setCurrentProcess,
              setErrorPolicyModal
            )
          }
          submitAddDocument={(document: IAddDocumentToProcessFormValues) =>
            handleAddDocument(document, getProcessById, setErrorDocumentModal)
          }
          errorProcessModal={errorProcessModal}
          errorPolicyModal={errorPolicyModal}
          errorDocumentModal={errorDocumentModal}
          forUnderordnetBehandlinger={false}
        />
      )}
      {!codelistLoading && showCreateProcessModal && (
        <ModalProcess
          key={createProcessModalKey}
          codelistUtils={codelistUtils}
          title='Opprett ny behandling'
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
