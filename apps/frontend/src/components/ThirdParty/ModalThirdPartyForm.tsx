import * as React from 'react'
import { DisclosureFormValues, Document } from '../../constants';
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from 'baseui/modal';
import { Field, FieldArray, FieldProps, Form, Formik, FormikProps } from 'formik';
import { Block, BlockProps } from 'baseui/block';
import { Error, ModalLabel } from '../common/ModalSchema';
import { intl, useDebouncedState } from '../../util';
import { Button } from 'baseui/button';
import { Select, StatefulSelect, Value, TYPE, Option } from 'baseui/select';
import { codelist, ListName } from '../../service/Codelist';
import { Textarea } from 'baseui/textarea';
import { useInfoTypeSearch, searchDocuments } from '../../api';
import { ListLegalBases } from '../common/LegalBasis';
import CardLegalBasis from '../Purpose/Accordion/CardLegalBasis';
import { Plus } from 'baseui/icon';
import { disclosureSchema } from "../common/schema"
import { Input } from "baseui/input"
import SelectDocument from '../common/SelectDocument';

const modalBlockProps: BlockProps = {
  width: '750px',
  paddingRight: '2rem',
  paddingLeft: '2rem'
};

const modalHeaderProps: BlockProps = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '2rem'
};

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem'
};

const FieldRecipient = (props: { value?: string, disabled: boolean | undefined }) => {
  const [recipientValue, setRecipientValue] = React.useState<Value>(props.value ? [{id: props.value, label: codelist.getShortname(ListName.THIRD_PARTY, props.value)}] : []);

  return (
    <Field
      name="recipient"
      render={({form}: FieldProps<DisclosureFormValues>) => (
        <Select
          autoFocus
          options={codelist.getParsedOptions(ListName.THIRD_PARTY)}
          onChange={({value}) => {
            setRecipientValue(value)
            form.setFieldValue('recipient', value.length > 0 ? value[0].id : undefined)
          }}
          value={recipientValue}
          disabled={props.disabled}
        />
      )}
    />
  )
}

const FieldTextarea = (props: { fieldName: string, fieldValue?: string, placeholder?: string }) => {
  return (
    <Field
      name={props.fieldName}
      render={({field, form}: FieldProps<DisclosureFormValues>) => (
        <Textarea
          {...field}
          placeholder={props.placeholder}
          rows={4}
          onKeyDown={e => {
            if (e.key === 'Enter') form.setFieldValue(props.fieldName, props.fieldValue + '\n')
          }}
        />
      )}
    />
  )
}

const FieldInput = (props: { fieldName: string, fieldValue?: string }) => {
  return (
    <Field
      name={props.fieldName}
      render={({field, form}: FieldProps<DisclosureFormValues>) => (
        <Input {...field} />
      )}
    />
  )
}



type ModalThirdPartyProps = {
  title?: string;
  isOpen: boolean;
  isEdit: boolean;
  disableRecipientField?: boolean | undefined;
  initialValues: DisclosureFormValues;
  errorOnCreate: any | undefined;
  submit: (values: DisclosureFormValues) => void;
  onClose: () => void;
};



const ModalThirdParty = (props: ModalThirdPartyProps) => {
  const [infoTypeSearchResult, setInfoTypeSearch] = useInfoTypeSearch()
  const [documents, setDocuments] = React.useState<Document[]>([])
  const [documentSearch, setDocumentSearch] = useDebouncedState<string>('', 400)
  const [selectedLegalBasis, setSelectedLegalBasis] = React.useState();
  const [selectedLegalBasisIndex, setSelectedLegalBasisIndex] = React.useState();

  const {submit, errorOnCreate, onClose, isOpen, isEdit, disableRecipientField, initialValues, title} = props

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
          onSubmit={(values) => submit(values)}
          validationSchema={disclosureSchema()}
          render={(formikBag: FormikProps<DisclosureFormValues>) => (
            

            <Form>
              <ModalHeader>
                <Block {...modalHeaderProps}>
                  {title}
                </Block>
              </ModalHeader>

              <ModalBody>
                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.recipient}/>
                  <FieldRecipient value={formikBag.values.recipient} disabled={disableRecipientField}/>
                </Block>

                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.name}/>
                  <FieldInput fieldName="name" fieldValue={formikBag.values.name}/>
                </Block>
                <Error fieldName="name"/>

                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.recipientPurpose}/>
                  <FieldTextarea fieldName="recipientPurpose" fieldValue={formikBag.values.recipientPurpose}/>
                </Block>
                <Error fieldName="recipientPurpose"/>

                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.description}/>
                  <FieldTextarea fieldName="description" fieldValue={formikBag.values.description}/>
                </Block>
                <Error fieldName="description"/>

                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.document}/>
                  <Field 
                    name="document"
                    render={({form}: FieldProps<DisclosureFormValues>) => (
                      <SelectDocument
                        document={form.values.document}
                        handleChange={(document: Document | undefined) => {
                          formikBag.setFieldValue("document", document)
                        }}
                      />
                    )}
                  />
                </Block>
                <Error fieldName="document" />

                <Block {...rowBlockProps}>
                  <ModalLabel/>
                  {!formikBag.values.legalBasesOpen && (
                    <Block width="100%" marginBottom="1rem">
                      <Button
                        size="compact"
                        kind="minimal"
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
                      {formikBag.values.legalBasesOpen && (
                        <Block width="100%" marginTop="2rem">
                          <CardLegalBasis
                            titleSubmitButton={selectedLegalBasis ? intl.update : intl.add}
                            initValue={selectedLegalBasis || {}}
                            hideCard={() => formikBag.setFieldValue('legalBasesOpen', false)}
                            submit={values => {
                              if (!values) return;
                              if (selectedLegalBasis) {
                                arrayHelpers.replace(selectedLegalBasisIndex, values);
                                setSelectedLegalBasis(null)
                              } else {
                                arrayHelpers.push(values);
                              }
                              formikBag.setFieldValue('legalBasesOpen', false);
                            }}/>
                        </Block>
                      )}
                      {!formikBag.values.legalBasesOpen && (
                        <Block display="flex">
                          <ModalLabel/>
                          <Block width="100%">
                            <ListLegalBases
                              legalBases={formikBag.values.legalBases}
                              onRemove={(index) => arrayHelpers.remove(index)}
                              onEdit={(index) => {
                                setSelectedLegalBasis(formikBag.values.legalBases[index]);
                                setSelectedLegalBasisIndex(index);
                                formikBag.setFieldValue('legalBasesOpen', true)
                              }}
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
                  <Button type="button" kind="minimal" onClick={() => onClose()}>{intl.abort}</Button>
                  <ModalButton type="submit">{intl.save}</ModalButton>
                </Block>
              </ModalFooter>
            </Form>
          )}
        />
      </Block>
    </Modal>

  )
}

export default ModalThirdParty
