import * as React from 'react'
import {ReactElement, useEffect} from 'react'
import {Accordion, Panel} from 'baseui/accordion'
import {generatePath, RouteComponentProps, withRouter} from 'react-router'
import {Button, KIND, SIZE as ButtonSize} from "baseui/button";
import {StyledSpinnerNext} from 'baseui/spinner';
import {Block} from 'baseui/block';
import {Label1, Label2, Paragraph2} from 'baseui/typography';
import {intl, theme, useAwait} from '../../../util';
import _includes from 'lodash/includes'
import {user} from "../../../service/User";
import {Plus} from 'baseui/icon'
import {
  AddDocumentToProcessFormValues,
  LegalBasesStatus,
  Policy,
  PolicyFormValues,
  Process,
  ProcessFormValues
} from "../../../constants"
import {LegalBasisView} from "../../common/LegalBasis"
import {codelist, ListName} from "../../../service/Codelist"
import ModalProcess from './ModalProcess';
import ModalPolicy from './ModalPolicy'
import TablePolicy from './TablePolicy';
import {convertProcessToFormValues} from "../../../api"
import {PathParams} from "../../../pages/PurposePage"
import {ActiveIndicator} from "../../common/Durations"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faChevronRight, faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'baseui/modal';
import {TeamPopover} from "../../common/Team"
import {PLACEMENT, StatefulTooltip} from "baseui/tooltip";
import {AuditButton} from "../../audit/AuditButton"
import {AddDocumentModal} from "./AddDocumentModal"
import {RetentionView} from "../Retention"
import {boolToText} from "../../common/Radio"

