import * as React from 'react'
import {KeyboardEvent, useEffect, useState} from 'react'
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE} from 'baseui/modal'
import {Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikProps,} from 'formik'
import {Block, BlockProps} from 'baseui/block'
import {Input, SIZE as InputSIZE} from 'baseui/input'
import {Select, Value} from 'baseui/select'
import {Button, KIND, SHAPE, SIZE as ButtonSize} from 'baseui/button'
import {Plus} from 'baseui/icon'
import {Error, ModalLabel} from '../../common/ModalSchema'
import {DisclosureFormValues, LegalBasisFormValues, ProcessFormValues} from '../../../constants'
import CardLegalBasis from './CardLegalBasis'
import {codelist, ListName} from '../../../service/Codelist'
import {intl, theme} from '../../../util'
import {ListLegalBases} from '../../common/LegalBasis'
import {processSchema} from '../../common/schema'
import {getTeam, mapTeamToOption, useTeamSearch} from '../../../api'
import {Textarea} from 'baseui/textarea'
import {renderTagList} from '../../common/TagList'
import {Slider} from 'baseui/slider'
import {RadioBoolButton} from '../../common/Radio'
import {Accordion, Panel} from 'baseui/accordion'
import {Label1} from 'baseui/typography'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronDown, faChevronRight} from '@fortawesome/free-solid-svg-icons'
import CustomizedModalBlock from '../../common/CustomizedModalBlock'
import {DateFieldsProcessModal} from "../DateFieldsProcessModal";

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

const modalHeaderProps: BlockProps = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '2rem'
}

const FieldName = () => (
  <Field
    name='name'
    render={({field, form}: FieldProps<string, ProcessFormValues>) => (
      <Input {...field} type='input' size={InputSIZE.default} autoFocus
             error={!!form.errors.name && form.touched.name}/>
    )}
  />
)

const FieldPurpose = (props: { purposeCode?: string, disabled?: boolean }) => {
  const {purposeCode, disabled} = props
  const [value, setValue] = React.useState<Value>(purposeCode ? [{
    id: disabled ? purposeCode : "",
    label: disabled ? codelist.getShortname(ListName.PURPOSE, purposeCode) : ""
  }] : [])

  return (
    <Field
      name='purposeCode'
      render={({form}: FieldProps<ProcessFormValues>) => (
        <Block marginRight='10px' width={'100%'}>
          <Select
            options={codelist.getParsedOptions(ListName.PURPOSE)}
            onChange={({value}) => {
              setValue(value)
              form.setFieldValue('purposeCode', value.length > 0 ? value[0].id : '')
            }}
            disabled={disabled}
            value={value}
            error={!!(form.errors.purposeCode && form.touched.purposeCode)}
          />
        </Block>
      )}
    />
  )
}

const FieldDescription = () => (
  <Field
    name='description'
    render={({field, form}: FieldProps<string, ProcessFormValues>) => (
      <Textarea {...field} type='input' size={InputSIZE.default}
                error={!!form.errors.description && form.touched.description}/>
    )}
  />
)

const FieldDepartment = (props: { department?: string }) => {
  const {department} = props
  const [value, setValue] = React.useState<Value>(department ? [{
    id: department,
    label: codelist.getShortname(ListName.DEPARTMENT, department)
  }] : [])

  return (
    <Field
      name='department'
      render={({form}: FieldProps<ProcessFormValues>) => (
        <Block marginRight='10px' width={'100%'}>
          <Select
            options={codelist.getParsedOptions(ListName.DEPARTMENT)}
            onChange={({value}) => {
              setValue(value)
              form.setFieldValue('department', value.length > 0 ? value[0].id : '')
            }}
            value={value}
          />
        </Block>
      )}
    />
  )
}

const FieldSubDepartment = (props: { subDepartment?: string }) => {
  const {subDepartment} = props
  const [value, setValue] = React.useState<Value>(subDepartment
    ? [{id: subDepartment, label: codelist.getShortname(ListName.SUB_DEPARTMENT, subDepartment)}]
    : [])

  return (
    <Field
      name='subDepartment'
      render={({form}: FieldProps<ProcessFormValues>) => (
        <Block marginRight='10px' width={'100%'}>
          <Select
            options={codelist.getParsedOptions(ListName.SUB_DEPARTMENT)}
            onChange={({value}) => {
              setValue(value)
              form.setFieldValue('subDepartment', value.length > 0 ? value[0].id : '')
            }}
            value={value}
          />
        </Block>
      )}
    />
  )

}

