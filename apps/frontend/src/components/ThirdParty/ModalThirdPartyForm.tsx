import * as React from 'react'
import {DisclosureFormValues, Document} from '../../constants';
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE} from 'baseui/modal';
import {Field, FieldProps, Form, Formik, FormikProps} from 'formik';
import {Block, BlockProps} from 'baseui/block';
import {Error, ModalLabel} from '../common/ModalSchema';
import {intl, theme} from '../../util';
import {Button} from 'baseui/button';
import {Select, Value} from 'baseui/select';
import {codelist, ListName} from '../../service/Codelist';
import {Textarea} from 'baseui/textarea';
import {disclosureSchema} from "../common/schema"
import {Input} from "baseui/input"
import SelectDocument from '../common/SelectDocument';
import FieldLegalBasis from "../Process/common/FieldLegalBasis";
import {Accordion, Panel} from "baseui/accordion";
import PanelTitle from "../Process/common/PanelTitle";
import SelectProcess from '../common/SelectProcess';
import SelectInformationTypes from '../common/SelectInformationTypes';

const modalBlockProps: BlockProps = {
  width: '960px',
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

const panelOverrides = {
  Header: {
    style: {
      paddingLeft: 0
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
      render={({field, form}: FieldProps<string, DisclosureFormValues>) => (
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

const FieldInput = (props: { fieldName: string, fieldValue?: string, }) => {
  return (
    <Field
      name={props.fieldName}
      render={({field, form}: FieldProps<string, DisclosureFormValues>) => (
        <Input {...field}/>
      )}
    />
  )
}

type ModalThirdPartyProps = {
  title?: string;
  isOpen: boolean;
  disableRecipientField?: boolean | undefined;
  initialValues: DisclosureFormValues;
  errorOnCreate: any | undefined;
  submit: (values: DisclosureFormValues) => void;
  onClose: () => void;
};

const ModalThirdParty = (props: ModalThirdPartyProps) => {

  const [isPanelExpanded, togglePanel] = React.useReducer(prevState => !prevState, false)
  const {submit, errorOnCreate, onClose, isOpen, disableRecipientField, initialValues, title} = props

  console.log(initialValues, "INTISLK")

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      closeable
      animate
      size={SIZE.auto}
      role={ROLE.dialog}
      unstable_ModalBackdropScroll={true}
    >
      <Block {...modalBlockProps}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            console.log(values)
            submit(values)
          }}
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
                  <ModalLabel label={intl.disclosureName}/>
                  <FieldInput fieldName="name" fieldValue={formikBag.values.name}/>
                </Block>
                <Error fieldName="name"/>

                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.disclosurePurpose}/>
                  <FieldTextarea fieldName="recipientPurpose" fieldValue={formikBag.values.recipientPurpose}/>
                </Block>
                <Error fieldName="recipientPurpose"/>

                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.additionalDescription}/>
                  <FieldTextarea fieldName="description" fieldValue={formikBag.values.description}/>
                </Block>
                <Error fieldName="description"/>

                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.relatedProcesses}/>
                  <Block width="100%">
                    <SelectProcess formikBag={formikBag} />
                  </Block>
                </Block>

                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.informationTypes}/>
                  <Block width="100%">
                    <SelectInformationTypes formikBag={formikBag} />
                  </Block>
                </Block>

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
                <Error fieldName="document"/>



                <Accordion overrides={{
                  Root: {
                    style: {
                      marginTop: '25px'
                    }
                  }
                }}>
                  <Panel
                    title={<PanelTitle title={intl.legalBasisShort} expanded={isPanelExpanded}/>}
                    onChange={togglePanel}
                    overrides={{...panelOverrides}}
                  >
                    <Block marginTop={"1rem"}>
                      <FieldLegalBasis formikBag={formikBag} openArt6OnEmpty/>
                    </Block>
                    <Error fieldName="legalBasesOpen" fullWidth={true}/>
                  </Panel>
                </Accordion>
              </ModalBody>

              <ModalFooter style={{borderTop: 0}}>
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
