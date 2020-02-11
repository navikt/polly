import * as React from 'react'
import { useEffect } from 'react'
import { Accordion, Panel, SharedProps } from 'baseui/accordion'
import { generatePath, RouteComponentProps, withRouter } from 'react-router'
import { Button, KIND, SIZE as ButtonSize } from "baseui/button";
import { Spinner } from 'baseui/spinner';
import { Block, BlockProps } from 'baseui/block';
import { Label2, Paragraph2, Paragraph3 } from 'baseui/typography';
import { intl, theme, useAwait } from '../../../util';
import _includes from 'lodash/includes'
import { user } from "../../../service/User";
import { Plus } from 'baseui/icon'
import { AddDocumentToProcessFormValues, LegalBasesStatus, LegalBasis, Policy, PolicyFormValues, Process, ProcessFormValues } from "../../../constants"
import { LegalBasisView } from "../../common/LegalBasis"
import { codelist, ListName } from "../../../service/Codelist"
import ModalProcess from './ModalProcess';
import ModalPolicy from './ModalPolicy'
import TablePolicy from './TablePolicy';
import { convertProcessToFormValues } from "../../../api"
import { PathParams } from "../../../pages/PurposePage"
import { ActiveIndicator } from "../../common/Durations"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal';
import { TeamPopover } from "../../common/Team"
import { PLACEMENT, StatefulTooltip } from "baseui/tooltip";
import { AuditButton } from "../../audit/AuditButton"
import { AddDocumentModal } from "./AddDocumentModal"
import { RetentionView } from "../Retention"
import { boolToText } from "../../common/Radio"

