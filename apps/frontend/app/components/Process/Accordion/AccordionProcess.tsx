'use client'

import {
  ExclamationmarkIcon,
  ExclamationmarkTriangleIcon,
  GavelIcon,
  InformationSquareIcon,
  PlusIcon,
  TrashIcon,
} from '@navikt/aksel-icons'
import {
  Accordion,
  BodyShort,
  InfoCard,
  InlineMessage,
  Link,
  List,
  Loader,
  Modal,
  Tabs,
} from '@navikt/ds-react'
import { useParams, useSearchParams } from 'next/navigation'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { TPathParams } from '@/components/mainPages/ProcessPage'
import { ICode } from '@/constants/codelistConstant'
import { ICodelistProps } from '@/provider/kodeverkProvider'
import { IUserContext, UserContext } from '@/provider/userProvider'
import { checkForAvvikKeys, getMissingPolicies, getPolicyAvvik } from '@/util/processUtils'
import { TNavigateFunction, useNavigate } from '@/util/router'
import {
  convertProcessToFormValues,
  getDisclosuresByProcessId,
  getResourceById,
} from '../../../api/GetAllApi'
import {
  EBehandlingsNivaa,
  ELegalBasesUse,
  IAddDocumentToProcessFormValues,
  IDisclosure,
  IPolicy,
  IPolicyFormValues,
  IProcess,
  IProcessFormValues,
  IProcessShort,
} from '../../../constants'
import { lastModifiedDate } from '../../../util/date-formatter'
import { RequestRevisionForm } from '../../admin/revision/RequestRevisionForm'
import Button from '../../common/Button/CustomButton'
import AvvikTag from '../common/AvvikTag'
import UnderordnetBehandlingList from '../underordnetBehandling/underornetBehandlingList'
import AccordionTitle, { InformationTypeRef } from './AccordionTitle'
import { AddBatchInformationTypesModal } from './AddBatchInformationTypesModal'
import { AddDocumentModal } from './AddDocumentModal'
import DeleteAllPolicyModal from './DeleteAllPolicyModal'
import { DeleteProcessModal } from './DeleteProcessModal'
import ModalPolicy from './ModalPolicy'
import ModalProcess from './ModalProcess'
import { ProcessButtonGroup } from './ProcessButtonGroup'
import { ProcessCreatedModal } from './ProcessCreatedModal'
import ProcessData from './ProcessData'
import TablePolicy from './TablePolicy'

type TAccordionProcessProps = {
  codelistUtils: ICodelistProps
  isLoading: boolean
  processList: IProcessShort[]
  currentProcess?: IProcess
  errorProcessModal: any | null
  errorPolicyModal: string | null
  errorDocumentModal: string | null
  setProcessList: (processes: IProcessShort[]) => void
  onChangeProcess: (processId?: string) => void
  submitDeleteProcess: (process: IProcess) => Promise<boolean>
  submitEditProcess: (process: IProcessFormValues) => Promise<boolean>
  submitCreatePolicy: (policy: IPolicyFormValues) => Promise<boolean>
  submitEditPolicy: (policy: IPolicyFormValues) => Promise<boolean>
  submitDeletePolicy: (policy: IPolicy) => Promise<boolean>
  submitDeleteAllPolicy: (processId: string) => Promise<boolean>
  submitAddDocument: (document: IAddDocumentToProcessFormValues) => Promise<boolean>
  forUnderordnetBehandlinger: boolean
  overordnetBehandling?: IProcess
  overordnetBehandlingUtleveringer?: IDisclosure[]
}

