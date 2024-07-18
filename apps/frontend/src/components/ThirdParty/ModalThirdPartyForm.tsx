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
      <div className="w-[960px] px-8">
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
                <div className="flex jusify-center mb-8">{title}</div>
              </ModalHeader>

              <ModalBody>
                <div className="flex w-full mt-4">
                  <ModalLabel label='Mottaker' />
                  <FieldRecipient value={formikBag.values.recipient} disabled={disableRecipientField} />
                </div>

                <div className="flex w-full mt-4">
                  <ModalLabel label='Navn på utlevering'
                              tooltip='Et kort navn som beskriver hva utleveringen går ut på. Eksempel: Utlevering av syke- og uføreopplysninger fra NAV til forsikringsselskap.' />
                  <FieldInput fieldName="name" fieldValue={formikBag.values.name} />
                </div>
                <Error fieldName="name" />

                <div className="flex w-full mt-4">
                  <ModalLabel label='Formål med utlevering'
                              tooltip='Beskriv formålet med utleveringen til mottaker. Eksempel: Formålet er å bidra til at forsikringsselskap kan motta opplysninger fra NAV som er nødvendig for å behandle en forsikringssak.' />
                  <FieldTextarea fieldName="recipientPurpose" fieldValue={formikBag.values.recipientPurpose} />
                </div>
                <Error fieldName="recipientPurpose" />

                <div className="flex w-full mt-4">
                  <ModalLabel label='Ytterligere beskrivelse'
                              tooltip='Relevant informasjon som ikke passer inn i andre felt kan beskrives her. For eksempel hva slags type informasjon som utleveres, regelmessighet eller lignende.' />
                  <FieldTextarea fieldName="description" fieldValue={formikBag.values.description} />
                </div>
                <Error fieldName="description" />

                <div className="flex w-full mt-4">
                  <ModalLabel label='Relaterte behandlinger' />
                  <div className="w-full">
                    <SelectProcess formikBag={formikBag} />
                  </div>
                </div>

                <div className="flex w-full mt-4">
                  <ModalLabel label='Opplysningstyper' />
                  <div className="w-full">
                    <SelectInformationTypes formikBag={formikBag} />
                  </div>
                </div>

                <div className="flex w-full mt-4">
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
                </div>
                <Error fieldName="document" />

                <div className="flex w-full mt-4">
                  <ModalLabel label='Saksnummer i adminstrativt arkiv' />
                  <FieldInput fieldName="administrationArchiveCaseNumber" fieldValue={formikBag.values.administrationArchiveCaseNumber} />
                </div>
                <Error fieldName="administrationArchiveCaseNumber" />

                <div className="flex w-full mt-4">
                  <ModalLabel label='Utleveres personopplysningene til utlandet?' />
                  <BoolField fieldName="abroad.abroad" value={formikBag.values.abroad.abroad} />
                </div>

                {formikBag.values.abroad.abroad && (
                  <>
                    <div className="flex w-full mt-4">
                      <ModalLabel label='Land' />
                      <FieldArray
                        name="abroad.countries"
                        render={(arrayHelpers: FieldArrayRenderProps) => (
                          <div className="w-full">
                            <div>
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
                            </div>
                            <div>
                              <div>
                                {renderTagList(
                                  formikBag.values.abroad.countries.map((c) => codelist.countryName(c)),
                                  arrayHelpers,
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      />
                    </div>

                    <div className="flex w-full mt-4">
                      <ModalLabel label='Oppgi referanse til trygdeavtale' />
                      <FieldInput fieldName="abroad.refToAgreement" fieldValue={formikBag.values.abroad.refToAgreement} />
                    </div>

                    <div className="flex w-full mt-4">
                      <ModalLabel label='Trygdeområde' />
                      <FieldInput fieldName="abroad.businessArea" fieldValue={formikBag.values.abroad.businessArea} />
                    </div>
                  </>
                )}

                <div>
                  <div className="flex w-full mt-4">
                    <ModalLabel label='Hjemmel for unntak fra taushetsplikt er vurdert' />
                    <BoolField fieldName="assessedConfidentiality" value={formikBag.values.assessedConfidentiality} omitUndefined={true} />
                  </div>
                  <Error fieldName="assessedConfidentiality" />
                </div>
                {
                  formikBag.values.assessedConfidentiality !== undefined &&
                  (<>
                    <div>
                      <div className="flex w-full mt-4">
                        <ModalLabel label={formikBag.values.assessedConfidentiality ? 'Hjemmel for unntak fra taushetsplikt, og ev. referanse til vurderingen'
                          : 'Begrunnelse for at hjemmel for unntak for taushetsplikt ikke er vurdert'} />
                        <FieldTextarea fieldName="confidentialityDescription" fieldValue={formikBag.values.confidentialityDescription} />
                      </div>
                      <Error fieldName="confidentialityDescription" />
                    </div>

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
                    <div className="flex w-full justify-between">
                      <div className="w-[48%]">
                        <ModalLabel label='Avdeling' tooltip='Angi hvilken avdeling som har hovedansvar for behandlingen.' />
                      </div>
                    </div>

                    <div className="flex w-full justify-between">
                      <div className="w-[48%]">
                        <FieldDepartment department={formikBag.values.department} fieldName="department" />
                      </div>
                    </div>

                    <div className="flex w-full justify-between mt-2.5">
                      <div className="w-[48%]">
                        <ModalLabel label='Team (Oppslag i Teamkatalogen)' tooltip='Angi hvilke team som har forvaltningsansvaret for IT-systemene.' fullwidth={true} />
                      </div>
                    </div>

                    <div className="flex w-full justify-between">
                      <div className="w-[48%]">
                        <FieldProductTeam productTeams={formikBag.values.productTeams || []} fieldName="productTeams" />
                      </div>
                    </div>
                  </Panel>
                  <Panel
                    title={<PanelTitle title='Behandlingsgrunnlag' expanded={isPanelExpanded} />}
                    onChange={() => {
                      togglePanel()
                      formikBag.setFieldValue('legalBasesOpen', !isPanelExpanded)
                    }}
                    overrides={{ ...panelOverrides }}
                  >
                    <div className="mt-4">
                      <FieldLegalBasis formikBag={formikBag} openArt6OnEmpty />
                    </div>
                    <Error fieldName="legalBasesOpen" fullWidth={true} />
                  </Panel>
                </Accordion>
              </ModalBody>

              <ModalFooter style={{ borderTop: 0 }}>
                <div className="flex justify-end">
                  <div className="self-end">{errorOnCreate && <p>{errorOnCreate}</p>}</div>
                  <Button type="button" kind="tertiary" onClick={() => onClose()}>
                    Avbryt
                  </Button>
                  <ModalButton type="submit">Lagre</ModalButton>
                </div>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  )
}

export default ModalThirdParty
