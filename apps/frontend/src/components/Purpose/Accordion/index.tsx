import * as React from 'react'
import {useEffect} from 'react'
import {Panel, StatelessAccordion} from 'baseui/accordion'
import {RouteComponentProps, withRouter} from 'react-router'
import {KIND, SIZE as ButtonSize} from 'baseui/button'
import {StyledSpinnerNext} from 'baseui/spinner'
import {Block} from 'baseui/block'
import {Label2} from 'baseui/typography'
import {intl, theme} from '../../../util'
import {user} from '../../../service/User'
import {Plus} from 'baseui/icon'
import {AddDocumentToProcessFormValues, LegalBasesUse, Policy, PolicyFormValues, Process, ProcessFormValues, ProcessShort} from '../../../constants'
import ModalProcess from './ModalProcess'
import ModalPolicy from './ModalPolicy'
import TablePolicy from './TablePolicy'
import {convertProcessToFormValues} from '../../../api'
import {PathParams} from '../../../pages/ProcessPage'
import {AddDocumentModal} from './AddDocumentModal'
import Button from '../../common/Button'
import AccordionTitle from './AccordionTitle'
import ProcessData from './ProcessData'
import {lastModifiedDate} from '../../../util/date-formatter'
import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons'
import {canViewAlerts} from '../../../pages/AlertEventPage'
import {DeleteProcessModal} from './DeleteProcessModal'
import {ProcessCreatedModal} from './ProcessCreatedModal'

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
  submitAddDocument: (document: AddDocumentToProcessFormValues) => Promise<boolean>
}

const AccordionProcess = (props: AccordionProcessProps & RouteComponentProps<PathParams>) => {
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
    submitDeletePolicy
  } = props

  const [showEditProcessModal, setShowEditProcessModal] = React.useState(false)
  const [showCreatePolicyModal, setShowCreatePolicyModal] = React.useState(false)
  const [addDefaultDocument, setAddDefaultDocument] = React.useState(false)
  const [showAddDocumentModal, setShowAddDocumentModal] = React.useState(false)
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const purposeRef = React.useRef<HTMLInputElement>(null)

  const hasAccess = () => user.canWrite()

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
    props.match.params.processId && !isLoading && setTimeout(() => {
      purposeRef.current && window.scrollTo({top: purposeRef.current.offsetTop - 40})
    }, 200)
  }, [isLoading])

  return (
    <Block>
      <StatelessAccordion
        onChange={({expanded}) => onChangeProcess(expanded.length ? expanded[0] as string : undefined)}
        expanded={props.match.params.processId ? [props.match.params.processId] : []}
      >
        {props.processList &&
        props
        .processList
        .sort((a, b) => a.purpose.shortName.localeCompare(b.purpose.shortName))
        .map((p: ProcessShort) => {
          const expanded = props.match.params.processId === p.id
          return (
            <Panel
              title={
                <AccordionTitle process={p} expanded={expanded}
                                hasAccess={hasAccess()} editProcess={() => setShowEditProcessModal(true)}
                                deleteProcess={() => setShowDeleteModal(true)}
                                forwardRef={expanded ? purposeRef : undefined}
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
          )
        })}
      </StatelessAccordion>
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
            legalBasesUse: LegalBasesUse.INHERITED_FROM_PROCESS,
            process: currentProcess,
            purposeCode: currentProcess.purpose.code,
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

        <DeleteProcessModal onClose={() => setShowDeleteModal(false)} isOpen={showDeleteModal}
                            errorProcessModal={errorProcessModal} submitDeleteProcess={submitDeleteProcess}
                            process={currentProcess}/>

        <ProcessCreatedModal openAddPolicy={() => setShowCreatePolicyModal(true)}
                             openAddDocument={() => {
                               setAddDefaultDocument(true)
                               setShowAddDocumentModal(true)
                             }}/>
      </>}
    </Block>

  )
}

export default withRouter(AccordionProcess)
