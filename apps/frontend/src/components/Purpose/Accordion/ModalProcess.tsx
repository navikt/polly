import * as React from 'react'
import {KeyboardEvent} from 'react'
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE} from 'baseui/modal'
import {Field, FieldArray, FieldProps, Form, Formik, FormikProps,} from 'formik'
import {Block, BlockProps} from 'baseui/block'
import {Button, KIND, SIZE as ButtonSize} from 'baseui/button'
import {Plus} from 'baseui/icon'
import {Error, ModalLabel} from '../../common/ModalSchema'
import {LegalBasisFormValues, ProcessFormValues, ProcessStatus} from '../../../constants'
import CardLegalBasis from './CardLegalBasis'
import {codelist, SensitivityLevel} from '../../../service/Codelist'
import {intl, theme} from '../../../util'
import {processSchema} from '../../common/schema'
import {Accordion, Panel} from 'baseui/accordion'
import {Label1} from 'baseui/typography'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronDown, faChevronRight} from '@fortawesome/free-solid-svg-icons'
import CustomizedModalBlock from '../../common/CustomizedModalBlock'
import {DateFieldsProcessModal} from '../DateFieldsProcessModal'
import FieldName from '../common/FieldName'
import FieldPurpose from '../common/FieldPurpose'
import FieldDescription from '../common/FieldDescription'
import FieldDepartment from '../common/FieldDepartment'
import FieldSubDepartments from '../common/FieldSubDepartment'
import FieldProductTeam from '../common/FieldProductTeam'
import FieldProduct from '../common/FieldProduct'
import BoolField from '../common/BoolField'
import FieldDataProcessorAgreements from '../common/FieldDataProcessorAgreements'
import RetentionItems from '../common/RetentionItems'
import {ALIGN, Radio, RadioGroup} from 'baseui/radio'
import DpiaItems from '../common/DpiaItems'
import FieldRiskOwner from '../common/FieldRiskOwner'
import FieldInput from '../common/FieldInput'
import FieldCommonExternalProcessResponsible from '../common/FieldCommonExternalProcessResponsible'
import {RadioBoolButton} from '../../common/Radio'
import {env} from '../../../util/env'
import {writeLog} from '../../../api/LogApi'
import {ListLegalBases} from '../../common/LegalBasis'

const modalHeaderProps: BlockProps = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '2rem'
}

const modalBlockProps: BlockProps = {
  width: '960px',
  paddingRight: '2rem',
  paddingLeft: '2rem',
}

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem',
}

type ModalProcessProps = {
  title: string
  isOpen: boolean
  isEdit?: boolean
  initialValues: ProcessFormValues
  errorOnCreate: any | undefined
  submit: (process: ProcessFormValues) => void
  onClose: () => void
}

const panelOverrides = {
  Header: {
    style: {
      paddingLeft: '0'
    }
  },
  Content: {
    style: {
      backgroundColor: theme.colors.white,
    }
  },
  ToggleIcon: {
    component: () => null
  }
}

const AccordionTitle = (props: { title: string, expanded: boolean }) => {
  const {title, expanded} = props
  return <>
    <Block>
      <Label1 color={theme.colors.primary}>
        {expanded ? <FontAwesomeIcon icon={faChevronDown}/> : <FontAwesomeIcon icon={faChevronRight}/>}
        <span> </span>
        <span>{title}</span>
      </Label1>
    </Block>
  </>
}