const BoolField = (props: { value?: boolean, fieldName: string, omitUndefined?: boolean }) => (
  <Field
    name={props.fieldName}
    render={({form}: FieldProps<ProcessFormValues>) =>
      <RadioBoolButton value={props.value} setValue={(b) => form.setFieldValue(props.fieldName, b)}
                       omitUndefined={props.omitUndefined}/>}
  />
)

const FieldDataProcessorAgreements = (props: { formikBag: FormikProps<ProcessFormValues> }) => {
  const [currentKeywordValue, setCurrentKeywordValue] = React.useState('')
  const agreementRef = React.useRef<HTMLInputElement>(null)

  const onAddAgreement = (arrayHelpers: FieldArrayRenderProps) => {
    if (!currentKeywordValue) return
    arrayHelpers.push(currentKeywordValue)
    setCurrentKeywordValue('')
    if (agreementRef && agreementRef.current) {
      agreementRef.current.focus()
    }
  }

  return (
    <FieldArray
      name='dataProcessing.dataProcessorAgreements'
      render={arrayHelpers => (
        <Block width='100%'>
          <Input
            type='text'
            size='compact'
            placeholder={intl.dataProcessorAgreement}
            value={currentKeywordValue}
            onChange={event => setCurrentKeywordValue(event.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onAddAgreement(arrayHelpers)
            }}
            onBlur={() => onAddAgreement(arrayHelpers)}
            inputRef={agreementRef}
            overrides={{
              After: () => (
                <Button
                  type='button'
                  size='compact'
                  shape={SHAPE.square}
                >
                  <Plus/>
                </Button>
              )
            }}
          />
          {renderTagList(props.formikBag.values.dataProcessing.dataProcessorAgreements, arrayHelpers)}
        </Block>
      )}
    />
  )
}

const FieldProductTeam = (props: { productTeam?: string }) => {
  const {productTeam} = props
  const [value, setValue] = React.useState<Value>(productTeam ? [{id: productTeam, label: productTeam}] : [])
  const [teamSearchResult, setTeamSearch, teamSearchLoading] = useTeamSearch()

  const initialValueTeam = async () => {
    if (!productTeam) return []
    return [mapTeamToOption(await getTeam(productTeam))]
  }
  useEffect(() => {
    (async () => setValue(await initialValueTeam()))()
  }, [productTeam])

  return (
    <Field
      name='productTeam'
      render={({form, field}: FieldProps<ProcessFormValues>) => (
        <Block width={'100%'}>
          <Select
            options={teamSearchResult}
            onChange={({value}) => {
              setValue(value)
              form.setFieldValue('productTeam', value && value.length > 0 ? value[0].id : '')
            }}
            onInputChange={event => setTeamSearch(event.currentTarget.value)}
            value={value}
            isLoading={teamSearchLoading}
          />
        </Block>
      )}
    />
  )
}

const FieldProduct = (props: { products: string[] }) => {
  const {products} = props
  const [value, setValue] = React.useState<Value>(products ? products.map(product => ({
    id: product,
    label: codelist.getShortname(ListName.SYSTEM, product)
  })) : [])

  return <FieldArray
    name='products'
    render={arrayHelpers => <Select
      multi
      clearable
      options={codelist.getParsedOptions(ListName.SYSTEM)}
      onChange={({value}) => {
        setValue(value)
        arrayHelpers.form.setFieldValue('products', value.map(v => v.id))
      }}
      value={value}
    />}
  />
}

const FieldInput = (props: { fieldName: string, fieldValue?: string | number }) => {
  return (
    <Field
      name={props.fieldName}
      render={({field, form}: FieldProps<string, DisclosureFormValues>) => (
        <Input {...field} size='compact'/>
      )}
    />
  )
}

