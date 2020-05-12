import * as React from 'react'
import { useEffect } from 'react'
import { Accordion, Panel } from 'baseui/accordion'
import { generatePath, RouteComponentProps, withRouter } from 'react-router'
import { KIND, SIZE as ButtonSize } from 'baseui/button'
import { StyledSpinnerNext } from 'baseui/spinner'
import { Block } from 'baseui/block'
import { Label2, Paragraph2 } from 'baseui/typography'
import { intl, theme, useAwait } from '../../../util'
import { user } from '../../../service/User'
import { Plus } from 'baseui/icon'
import { AddDocumentToProcessFormValues, LegalBasesStatus, Policy, PolicyFormValues, Process, ProcessFormValues, UseWithPurpose } from '../../../constants'
import ModalProcess from './ModalProcess'
import ModalPolicy from './ModalPolicy'
import TablePolicy from './TablePolicy'
import { convertProcessToFormValues } from '../../../api'
import { PathParams } from '../../../pages/PurposePage'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import { AddDocumentModal } from './AddDocumentModal'
import Button from '../../common/Button'
import AccordionTitle from './AccordionTitle'
import ProcessData from './ProcessData'
import { lastModifiedDate } from "../../../util/date-formatter";
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { canViewAlerts } from '../../../pages/AlertEventPage'

type AccordionProcessProps = {
  isLoading: boolean
  code: string
  processList: UseWithPurpose[]
  currentProcess?: Process
  errorProcessModal: any | null
  errorPolicyModal: string | null
  errorDocumentModal: string | null
  setProcessList: (processes: Process[]) => void
  onChangeProcess: (processId: string) => void
  submitDeleteProcess: (process: Process) => Promise<boolean>
  submitEditProcess: (process: ProcessFormValues) => Promise<boolean>
  submitCreatePolicy: (process: PolicyFormValues) => Promise<boolean>
  submitEditPolicy: (process: PolicyFormValues) => Promise<boolean>
  submitDeletePolicy: (process: Policy) => Promise<boolean>
  submitAddDocument: (document: AddDocumentToProcessFormValues) => Promise<boolean>
}

