import * as React from 'react'
import { useEffect } from 'react'
import { Panel, StatelessAccordion } from 'baseui/accordion'
import { KIND, SIZE as ButtonSize } from 'baseui/button'
import { Spinner } from 'baseui/spinner'
import { Block } from 'baseui/block'
import { LabelMedium } from 'baseui/typography'
import { intl, theme } from '../../../util'
import { user } from '../../../service/User'
import { Plus } from 'baseui/icon'
import { AddDocumentToProcessFormValues, Disclosure, LegalBasesUse, Policy, PolicyFormValues, Process, ProcessFormValues, ProcessShort } from '../../../constants'
import ModalProcess from './ModalProcess'
import ModalPolicy from './ModalPolicy'
import TablePolicy from './TablePolicy'
import { convertProcessToFormValues, getDisclosuresByProcessId, getResourceById } from '../../../api'
import { PathParams } from '../../../pages/ProcessPage'
import { AddDocumentModal } from './AddDocumentModal'
import Button from '../../common/Button'
import AccordionTitle, { InformationTypeRef } from './AccordionTitle'
import ProcessData from './ProcessData'
import { lastModifiedDate } from '../../../util/date-formatter'
import { faExclamationCircle, faGavel, faTrash } from '@fortawesome/free-solid-svg-icons'
import { canViewAlerts } from '../../../pages/AlertEventPage'
import { DeleteProcessModal } from './DeleteProcessModal'
import { ProcessCreatedModal } from './ProcessCreatedModal'
import { useNavigate, useParams } from 'react-router-dom'
import { AddBatchInformationTypesModal } from './AddBatchInformationTypesModal'
import { Modal, ModalBody, SIZE } from 'baseui/modal'
import { RequestRevisionPage } from '../../../pages/admin/RequestRevisionPage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DeleteAllPolicyModal from './DeleteAllPolicyModal'

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

  const [showEditProcessModal, setShowEditProcessModal] = React.useState(false)
  const [showCreatePolicyModal, setShowCreatePolicyModal] = React.useState(false)
  const [showAddBatchInfoTypesModal, setShowAddBatchInfoTypesModal] = React.useState(false)
  const [addDefaultDocument, setAddDefaultDocument] = React.useState(false)
  const [showAddDocumentModal, setShowAddDocumentModal] = React.useState(false)
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const [showRevisionModal, setShowRevisionModal] = React.useState(false)
  const [showDeleteAllPolicyModal, setShowDeleteAllPolicyModal] = React.useState(false)
  const [lastModifiedUserEmail, setLastModifiedUserEmail] = React.useState('')
  const [disclosures, setDisclosures] = React.useState<Disclosure[]>([])
  const purposeRef = React.useRef<HTMLInputElement>(null)
  const params = useParams<PathParams>()
  const history = useNavigate()

  const hasAccess = () => user.canWrite()

  const today = new Date().toISOString().split('T')[0]

  const renderCreatePolicyButton = () => (
    <Button
      tooltip={intl.addOneInformationType}
      size={ButtonSize.compact}
      kind={KIND.tertiary}
      onClick={() => setShowCreatePolicyModal(true)}
      startEnhancer={
        <Block display="flex" justifyContent="center" marginRight={theme.sizing.scale100}>
          <Plus size={22} />
        </Block>
      }
    >
      {intl.informationType}
    </Button>
  )

  const renderDeleteAllPolicyButton = () => (
    <Button
      tooltip="Slett alle opplysningstype"
      size={ButtonSize.compact}
      kind={KIND.tertiary}
      onClick={() => setShowDeleteAllPolicyModal(true)}
      startEnhancer={
        <Block display="flex" justifyContent="center" marginRight={theme.sizing.scale100}>
          <FontAwesomeIcon title={intl.delete} icon={faTrash}/>
        </Block>
      }
    >
      Slett hele tabelen
    </Button>
  )

  const renderAddDocumentButton = () => (
    <Button
      tooltip={intl.addCollectionOfInformationTypes}
      size={ButtonSize.compact}
      kind={KIND.tertiary}
      onClick={() => setShowAddDocumentModal(true)}
      startEnhancer={
        <Block display="flex" justifyContent="center" marginRight={theme.sizing.scale100}>
          <Plus size={22} />
        </Block>
      }
    >
      {intl.document}
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
    <Block>
      <StatelessAccordion onChange={({ expanded }) => onChangeProcess(expanded.length ? (expanded[0] as string) : undefined)} expanded={params.processId ? [params.processId] : []}>
        {props.processList &&
          props.processList
            .sort((a, b) =>{
              if (today < a.end && today > b.end) return -1
              else if (today > a.end && today < b.end) return 1


              return a.name.trim().localeCompare(b.name.trim())

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
                    <Block padding={theme.sizing.scale400}>
                      <Spinner $size={theme.sizing.scale1200} />
                    </Block>
                  )}

                  {!isLoading && currentProcess && (
                    <Block
                      $style={{
                        outline: `4px ${theme.colors.primary200} solid`,
                      }}
                    >
                      <Block paddingLeft={theme.sizing.scale800} paddingRight={theme.sizing.scale800} paddingTop={theme.sizing.scale800}>
                        <ProcessData process={currentProcess} disclosures={disclosures} />

                        <Block>
                          <Block display="flex" justifyContent="flex-end">
                            <span>
                              <i>
                                {intl.formatString(intl.lastModified, '', '').toString().slice(0, -2)} <a href={'mailto: ' + lastModifiedUserEmail}>{lastModifiedUserEmail}</a>,{' '}
                                {lastModifiedDate(currentProcess.changeStamp.lastModifiedDate)}
                              </i>
                            </span>
                          </Block>
                        </Block>
                        <Block display="flex" paddingTop={theme.sizing.scale800} width="100%" justifyContent="space-between">
                          <Block display="flex">
                            {canViewAlerts() && (
                              <Block marginRight="auto">
                                <Button type="button" kind="tertiary" size="compact" icon={faExclamationCircle} onClick={() => history(`/alert/events/process/${p.id}`)}>
                                  {intl.alerts}
                                </Button>
                              </Block>
                            )}
                            {(user.isAdmin() || user.isSuper()) && (
                              <Block marginRight="auto">
                                <Button type="button" kind="tertiary" size="compact" icon={faGavel} onClick={() => setShowRevisionModal(true)}>
                                  {intl.newRevision}
                                </Button>
                              </Block>
                            )}
                          </Block>
                          {hasAccess() && (
                            <Block display="flex" justifyContent="center">
                              <div ref={InformationTypeRef} />
                              {renderAddDocumentButton()}
                              {renderCreatePolicyButton()}
                              {renderDeleteAllPolicyButton()}
                            </Block>
                          )}
                        </Block>
                      </Block>

                      <TablePolicy
                        process={currentProcess}
                        hasAccess={hasAccess()}
                        errorPolicyModal={errorPolicyModal}
                        errorDeleteModal={errorPolicyModal}
                        submitEditPolicy={submitEditPolicy}
                        submitDeletePolicy={submitDeletePolicy}
                      />
                    </Block>
                  )}
                </Panel>
              )
            })}
      </StatelessAccordion>
      {!props.processList.length && (
        <LabelMedium margin="1rem">
          {intl.emptyTable} {intl.processes}
        </LabelMedium>
      )}

      {!!currentProcess && (
        <>
          <ModalProcess
            key={currentProcess.id}
            title={intl.processingActivitiesEdit}
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
            title={intl.policyAdd}
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
              <Block width="600px">
                <RequestRevisionPage processId={currentProcess.id} close={closeRevision} />
              </Block>
            </ModalBody>
          </Modal>
        </>
      )}
    </Block>
  )
}

export default AccordionProcess
