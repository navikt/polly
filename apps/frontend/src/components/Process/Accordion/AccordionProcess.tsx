import { faExclamationCircle, faGavel, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Panel, StatelessAccordion } from 'baseui/accordion'
import { SIZE as ButtonSize, KIND } from 'baseui/button'
import { Plus } from 'baseui/icon'
import { Modal, ModalBody, SIZE } from 'baseui/modal'
import { Spinner } from 'baseui/spinner'
import { LabelMedium } from 'baseui/typography'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { convertProcessToFormValues, getDisclosuresByProcessId, getResourceById } from '../../../api'
import { RequestRevisionPage } from '../../../components/admin/revision/RequestRevisionPage'
import { AddDocumentToProcessFormValues, Disclosure, LegalBasesUse, Policy, PolicyFormValues, Process, ProcessFormValues, ProcessShort } from '../../../constants'
import { canViewAlerts } from '../../../pages/AlertEventPage'
import { PathParams } from '../../../pages/ProcessPage'
import { user } from '../../../service/User'
import { theme } from '../../../util'
import { lastModifiedDate } from '../../../util/date-formatter'
import Button from '../../common/Button'
import AccordionTitle, { InformationTypeRef } from './AccordionTitle'
import { AddBatchInformationTypesModal } from './AddBatchInformationTypesModal'
import { AddDocumentModal } from './AddDocumentModal'
import DeleteAllPolicyModal from './DeleteAllPolicyModal'
import { DeleteProcessModal } from './DeleteProcessModal'
import ModalPolicy from './ModalPolicy'
import ModalProcess from './ModalProcess'
import { ProcessCreatedModal } from './ProcessCreatedModal'
import ProcessData from './ProcessData'
import TablePolicy from './TablePolicy'

type AccordionProcessProps = {
  isLoading: boolean
  processList: ProcessShort[]
  currentProcess?: Process
  errorProcessModal: any | null
  errorPolicyModal: string | null
  errorDocumentModal: string | null
  setProcessList: (processes: Process[]) => void
  onChangeProcess: (processId?: string) => void
  submitDeleteProcess: (process: Process) => Promise<boolean>
  submitEditProcess: (process: ProcessFormValues) => Promise<boolean>
  submitCreatePolicy: (process: PolicyFormValues) => Promise<boolean>
  submitEditPolicy: (process: PolicyFormValues) => Promise<boolean>
  submitDeletePolicy: (process: Policy) => Promise<boolean>
  submitDeleteAllPolicy: (processId: string) => Promise<boolean>
  submitAddDocument: (document: AddDocumentToProcessFormValues) => Promise<boolean>
}