const ModalProcess = ({submit, errorOnCreate, onClose, isOpen, initialValues, title}: ModalProcessProps) => {

  const [selectedLegalBasis, setSelectedLegalBasis] = React.useState<LegalBasisFormValues>()
  const [selectedLegalBasisIndex, setSelectedLegalBasisIndex] = React.useState<number>()
  const [isPanelExpanded, togglePanel] = React.useReducer(prevState => !prevState, false)
  const [showResponsibleSelect, setShowResponsibleSelect] = React.useState<boolean>(!!initialValues.commonExternalProcessResponsible)
  const [sensitivityLevel, setSensitivityLevel] = React.useState<SensitivityLevel>(SensitivityLevel.ART6)

  const disableEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault()
  }

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      closeable={false}
      animate
      size={SIZE.auto}
      role={ROLE.dialog}
      unstable_ModalBackdropScroll={true}
    >
      <Block {...modalBlockProps}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            values.legalBasesOpen = false
            submit(values)
          }}
          validationSchema={processSchema()}
          render={(formikBag: FormikProps<ProcessFormValues>) => {
            if (formikBag.isValidating && formikBag.isSubmitting && !formikBag.isValid) {
              console.log(formikBag.errors)
              writeLog('warn', 'submit process', JSON.stringify(formikBag.errors))
            }
            return (
              <Form onKeyDown={disableEnter}>
                <ModalHeader>
                  <Block {...modalHeaderProps}>
                    {title}
                  </Block>
                </ModalHeader>

                <ModalBody>
                  <CustomizedModalBlock>
                    <ModalLabel label={intl.name} tooltip={intl.processNameHelpText}/>
                    <FieldName/>
                  </CustomizedModalBlock>
                  <Error fieldName='name'/>

                  <CustomizedModalBlock>
                    <ModalLabel label={intl.overallPurposeActivity} tooltip={intl.overallPurposeHelpText}/>
                    <FieldPurpose
                      purposeCode={initialValues.purposeCode}
                    />
                  </CustomizedModalBlock>
                  <Error fieldName='purposeCode'/>

                  <CustomizedModalBlock>
                    <ModalLabel label={intl.purposeOfTheProcess} tooltip={intl.processPurposeHelpText}/>
                    <FieldDescription/>
                  </CustomizedModalBlock>
                  <Error fieldName='description'/>

                  <CustomizedModalBlock>
                    <ModalLabel label={intl.isProcessImplemented} tooltip={intl.dpiaHelpText}/>
                    <Block>
                      <BoolField value={formikBag.values.dpia?.processImplemented} fieldName='dpia.processImplemented' omitUndefined/>
                    </Block>
                  </CustomizedModalBlock>

                  {!env.disableRiskOwner && <CustomizedModalBlock>
                    <ModalLabel label={intl.riskOwner}/>
                    <FieldRiskOwner riskOwner={formikBag.values.dpia?.riskOwner}/>
                  </CustomizedModalBlock>}

                  {!env.disableRiskOwner && <CustomizedModalBlock>
                    <ModalLabel label={intl.riskOwnerFunction}/>
                    <FieldInput fieldName='dpia.riskOwnerFunction' fieldValue={formikBag.values.dpia?.riskOwnerFunction}/>
                  </CustomizedModalBlock>}

                  <CustomizedModalBlock>
                    <ModalLabel label={intl.validityOfProcess}/>
                    <DateFieldsProcessModal showDates={true} showLabels={true} rowBlockProps={rowBlockProps}/>
                  </CustomizedModalBlock>

                  <CustomizedModalBlock>
                    <ModalLabel label={intl.system} tooltip={intl.systemHelpText}/>
                    <FieldProduct formikBag={formikBag}/>
                  </CustomizedModalBlock>

                  <CustomizedModalBlock>
                    <ModalLabel label={intl.USES_ALL_INFO_TYPE} tooltip={intl.usesAllInformationTypesHelpText}/>
                    <Block>
                      <BoolField value={formikBag.values.usesAllInformationTypes} fieldName='usesAllInformationTypes' omitUndefined
                                 firstButtonLabel={`(${intl.exceptionalUsage})`}/>
                    </Block>
                  </CustomizedModalBlock>

                  <CustomizedModalBlock>
                    <ModalLabel label={intl.processStatus} tooltip={intl.processStatusHelpText}/>
                    <Block {...rowBlockProps}>
                      <Field
                        name='status'
                        render={({form}: FieldProps<ProcessFormValues>) =>
                          <RadioGroup
                            value={formikBag.values.status}
                            align={ALIGN.horizontal}
                            onChange={(e) => form.setFieldValue('status', (e.target as HTMLInputElement).value)}
                          >
                            <Radio value={ProcessStatus.COMPLETED}>{intl.completedProcesses}</Radio>
                            <Radio value={ProcessStatus.IN_PROGRESS}>{intl.inProgress}</Radio>
                          </RadioGroup>
                        }
                      />
                    </Block>
                  </CustomizedModalBlock>

                  <Accordion overrides={{
                    Root: {
                      style: {
                        marginTop: '25px'
                      }
                    }
                  }}>
                    <Panel
                      title={<ModalLabel label={<AccordionTitle title={intl.organizing} expanded={isPanelExpanded}/>}/>}
                      onChange={togglePanel}
                      overrides={{...panelOverrides}}
                    >
                      <Block display='flex' width='100%' justifyContent='space-between'>
                        <Block width='48%'><ModalLabel label={intl.department} tooltip={intl.departmentHelpText}/></Block>
                        {codelist.showSubDepartment(formikBag.values.department) && (
                          <Block width='48%'><ModalLabel label={intl.subDepartment} tooltip={intl.subDepartmentHelpText}/></Block>
                        )}
                      </Block>

                      <Block display='flex' width='100%' justifyContent='space-between'>
                        <Block width='48%'>
                          <FieldDepartment department={formikBag.values.department}/>
                        </Block>
                        {codelist.showSubDepartment(formikBag.values.department) && (
                          <Block width='48%'>
                            <FieldSubDepartments formikBag={formikBag}/>
                          </Block>
                        )}
                      </Block>

                      <Block display='flex' width='100%' justifyContent='space-between' marginTop={theme.sizing.scale400}>
                        <Block width='48%'><ModalLabel label={intl.productTeamFromTK} tooltip={intl.productTeamFromTKHelpText}/></Block>
                        <Block width='48%'>
                          <ModalLabel fullwidth label={intl.commonExternalProcessResponsible} tooltip={intl.commonExternalProcessResponsibleHelpText}/>
                        </Block>
                      </Block>

                      <Block display='flex' width='100%' justifyContent='space-between'>
                        <Block width='48%'>
                          <FieldProductTeam formikBag={formikBag}/>
                        </Block>
                        <Block width='48%'>
                          {showResponsibleSelect && <FieldCommonExternalProcessResponsible thirdParty={formikBag.values.commonExternalProcessResponsible}
                                                                                           hideSelect={() => setShowResponsibleSelect(false)}/>}
                          {!showResponsibleSelect && <RadioBoolButton
                            value={showResponsibleSelect}
                            setValue={(b) => setShowResponsibleSelect(b!)}
                            omitUndefined
                          />}
                        </Block>
                      </Block>
                    </Panel>

                    <Panel
                      title={<AccordionTitle title={intl.legalBasis} expanded={isPanelExpanded}/>}
                      onChange={togglePanel}
                      overrides={{...panelOverrides}}
                    >

                      <FieldArray
                        name='legalBases'
                        render={arrayHelpers => (
                          <>
                            {formikBag.values.legalBasesOpen || formikBag.values.legalBases.length < 1 ? (
                              <CardLegalBasis
                                titleSubmitButton={selectedLegalBasis ? intl.update : intl.add}
                                initValue={selectedLegalBasis || {}}
                                hideCard={() => {
                                  formikBag.setFieldValue('legalBasesOpen', false)
                                  setSelectedLegalBasis(undefined)
                                }}
                                submit={values => {
                                  if (!values) return
                                  if (selectedLegalBasis) {
                                    arrayHelpers.replace(selectedLegalBasisIndex!, values)
                                    setSelectedLegalBasis(undefined)
                                  } else {
                                    arrayHelpers.push(values)
                                  }
                                  formikBag.setFieldValue('legalBasesOpen', false)
                                }}
                                sensitivityLevel={sensitivityLevel}
                              />
                            ) : (
                              <Block display={"flex"} width={"100%"}>
                                <Block width={"100%"}>
                                  <Block>
                                    <Button
                                      size={ButtonSize.compact}
                                      kind={KIND.minimal}
                                      onClick={() => {
                                        formikBag.setFieldValue('legalBasesOpen', true)
                                        setSensitivityLevel(SensitivityLevel.ART6)
                                      }}
                                      startEnhancer={() => <Block display='flex' justifyContent='center'><Plus size={22}/></Block>}
                                    >
                                      {intl.addArticle6}
                                    </Button>
                                  </Block>

                                  <Block>

                                    <ListLegalBases
                                      legalBases={formikBag.values.legalBases.filter(l => codelist.isArt6(l.gdpr))}
                                      onRemove={(index) => arrayHelpers.remove(index)}
                                      onEdit={
                                        (index) => {
                                          setSelectedLegalBasis(formikBag.values.legalBases.filter(l => codelist.isArt6(l.gdpr))[index])
                                          setSelectedLegalBasisIndex(index)
                                          formikBag.setFieldValue('legalBasesOpen', true)
                                        }
                                      }
                                    />
                                  </Block>
                                </Block>

                                <Block width={"100%"}>
                                  <Block>
                                    <Button
                                      size={ButtonSize.compact}
                                      kind={KIND.minimal}
                                      onClick={() => {
                                        formikBag.setFieldValue('legalBasesOpen', true)
                                        setSensitivityLevel(SensitivityLevel.ART9)
                                      }}
                                      startEnhancer={() => <Block display='flex' justifyContent='center'><Plus size={22}/></Block>}
                                    >
                                      {intl.addArticle9}
                                    </Button>
                                  </Block>
                                  <Block>
                                    <ListLegalBases
                                      legalBases={formikBag.values.legalBases.filter(l => codelist.isArt9(l.gdpr))}
                                      onRemove={(index) => {
                                        arrayHelpers.remove(formikBag.values.legalBases.filter(l => codelist.isArt6(l.gdpr)).length + index)
                                      }}
                                      onEdit={
                                        (index) => {
                                          setSelectedLegalBasis(formikBag.values.legalBases.filter(l => codelist.isArt9(l.gdpr))[index])
                                          setSelectedLegalBasisIndex(index)
                                          formikBag.setFieldValue('legalBasesOpen', true)
                                        }
                                      }
                                    />
                                  </Block>
                                </Block>
                              </Block>
                            )}
                          </>
                        )}
                      />
                      <Error fieldName='legalBasesOpen' fullWidth={true}/>
                    </Panel>

                    <Panel
                      title={<AccordionTitle title={intl.automation} expanded={isPanelExpanded}/>}
                      onChange={togglePanel}
                      overrides={{...panelOverrides}}
                    >
                      <Block {...rowBlockProps}>
                        <ModalLabel label={intl.isAutomationNeeded} tooltip={intl.processAutomationHelpText} fullwidth={true}/>
                        <BoolField fieldName='automaticProcessing' value={formikBag.values.automaticProcessing} justifyContent={"flex-end"}/>
                      </Block>
                      <Block {...rowBlockProps}>
                        <ModalLabel label={intl.isProfilingUsed} tooltip={intl.profilingHelpText}/>
                        <BoolField fieldName='profiling' value={formikBag.values.profiling} justifyContent={"flex-end"}/>
                      </Block>
                    </Panel>

                    <Panel
                      title={<AccordionTitle title={intl.dataProcessor} expanded={isPanelExpanded}/>}
                      onChange={togglePanel}
                      overrides={{...panelOverrides}}
                    >
                      <Block {...rowBlockProps} marginTop={0}>
                        <ModalLabel label={intl.isDataProcessorUsed} tooltip={intl.dataProcessorHelpText}/>
                        <BoolField fieldName='dataProcessing.dataProcessor'
                                   value={formikBag.values.dataProcessing.dataProcessor}/>
                      </Block>

                      {formikBag.values.dataProcessing.dataProcessor && <>
                        <Block {...rowBlockProps}>
                          <ModalLabel label={intl.dataProcessorAgreement}/>
                          <FieldDataProcessorAgreements formikBag={formikBag}/>
                        </Block>
                        <Error fieldName='dataProcessing.dataProcessorAgreement'/>

                        <Block {...rowBlockProps}>
                          <ModalLabel label={intl.isDataProcessedOutsideEUEEA} tooltip={intl.isDataProcessedOutsideEUEEAHelpText}/>
                          <BoolField fieldName='dataProcessing.dataProcessorOutsideEU'
                                     value={formikBag.values.dataProcessing.dataProcessorOutsideEU}/>
                        </Block>
                      </>}
                    </Panel>
                    <Panel
                      title={<AccordionTitle title={intl.retention} expanded={isPanelExpanded}/>}
                      onChange={togglePanel}
                      overrides={{...panelOverrides}}
                    >
                      <RetentionItems formikBag={formikBag}/>
                    </Panel>

                    <Panel
                      title={<AccordionTitle title={intl.pvkRequired} expanded={isPanelExpanded}/>}
                      onChange={togglePanel}
                      overrides={{...panelOverrides}}
                    >
                      <DpiaItems formikBag={formikBag}/>
                    </Panel>

                  </Accordion>
                </ModalBody>

                <ModalFooter style={{
                  borderTop: 0
                }}>
                  <Block display='flex' justifyContent='flex-end'>
                    <Block alignSelf='flex-end'>{errorOnCreate && <p>{errorOnCreate}</p>}</Block>
                    <Button type='button' kind={KIND.minimal} onClick={onClose}>{intl.abort}</Button>
                    <ModalButton type='submit'>{intl.save}</ModalButton>
                  </Block>
                </ModalFooter>
              </Form>
            )
          }}
        />

      </Block>
    </Modal>
  )
}

export default ModalProcess