const AccordionProcess = (props: TAccordionProcessProps) => {
  const {
    codelistUtils,
    isLoading,
    currentProcess,
    onChangeProcess,
    submitDeleteProcess,
    submitEditProcess,
    submitCreatePolicy,
    submitEditPolicy,
    errorProcessModal,
    errorPolicyModal,
    submitDeletePolicy,
    submitDeleteAllPolicy,
    processList,
    setProcessList,
    submitAddDocument,
    errorDocumentModal,
    forUnderordnetBehandlinger,
    overordnetBehandling,
    overordnetBehandlingUtleveringer,
  } = props
  const history: TNavigateFunction = useNavigate()
  const user: IUserContext = useContext(UserContext)

  const [showEditProcessModal, setShowEditProcessModal] = useState(false)
  const [showCreatePolicyModal, setShowCreatePolicyModal] = useState(false)
  const [showAddBatchInfoTypesModal, setShowAddBatchInfoTypesModal] = useState(false)
  const [addDefaultDocument, setAddDefaultDocument] = useState(false)
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRevisionModal, setShowRevisionModal] = useState(false)
  const [revisionModalKey, setRevisionModalKey] = useState(0)
  const [showDeleteAllPolicyModal, setShowDeleteAllPolicyModal] = useState(false)
  const [disclosures, setDisclosures] = useState<IDisclosure[]>([])
  const purposeRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLButtonElement>(null)
  const scrollToPolicyTable = useRef(false)

  const params: Readonly<Partial<TPathParams>> = useParams<TPathParams>()
  const searchParams = useSearchParams()
  const underordnetBehandlingId = searchParams.get('underordnetBehandlingId')
  const selectedProcessId = forUnderordnetBehandlinger ? underordnetBehandlingId : params.processId
  const previousUnderordnetBehandlingId = useRef(underordnetBehandlingId)
  const avvikKeys = useMemo(() => {
    if (forUnderordnetBehandlinger && overordnetBehandling && currentProcess) {
      return checkForAvvikKeys(overordnetBehandling, currentProcess)
    }
    return []
  }, [forUnderordnetBehandlinger, overordnetBehandling, currentProcess])
  const avvikPolicyIds = useMemo(() => {
    if (forUnderordnetBehandlinger && overordnetBehandling && currentProcess) {
      return getPolicyAvvik(overordnetBehandling.policies, currentProcess.policies).map(
        (policy) => policy.id
      )
    }
    return []
  }, [forUnderordnetBehandlinger, overordnetBehandling, currentProcess])
  const policyNotInUnderordnet = useMemo(() => {
    if (forUnderordnetBehandlinger && overordnetBehandling && currentProcess) {
      return getMissingPolicies(overordnetBehandling.policies, currentProcess.policies)
    }
    return []
  }, [forUnderordnetBehandlinger, overordnetBehandling, currentProcess])

  useEffect(() => {
    if (forUnderordnetBehandlinger || !headerRef.current || !purposeRef.current) return

    const header = headerRef.current
    const item = purposeRef.current
    const updateHeaderHeight = () => {
      item.style.setProperty(
        '--polly-process-header-height',
        `${header.getBoundingClientRect().height}px`
      )
    }

    updateHeaderHeight()
    const observer = new ResizeObserver(updateHeaderHeight)
    observer.observe(header)

    return () => observer.disconnect()
  }, [forUnderordnetBehandlinger, params.processId, processList])

  const hasAccess = (): boolean => user.canWrite()

  const today: string = new Date().toISOString().split('T')[0]

  const renderCreatePolicyButton = () => (
    <Button
      tooltip='Legg til én informasjonstype'
      size='xsmall'
      kind='tertiary'
      onClick={() => setShowCreatePolicyModal(true)}
      startEnhancer={
        <div className='flex justify-center mr-1'>
          <PlusIcon aria-hidden />
        </div>
      }
    >
      Opplysningstype
    </Button>
  )

  const renderDeleteAllPolicyButton = () => (
    <Button
      tooltip='Slett alle opplysningstype'
      size='xsmall'
      kind='tertiary'
      onClick={() => setShowDeleteAllPolicyModal(true)}
      startEnhancer={
        <div className='flex items-center justify-center mr-1 leading-none'>
          <TrashIcon aria-hidden className='block' />
        </div>
      }
    >
      Tøm tabellen
    </Button>
  )

  const renderAddDocumentButton = () => (
    <Button
      tooltip='Legg til en samling av opplysningstyper'
      size='xsmall'
      kind='tertiary'
      onClick={() => setShowAddDocumentModal(true)}
      startEnhancer={
        <div className='flex justify-center mr-1'>
          <PlusIcon aria-hidden />
        </div>
      }
    >
      Dokument
    </Button>
  )

  useEffect(() => {
    ;(async () => {
      if (forUnderordnetBehandlinger) {
        if (
          searchParams.get('underordnetBehandlingId') !== null &&
          searchParams.get('underordnetBehandlingId') !== ''
        ) {
          const underordnetBehandlingId = searchParams.get('underordnetBehandlingId') || ''
          setDisclosures(await getDisclosuresByProcessId(underordnetBehandlingId))
        }
      } else {
        if (params.processId) {
          setDisclosures(await getDisclosuresByProcessId(params.processId))
        }
      }
    })()
  }, [params.processId, searchParams])

  useEffect(() => {
    const closedUnderordnetBehandling =
      !!previousUnderordnetBehandlingId.current && !underordnetBehandlingId
    previousUnderordnetBehandlingId.current = underordnetBehandlingId

    if (closedUnderordnetBehandling) return
    if (!forUnderordnetBehandlinger && underordnetBehandlingId) return

    if (selectedProcessId && currentProcess?.id === selectedProcessId && !isLoading) {
      const timeoutId = window.setTimeout(() => {
        const MainSearchHeaderEl = document.querySelector(
          '.polly-white-internalheader'
        ) as HTMLElement | null
        const headerOffset = MainSearchHeaderEl?.offsetHeight ?? 0
        const parentHeaderOffset =
          forUnderordnetBehandlinger && headerRef.current
            ? parseFloat(window.getComputedStyle(headerRef.current).top) || 0
            : 0
        const accordionOffset = forUnderordnetBehandlinger ? parentHeaderOffset : headerOffset + 16
        if (scrollToPolicyTable.current && InformationTypeRef.current) {
          scrollToPolicyTable.current = false
          window.scrollTo({
            top: InformationTypeRef.current.offsetTop - headerOffset - 16,
            behavior: 'smooth',
          })
        } else if (purposeRef.current) {
          window.scrollTo({
            top: window.scrollY + purposeRef.current.getBoundingClientRect().top - accordionOffset,
          })
        }
      }, 300)

      return () => window.clearTimeout(timeoutId)
    }
  }, [
    currentProcess?.id,
    isLoading,
    selectedProcessId,
    forUnderordnetBehandlinger,
    underordnetBehandlingId,
  ])

  useEffect(() => {
    ;(async () => {
      if (currentProcess) {
        const userIdent: string = currentProcess.changeStamp.lastModifiedBy.split(' ')[0]
        await getResourceById(userIdent).catch(() =>
          console.debug('Unable to get email for user that last modified')
        )
      }
    })()
  }, [currentProcess])

  const closeRevision = (): void => {
    setShowRevisionModal(false)
    onChangeProcess(currentProcess?.id)
  }

  return (
    <div className='mt-3'>
      <Accordion>
        {processList &&
          processList
            .sort((a, b) => {
              if (today < a.end && today > b.end) return -1
              else if (today > a.end && today < b.end) return 1

              const aname = a.purposes[0].shortName + ': ' + a.name.trim()
              const bname = b.purposes[0].shortName + ': ' + b.name.trim()

              return aname.localeCompare(bname)
            })
            .map((process: IProcessShort) => {
              let expanded = params.processId === process.id

              if (forUnderordnetBehandlinger) {
                expanded = searchParams.get('underordnetBehandlingId') === process.id
              }

              return (
                <Accordion.Item
                  key={process.id}
                  ref={expanded ? purposeRef : undefined}
                  open={expanded}
                  onOpenChange={(open) => {
                    onChangeProcess(open ? process.id : undefined)
                  }}
                  className='relative'
                >
                  <Accordion.Header
                    ref={expanded ? headerRef : undefined}
                    className={`sticky bg-(--ax-bg-raised) ${forUnderordnetBehandlinger ? 'z-10' : 'z-20'}`}
                    style={{
                      top: forUnderordnetBehandlinger
                        ? 'var(--polly-process-header-height, 0px)'
                        : 0,
                    }}
                  >
                    <AccordionTitle
                      codelistUtils={codelistUtils}
                      process={process}
                      expanded={expanded}
                      noChevron
                      forUnderordnetBehandlinger={forUnderordnetBehandlinger}
                      overordnetBehandling={overordnetBehandling}
                    />
                  </Accordion.Header>
                  <Accordion.Content className={expanded ? 'overflow-visible' : undefined}>
                    {expanded && isLoading && (
                      <div className='p-2.5'>
                        <div className='flex w-full justify-center'>
                          <Loader size='3xlarge' />
                        </div>
                      </div>
                    )}

                    {expanded && !isLoading && currentProcess && (
                      <div>
                        <div className='px-6 pt-6'>
                          <ProcessButtonGroup
                            process={process}
                            hasAccess={hasAccess()}
                            editProcess={() => setShowEditProcessModal(true)}
                            deleteProcess={() => setShowDeleteModal(true)}
                          />
                          <ProcessData
                            process={currentProcess}
                            disclosures={disclosures}
                            codelistUtils={codelistUtils}
                            forUnderordnetBehandlinger={forUnderordnetBehandlinger}
                            overordnetBehandling={overordnetBehandling}
                            overordnetBehandlingUtleveringer={overordnetBehandlingUtleveringer}
                          />

                          <div>
                            <div className='flex justify-end'>
                              <span>
                                <i>{`Sist endret av ${currentProcess.changeStamp.lastModifiedBy}, ${lastModifiedDate(currentProcess.changeStamp?.lastModifiedDate)}`}</i>
                              </span>
                            </div>
                          </div>
                          <div className='flex flex-col sm:flex-row sm:justify-between mt-20 w-full gap-2'>
                            <div className='flex flex-wrap gap-2'>
                              {(user.isSuperUser() || user.isAdmin()) && (
                                <Button
                                  type='button'
                                  kind='tertiary'
                                  size='xsmall'
                                  icon={
                                    <span className='flex items-center leading-none'>
                                      <ExclamationmarkIcon aria-hidden className='block' />
                                    </span>
                                  }
                                  onClick={() => history(`/alert/events/process/${process.id}`)}
                                >
                                  Varsler
                                </Button>
                              )}
                              {(user.isAdmin() || user.isSuperUser()) && (
                                <Button
                                  type='button'
                                  kind='tertiary'
                                  size='xsmall'
                                  icon={
                                    <span className='flex items-center leading-none'>
                                      <GavelIcon aria-hidden className='block' />
                                    </span>
                                  }
                                  onClick={() => {
                                    setRevisionModalKey((k) => k + 1)
                                    setShowRevisionModal(true)
                                  }}
                                >
                                  Ny revidering
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        <Tabs
                          defaultValue={
                            !forUnderordnetBehandlinger &&
                            underordnetBehandlingId &&
                            currentProcess.behandlingsNivaa === EBehandlingsNivaa.OVERORDNET
                              ? 'underordnet'
                              : 'opplysninger'
                          }
                          className='mt-5'
                        >
                          <Tabs.List>
                            <Tabs.Tab
                              value='opplysninger'
                              label={
                                <span>
                                  {forUnderordnetBehandlinger &&
                                    !!overordnetBehandling &&
                                    avvikKeys.includes('policies') && (
                                      <AvvikTag marginRight marginTop />
                                    )}
                                  Opplysningstyper ({currentProcess.policies.length})
                                </span>
                              }
                            />
                            {currentProcess.behandlingsNivaa === EBehandlingsNivaa.OVERORDNET && (
                              <Tabs.Tab
                                value='underordnet'
                                label={`Underordnede behandlinger (${currentProcess.underordnetBehandlinger?.length})`}
                              />
                            )}
                          </Tabs.List>
                          <Tabs.Panel value='opplysninger'>
                            {currentProcess.behandlingsNivaa === EBehandlingsNivaa.UNDERORDNET && (
                              <InfoCard data-color='warning' className='mt-3'>
                                <InfoCard.Message
                                  icon={<ExclamationmarkTriangleIcon aria-hidden />}
                                >
                                  Dere må sjekke om opplysningstypene og enkelte opplysninger
                                  stemmer for deres behandling
                                </InfoCard.Message>
                              </InfoCard>
                            )}

                            {currentProcess.behandlingsNivaa === EBehandlingsNivaa.UNDERORDNET &&
                              avvikKeys.includes('policies') && (
                                <InlineMessage status='info' className='my-5'>
                                  <strong>
                                    Opplysningstyper som ikke brukes i den overordnede behandlingen,
                                    eller som inneholder endringer i forhold til den overordnede
                                    behandlingen, markeres med &nbsp;
                                    <AvvikTag />
                                  </strong>
                                </InlineMessage>
                              )}
                            {hasAccess() && (
                              <div className='flex w-full mt-5 mb-3 justify-end'>
                                <div className='gap-2'>
                                  <div ref={InformationTypeRef} />
                                  {renderAddDocumentButton()}
                                  {renderCreatePolicyButton()}
                                  {renderDeleteAllPolicyButton()}
                                </div>
                              </div>
                            )}
                            <TablePolicy
                              codelistUtils={codelistUtils}
                              process={currentProcess}
                              hasAccess={hasAccess()}
                              errorPolicyModal={errorPolicyModal}
                              errorDeleteModal={errorPolicyModal}
                              submitEditPolicy={submitEditPolicy}
                              submitDeletePolicy={submitDeletePolicy}
                              avvikPolicyIds={avvikPolicyIds}
                            />

                            {currentProcess.behandlingsNivaa === EBehandlingsNivaa.UNDERORDNET &&
                              policyNotInUnderordnet.length !== 0 && (
                                <InfoCard data-color='meta-purple' className='mt-5'>
                                  <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
                                    <InfoCard.Title>
                                      Følgende opplysningstyper brukes i den overordnede
                                      behandlingen, men ikke i denne, underordnede behandlingen.
                                    </InfoCard.Title>
                                  </InfoCard.Header>
                                  <InfoCard.Content>
                                    <List as='ul'>
                                      {policyNotInUnderordnet.map((policy) => (
                                        <List.Item key={policy.id}>
                                          <Link
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            href={`/informationtype/${policy.informationType.id}`}
                                          >
                                            {policy.informationType.name} (åpner i en ny fane)
                                          </Link>
                                        </List.Item>
                                      ))}
                                    </List>
                                  </InfoCard.Content>
                                </InfoCard>
                              )}
                          </Tabs.Panel>
                          {currentProcess.behandlingsNivaa === EBehandlingsNivaa.OVERORDNET && (
                            <Tabs.Panel value='underordnet'>
                              <UnderordnetBehandlingList
                                overordnetBehandling={currentProcess}
                                overordnetBehandlingUtleveringer={disclosures}
                                codelistUtils={codelistUtils}
                                overordnetOgVanligBehandlingList={processList}
                                setOverordnetOgVanligBehandlingList={setProcessList}
                              />
                            </Tabs.Panel>
                          )}
                        </Tabs>
                      </div>
                    )}
                  </Accordion.Content>
                </Accordion.Item>
              )
            })}
      </Accordion>
      {!processList.length && <BodyShort className='m-4'>Ingen behandlinger</BodyShort>}

      {!!currentProcess && (
        <>
          {showEditProcessModal && (
            <ModalProcess
              codelistUtils={codelistUtils}
              key={currentProcess.id}
              title='Redigér behandling'
              onClose={() => setShowEditProcessModal(false)}
              isOpen={showEditProcessModal}
              submit={async (values: IProcessFormValues) => {
                if (await submitEditProcess(values)) {
                  setShowEditProcessModal(false)
                } else {
                  setShowEditProcessModal(true)
                }
              }}
              errorOnCreate={errorProcessModal}
              isEdit={true}
              initialValues={{
                ...convertProcessToFormValues(currentProcess),
                disclosures: disclosures,
              }}
              overordnetBehandling={overordnetBehandling}
              underordnetBehandling={currentProcess}
              overordnetBehandlingUtleveringer={overordnetBehandlingUtleveringer}
              underordnetBehandlingUtleveringer={disclosures}
            />
          )}

          {showCreatePolicyModal && (
            <ModalPolicy
              title='Legg til opplysningstyper brukt i behandlingen'
              initialValues={{
                legalBasesOpen: false,
                informationType: undefined,
                legalBasesUse: ELegalBasesUse.INHERITED_FROM_PROCESS,
                process: currentProcess,
                purposes: currentProcess.purposes.map((purpose: ICode) => purpose.code),
                subjectCategories: [],
                legalBases: [],
                documentIds: [],
                otherPolicies: currentProcess.policies,
              }}
              isEdit={false}
              onClose={() => setShowCreatePolicyModal(false)}
              isOpen={showCreatePolicyModal}
              submit={(values: IPolicyFormValues) => {
                scrollToPolicyTable.current = true
                submitCreatePolicy(values)
                  .then(() => setShowCreatePolicyModal(false))
                  .catch(() => {
                    scrollToPolicyTable.current = false
                    setShowCreatePolicyModal(true)
                  })
              }}
              addBatch={() => {
                setShowCreatePolicyModal(false)
                setShowAddBatchInfoTypesModal(true)
              }}
              errorOnCreate={errorPolicyModal}
              codelistUtils={codelistUtils}
            />
          )}

          <DeleteAllPolicyModal
            isOpen={showDeleteAllPolicyModal}
            submitDeleteAllPolicies={() => {
              submitDeleteAllPolicy(currentProcess.id)
              setShowDeleteAllPolicyModal(false)
            }}
            onClose={() => {
              setShowDeleteAllPolicyModal(false)
            }}
          />

          <AddDocumentModal
            onClose={() => {
              setAddDefaultDocument(false)
              setShowAddDocumentModal(false)
            }}
            isOpen={showAddDocumentModal}
            submit={(formValues: IAddDocumentToProcessFormValues) =>
              submitAddDocument(formValues).then(() => setShowAddDocumentModal(false))
            }
            process={currentProcess}
            addDefaultDocument={addDefaultDocument}
            error={errorDocumentModal}
          />

          <AddBatchInformationTypesModal
            onClose={() => setShowAddBatchInfoTypesModal(false)}
            isOpen={showAddBatchInfoTypesModal}
            submit={(formValues) =>
              submitAddDocument(formValues).then(() => setShowAddBatchInfoTypesModal(false))
            }
            codelistUtils={codelistUtils}
            process={currentProcess}
            error={errorDocumentModal}
          />

          <DeleteProcessModal
            onClose={() => setShowDeleteModal(false)}
            isOpen={showDeleteModal}
            errorProcessModal={errorProcessModal}
            submitDeleteProcess={submitDeleteProcess}
            process={currentProcess}
            disclosures={disclosures}
          />

          <ProcessCreatedModal
            openAddPolicy={() => setShowCreatePolicyModal(true)}
            openAddDocument={() => {
              setAddDefaultDocument(true)
              setShowAddDocumentModal(true)
            }}
          />

          <Modal
            open={showRevisionModal}
            onClose={closeRevision}
            header={{ heading: 'Ny revidering' }}
          >
            <Modal.Body>
              <div className='w-150'>
                <RequestRevisionForm
                  key={revisionModalKey}
                  processId={currentProcess.id}
                  close={closeRevision}
                />
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  )
}

export default AccordionProcess
