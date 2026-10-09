import { InformationSquareIcon } from '@navikt/aksel-icons'
import { InfoCard, List, ReadMore } from '@navikt/ds-react'
import { useParams, useSearchParams } from 'next/navigation'
import { FunctionComponent, useEffect, useState } from 'react'
import { convertDisclosureToFormValues, updateDisclosure } from '@/api/DisclosureApi'
import { convertProcessToFormValues, createProcess, getProcess } from '@/api/ProcessApi'
import { ESection, TPathParams } from '@/components/mainPages/ProcessPage'
import {
  EBehandlingsNivaa,
  EProcessStatus,
  IAddDocumentToProcessFormValues,
  IPolicy,
  IPolicyFormValues,
  IProcess,
  IProcessFormValues,
  IProcessShort,
} from '@/constants'
import { EListName, ICode } from '@/constants/codelistConstant'
import { ICodelistProps } from '@/provider/kodeverkProvider'
import { env } from '@/util/env'
import {
  genUnderordnetProcessPath,
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
import AccordionProcess from '../Accordion/AccordionProcess'
import ModalProcess from '../Accordion/ModalProcess'
import ProcessPageButtonGroup from '../common/processPageButtonGroup'

type TProps = {
  overordnetBehandling: IProcess
  codelistUtils: ICodelistProps
}

const UnderordnetBehandlingList: FunctionComponent<TProps> = ({
  overordnetBehandling,
  codelistUtils,
}) => {
  const navigate = useNavigate()
  const params = useParams<TPathParams>()
  const searchParams = useSearchParams()
  const current_location = useLocation()
  const { section, code } = params
  const underordnetfilter = (searchParams.get('underordnetfilter') as EProcessStatus) || undefined
  const [underOrdnetBehandlinger, setUnderordnetBehandlinger] = useState<IProcessShort[]>([])
  const [currentUnderordnetBehandling, setCurrentUnderordnetBehandling] = useState<
    IProcess | undefined
  >()
  const [isUnderordnetBehandlingLoading, setIsUnderordnetBehandlingLoading] =
    useState<boolean>(false)

  const [exportHref, setExportHref] = useState<string>('')
  const [errorProcessModal, setErrorProcessModal] = useState<string>('')
  const [errorDocumentModal, setErrorDocumentModal] = useState<string | null>(null)
  const [createProcessModalKey, setCreateProcessModalKey] = useState<number>(0)
  const [showCreateProcessModal, setShowCreateProcessModal] = useState<boolean>(false)
  const [errorPolicyModal, setErrorPolicyModal] = useState<string | null>(null)
  const navCode = section === ESection.department && !code ? 'Ingen avdeling' : code
  const underordnetBehandlingId = searchParams.get('underordnetBehandlingId')

  useEffect(() => {
    ;(async () => {
      const pathName: string = current_location.pathname.split('/')[1]
      if (pathName === 'seksjon') {
        setExportHref(`${env.pollyBaseUrl}/export/process?section=${code}`)
      } else if (pathName === 'team') {
        setExportHref(`${env.pollyBaseUrl}/export/process?productTeam=${code}`)
      }
    })()
  }, [code, underordnetfilter])

  useEffect(() => {
    ;(async () => {
      if (overordnetBehandling.underordnetBehandlinger) {
        setUnderordnetBehandlinger(overordnetBehandling.underordnetBehandlinger)
      }
    })()
  }, [overordnetBehandling])

  useEffect(() => {
    ;(async () => {
      if (overordnetBehandling.underordnetBehandlinger) {
        if (underordnetfilter) {
          setUnderordnetBehandlinger(
            overordnetBehandling.underordnetBehandlinger.filter(
              (behandling) => behandling.status === underordnetfilter
            )
          )
        } else {
          setUnderordnetBehandlinger(overordnetBehandling.underordnetBehandlinger)
        }
      }
    })()
  }, [underordnetfilter, overordnetBehandling])

  const getProcessById = async (id: string) => {
    try {
      setIsUnderordnetBehandlingLoading(true)
      setCurrentUnderordnetBehandling(await getProcess(id))
    } catch (error: any) {
      console.debug(error)
    }
    setIsUnderordnetBehandlingLoading(false)
  }

  useEffect(() => {
    ;(async () => {
      if (underordnetBehandlingId && currentUnderordnetBehandling?.id !== underordnetBehandlingId) {
        await getProcessById(underordnetBehandlingId)
      }
    })()
  }, [underordnetBehandlingId, currentUnderordnetBehandling?.id])

  const handleChangePanel: (process?: Partial<IProcess>) => void = (
    process?: Partial<IProcess>
  ) => {
    if (process?.id !== currentUnderordnetBehandling?.id) {
      navigate(
        genUnderordnetProcessPath(
          section,
          navCode,
          overordnetBehandling,
          process,
          underordnetfilter
        ),
        {
          scroll: false,
        }
      )
    }
    // reuse method to reload a process
    else if (process?.id) {
      getProcessById(process.id).catch(setErrorProcessModal)
      navigate(
        genUnderordnetProcessPath(
          section,
          navCode,
          overordnetBehandling,
          process,
          underordnetfilter
        ),
        {
          scroll: false,
        }
      )
    }
  }

  const handleCreateProcess = async (process: IProcessFormValues): Promise<void> => {
    if (!process) return
    try {
      const newProcess = await createProcess(process)
      setUnderordnetBehandlinger(sortProcess([...underOrdnetBehandlinger, newProcess]))
      setErrorProcessModal('')
      setShowCreateProcessModal(false)
      setCurrentUnderordnetBehandling(newProcess)
      // todo uh multipurpose url....
      navigate(
        genUnderordnetProcessPath(
          section,
          navCode,
          overordnetBehandling,
          newProcess,
          undefined,
          true
        )
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

  return (
    <div className='mt-5'>
      <ReadMore header='Om overordnede og underordnede behandlinger' className='mb-5'>
        Behandlingen{' '}
        <strong>
          B{overordnetBehandling.number}{' '}
          {overordnetBehandling.purposes
            .map((purpose: ICode) => codelistUtils.getShortname(EListName.PURPOSE, purpose.code))
            .join(', ')}
          : {overordnetBehandling.name}
        </strong>{' '}
        kan brukes som overordnet behandling. Dette kan gjøres hvis:
        <List as='ul' className='my-5'>
          <List.Item>
            den underordnede behandlingen har, eller skal ha, samme behandlingsaktivitet som B$
            {overordnetBehandling.number}.
          </List.Item>
          <List.Item>
            det ønskes samlet mange behandlinger under samme, overordnet behandling, nemlig B$
            {overordnetBehandling.number}.
          </List.Item>
        </List>
        Koblingen oppretter du ved å redigere den behandlingen som skal bli underordnet denne. Les
        mer om overordnede og underordnede behandlinger (åpner i en ny fane).
      </ReadMore>

      <div className='w-full flex justify-end my-5'>
        <ProcessPageButtonGroup
          isEditable={true}
          exportHref={exportHref}
          setErrorProcessModal={setErrorProcessModal}
          setCreateProcessModalKey={setCreateProcessModalKey}
          setShowCreateProcessModal={setShowCreateProcessModal}
          process={overordnetBehandling}
          forUnderordnetBehandling={true}
          filter={underordnetfilter}
        />
      </div>

      {overordnetBehandling.underordnetBehandlinger?.length === 0 && (
        <InfoCard data-color='info'>
          <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>
            Det finnes ingen underordnede behandlinger, men det er mulig å velge denne behandlingen
            som overordnet.
          </InfoCard.Message>
        </InfoCard>
      )}

      {overordnetBehandling.underordnetBehandlinger &&
        overordnetBehandling.underordnetBehandlinger.length > 0 && (
          <AccordionProcess
            codelistUtils={codelistUtils}
            isLoading={isUnderordnetBehandlingLoading}
            processList={underOrdnetBehandlinger}
            setProcessList={setUnderordnetBehandlinger}
            currentProcess={currentUnderordnetBehandling}
            onChangeProcess={(id) => handleChangePanel({ id })}
            submitDeleteProcess={(processTodelete) =>
              handleDeleteProcess(
                processTodelete,
                underOrdnetBehandlinger,
                setUnderordnetBehandlinger,
                setErrorProcessModal
              )
            }
            submitEditProcess={(process: IProcessFormValues) =>
              handleEditProcess(
                process,
                setCurrentUnderordnetBehandling,
                underOrdnetBehandlinger,
                setUnderordnetBehandlinger
              )
            }
            submitCreatePolicy={(process: IPolicyFormValues) =>
              handleCreatePolicy(
                process,
                currentUnderordnetBehandling,
                getProcessById,
                setErrorPolicyModal
              )
            }
            submitEditPolicy={(values: IPolicyFormValues) =>
              handleEditPolicy(
                values,
                currentUnderordnetBehandling,
                setCurrentUnderordnetBehandling,
                setErrorPolicyModal
              )
            }
            submitDeletePolicy={(values: IPolicy) =>
              handleDeletePolicy(
                values,
                currentUnderordnetBehandling,
                setCurrentUnderordnetBehandling,
                setErrorPolicyModal
              )
            }
            submitDeleteAllPolicy={(processId: string) =>
              handleDeleteAllPolicies(
                processId,
                currentUnderordnetBehandling,
                setCurrentUnderordnetBehandling,
                setErrorPolicyModal
              )
            }
            submitAddDocument={(document: IAddDocumentToProcessFormValues) =>
              handleAddDocument(document, getProcessById, setErrorDocumentModal)
            }
            errorProcessModal={errorProcessModal}
            errorPolicyModal={errorPolicyModal}
            errorDocumentModal={errorDocumentModal}
            forUnderordnetBehandlinger={true}
          />
        )}

      {showCreateProcessModal && (
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
            ...overordnetBehandling,
            name: '',
            number: undefined,
            id: '',
            behandlingsNivaa: EBehandlingsNivaa.UNDERORDNET,
            overordnetBehandling: {
              id: overordnetBehandling.id,
              name: overordnetBehandling.name,
              number: overordnetBehandling.number,
              purposes: overordnetBehandling.purposes,
              end: overordnetBehandling.end,
              affiliation: overordnetBehandling.affiliation,
              behandlingsNivaa: EBehandlingsNivaa.OVERORDNET,
              changeStamp: overordnetBehandling.changeStamp,
            },
            status: EProcessStatus.IN_PROGRESS,
            policies: [],
          })}
        />
      )}
    </div>
  )
}

export default UnderordnetBehandlingList