const rowPanelContent: BlockProps = {
  display: 'flex',
  marginBottom: '1rem',
  justifyContent: 'space-between'
}

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

  const renderActiveForProcess = (process: Process) =>
    <Block>
      <Label2>{intl.validityOfProcess}</Label2>
      <ActiveIndicator alwaysShow={true} showDates={true} {...process} />
    </Block>

  const renderLegalBasisListForProcess = (list: LegalBasis[]) => (
    <Block marginRight="scale1200">
      <Label2>{intl.legalBasis}</Label2>
      {list && list.length < 1 && <Paragraph2>{intl.legalBasisNotFound}</Paragraph2>}
      {list && list.length > 0 && (
        <ul style={{listStyle: "none", paddingInlineStart: 0}}>
          {list.map((legalBasis, i) => <li key={i}><Paragraph2><LegalBasisView
            legalBasis={legalBasis}/></Paragraph2></li>)}
        </ul>
      )}
    </Block>
  )
  const renderSubjectCategoriesForProcess = (processObj: Process) => {
    const notFound = (<Paragraph2>{intl.subjectCategoriesNotFound}</Paragraph2>)
    let display
    if (!processObj) display = notFound
    else if (!processObj.policies) {
      display = notFound
    } else {
      if (processObj.policies.length < 1) display = notFound
      else {
        const subjectCategories = processObj.policies.flatMap(p => p.subjectCategories).reduce((acc: string[], curr) => {
          const subjectCategory = codelist.getShortname(ListName.SUBJECT_CATEGORY, curr.code)
          if (!_includes(acc, subjectCategory) && subjectCategory)
            acc = [...acc, subjectCategory]
          return acc
        }, [])
        if (subjectCategories.length < 1) display = notFound
        else display = <Paragraph2>{subjectCategories.join(', ')}</Paragraph2>
      }
    }

    return (
      <Block marginRight="scale1200">
        <Label2>{intl.subjectCategories}</Label2>
        {display}
      </Block>
    )
  }
  const renderEditProcessButton = () => (
    <StatefulTooltip content={intl.edit} placement={PLACEMENT.top}>
      <Button
        size={ButtonSize.compact}
        kind={KIND.secondary}
        onClick={() => setShowEditProcessModal(true)}
        overrides={{
          BaseButton: {
            style: () => {
              return {marginRight: theme.sizing.scale500}
            }
          }
        }}
      >
        <FontAwesomeIcon icon={faEdit}/>
      </Button>
    </StatefulTooltip>
  )
  const renderDeleteProcessButton = () => (
    <StatefulTooltip content={intl.delete} placement={PLACEMENT.top}>
      <Button
        size={ButtonSize.compact}
        kind={KIND.secondary}
        onClick={() => setShowDeleteModal(true)}
      >
        <FontAwesomeIcon icon={faTrash}/>
      </Button>
    </StatefulTooltip>
  )

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

  const dataProcessorAgreements = !!currentProcess?.dataProcessing?.dataProcessorAgreements.length
  return (
    <Block ref={purposeRef}>
      <Accordion
        onChange={({expanded}) => handleChangePanel(expanded.length ? expanded[0].toString() : undefined)}
        initialState={{expanded: props.match.params.processId ? [props.match.params.processId] : []}}>
        {props.processList && props.processList.map((p: Process) => (
          <Panel
            title={p.name}
            key={p.id}
            overrides={{
              ToggleIcon: {
                component: (iconProps: SharedProps) => !!iconProps.$expanded ?
                  <FontAwesomeIcon icon={faChevronDown}/> : <FontAwesomeIcon icon={faChevronRight}/>
              }
            }}
          >
            {isLoading && <Spinner size={18}/>}

            {!isLoading && currentProcess && (
              <React.Fragment>

                <Block {...rowPanelContent}>
                  <Block width="90%" marginRight=".5rem">

                    <Block flexWrap={true} display="flex" justifyContent="flex-start">
                      {currentProcess.description && <Block marginBottom=".5rem" width="100%">
                        <Label2>{intl.processPurpose}</Label2>
                        <Paragraph2>{currentProcess.description}</Paragraph2>
                      </Block>}
                    </Block>
                  </Block>

                  <Block width="10%" minWidth="150px">
                    {hasAccess() && (
                      <>
                        <AuditButton id={p.id}/>
                        {renderEditProcessButton()}
                        {renderDeleteProcessButton()}
                      </>
                    )}
                  </Block>
                </Block>

                <Block {...rowPanelContent}>
                  <Block width="100%" flexWrap display="flex">

                    <Block width="33%">{renderLegalBasisListForProcess(currentProcess.legalBases)}</Block>
                    <Block width="33%">{renderSubjectCategoriesForProcess(currentProcess)}</Block>
                    <Block width="33%">{renderActiveForProcess(currentProcess)}</Block>

                    <Block width="33%">
                      <Label2>{intl.organizing}</Label2>
                      <Block>
                        {currentProcess.department &&
                        <Paragraph3 marginBottom="0">
                          <span>{intl.department}: </span>
                          <span>{codelist.getShortnameForCode(currentProcess.department)}</span>
                        </Paragraph3>}
                        {currentProcess.subDepartment &&
                        <Paragraph3 marginBottom="0" marginTop="0">
                          <span>{intl.subDepartment}: </span>
                          <span>{codelist.getShortnameForCode(currentProcess.subDepartment)}</span>
                        </Paragraph3>}
                        {currentProcess.productTeam &&
                        <Paragraph3 marginTop="0">
                          <span>{intl.productTeam}: </span>
                          <TeamPopover teamId={currentProcess.productTeam}/>
                        </Paragraph3>}
                      </Block>
                    </Block>

                    {!!currentProcess?.products?.length && <Block width="33%">
                      <Label2>{intl.product}</Label2>
                      <Paragraph3>{currentProcess.products.map(product => codelist.getShortname(ListName.SYSTEM, product.code)).join(", ")}</Paragraph3>
                    </Block>}

                    <Block width="33%">
                      <Label2>{intl.automaticProcessing}</Label2>
                      <Block>
                        <Paragraph3 marginBottom="0">
                          <span>{intl.automaticProcessing}: </span>
                          <span>{boolToText(currentProcess?.automaticProcessing)}</span>
                        </Paragraph3>
                        <Paragraph3 marginTop="0">
                          <span>{intl.profiling}: </span>
                          <span>{boolToText(currentProcess?.profiling)}</span>
                        </Paragraph3>
                      </Block>
                    </Block>

                    <Block width="33%">
                      <Label2>{intl.dataProcessor}</Label2>
                      <Block>
                        {currentProcess?.dataProcessing?.dataProcessor === null && intl.dataProcessorUnclarified}
                        {currentProcess?.dataProcessing?.dataProcessor === false && intl.dataProcessorNo}
                        {currentProcess?.dataProcessing?.dataProcessor &&
                        <>
                          <Paragraph3 marginBottom="0">
                            <span>{intl.dataProcessorYes}</span>
                          </Paragraph3>
                          <Paragraph3 marginBottom="0" marginTop="0">
                            <span>{dataProcessorAgreements && `${intl.dataProcessorAgreement}: `}</span>
                            <span>{dataProcessorAgreements && currentProcess?.dataProcessing?.dataProcessorAgreements.join(", ")}</span>
                          </Paragraph3>
                          <Paragraph3 marginTop="0">
                            <span>{intl.dataProcessorOutsideEUExtra}: </span>
                            <span>{boolToText(currentProcess?.dataProcessing?.dataProcessorOutsideEU)}</span>
                          </Paragraph3>
                        </>}
                      </Block>
                    </Block>

                    <Block width="33%">
                      <Label2>{intl.retention}</Label2>
                      <Block>
                        {currentProcess?.retention?.retentionPlan === null && intl.retentionPlanUnclarified}
                        {currentProcess?.retention?.retentionPlan === false && intl.retentionPlanNo}
                        {currentProcess?.retention?.retentionPlan &&
                        <>
                          <Paragraph3 marginBottom="0">
                            <span>{intl.retentionPlanYes}</span>
                          </Paragraph3>
                          <Paragraph3 marginBottom="0" marginTop="0">
                            <RetentionView retention={currentProcess?.retention}/>
                          </Paragraph3>
                          <Paragraph3 marginTop="0">
                            <span>{currentProcess?.retention?.retentionDescription && `${intl.description}: `}</span>
                            <span>{currentProcess?.retention?.retentionDescription}</span>
                          </Paragraph3>
                        </>
                        }
                      </Block>
                    </Block>
                  </Block>
                </Block>

                <Block {...rowPanelContent}>
                  <Label2 alignSelf="center">{intl.informationTypes}</Label2>
                  {hasAccess() && (
                    <Block alignSelf="flex-end">
                      {renderAddDocumentButton()}
                      {renderCreatePolicyButton()}
                    </Block>
                  )}
                </Block>
                {currentProcess.policies && (
                  <Block>
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
              </React.Fragment>
            )}
          </Panel>
        ))}
      </Accordion>
      {!props.processList.length && <Label2 margin="1rem">{intl.emptyTable} {intl.processes}</Label2>}

    </Block>

  )
}

export default withRouter(AccordionProcess)
