import * as React from 'react'
import { DisclosureFormValues, Document } from '../../constants'
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from 'baseui/modal'
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikProps } from 'formik'
import { Block, BlockProps } from 'baseui/block'
import { Error, ModalLabel } from '../common/ModalSchema'
import { theme } from '../../util'
import { Button } from 'baseui/button'
import { Select, Value } from 'baseui/select'
import { codelist, ListName } from '../../service/Codelist'
import { Textarea } from 'baseui/textarea'
import { disclosureSchema } from '../common/schema'
import { Input } from 'baseui/input'
import SelectDocument from '../common/SelectDocument'
import FieldLegalBasis from '../Process/common/FieldLegalBasis'
import { Accordion, Panel } from 'baseui/accordion'
import PanelTitle from '../Process/common/PanelTitle'
import SelectProcess from '../common/SelectProcess'
import SelectInformationTypes from '../common/SelectInformationTypes'
import BoolField from '../Process/common/BoolField'
import { renderTagList } from '../common/TagList'
import FieldDepartment from "../Process/common/FieldDepartment";
import FieldProductTeam from "../common/form/FieldProductTeam";


const modalBlockProps: BlockProps = {
  width: '960px',
  paddingRight: '2rem',
  paddingLeft: '2rem',
}

const modalHeaderProps: BlockProps = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '2rem',
}

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem',
}

const panelOverrides = {
  Header: {
    style: {
      paddingLeft: 0,
    },
  },
  Content: {
    style: {
      backgroundColor: theme.colors.white,
    },
  },
  ToggleIcon: {
    component: () => null,
  },
}

