import * as React from 'react'
import {KeyboardEvent} from 'react'
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE} from 'baseui/modal'
import {FieldArray, Form, Formik, FormikProps,} from 'formik'
import {Block, BlockProps} from 'baseui/block'
import {Button, KIND, SIZE as ButtonSize} from 'baseui/button'
import {Plus} from 'baseui/icon'
import {Error, ModalLabel} from '../../common/ModalSchema'
import {LegalBasisFormValues, ProcessFormValues} from '../../../constants'
import CardLegalBasis from './CardLegalBasis'
import {codelist, ListName} from '../../../service/Codelist'
import {intl, theme} from '../../../util'
import {ListLegalBases} from '../../common/LegalBasis'
import {processSchema} from '../../common/schema'
import {Accordion, Panel} from 'baseui/accordion'
import {Label1} from 'baseui/typography'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronDown, faChevronRight} from '@fortawesome/free-solid-svg-icons'
import CustomizedModalBlock from '../../common/CustomizedModalBlock'
import {DateFieldsProcessModal} from "../DateFieldsProcessModal"
import FieldName from "../common/FieldName";
import FieldPurpose from "../common/FieldPurpose";
import FieldDescription from "../common/FieldDescription";
import FieldDepartment from "../common/FieldDepartment";
import FieldSubDepartment from "../common/FieldSubDepartment";
import FieldProductTeam from "../common/FieldProductTeam";
import FieldProduct from "../common/FieldProduct";
import BoolField from "../common/BoolField";
import FieldDataProcessorAgreements from "../common/FieldDataProcessorAgreements";
import RetentionItems from "../common/RetentionItems";

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
    >
      <Block {...modalBlockProps}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            submit(values)
          }}
          validationSchema={processSchema()}
          render={(formikBag: FormikProps<ProcessFormValues>) => (
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
                  <ModalLabel label={intl.overallPurpose} tooltip={intl.overallPurposeHelpText}/>
                  <FieldPurpose
                    purposeCode={initialValues.purposeCode}
                    disabled={codelist.getCodes(ListName.PURPOSE).filter(p => p.code === initialValues.purposeCode).length > 0}
                  />
                </CustomizedModalBlock>
                <Error fieldName='purposeCode'/>

                <CustomizedModalBlock>
                  <ModalLabel label={intl.purposeOfTheProcess} tooltip={intl.processPurposeHelpText}/>
                  <FieldDescription/>
                </CustomizedModalBlock>
                <Error fieldName='description'/>

                <CustomizedModalBlock>
                  <ModalLabel label={intl.validityOfProcess} tooltip={intl.validityOfProcessHelpText}/>
                  <DateFieldsProcessModal showDates={true} showLabels={true} rowBlockProps={rowBlockProps}/>
                </CustomizedModalBlock>

                <CustomizedModalBlock>
                  <ModalLabel label={intl.organizing} tooltip={intl.organizingHelpText}/>

                  <Block maxWidth={"672px"} width={"100%"}>
                    <Block display={"flex"} width={"100%"}>
                      <Block minWidth={"33%"} width={"100%"} marginLeft={".5rem"}>{intl.department}</Block>
                      {codelist.showSubDepartment(formikBag.values.department) && (
                        <Block minWidth={"33%"} width={"100%"}>
                          {intl.subDepartment}
                        </Block>
                      )}

                      <Block minWidth={"33%"} width={"100%"}>{intl.productTeam}</Block>
                    </Block>
                    <Block display={"flex"} width={"100%"}>
                      <Block minWidth={"33%"} width={"100%"} marginRight={".5rem"}>
                        <Block {...rowBlockProps}>
                          <FieldDepartment department={formikBag.values.department}/>
                        </Block>
                      </Block>
                      {codelist.showSubDepartment(formikBag.values.department) && (
                        <Block minWidth={"33%"} width={"100%"} marginRight={".5rem"}>
                          <Block {...rowBlockProps}>
                            <FieldSubDepartment subDepartment={formikBag.values.subDepartment}/>
                          </Block>
                        </Block>
                      )}
                      <Block minWidth={"33%"} width={"100%"}>
                        <Block {...rowBlockProps}>
                          <FieldProductTeam productTeam={formikBag.values.productTeam}/>
                        </Block>
                      </Block>
                    </Block>
                  </Block>
                </CustomizedModalBlock>

                <CustomizedModalBlock>
                  <ModalLabel label={intl.system} tooltip={intl.systemHelpText}/>
                  <FieldProduct products={formikBag.values.products}/>
                </CustomizedModalBlock>

                <CustomizedModalBlock>
                  <ModalLabel label={intl.usesAllInformationTypes} tooltip={intl.usesAllInformationTypesHelpText}/>
                  <Block>
                    <BoolField value={formikBag.values.usesAllInformationTypes} fieldName='usesAllInformationTypes' omitUndefined firstButtonLabel={`(${intl.exceptionalUsage})`}/>
                  </Block>
                </CustomizedModalBlock>

                <Accordion overrides={{
                  Root: {
                    style: {
                      marginTop: "25px"
                    }
                  }
                }}>
                  <Panel
                    title={<AccordionTitle title={intl.legalBasis} expanded={isPanelExpanded}/>}
                    onChange={togglePanel}
                    overrides={{...panelOverrides}}
                  >
                    <Block {...rowBlockProps}>
                      <ModalLabel/>
                      {!formikBag.values.legalBasesOpen && (
                        <Block width='100%' marginBottom='1rem'>
                          <Button
                            size={ButtonSize.compact}
                            kind={KIND.minimal}
                            onClick={() => formikBag.setFieldValue('legalBasesOpen', true)}
                            startEnhancer={() => <Block display='flex' justifyContent='center'><Plus size={22}/></Block>}
                          >
                            {intl.legalBasisAdd}
                          </Button>
                        </Block>
                      )}
                    </Block>

                    <FieldArray
                      name='legalBases'
                      render={arrayHelpers => (
                        <React.Fragment>
                          {formikBag.values.legalBasesOpen ? (
                            <Block width='100%' marginTop='2rem'>
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
                                }}/>
                            </Block>
                          ) : (
                            <Block display='flex'>
                              <ModalLabel/>
                              <Block width='100%'>
                                <ListLegalBases
                                  legalBases={formikBag.values.legalBases}
                                  onRemove={(index) => arrayHelpers.remove(index)}
                                  onEdit={
                                    (index) => {
                                      setSelectedLegalBasis(formikBag.values.legalBases[index])
                                      setSelectedLegalBasisIndex(index)
                                      formikBag.setFieldValue('legalBasesOpen', true)
                                    }
                                  }
                                />
                              </Block>
                            </Block>
                          )}
                        </React.Fragment>
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
                      <ModalLabel/>
                      <ModalLabel label={intl.automaticProcessing} tooltip={intl.processAutomationHelpText}/>
                      <BoolField fieldName='automaticProcessing' value={formikBag.values.automaticProcessing}/>
                    </Block>
                    <Block {...rowBlockProps}>
                      <ModalLabel/>
                      <ModalLabel label={intl.profiling} tooltip={intl.profilingHelpText}/>
                      <BoolField fieldName='profiling' value={formikBag.values.profiling}/>
                    </Block>
                  </Panel>

                  <Panel
                    title={<AccordionTitle title={intl.dataProcessor} expanded={isPanelExpanded}/>}
                    onChange={togglePanel}
                    overrides={{...panelOverrides}}
                  >
                    <Block {...rowBlockProps} marginTop={0}>
                      <ModalLabel/>
                      <ModalLabel label={intl.dataProcessor}/>
                      <BoolField fieldName='dataProcessing.dataProcessor'
                                 value={formikBag.values.dataProcessing.dataProcessor}/>
                    </Block>

                    {formikBag.values.dataProcessing.dataProcessor && <>
                      <Block {...rowBlockProps}>
                        <ModalLabel/>
                        <ModalLabel label={intl.dataProcessorAgreement}/>
                        <FieldDataProcessorAgreements formikBag={formikBag}/>
                      </Block>
                      <Error fieldName='dataProcessing.dataProcessorAgreement'/>

                      <Block {...rowBlockProps}>
                        <ModalLabel/>
                        <ModalLabel label={intl.dataProcessorOutsideEU} tooltip={intl.dataProcessorOutsideEUExtra}/>
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
          )}
        />

      </Block>
    </Modal>
  )
}

export default ModalProcess