type AccordionProcessProps = {
  isLoading: boolean
  purposeCode: string
  processList: Process[]
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

const AccordionTitle = (props: { process: Process, expanded: boolean, hasAccess: boolean, editProcess: () => void, deleteProcess: () => void }) => {
  const {process, expanded, hasAccess} = props

  const renderEditProcessButton = () => (
    <StatefulTooltip content={intl.edit} placement={PLACEMENT.top}>
      <Button
        size={ButtonSize.compact}
        kind={KIND.secondary}
        onClick={props.editProcess}
        overrides={{
          BaseButton: {
            style: () => {
              return {marginRight: theme.sizing.scale500}
            }
          }
        }}
      >
        <FontAwesomeIcon icon={faEdit} style={{marginRight: ".5rem"}}/>{intl.edit}
      </Button>
    </StatefulTooltip>
  )
  const renderDeleteProcessButton = () => (
    <StatefulTooltip content={intl.delete} placement={PLACEMENT.top}>
      <Button
        size={ButtonSize.compact}
        kind={KIND.secondary}
        onClick={props.deleteProcess}
      >
        <FontAwesomeIcon icon={faTrash} style={{marginRight: ".5rem"}}/>{intl.delete}
      </Button>
    </StatefulTooltip>
  )

  return <>
    <Block>
      <Label1 color={theme.colors.primary}>
        {expanded ?
          <FontAwesomeIcon icon={faChevronDown}/> : <FontAwesomeIcon icon={faChevronRight}/>}
        <span> </span>
        <span>{codelist.getShortname(ListName.PURPOSE, process.purposeCode)}: </span>
        <span>{process.name}</span>
      </Label1>
    </Block>
    <div onClick={(e) => {
      e.stopPropagation()
    }}>
      {hasAccess && expanded && (
        <>
          <AuditButton id={process.id}/>
          {renderEditProcessButton()}
          {renderDeleteProcessButton()}
        </>
      )}
    </div>
  </>
}

type DataTextProps = {
  label: string,
  text?: false | string | string[],
  children?: ReactElement | Array<ReactElement | false>
  hide?: boolean
}

const DataText = (props: DataTextProps) => {
  if (props.hide) return null
  const texts = typeof props.text === "string" ? [props.text] : props.text

  return (
    <Block display="flex" alignContent="flex-start" marginBottom="1rem" width="100%">
      <Block width="30%" paddingRight={theme.sizing.scale400}>
        <Label2>{props.label}</Label2>
      </Block>
      <Block width="70%">
        {texts && texts.map((text, index) =>
          <Paragraph2 marginTop="0" marginBottom="0" key={index}>
            {text}
          </Paragraph2>
        )}
        {props.children &&
        <Block font="ParagraphMedium">
          {props.children}
        </Block>}
      </Block>
    </Block>
  )
}

const ProcessData = (props: { process: Process }) => {
  const {process} = props
  const dataProcessorAgreements = !!process.dataProcessing?.dataProcessorAgreements.length

  const subjectCategories = process.policies.flatMap(p => p.subjectCategories).reduce((acc: string[], curr) => {
    const subjectCategory = codelist.getShortname(ListName.SUBJECT_CATEGORY, curr.code)
    if (!_includes(acc, subjectCategory) && subjectCategory)
      acc = [...acc, subjectCategory]
    return acc
  }, [])

  return (
    <Block>

      <DataText label={intl.processPurpose} text={process.description} hide={!process.description}/>

      <DataText label={intl.legalBasis} text={process.legalBases.length ? undefined : intl.legalBasisNotFound}>
        {process.legalBases.map((legalBasis, index) =>
          <Block key={index}><LegalBasisView legalBasis={legalBasis}/></Block>
        )}
      </DataText>

      <DataText label={intl.subjectCategories} text={subjectCategories.length ? subjectCategories.join(", ") : intl.subjectCategoriesNotFound}/>

      <DataText label={intl.validityOfProcess}>
        <ActiveIndicator alwaysShow={true} showDates={true} {...process} />
      </DataText>

      <DataText label={intl.organizing}>
        {process.department && <Block>
          <span>{intl.department}: </span>
          <span>{codelist.getShortnameForCode(process.department)}</span>
        </Block>}
        {process.subDepartment && <Block>
          <span>{intl.subDepartment}: </span>
          <span>{codelist.getShortnameForCode(process.subDepartment)}</span>
        </Block>}
        {!!process.productTeam && <Block>
          <span>{intl.productTeam}: </span>
          <TeamPopover teamId={process.productTeam}/>
        </Block>}
      </DataText>

      <DataText label={intl.system}
                text={process.products.map(product => codelist.getShortname(ListName.SYSTEM, product.code)).join(", ")}
                hide={!process.products?.length}/>

      <DataText label={intl.automation}>
        <Block>
          <span>{intl.automaticProcessing}: </span>
          <span>{boolToText(process.automaticProcessing)}</span>
        </Block>
        <Block>
          <span>{intl.profiling}: </span>
          <span>{boolToText(process.profiling)}</span>
        </Block>
      </DataText>

      <DataText label={intl.dataProcessor}>
        <>
          {process.dataProcessing?.dataProcessor === null && intl.dataProcessorUnclarified}
          {process.dataProcessing?.dataProcessor === false && intl.dataProcessorNo}
        </>
        <>
          {process.dataProcessing?.dataProcessor &&
          <Block>
            <Block>
              <span>{intl.dataProcessorYes}</span>
            </Block>
            <Block>
              <span>{dataProcessorAgreements && `${intl.dataProcessorAgreement}: `}</span>
              <span>{dataProcessorAgreements && process.dataProcessing?.dataProcessorAgreements.join(", ")}</span>
            </Block>
            <Block>
              <span>{intl.dataProcessorOutsideEUExtra}: </span>
              <span>{boolToText(process.dataProcessing?.dataProcessorOutsideEU)}</span>
            </Block>
          </Block>}
        </>
      </DataText>

      <DataText label={intl.retention}>
        <>
          {process.retention?.retentionPlan === null && intl.retentionPlanUnclarified}
          {process.retention?.retentionPlan === false && intl.retentionPlanNo}
        </>
        <>
          {process.retention?.retentionPlan &&
          <Block>
            <Block>
              <span>{intl.retentionPlanYes}</span>
            </Block>
            <Block>
              <RetentionView retention={process.retention}/>
            </Block>
            <Block>
              <span>{process.retention?.retentionDescription && `${intl.retentionDescription}: `}</span>
              <span>{process.retention?.retentionDescription}</span>
            </Block>
          </Block>
          }
        </>
      </DataText>

    </Block>
  )
}

const AccordionProcess = (props: AccordionProcessProps & RouteComponentProps<PathParams>) => {
  const [showEditProcessModal, setShowEditProcessModal] = React.useState(false)
  const [showCreatePolicyModal, setShowCreatePolicyModal] = React.useState(false)
  const [showAddDocumentModal, setShowAddDocumentModal] = React.useState(false)
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const purposeRef = React.useRef<HTMLInputElement>(null);

  const {
    isLoading,
    purposeCode,
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

  const updatePath = (params: PathParams | null) => {
    let nextPath
    if (!params) nextPath = generatePath(props.match.path)
    else nextPath = generatePath(props.match.path, params)
    props.history.push(nextPath)
  }

  const handleChangePanel = async (processId?: string) => {
    if (!processId)
      updatePath({purposeCode: purposeCode})
    else {
      updatePath({purposeCode: purposeCode, processId: processId})
    }
  }

  const renderCreatePolicyButton = () => (
    <StatefulTooltip content={intl.addOneInformationType} placement={PLACEMENT.top}>
      <Button
        size={ButtonSize.compact}
        kind={KIND.tertiary}
        onClick={() => setShowCreatePolicyModal(true)}
        startEnhancer={() => <Block display="flex" justifyContent="center"><Plus size={22}/></Block>}
        overrides={{StartEnhancer: {style: {marginRight: theme.sizing.scale100}}}}
      >
        {intl.informationType}
      </Button>
    </StatefulTooltip>
  )

  const renderAddDocumentButton = () => (
    <StatefulTooltip content={intl.addCollectionOfInformationTypes} placement={PLACEMENT.top}>
      <Button
        size={ButtonSize.compact}
        kind={KIND.tertiary}
        onClick={() => setShowAddDocumentModal(true)}
        startEnhancer={() => <Block display="flex" justifyContent="center"><Plus size={22}/></Block>}
        overrides={{StartEnhancer: {style: {marginRight: theme.sizing.scale100}}}}
      >
        {intl.document}
      </Button>
    </StatefulTooltip>
  )

  const hasAccess = () => user.canWrite()
  useAwait(user.wait())

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
        {props.processList && props.processList.map((p: Process) => (
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
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  paddingLeft: "4px",
                  paddingRight: "4px",
                }
              }
            }}
          >
            {isLoading && <Block padding={theme.sizing.scale400}><StyledSpinnerNext size={theme.sizing.scale1200}/></Block>}

            {!isLoading && currentProcess && (
              <Block $style={{
                outline: `4px ${theme.colors.primary200} solid`
              }}>

                <Block padding={theme.sizing.scale800}>
                  <ProcessData process={currentProcess}/>
                </Block>

                <Block backgroundColor={theme.colors.primary50}>
                  <Block {...({
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingLeft: theme.sizing.scale800,
                    paddingRight: theme.sizing.scale800
                  })}>
                    <Label2 alignSelf="center">{intl.informationTypes}</Label2>
                    {hasAccess() && (
                      <Block alignSelf="flex-end">
                        {renderAddDocumentButton()}
                        {renderCreatePolicyButton()}
                      </Block>
                    )}
                  </Block>
                  <Block padding={theme.sizing.scale800}>
                    <TablePolicy
                      process={currentProcess}
                      hasAccess={hasAccess()}
                      errorPolicyModal={errorPolicyModal}
                      errorDeleteModal={errorPolicyModal}
                      submitEditPolicy={submitEditPolicy}
                      submitDeletePolicy={submitDeletePolicy}
                    />
                  </Block>
                </Block>

              </Block>
            )}
          </Panel>
        ))}
      </Accordion>
      {!props.processList.length && <Label2 margin="1rem">{intl.emptyTable} {intl.processes}</Label2>}

      {!!currentProcess &&
      <>
        <ModalProcess
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
          title={intl.policyNew}
          initialValues={{
            legalBasesOpen: false,
            informationType: undefined,
            legalBasesStatus: LegalBasesStatus.INHERITED,
            process: currentProcess,
            purposeCode: currentProcess.purposeCode,
            subjectCategories: [],
            start: undefined,
            end: undefined,
            legalBases: [],
            documentIds: []
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
          size="default"
        >
          <ModalHeader>{intl.confirmDeleteHeader}</ModalHeader>
          <ModalBody>
            {!currentProcess?.policies.length && <Paragraph2>{intl.confirmDeleteProcessText} {currentProcess.name}</Paragraph2>}
            {!!currentProcess?.policies.length &&
            <Paragraph2>{intl.formatString(intl.cannotDeleteProcess, currentProcess?.name, '' + currentProcess?.policies.length)}</Paragraph2>}
          </ModalBody>

          <ModalFooter>
            <Block display="flex" justifyContent="flex-end">
              <Block alignSelf="flex-end">{errorProcessModal &&
              <p>{errorProcessModal}</p>}</Block>
              <Button
                kind="secondary"
                onClick={() => setShowDeleteModal(false)}
                overrides={{
                  BaseButton: {
                    style: {
                      marginRight: '1rem',
                      marginLeft: '1rem'
                    }
                  }
                }}
              >
                {intl.abort}
              </Button>
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