const AccordionProcess = (props: AccordionProcessProps & RouteComponentProps<PathParams>) => {
  const {
    isLoading,
    code,
    currentProcess,
    onChangeProcess,
    submitDeleteProcess,
    submitEditProcess,
    submitCreatePolicy,
    submitEditPolicy,
    errorProcessModal,
    errorPolicyModal,
    submitDeletePolicy
  } = props

  const [showEditProcessModal, setShowEditProcessModal] = React.useState(false)
  const [showCreatePolicyModal, setShowCreatePolicyModal] = React.useState(false)
  const [showAddDocumentModal, setShowAddDocumentModal] = React.useState(false)
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const purposeRef = React.useRef<HTMLInputElement>(null)

  const hasAccess = () => user.canWrite()
  useAwait(user.wait())

  const updatePath = (params: PathParams | null) => {
    let nextPath
    if (!params) nextPath = generatePath(props.match.path)
    else nextPath = generatePath(props.match.path, params)
    props.history.push(nextPath)
  }

  const handleChangePanel = async (processId?: string) => {
    if (!processId)
      updatePath({code: code})
    else {
      updatePath({code: code, processId: processId})
    }
  }

  const renderCreatePolicyButton = () => (
    <Button
      tooltip={intl.addOneInformationType}
      size={ButtonSize.compact}
      kind={KIND.tertiary}
      onClick={() => setShowCreatePolicyModal(true)}
      startEnhancer={() => <Block display='flex' justifyContent='center' marginRight={theme.sizing.scale100}><Plus size={22}/></Block>}
    >
      {intl.informationType}
    </Button>
  )

  const renderAddDocumentButton = () => (
    <Button
      tooltip={intl.addCollectionOfInformationTypes}
      size={ButtonSize.compact}
      kind={KIND.tertiary}
      onClick={() => setShowAddDocumentModal(true)}
      startEnhancer={() => <Block display='flex' justifyContent='center' marginRight={theme.sizing.scale100}><Plus size={22}/></Block>}
    >
      {intl.document}
    </Button>
  )

  useEffect(() => {
    props.match.params.processId && onChangeProcess(props.match.params.processId)
  }, [props.match.params.processId])

  useEffect(() => {
    props.match.params.processId && !isLoading && setTimeout(() => {
      purposeRef.current && window.scrollTo({top: purposeRef.current.offsetTop})
    }, 200)
  }, [isLoading])

  return (
    <Block ref={purposeRef}>
      <Accordion
        onChange={({expanded}) => handleChangePanel(expanded.length ? expanded[0].toString() : undefined)}
        initialState={{expanded: props.match.params.processId ? [props.match.params.processId] : []}}>
        {props.processList &&
        props
        .processList
        .sort((a, b) => a.purposeCode.localeCompare(b.purposeCode))
        .map((p: UseWithPurpose) => (
          <Panel
            title={
              <AccordionTitle process={p} expanded={props.match.params.processId === p.id}
                              hasAccess={hasAccess()} editProcess={() => setShowEditProcessModal(true)}
                              deleteProcess={() => setShowDeleteModal(true)}
              />
            }
            key={p.id}
            overrides={{
              ToggleIcon: {
                component: () => null
              },
              Content: {
                style: {
                  backgroundColor: theme.colors.white,
                  // Outline width
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  paddingLeft: '4px',
                  paddingRight: '4px',
                }
              }
            }}
          >
            {isLoading && <Block padding={theme.sizing.scale400}><StyledSpinnerNext size={theme.sizing.scale1200}/></Block>}

            {!isLoading && currentProcess && (
              <Block $style={{
                outline: `4px ${theme.colors.primary200} solid`
              }}>

                <Block paddingLeft={theme.sizing.scale800} paddingRight={theme.sizing.scale800} paddingTop={theme.sizing.scale800}>
                  <ProcessData process={currentProcess}/>

                  <Block display='flex' justifyContent='flex-end'>
                    <span><i>{intl.formatString(intl.lastModified, currentProcess.changeStamp.lastModifiedBy, lastModifiedDate(currentProcess.changeStamp.lastModifiedDate))}</i></span>
                  </Block>
                  <Block display='flex' paddingTop={theme.sizing.scale800} width='100%' justifyContent='flex-end'>
                    {canViewAlerts() && <Block marginRight='auto'>
                      <Button type='button' kind='tertiary' size='compact' icon={faExclamationCircle}
                              onClick={() => props.history.push(`/alert/events/process/${p.id}`)}>{intl.alerts}</Button>
                    </Block>}
                    {hasAccess() &&
                    <Block>
                      {renderAddDocumentButton()}
                      {renderCreatePolicyButton()}
                    </Block>
                    }
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
        ))}
      </Accordion>
      {!props.processList.length && <Label2 margin='1rem'>{intl.emptyTable} {intl.processes}</Label2>}

      {!!currentProcess &&
      <>
        <ModalProcess
          key={currentProcess.id}
          title={intl.processingActivitiesEdit}
          onClose={() => setShowEditProcessModal(false)}
          isOpen={showEditProcessModal}
          submit={async (values: ProcessFormValues) => {
            await submitEditProcess(values) ? setShowEditProcessModal(false) : setShowEditProcessModal(true)
          }}
          errorOnCreate={errorProcessModal}
          isEdit={true}
          initialValues={convertProcessToFormValues(currentProcess)}
        />
        <ModalPolicy
          title={intl.policyAdd}
          initialValues={{
            legalBasesOpen: false,
            informationType: undefined,
            legalBasesStatus: LegalBasesStatus.INHERITED,
            process: currentProcess,
            purposeCode: currentProcess.purposeCode,
            subjectCategories: [],
            legalBases: [],
            documentIds: [],
          }}
          isEdit={false}
          onClose={() => setShowCreatePolicyModal(false)}
          isOpen={showCreatePolicyModal}
          submit={(values: PolicyFormValues) => {
            submitCreatePolicy(values).then(() => setShowCreatePolicyModal(false)).catch(() => setShowCreatePolicyModal(true))
          }}
          errorOnCreate={errorPolicyModal}
        />

        <AddDocumentModal
          onClose={() => setShowAddDocumentModal(false)}
          isOpen={showAddDocumentModal}
          submit={(formValues) => props.submitAddDocument(formValues).then(() => setShowAddDocumentModal(false))}
          process={currentProcess}
          error={props.errorDocumentModal}
        />

        <Modal
          onClose={() => setShowDeleteModal(false)}
          isOpen={showDeleteModal}
          animate
          size='default'
        >
          <ModalHeader>{intl.confirmDeleteHeader}</ModalHeader>
          <ModalBody>
            <Paragraph2>{intl.deleteProcessText}</Paragraph2>
            {!currentProcess?.policies.length && <Paragraph2>{intl.confirmDeleteProcessText} {currentProcess.name}</Paragraph2>}
            {!!currentProcess?.policies.length &&
            <Paragraph2>{intl.formatString(intl.cannotDeleteProcess, currentProcess?.name, '' + currentProcess?.policies.length)}</Paragraph2>}
          </ModalBody>

          <ModalFooter>
            <Block display='flex' justifyContent='flex-end'>
              <Block alignSelf='flex-end'>{errorProcessModal &&
              <p>{errorProcessModal}</p>}</Block>
              <Button
                kind='secondary'
                onClick={() => setShowDeleteModal(false)}
              >
                {intl.abort}
              </Button>
              <Block display='inline' marginRight={theme.sizing.scale500}/>
              <Button onClick={() =>
                submitDeleteProcess(currentProcess).then(() => setShowDeleteModal(false)).catch(() => setShowDeleteModal(true))
              } disabled={!!currentProcess?.policies.length}>
                {intl.delete}
              </Button>
            </Block>
          </ModalFooter>
        </Modal>
      </>}
    </Block>

  )
}

export default withRouter(AccordionProcess)