const FieldRecipient = (props: { value?: string; disabled: boolean | undefined }) => {
  const [recipientValue, setRecipientValue] = React.useState<Value>(props.value ? [{ id: props.value, label: codelist.getShortname(ListName.THIRD_PARTY, props.value) }] : [])

  return (
    <Field
      name="recipient"
      render={({ form }: FieldProps<DisclosureFormValues>) => (
        <Select
          autoFocus
          options={codelist.getParsedOptions(ListName.THIRD_PARTY)}
          onChange={({ value }) => {
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

const FieldTextarea = (props: { fieldName: string; fieldValue?: string; placeholder?: string }) => {
  return (
    <Field
      name={props.fieldName}
      render={({ field, form }: FieldProps<string, DisclosureFormValues>) => (
        <Textarea
          {...field}
          placeholder={props.placeholder}
          rows={4}
          onKeyDown={(e) => {
            if (e.key === 'Enter') form.setFieldValue(props.fieldName, props.fieldValue + '\n')
          }}
        />
      )}
    />
  )
}

const FieldInput = (props: { fieldName: string; fieldValue?: string }) => {
  return <Field name={props.fieldName} render={({ field, form }: FieldProps<string, DisclosureFormValues>) => <Input {...field} />} />
}

type ModalThirdPartyProps = {
  title?: string
  isOpen: boolean
  disableRecipientField?: boolean | undefined
  initialValues: DisclosureFormValues
  errorOnCreate: any | undefined
  submit: (values: DisclosureFormValues) => void
  onClose: () => void
}

const ModalThirdParty = (props: ModalThirdPartyProps) => {
  const [isPanelExpanded, togglePanel] = React.useReducer((prevState) => !prevState, false)
  const { submit, errorOnCreate, onClose, isOpen, disableRecipientField, initialValues, title } = props
  return (
    <Modal onClose={onClose} isOpen={isOpen} closeable={false} animate size={SIZE.auto} role={ROLE.dialog}>
      <Block {...modalBlockProps}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            submit({
              ...values,
              processIds: values.processes.map((p) => p.id),
            })
          }}
          validationSchema={disclosureSchema()}
        >
          {(formikBag: FormikProps<DisclosureFormValues>) => (
            <Form>
              <ModalHeader>
                <Block {...modalHeaderProps}>{title}</Block>
              </ModalHeader>

              <ModalBody>
                <Block {...rowBlockProps}>
                  <ModalLabel label='Mottaker' />
                  <FieldRecipient value={formikBag.values.recipient} disabled={disableRecipientField} />
                </Block>

                <Block {...rowBlockProps}>
                  <ModalLabel label='Navn på utlevering'
                              tooltip='Et kort navn som beskriver hva utleveringen går ut på. Eksempel: Utlevering av syke- og uføreopplysninger fra NAV til forsikringsselskap.' />
                  <FieldInput fieldName="name" fieldValue={formikBag.values.name} />
                </Block>
                <Error fieldName="name" />

                <Block {...rowBlockProps}>
                  <ModalLabel label='Formål med utlevering'
                              tooltip='Beskriv formålet med utleveringen til mottaker. Eksempel: Formålet er å bidra til at forsikringsselskap kan motta opplysninger fra NAV som er nødvendig for å behandle en forsikringssak.' />
                  <FieldTextarea fieldName="recipientPurpose" fieldValue={formikBag.values.recipientPurpose} />
                </Block>
                <Error fieldName="recipientPurpose" />

                <Block {...rowBlockProps}>
                  <ModalLabel label='Ytterligere beskrivelse'
                              tooltip='Relevant informasjon som ikke passer inn i andre felt kan beskrives her. For eksempel hva slags type informasjon som utleveres, regelmessighet eller lignende.' />
                  <FieldTextarea fieldName="description" fieldValue={formikBag.values.description} />
                </Block>
                <Error fieldName="description" />

                <Block {...rowBlockProps}>
                  <ModalLabel label='Relaterte behandlinger' />
                  <Block width="100%">
                    <SelectProcess formikBag={formikBag} />
                  </Block>
                </Block>

                <Block {...rowBlockProps}>
                  <ModalLabel label='Opplysningstyper' />
                  <Block width="100%">
                    <SelectInformationTypes formikBag={formikBag} />
                  </Block>
                </Block>

                <Block {...rowBlockProps}>
                  <ModalLabel label='Dokument'
                              tooltip='En samling av opplysningstyper. Sykmelding og inntektsmelding er eksempel på dokumenter som inneholder flere opplysningstyper.' />
                  <Field
                    name="document"
                    render={({ form }: FieldProps<DisclosureFormValues>) => (
                      <SelectDocument
                        document={form.values.document}
                        handleChange={(document: Document | undefined) => {
                          formikBag.setFieldValue('document', document)
                        }}
                      />
                    )}
                  />
                </Block>
                <Error fieldName="document" />

                <Block {...rowBlockProps}>
                  <ModalLabel label='Saksnummer i adminstrativt arkiv' />
                  <FieldInput fieldName="administrationArchiveCaseNumber" fieldValue={formikBag.values.administrationArchiveCaseNumber} />
                </Block>
                <Error fieldName="administrationArchiveCaseNumber" />

                <Block {...rowBlockProps}>
                  <ModalLabel label='Utleveres personopplysningene til utlandet?' />
                  <BoolField fieldName="abroad.abroad" value={formikBag.values.abroad.abroad} />
                </Block>

                {formikBag.values.abroad.abroad && (
                  <>
                    <Block {...rowBlockProps}>
                      <ModalLabel label='Land' />
                      <FieldArray
                        name="abroad.countries"
                        render={(arrayHelpers: FieldArrayRenderProps) => (
                          <Block width="100%">
                            <Block>
                              <Select
                                clearable
                                options={codelist
                                  .getCountryCodesOutsideEu()
                                  .map((c) => ({ id: c.code, label: c.description }))
                                  .filter((o) => !formikBag.values.abroad.countries.includes(o.id))}
                                onChange={({ value }) => {
                                  arrayHelpers.form.setFieldValue('abroad.countries', [...formikBag.values.abroad.countries, ...value.map((v) => v.id)])
                                }}
                                maxDropdownHeight={'400px'}
                              />
                            </Block>
                            <Block>
                              <Block>
                                {renderTagList(
                                  formikBag.values.abroad.countries.map((c) => codelist.countryName(c)),
                                  arrayHelpers,
                                )}
                              </Block>
                            </Block>
                          </Block>
                        )}
                      />
                    </Block>

                    <Block {...rowBlockProps}>
                      <ModalLabel label='Oppgi referanse til trygdeavtale' />
                      <FieldInput fieldName="abroad.refToAgreement" fieldValue={formikBag.values.abroad.refToAgreement} />
                    </Block>

                    <Block {...rowBlockProps}>
                      <ModalLabel label='Trygdeområde' />
                      <FieldInput fieldName="abroad.businessArea" fieldValue={formikBag.values.abroad.businessArea} />
                    </Block>
                  </>
                )}

                <Block>
                  <Block {...rowBlockProps}>
                    <ModalLabel label='Hjemmel for unntak fra taushetsplikt er vurdert' />
                    <BoolField fieldName="assessedConfidentiality" value={formikBag.values.assessedConfidentiality} omitUndefined={true} />
                  </Block>
                  <Error fieldName="assessedConfidentiality" />
                </Block>
                {
                  formikBag.values.assessedConfidentiality !== undefined &&
                  (<>
                    <Block>
                      <Block {...rowBlockProps}>
                        <ModalLabel label={formikBag.values.assessedConfidentiality ? 'Hjemmel for unntak fra taushetsplikt, og ev. referanse til vurderingen'
                          : 'Begrunnelse for at hjemmel for unntak for taushetsplikt ikke er vurdert'} />
                        <FieldTextarea fieldName="confidentialityDescription" fieldValue={formikBag.values.confidentialityDescription} />
                      </Block>
                      <Error fieldName="confidentialityDescription" />
                    </Block>

                  </>)
                }

                <Accordion
                  overrides={{
                    Root: {
                      style: {
                        marginTop: '25px',
                      },
                    },
                  }}
                >
                  <Panel
                    key="organizing"
                    title={<ModalLabel label={<PanelTitle title='Organisering' expanded={isPanelExpanded} />} />}
                    overrides={{ ...panelOverrides }}
                  >
                    <Block display="flex" width="100%" justifyContent="space-between">
                      <Block width="48%">
                        <ModalLabel label='Avdeling' tooltip='Angi hvilken avdeling som har hovedansvar for behandlingen.' />
                      </Block>
                    </Block>

                    <Block display="flex" width="100%" justifyContent="space-between">
                      <Block width="48%">
                        <FieldDepartment department={formikBag.values.department} fieldName="department" />
                      </Block>
                    </Block>

                    <Block display="flex" width="100%" justifyContent="space-between" marginTop={theme.sizing.scale400}>
                      <Block width="48%">
                        <ModalLabel label='Team (Oppslag i Teamkatalogen)' tooltip='Angi hvilke team som har forvaltningsansvaret for IT-systemene.' fullwidth={true} />
                      </Block>
                    </Block>

                    <Block display="flex" width="100%" justifyContent="space-between">
                      <Block width="48%">
                        <FieldProductTeam productTeams={formikBag.values.productTeams || []} fieldName="productTeams" />
                      </Block>
                    </Block>
                  </Panel>
                  <Panel
                    title={<PanelTitle title='Behandlingsgrunnlag' expanded={isPanelExpanded} />}
                    onChange={() => {
                      togglePanel()
                      formikBag.setFieldValue('legalBasesOpen', !isPanelExpanded)
                    }}
                    overrides={{ ...panelOverrides }}
                  >
                    <Block marginTop={'1rem'}>
                      <FieldLegalBasis formikBag={formikBag} openArt6OnEmpty />
                    </Block>
                    <Error fieldName="legalBasesOpen" fullWidth={true} />
                  </Panel>
                </Accordion>
              </ModalBody>

              <ModalFooter style={{ borderTop: 0 }}>
                <Block display="flex" justifyContent="flex-end">
                  <Block alignSelf="flex-end">{errorOnCreate && <p>{errorOnCreate}</p>}</Block>
                  <Button type="button" kind="tertiary" onClick={() => onClose()}>
                    Avbryt
                  </Button>
                  <ModalButton type="submit">Lagre</ModalButton>
                </Block>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Block>
    </Modal>
  )
}

export default ModalThirdParty
