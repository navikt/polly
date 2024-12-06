import { faExclamationCircle, faGavel, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Accordion } from '@navikt/ds-react'
import { Plus } from 'baseui/icon'
import { Modal, ModalBody, SIZE } from 'baseui/modal'
import { Spinner } from 'baseui/spinner'
import { LabelMedium } from 'baseui/typography'
import { useEffect, useRef, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import {
  convertProcessToFormValues,
  getDisclosuresByProcessId,
  getResourceById,
} from '../../../api/GetAllApi'
import {
  ELegalBasesUse,
  IAddDocumentToProcessFormValues,
  IDisclosure,
  IPolicy,
  IPolicyFormValues,
  IProcess,
  IProcessFormValues,
  IProcessShort,
} from '../../../constants'
import { canViewAlerts } from '../../../pages/AlertEventPage'
import { TPathParams } from '../../../pages/ProcessPage'
import { ICode, ICodelistProps } from '../../../service/Codelist'
import { user } from '../../../service/User'
import { theme } from '../../../util'
import { lastModifiedDate } from '../../../util/date-formatter'
import { RequestRevisionForm } from '../../admin/revision/RequestRevisionForm'
import Button from '../../common/Button/CustomButton'
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
  setProcessList: (processes: IProcess[]) => void
  onChangeProcess: (processId?: string) => void
  submitDeleteProcess: (process: IProcess) => Promise<boolean>
  submitEditProcess: (process: IProcessFormValues) => Promise<boolean>
  submitCreatePolicy: (process: IPolicyFormValues) => Promise<boolean>
  submitEditPolicy: (process: IPolicyFormValues) => Promise<boolean>
  submitDeletePolicy: (process: IPolicy) => Promise<boolean>
  submitDeleteAllPolicy: (processId: string) => Promise<boolean>
  submitAddDocument: (document: IAddDocumentToProcessFormValues) => Promise<boolean>
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
    submitAddDocument,
    errorDocumentModal,
  } = props
  const history: NavigateFunction = useNavigate()

  const [showEditProcessModal, setShowEditProcessModal] = useState(false)
  const [showCreatePolicyModal, setShowCreatePolicyModal] = useState(false)
  const [showAddBatchInfoTypesModal, setShowAddBatchInfoTypesModal] = useState(false)
  const [addDefaultDocument, setAddDefaultDocument] = useState(false)
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRevisionModal, setShowRevisionModal] = useState(false)
  const [showDeleteAllPolicyModal, setShowDeleteAllPolicyModal] = useState(false)
  const [disclosures, setDisclosures] = useState<IDisclosure[]>([])
  const purposeRef = useRef<HTMLButtonElement>(null)

  const params: Readonly<Partial<TPathParams>> = useParams<TPathParams>()

  const hasAccess = (): boolean => user.canWrite()

  const today: string = new Date().toISOString().split('T')[0]

  const renderCreatePolicyButton = () => (
    <Button
      tooltip="Legg til én informasjonstype"
      size="xsmall"
      kind="tertiary"
      onClick={() => setShowCreatePolicyModal(true)}
      startEnhancer={
        <div className="flex justify-center mr-1">
          <Plus size={22} />
        </div>
      }
    >
      Opplysningstype
    </Button>
  )

  const renderDeleteAllPolicyButton = () => (
    <Button
      tooltip="Slett alle opplysningstype"
      size="xsmall"
      kind="tertiary"
      onClick={() => setShowDeleteAllPolicyModal(true)}
      startEnhancer={
        <div className="flex justify-center mr-1">
          <FontAwesomeIcon title="Slett" icon={faTrash} />
        </div>
      }
    >
      Slett hele tabellen
    </Button>
  )

  const renderAddDocumentButton = () => (
    <Button
      tooltip="Legg til en samling av opplysningstyper"
      size="xsmall"
      kind="tertiary"
      onClick={() => setShowAddDocumentModal(true)}
      startEnhancer={
        <div className="flex justify-center mr-1">
          <Plus size={22} />
        </div>
      }
    >
      Dokument
    </Button>
  )

  useEffect(() => {
    ;(async () => {
      if (params.processId) {
        setDisclosures(await getDisclosuresByProcessId(params.processId))
      }
    })()
    params.processId &&
      !isLoading &&
      setTimeout(() => {
        purposeRef.current && window.scrollTo({ top: purposeRef.current.offsetTop - 30 })
      }, 200)
  }, [isLoading])

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
    <div className="mt-3">
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
              const expanded = params.processId === process.id

              return (
                <Accordion.Item
                  key={process.id}
                  open={expanded}
                  onOpenChange={(open) => {
                    onChangeProcess(open ? process.id : undefined)
                  }}
                >
                  <Accordion.Header ref={expanded ? purposeRef : undefined}>
                    <AccordionTitle
                      codelistUtils={codelistUtils}
                      process={process}
                      expanded={expanded}
                      noChevron
                    />
                  </Accordion.Header>
                  <Accordion.Content>
                    {expanded && isLoading && (
                      <div className="p-2.5">
                        <Spinner $size={theme.sizing.scale1200} />
                      </div>
                    )}

                    {expanded && !isLoading && currentProcess && (
                      <div className="outline outline-4 outline-[#E2E2E2]">
                        <div className="px-6 pt-6">
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
                          />
                          <div>
                            <div className="flex justify-end">
                              <span>
                                <i>{`Sist endret av ${currentProcess.changeStamp.lastModifiedBy}, ${lastModifiedDate(currentProcess.changeStamp?.lastModifiedDate)}`}</i>
                              </span>
                            </div>
                          </div>
                          <div className="flex pt-6 w-full justify-between">
                            <div className="flex">
                              {canViewAlerts() && (
                                <div className="mr-auto">
                                  <Button
                                    type="button"
                                    kind="tertiary"
                                    size="xsmall"
                                    icon={faExclamationCircle}
                                    onClick={() => history(`/alert/events/process/${process.id}`)}
                                  >
                                    Varsler
                                  </Button>
                                </div>
                              )}
                              {(user.isAdmin() || user.isSuper()) && (
                                <div className="mr-auto">
                                  <Button
                                    type="button"
                                    kind="tertiary"
                                    size="xsmall"
                                    icon={faGavel}
                                    onClick={() => setShowRevisionModal(true)}
                                  >
                                    Ny revidering
                                  </Button>
                                </div>
                              )}
                            </div>
                            {hasAccess() && (
                              <div className="flex justify-center">
                                <div ref={InformationTypeRef} />
                                {renderAddDocumentButton()}
                                {renderCreatePolicyButton()}
                                {renderDeleteAllPolicyButton()}
                              </div>
                            )}
                          </div>
                        </div>
                        <TablePolicy
                          codelistUtils={codelistUtils}
                          process={currentProcess}
                          hasAccess={hasAccess()}
                          errorPolicyModal={errorPolicyModal}
                          errorDeleteModal={errorPolicyModal}
                          submitEditPolicy={submitEditPolicy}
                          submitDeletePolicy={submitDeletePolicy}
                        />
                      </div>
                    )}
                  </Accordion.Content>
                </Accordion.Item>
              )
            })}
      </Accordion>
      {!processList.length && <LabelMedium margin="1rem">Ingen behandlinger</LabelMedium>}

      {!!currentProcess && (
        <>
          <ModalProcess
            codelistUtils={codelistUtils}
            key={currentProcess.id}
            title="Redigér behandling"
            onClose={() => setShowEditProcessModal(false)}
            isOpen={showEditProcessModal}
            submit={async (values: IProcessFormValues) => {
              ;(await submitEditProcess(values))
                ? setShowEditProcessModal(false)
                : setShowEditProcessModal(true)
            }}
            errorOnCreate={errorProcessModal}
            isEdit={true}
            initialValues={{
              ...convertProcessToFormValues(currentProcess),
              disclosures: disclosures,
            }}
          />
          <ModalPolicy
            title="Legg til opplysningstyper brukt i behandlingen"
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
              submitCreatePolicy(values)
                .then(() => setShowCreatePolicyModal(false))
                .catch(() => setShowCreatePolicyModal(true))
            }}
            addBatch={() => {
              setShowCreatePolicyModal(false)
              setShowAddBatchInfoTypesModal(true)
            }}
            errorOnCreate={errorPolicyModal}
            codelistUtils={codelistUtils}
          />

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
            isOpen={showRevisionModal}
            size={SIZE.auto}
            // role='dialog'
            onClose={closeRevision}
          >
            <ModalBody>
              <div className="w-[600px]">
                <RequestRevisionForm processId={currentProcess.id} close={closeRevision} />
              </div>
            </ModalBody>
          </Modal>
        </>
      )}
    </div>
  )
}

export default AccordionProcess
