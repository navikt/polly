import * as React from 'react'
import {KeyboardEvent, useEffect, useState} from 'react'
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE} from "baseui/modal";
import {Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikProps,} from "formik";
import {Block, BlockProps} from "baseui/block";
import {Input, SIZE as InputSIZE} from "baseui/input";
import {Select, Value} from 'baseui/select';
import {Button, KIND, SHAPE, SIZE as ButtonSize} from "baseui/button";
import {Plus} from "baseui/icon";

import {DisclosureFormValues, ProcessFormValues} from "../../../constants";
import CardLegalBasis from './CardLegalBasis'
import {codelist, ListName} from "../../../service/Codelist"
import {intl, theme} from "../../../util"
import {Error, ModalLabel} from "../../common/ModalSchema";
import {ListLegalBases} from "../../common/LegalBasis"
import {DateModalFields} from "../DateModalFields"
import {hasSpecifiedDate} from "../../common/Durations"
import {processSchema} from "../../common/schema"
import {getTeam, mapTeamToOption, useTeamSearch} from "../../../api"
import {Textarea} from "baseui/textarea"
import {Card} from "baseui/card"
import {renderTagList} from "../../common/TagList"
import {Slider} from "baseui/slider"
import {RadioBoolButton} from "../../common/Radio"

const modalBlockProps: BlockProps = {
  width: '750px',
  paddingRight: '2rem',
  paddingLeft: '2rem'
};

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem'
};

const modalHeaderProps: BlockProps = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '2rem'
};

const FieldName = () => (
  <Field
    name="name"
    render={({field, form}: FieldProps<string, ProcessFormValues>) => (
      <Input {...field} type="input" size={InputSIZE.default} autoFocus error={!!form.errors.name && form.touched.name}/>
    )}
  />
);

const FieldDescription = () => (
  <Field
    name="description"
    render={({field, form}: FieldProps<string, ProcessFormValues>) => (
      <Textarea {...field} type="input" size={InputSIZE.default} error={!!form.errors.description && form.touched.description}/>
    )}
  />
)

const FieldDepartment = (props: { department?: string }) => {
  const {department} = props;
  const [value, setValue] = React.useState<Value>(department ? [{id: department, label: codelist.getShortname(ListName.DEPARTMENT, department)}] : []);

  return (
    <Field
      name="department"
      render={({form}: FieldProps<ProcessFormValues>) => (
        <Select
          options={codelist.getParsedOptions(ListName.DEPARTMENT)}
          onChange={({value}) => {
            setValue(value);
            form.setFieldValue('department', value.length > 0 ? value[0].id : '')
          }}
          value={value}
        />
      )}
    />
  )
};

const FieldSubDepartment = (props: { subDepartment?: string }) => {
  const {subDepartment} = props;
  const [value, setValue] = React.useState<Value>(subDepartment
    ? [{id: subDepartment, label: codelist.getShortname(ListName.SUB_DEPARTMENT, subDepartment)}]
    : []);

  return (
    <Field
      name="subDepartment"
      render={({form}: FieldProps<ProcessFormValues>) => (
        <Select
          options={codelist.getParsedOptions(ListName.SUB_DEPARTMENT)}
          onChange={({value}) => {
            setValue(value);
            form.setFieldValue('subDepartment', value.length > 0 ? value[0].id : '')
          }}
          value={value}
        />
      )}
    />
  )

};

const BoolField = (props: { value?: boolean, fieldName: string, omitUndefined?: boolean }) => (
  <Field
    name={props.fieldName}
    render={({form}: FieldProps<ProcessFormValues>) =>
      <RadioBoolButton value={props.value} setValue={(b) => form.setFieldValue(props.fieldName, b)}
                       omitUndefined={props.omitUndefined}/>}
  />
)