const AccordionProcess = (props: AccordionProcessProps) => {
  const {
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
  } = props

  const [showEditProcessModal, setShowEditProcessModal] = useState(false)
  const [showCreatePolicyModal, setShowCreatePolicyModal] = useState(false)
  const [showAddBatchInfoTypesModal, setShowAddBatchInfoTypesModal] = useState(false)
  const [addDefaultDocument, setAddDefaultDocument] = useState(false)
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRevisionModal, setShowRevisionModal] = useState(false)
  const [showDeleteAllPolicyModal, setShowDeleteAllPolicyModal] = useState(false)
  const [lastModifiedUserEmail, setLastModifiedUserEmail] = useState('')
  const [disclosures, setDisclosures] = useState<Disclosure[]>([])
  const purposeRef = useRef<HTMLInputElement>(null)
  const params = useParams<PathParams>()
  const history = useNavigate()

  const hasAccess = () => user.canWrite()

  const today = new Date().toISOString().split('T')[0]

  const renderCreatePolicyButton = () => (
    <Button
      tooltip="Legg til én informasjonstype"
      size={ButtonSize.compact}
      kind={KIND.tertiary}
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
      size={ButtonSize.compact}
      kind={KIND.tertiary}
      onClick={() => setShowDeleteAllPolicyModal(true)}
      startEnhancer={
        <div className="flex justify-center mr-1">
          <FontAwesomeIcon title="Slett" icon={faTrash} />
        </div>
      }
    >
      Slett hele tabelen
    </Button>
  )

  const renderAddDocumentButton = () => (
    <Button
      tooltip="Legg til en samling av opplysningstyper"
      size={ButtonSize.compact}
      kind={KIND.tertiary}
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
        purposeRef.current && window.scrollTo({ top: purposeRef.current.offsetTop - 40 })
      }, 200)
  }, [isLoading])

  useEffect(() => {
    ;(async () => {
      if (currentProcess) {
        const userIdent = currentProcess.changeStamp.lastModifiedBy.split(' ')[0]
        await getResourceById(userIdent)
          .then((res) => setLastModifiedUserEmail(res.email))
          .catch((e) => console.log('Unable to get email for user that last modified'))
      }
    })()
  }, [currentProcess])

  const closeRevision = () => {
    setShowRevisionModal(false)
    onChangeProcess(currentProcess?.id)
  }

  return (
    <div>
      <StatelessAccordion onChange={({ expanded }) => onChangeProcess(expanded.length ? (expanded[0] as string) : undefined)} expanded={params.processId ? [params.processId] : []}>
        {props.processList &&
          props.processList
            .sort((a, b) => {
              if (today < a.end && today > b.end) return -1
              else if (today > a.end && today < b.end) return 1

              const aname = a.purposes[0].shortName + ': ' + a.name.trim()
              const bname = b.purposes[0].shortName + ': ' + b.name.trim()

              return aname.localeCompare(bname)
            })
            .map((p: ProcessShort) => {
              const expanded = params.processId === p.id
              return (
                <Panel
                  title={
                    <AccordionTitle
                      process={p}
                      expanded={expanded}
                      hasAccess={hasAccess()}
                      editProcess={() => setShowEditProcessModal(true)}
                      deleteProcess={() => setShowDeleteModal(true)}
                      forwardRef={expanded ? purposeRef : undefined}
                    />
                  }
                  key={p.id}
                  overrides={{
                    ToggleIcon: {
                      component: () => null,
                    },
                    Content: {
                      style: {
                        backgroundColor: theme.colors.white,
                        // Outline width
                        paddingTop: '4px',
                        paddingBottom: '4px',
                        paddingLeft: '4px',
                        paddingRight: '4px',
                      },
                    },
                  }}
                >
                  {isLoading && (
                    <div className="p-2.5">
                      <Spinner $size={theme.sizing.scale1200} />
                    </div>
                  )}

                  {!isLoading && currentProcess && (
                    <div className="outline outline-4 outline-[#E2E2E2]">
                      <div className="px-6 pt-6">
                        <ProcessData process={currentProcess} disclosures={disclosures} />

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
                                <Button type="button" kind="tertiary" size="compact" icon={faExclamationCircle} onClick={() => history(`/alert/events/process/${p.id}`)}>
                                  Varsler
                                </Button>
                              </div>
                            )}
                            {(user.isAdmin() || user.isSuper()) && (
                              <div className="mr-auto">
                                <Button type="button" kind="tertiary" size="compact" icon={faGavel} onClick={() => setShowRevisionModal(true)}>
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
                        process={currentProcess}
                        hasAccess={hasAccess()}
                        errorPolicyModal={errorPolicyModal}
                        errorDeleteModal={errorPolicyModal}
                        submitEditPolicy={submitEditPolicy}
                        submitDeletePolicy={submitDeletePolicy}
                      />
                    </div>
                  )}
                </Panel>
              )
            })}
      </StatelessAccordion>
      {!props.processList.length && <LabelMedium margin="1rem">Ingen behandlinger</LabelMedium>}

      {!!currentProcess && (
        <>
          <ModalProcess
            key={currentProcess.id}
            title="Redigér behandling"
            onClose={() => setShowEditProcessModal(false)}
            isOpen={showEditProcessModal}
            submit={async (values: ProcessFormValues) => {
              ;(await submitEditProcess(values)) ? setShowEditProcessModal(false) : setShowEditProcessModal(true)
            }}
            errorOnCreate={errorProcessModal}
            isEdit={true}
            initialValues={{ ...convertProcessToFormValues(currentProcess), disclosures: disclosures }}
          />
          <ModalPolicy
            title="Legg til opplysningstyper brukt i behandlingen"
            initialValues={{
              legalBasesOpen: false,
              informationType: undefined,
              legalBasesUse: LegalBasesUse.INHERITED_FROM_PROCESS,
              process: currentProcess,
              purposes: currentProcess.purposes.map((p) => p.code),
              subjectCategories: [],
              legalBases: [],
              documentIds: [],
              otherPolicies: currentProcess.policies,
            }}
            isEdit={false}
            onClose={() => setShowCreatePolicyModal(false)}
            isOpen={showCreatePolicyModal}
            submit={(values: PolicyFormValues) => {
              submitCreatePolicy(values)
                .then(() => setShowCreatePolicyModal(false))
                .catch(() => setShowCreatePolicyModal(true))
            }}
            addBatch={() => {
              setShowCreatePolicyModal(false)
              setShowAddBatchInfoTypesModal(true)
            }}
            errorOnCreate={errorPolicyModal}
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
            submit={(formValues) => props.submitAddDocument(formValues).then(() => setShowAddDocumentModal(false))}
            process={currentProcess}
            addDefaultDocument={addDefaultDocument}
            error={props.errorDocumentModal}
          />

          <AddBatchInformationTypesModal
            onClose={() => setShowAddBatchInfoTypesModal(false)}
            isOpen={showAddBatchInfoTypesModal}
            submit={(formValues) => props.submitAddDocument(formValues).then(() => setShowAddBatchInfoTypesModal(false))}
            process={currentProcess}
            error={props.errorDocumentModal}
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
                <RequestRevisionPage processId={currentProcess.id} close={closeRevision} />
              </div>
            </ModalBody>
          </Modal>
        </>
      )}
    </div>
  )
}

export default AccordionProcess