function sliderOverride(suffix: string) {
  return {
    ThumbValue: {
      component: (prop: any) => <div style={{
        position: 'absolute',
        top: `-${theme.sizing.scale800}`,
        ...theme.typography.font200,
        backgroundColor: 'transparent',
        whiteSpace: 'nowrap',
      }}>{prop.children} {suffix}</div>
    }
  }
}

const RetentionItems = (props: { formikBag: FormikProps<ProcessFormValues> }) => {
  const {formikBag} = props

  const [retention, setRetention] = useState(formikBag.values.retention.retentionMonths || 0)
  const retentionYears = Math.floor(retention / 12)
  const retentionMonths = retention - retentionYears * 12

  useEffect(() => {
    (() => formikBag.setFieldValue('retention.retentionMonths', retention))()
  }, [retention])

  return (
    <>
      <Block {...rowBlockProps} marginTop={0}>
        <ModalLabel/>
        <ModalLabel label={intl.includeConservationPlan} tooltip={intl.retentionHelpText}/>
        <BoolField fieldName='retention.retentionPlan' value={formikBag.values.retention.retentionPlan}/>
      </Block>

      {!!formikBag.values.retention?.retentionPlan && <>
        <Block {...rowBlockProps}>
          <ModalLabel/>
          <ModalLabel label={intl.retentionMonths}/>
          <Field
            name='retention.retentionMonths'
            render={({field, form}: FieldProps<DisclosureFormValues>) => (
              <>
                <Slider
                  overrides={sliderOverride(intl.years)}
                  min={0} max={100}
                  value={[retentionYears]}
                  onChange={({value}) => setRetention(value[0] * 12 + retentionMonths)}
                />
                <Slider
                  overrides={sliderOverride(intl.months)}
                  min={0} max={11}
                  value={[retentionMonths]}
                  onChange={({value}) => setRetention(value[0] + retentionYears * 12)}
                />
              </>
            )}/>
        </Block>
        <Error fieldName='retention.retentionMonths'/>

        <Block {...rowBlockProps}>
          <ModalLabel/>
          <ModalLabel label={intl.retentionStart}/>
          <FieldInput fieldName='retention.retentionStart'
                      fieldValue={formikBag.values.retention.retentionStart}/>
        </Block>
        <Error fieldName='retention.retentionStart'/>

        <Block {...rowBlockProps}>
          <ModalLabel/>
          <ModalLabel label={intl.retentionDescription}/>
          <FieldInput fieldName='retention.retentionDescription'
                      fieldValue={formikBag.values.retention.retentionDescription}/>
        </Block>
        < Error fieldName='retention.retentionDescription'/>
      </>}
    </>
  )
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
                  <ModalLabel label={intl.overallPurpose}/>
                  <FieldPurpose
                    purposeCode={initialValues.purposeCode}
                    disabled={codelist.getCodes(ListName.PURPOSE).filter(p => p.code === initialValues.purposeCode).length > 0}
                  />
                </CustomizedModalBlock>
                <Error fieldName='purposeCode'/>

                <CustomizedModalBlock>
                  <ModalLabel label={intl.processPurpose} tooltip={intl.processPurposeHelpText}/>
                  <FieldDescription/>
                </CustomizedModalBlock>
                <Error fieldName='description'/>

                <CustomizedModalBlock>
                  <ModalLabel label={intl.validityOfProcess} tooltip={intl.validityOfProcessHelpText}/>
                  <DateFieldsProcessModal showDates={true} showLabels={true} rowBlockProps={rowBlockProps}/>
                </CustomizedModalBlock>

                <CustomizedModalBlock>
                  <ModalLabel label={intl.organizing} tooltip={intl.organizingHelpText}/>

                  <Block width={"100%"}>
                    <Block display={"flex"} width={"100%"}>
                      <Block minWidth={"33%"} width={"100%"} marginLeft={".5rem"}>{intl.organizing}</Block>
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
                        <Block minWidth={"33%"} width={"100%"} marginRight={"0"}>
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
                    <BoolField value={formikBag.values.usesAllInformationTypes} fieldName='usesAllInformationTypes' omitUndefined/>
                  </Block>
                  <Block margin={"auto 0 auto 0"}>({intl.exceptionalUsage})</Block>
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