const FieldDataProcessorAgreements = (props: { formikBag: FormikProps<ProcessFormValues> }) => {
  const [currentKeywordValue, setCurrentKeywordValue] = React.useState("");
  const agreementRef = React.useRef<HTMLInputElement>(null);

  const onAddAgreement = (arrayHelpers: FieldArrayRenderProps) => {
    arrayHelpers.push(currentKeywordValue);
    setCurrentKeywordValue("");
    if (agreementRef && agreementRef.current) {
      agreementRef.current.focus();
    }
  }
  return (
    <FieldArray
      name="dataProcessing.dataProcessorAgreements"
      render={arrayHelpers => (
        <Block>
          <Input
            type="text"
            size="compact"
            placeholder={intl.dataProcessorAgreement}
            value={currentKeywordValue}
            onChange={event => setCurrentKeywordValue(event.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onAddAgreement(arrayHelpers)
            }}
            inputRef={agreementRef}
            overrides={{
              After: () => (
                <Button
                  type="button"
                  size="compact"
                  shape={SHAPE.square}
                  onClick={() => onAddAgreement(arrayHelpers)}
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
  const {productTeam} = props;
  const [value, setValue] = React.useState<Value>(productTeam ? [{id: productTeam, label: productTeam}] : []);
  const [teamSearchResult, setTeamSearch, teamSearchLoading] = useTeamSearch();

  const initialValueTeam = async () => {
    if (!productTeam) return [];
    return [mapTeamToOption(await getTeam(productTeam))]
  };
  useEffect(() => {
    (async () => setValue(await initialValueTeam()))()
  }, [productTeam]);

  return (
    <Field
      name="productTeam"
      render={({form,field}: FieldProps<ProcessFormValues>) => (
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
      )}
    />
  )
}

const FieldProduct = (props: { products: string[] }) => {
  const {products} = props;
  const [value, setValue] = React.useState<Value>(products ? products.map(product => ({id: product, label: codelist.getShortname(ListName.SYSTEM, product)})) : []);

  return <FieldArray
    name="products"
    render={arrayHelpers => <Select
      multi
      clearable
      options={codelist.getParsedOptions(ListName.SYSTEM)}
      onChange={({value}) => {
        setValue(value);
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
        <Input {...field} size="compact"/>
      )}
    />
  )
}

function sliderOvveride(suffix: string) {
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

const OptionalItems = (props: { formikBag: FormikProps<ProcessFormValues> }) => {
  const {formikBag} = props
  const [showDates, setShowDates] = React.useState(hasSpecifiedDate(formikBag.values));
  const [showAutomation, setShowAutomation] = React.useState(formikBag.values.automaticProcessing || formikBag.values.profiling);
  const [showDataProcessor, setShowDataProcessor] = React.useState(formikBag.values.dataProcessing.dataProcessor);
  const [showRetention, setShowRetention] = React.useState(formikBag.values.retention.retentionPlan);

  const [retention, setRetention] = useState(formikBag.values.retention.retentionMonths || 0)
  const retentionYears = Math.floor(retention / 12)
  const retentionMonths = retention - retentionYears * 12

  useEffect(() => {
    (() => formikBag.setFieldValue('retention.retentionMonths', retention))()
  }, [retention])

  const cardOverrides = {
    Root: {style: {marginTop: "1rem"}},
    Contents: {style: {marginRight: "4px", marginTop: "4px", marginLeft: "4px", marginBottom: "4px"}},
    Body: {style: {marginBottom: 0}}
  }
  return (
    <>
      {showAutomation &&
      <Card overrides={cardOverrides}>
        <Block {...rowBlockProps} marginTop={0}>
          <ModalLabel label={intl.automaticProcessing} tooltip={intl.automaticProcessingExtra}/>
          <BoolField fieldName="automaticProcessing" value={formikBag.values.automaticProcessing}/>
        </Block>

        <Block {...rowBlockProps}>
          <ModalLabel label={intl.profiling} tooltip={intl.profilingExtra}/>
          <BoolField fieldName="profiling" value={formikBag.values.profiling}/>
        </Block>
      </Card>}

      {showDataProcessor &&
      <Card overrides={cardOverrides}>
        <Block {...rowBlockProps} marginTop={0}>
          <ModalLabel label={intl.dataProcessor} tooltip={intl.dataProcessorExtra}/>
          <BoolField fieldName="dataProcessing.dataProcessor" value={formikBag.values.dataProcessing.dataProcessor}/>
        </Block>

        {formikBag.values.dataProcessing.dataProcessor && <>
          <Block {...rowBlockProps}>
            <ModalLabel label={intl.dataProcessorAgreement}/>
            <FieldDataProcessorAgreements formikBag={formikBag}/>
          </Block>
          <Error fieldName="dataProcessing.dataProcessorAgreement"/>

          <Block {...rowBlockProps}>
            <ModalLabel label={intl.dataProcessorOutsideEU} tooltip={intl.dataProcessorOutsideEUExtra}/>
            <BoolField fieldName="dataProcessing.dataProcessorOutsideEU" value={formikBag.values.dataProcessing.dataProcessorOutsideEU}/>
          </Block>
        </>}
      </Card>}

      {showRetention &&
      <Card overrides={cardOverrides}>
        <Block {...rowBlockProps} marginTop={0}>
          <ModalLabel label={intl.retention} tooltip={intl.retentionPlan}/>
          <BoolField fieldName="retention.retentionPlan" value={formikBag.values.retention.retentionPlan}/>
        </Block>

        {formikBag.values.retention.retentionPlan && <>
          <Block {...rowBlockProps}>
            <ModalLabel label={intl.retentionMonths}/>
            <Field
              name="retention.retentionMonths"
              render={({field, form}: FieldProps<DisclosureFormValues>) => (
                <>
                  <Slider
                    overrides={sliderOvveride(intl.years)}
                    min={0} max={100}
                    value={[retentionYears]}
                    onChange={({value}) => setRetention(value[0] * 12 + retentionMonths)}
                  />
                  <Slider
                    overrides={sliderOvveride(intl.months)}
                    min={0} max={11}
                    value={[retentionMonths]}
                    onChange={({value}) => setRetention(value[0] + retentionYears * 12)}
                  />
                </>
              )}/>
          </Block>
          <Error fieldName="retention.retentionMonths"/>

          <Block {...rowBlockProps}>
            <ModalLabel label={intl.retentionStart}/>
            <FieldInput fieldName="retention.retentionStart" fieldValue={formikBag.values.retention.retentionStart}/>
          </Block>
          <Error fieldName="retention.retentionStart"/>

          <Block {...rowBlockProps}>
            <ModalLabel label={intl.retentionDescription}/>
            <FieldInput fieldName="retention.retentionDescription" fieldValue={formikBag.values.retention.retentionDescription}/>
          </Block>
          < Error fieldName="retention.retentionDescription"/>
        </>}
      </Card>}

      {showDates && <DateModalFields showDates={true} showLabels={true} rowBlockProps={rowBlockProps}/>}

      <Block {...rowBlockProps}>
        {!showDates &&
        <Button size="compact" shape='pill' type="button"
                $style={{marginRight: "1rem"}}
                onClick={() => setShowDates(true)}>{intl.useDates}</Button>}
        {!showAutomation &&
        <Button size="compact" shape='pill' type="button"
                $style={{marginRight: "1rem"}}
                onClick={() => setShowAutomation(true)}>{intl.automation}</Button>}
        {!showDataProcessor &&
        <Button size="compact" shape='pill' type="button"
                $style={{marginRight: "1rem"}}
                onClick={() => setShowDataProcessor(true)}>{intl.dataProcessor}</Button>}
        {!showRetention &&
        <Button size="compact" shape='pill' type="button"
                $style={{marginRight: "1rem"}}
                onClick={() => setShowRetention(true)}>{intl.retention}</Button>}
      </Block>
    </>
  )
}

type ModalProcessProps = {
  title: string;
  isOpen: boolean;
  isEdit?: boolean;
  initialValues: ProcessFormValues;
  errorOnCreate: any | undefined;
  submit: (process: ProcessFormValues) => void;
  onClose: () => void;
};

const ModalProcess = ({submit, errorOnCreate, onClose, isOpen, initialValues, title, isEdit}: ModalProcessProps) => {

  const [selectedLegalBasis, setSelectedLegalBasis] = React.useState();
  const [selectedLegalBasisIndex, setSelectedLegalBasisIndex] = React.useState();

  const disableEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault()
  }

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      closeable
      animate
      size={SIZE.auto}
      role={ROLE.dialog}
    >
      <Block {...modalBlockProps}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => submit(values)} validationSchema={processSchema()}
          render={(formikBag: FormikProps<ProcessFormValues>) => (
            <Form onKeyDown={disableEnter}>
              <ModalHeader>
                <Block {...modalHeaderProps}>
                  {title}
                </Block>
              </ModalHeader>

              <ModalBody>
                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.name}/>
                  <FieldName/>
                </Block>
                <Error fieldName="name"/>

                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.processPurpose}/>
                  <FieldDescription/>
                </Block>
                <Error fieldName="description"/>

                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.department}/>
                  <FieldDepartment department={formikBag.values.department}/>
                </Block>

                {codelist.showSubDepartment(formikBag.values.department) && (
                  <Block {...rowBlockProps}>
                    <ModalLabel label={intl.subDepartment}/>
                    <FieldSubDepartment subDepartment={formikBag.values.subDepartment}/>
                  </Block>
                )}

                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.productTeam}/>
                  <FieldProductTeam productTeam={formikBag.values.productTeam}/>
                </Block>

                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.system}/>
                  <FieldProduct products={formikBag.values.products}/>
                </Block>

                <OptionalItems formikBag={formikBag}/>

                <Block {...rowBlockProps}>
                  <ModalLabel/>
                  {!formikBag.values.legalBasesOpen && (
                    <Block width="100%" marginBottom="1rem">
                      <Button
                        size={ButtonSize.compact}
                        kind={KIND.minimal}
                        onClick={() => formikBag.setFieldValue('legalBasesOpen', true)}
                        startEnhancer={() => <Block display="flex" justifyContent="center"><Plus size={22}/></Block>}
                      >
                        {intl.legalBasisAdd}
                      </Button>
                    </Block>
                  )}
                </Block>

                <FieldArray
                  name="legalBases"
                  render={arrayHelpers => (
                    <React.Fragment>
                      {formikBag.values.legalBasesOpen ? (
                        <Block width="100%" marginTop="2rem">
                          <CardLegalBasis
                            titleSubmitButton={selectedLegalBasis ? intl.update : intl.add}
                            initValue={selectedLegalBasis || {}}
                            hideCard={() => formikBag.setFieldValue('legalBasesOpen', false)}
                            submit={values => {
                              if (!values) return;
                              if (selectedLegalBasis) {
                                arrayHelpers.replace(selectedLegalBasisIndex, values)
                                setSelectedLegalBasis(null)
                              } else {
                                arrayHelpers.push(values)
                              }
                              formikBag.setFieldValue('legalBasesOpen', false)
                            }}/>
                        </Block>
                      ) : (
                        <Block display="flex">
                          <ModalLabel/>
                          <Block width="100%">
                            <ListLegalBases
                              legalBases={formikBag.values.legalBases}
                              onRemove={(index) => arrayHelpers.remove(index)}
                              onEdit={
                                (index) => {
                                  setSelectedLegalBasis(formikBag.values.legalBases[index]);
                                  setSelectedLegalBasisIndex(index);
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
                <Error fieldName="legalBasesOpen" fullWidth={true}/>

              </ModalBody>

              <ModalFooter>
                <Block display="flex" justifyContent="flex-end">
                  <Block alignSelf="flex-end">{errorOnCreate && <p>{errorOnCreate}</p>}</Block>
                  <Button type="button" kind={KIND.minimal} onClick={onClose}>{intl.abort}</Button>
                  <ModalButton type="submit">{intl.save}</ModalButton>
                </Block>
              </ModalFooter>
            </Form>
          )}
        />

      </Block>
    </Modal>
  )
};

export default ModalProcess
