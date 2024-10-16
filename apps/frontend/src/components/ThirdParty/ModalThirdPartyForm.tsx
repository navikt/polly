import { Button, Modal } from '@navikt/ds-react'
import { Accordion, Panel } from 'baseui/accordion'
import { Input } from 'baseui/input'
import { Select, Value } from 'baseui/select'
import { Textarea } from 'baseui/textarea'
import {
  Field,
  FieldArray,
  FieldArrayRenderProps,
  FieldProps,
  Form,
  Formik,
  FormikProps,
} from 'formik'
import { KeyboardEvent, useReducer, useState } from 'react'
import { IDisclosureFormValues, IDocument } from '../../constants'
import { EListName, codelist } from '../../service/Codelist'
import { theme } from '../../util'
import BoolField from '../Process/common/BoolField'
import FieldDepartment from '../Process/common/FieldDepartment'
import FieldLegalBasis from '../Process/common/FieldLegalBasis'
import PanelTitle from '../Process/common/PanelTitle'
import { Error, ModalLabel } from '../common/ModalSchema'
import SelectDocument from '../common/SelectDocument'
import SelectInformationTypes from '../common/SelectInformationTypes'
import SelectProcess from '../common/SelectProcess'
import { renderTagList } from '../common/TagList'
import FieldProductTeam from '../common/form/FieldProductTeam'
import { disclosureSchema } from '../common/schema'

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

interface IFieldRecipientProps {
  value?: string
  disabled: boolean | undefined
}

const FieldRecipient = (props: IFieldRecipientProps) => {
  const { value, disabled } = props
  const [recipientValue, setRecipientValue] = useState<Value>(
    value ? [{ id: value, label: codelist.getShortname(EListName.THIRD_PARTY, value) }] : []
  )

  return (
    <Field
      name="recipient"
      render={({ form }: FieldProps<IDisclosureFormValues>) => (
        <Select
          options={codelist.getParsedOptions(EListName.THIRD_PARTY)}
          onChange={({ value }) => {
            setRecipientValue(value)
            form.setFieldValue('recipient', value.length > 0 ? value[0].id : undefined)
          }}
          value={recipientValue}
          disabled={disabled}
        />
      )}
    />
  )
}

interface IFieldTextareaProps {
  fieldName: string
  fieldValue?: string
  placeholder?: string
}

const FieldTextarea = (props: IFieldTextareaProps) => {
  const { fieldName, fieldValue, placeholder } = props

  return (
    <Field
      name={fieldName}
      render={({ field, form }: FieldProps<string, IDisclosureFormValues>) => (
        <Textarea
          {...field}
          placeholder={placeholder}
          rows={4}
          onKeyDown={(enter: KeyboardEvent<HTMLTextAreaElement>) => {
            if (enter.key === 'Enter') form.setFieldValue(fieldName, fieldValue + '\n')
          }}
        />
      )}
    />
  )
}

interface IFieldInputProps {
  fieldName: string
  fieldValue?: string
}

const FieldInput = (props: IFieldInputProps) => {
  const { fieldName } = props

  return (
    <Field
      name={fieldName}
      render={({ field }: FieldProps<string, IDisclosureFormValues>) => <Input {...field} />}
    />
  )
}

type TModalThirdPartyProps = {
  title?: string
  isOpen: boolean
  disableRecipientField?: boolean | undefined
  initialValues: IDisclosureFormValues
  errorOnCreate: any | undefined
  submit: (values: IDisclosureFormValues) => void
  onClose: () => void
}

const ModalThirdParty = (props: TModalThirdPartyProps) => {
  const { submit, errorOnCreate, onClose, isOpen, disableRecipientField, initialValues, title } =
    props
  const [isPanelExpanded, togglePanel] = useReducer((prevState) => !prevState, false)

  return (
    <Modal onClose={onClose} open={isOpen} header={{ heading: title || '' }} width='992px'>
      <div className="w-[960px] px-8">
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            submit({
              ...values,
              processIds: values.processes.map((process) => process.id),
            })
          }}
          validationSchema={disclosureSchema()}
        >
          {(formikBag: FormikProps<IDisclosureFormValues>) => (
            <Form>
              <Modal.Body>
                <div className="flex w-full mt-4">
                  <ModalLabel label="Mottaker" />
                  <FieldRecipient
                    value={formikBag.values.recipient}
                    disabled={disableRecipientField}
                  />
                </div>

                <div className="flex w-full mt-4">
                  <ModalLabel
                    label="Navn på utlevering"
                    tooltip="Et kort navn som beskriver hva utleveringen går ut på. Eksempel: Utlevering av syke- og uføreopplysninger fra NAV til forsikringsselskap."
                  />
                  <FieldInput fieldName="name" fieldValue={formikBag.values.name} />
                </div>
                <Error fieldName="name" />

                <div className="flex w-full mt-4">
                  <ModalLabel
                    label="Formål med utlevering"
                    tooltip="Beskriv formålet med utleveringen til mottaker. Eksempel: Formålet er å bidra til at forsikringsselskap kan motta opplysninger fra NAV som er nødvendig for å behandle en forsikringssak."
                  />
                  <FieldTextarea
                    fieldName="recipientPurpose"
                    fieldValue={formikBag.values.recipientPurpose}
                  />
                </div>
                <Error fieldName="recipientPurpose" />

                <div className="flex w-full mt-4">
                  <ModalLabel
                    label="Ytterligere beskrivelse"
                    tooltip="Relevant informasjon som ikke passer inn i andre felt kan beskrives her. For eksempel hva slags type informasjon som utleveres, regelmessighet eller lignende."
                  />
                  <FieldTextarea
                    fieldName="description"
                    fieldValue={formikBag.values.description}
                  />
                </div>
                <Error fieldName="description" />

                <div className="flex w-full mt-4">
                  <ModalLabel label="Relaterte behandlinger" />
                  <div className="w-full">
                    <SelectProcess formikBag={formikBag} />
                  </div>
                </div>

                <div className="flex w-full mt-4">
                  <ModalLabel label="Opplysningstyper" />
                  <div className="w-full">
                    <SelectInformationTypes formikBag={formikBag} />
                  </div>
                </div>

                <div className="flex w-full mt-4">
                  <ModalLabel
                    label="Dokument"
                    tooltip="En samling av opplysningstyper. Sykmelding og inntektsmelding er eksempel på dokumenter som inneholder flere opplysningstyper."
                  />
                  <Field
                    name="document"
                    render={({ form }: FieldProps<IDisclosureFormValues>) => (
                      <SelectDocument
                        form={form}
                        handleChange={(document: IDocument | undefined) => {
                          formikBag.setFieldValue('document', document)
                        }}
                      />
                    )}
                  />
                </div>
                <Error fieldName="document" />

                <div className="flex w-full mt-4">
                  <ModalLabel label="Saksnummer i adminstrativt arkiv" />
                  <FieldInput
                    fieldName="administrationArchiveCaseNumber"
                    fieldValue={formikBag.values.administrationArchiveCaseNumber}
                  />
                </div>
                <Error fieldName="administrationArchiveCaseNumber" />

                <div className="flex w-full mt-4">
                  <ModalLabel label="Utleveres personopplysningene til utlandet?" />
                  <BoolField fieldName="abroad.abroad" value={formikBag.values.abroad.abroad} />
                </div>

                {formikBag.values.abroad.abroad && (
                  <>
                    <div className="flex w-full mt-4">
                      <ModalLabel label="Land" />
                      <FieldArray
                        name="abroad.countries"
                        render={(arrayHelpers: FieldArrayRenderProps) => (
                          <div className="w-full">
                            <div>
                              <Select
                                clearable
                                options={codelist
                                  .getCountryCodesOutsideEu()
                                  .map((code) => ({ id: code.code, label: code.description }))
                                  .filter(
                                    (code) => !formikBag.values.abroad.countries.includes(code.id)
                                  )}
                                onChange={({ value }) => {
                                  arrayHelpers.form.setFieldValue('abroad.countries', [
                                    ...formikBag.values.abroad.countries,
                                    ...value.map((v) => v.id),
                                  ])
                                }}
                                maxDropdownHeight={'400px'}
                              />
                            </div>
                            <div>
                              <div>
                                {renderTagList(
                                  formikBag.values.abroad.countries.map((country) =>
                                    codelist.countryName(country)
                                  ),
                                  arrayHelpers
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      />
                    </div>

                    <div className="flex w-full mt-4">
                      <ModalLabel label="Oppgi referanse til trygdeavtale" />
                      <FieldInput
                        fieldName="abroad.refToAgreement"
                        fieldValue={formikBag.values.abroad.refToAgreement}
                      />
                    </div>

                    <div className="flex w-full mt-4">
                      <ModalLabel label="Trygdeområde" />
                      <FieldInput
                        fieldName="abroad.businessArea"
                        fieldValue={formikBag.values.abroad.businessArea}
                      />
                    </div>
                  </>
                )}

                <div>
                  <div className="flex w-full mt-4">
                    <ModalLabel label="Hjemmel for unntak fra taushetsplikt er vurdert" />
                    <BoolField
                      fieldName="assessedConfidentiality"
                      value={formikBag.values.assessedConfidentiality}
                      omitUndefined={true}
                    />
                  </div>
                  <Error fieldName="assessedConfidentiality" />
                </div>
                {formikBag.values.assessedConfidentiality !== undefined && (
                  <>
                    <div>
                      <div className="flex w-full mt-4">
                        <ModalLabel
                          label={
                            formikBag.values.assessedConfidentiality
                              ? 'Hjemmel for unntak fra taushetsplikt, og ev. referanse til vurderingen'
                              : 'Begrunnelse for at hjemmel for unntak for taushetsplikt ikke er vurdert'
                          }
                        />
                        <FieldTextarea
                          fieldName="confidentialityDescription"
                          fieldValue={formikBag.values.confidentialityDescription}
                        />
                      </div>
                      <Error fieldName="confidentialityDescription" />
                    </div>
                  </>
                )}

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
                    title={
                      <ModalLabel
                        label={<PanelTitle title="Organisering" expanded={isPanelExpanded} />}
                      />
                    }
                    overrides={{ ...panelOverrides }}
                  >
                    <div className="flex w-full justify-between">
                      <div className="w-[48%]">
                        <ModalLabel
                          label="Avdeling"
                          tooltip="Angi hvilken avdeling som har hovedansvar for behandlingen."
                        />
                      </div>
                    </div>

                    <div className="flex w-full justify-between">
                      <div className="w-[48%]">
                        <FieldDepartment
                          department={formikBag.values.department}
                          fieldName="department"
                        />
                      </div>
                    </div>

                    <div className="flex w-full justify-between mt-2.5">
                      <div className="w-[48%]">
                        <ModalLabel
                          label="Team (Oppslag i Teamkatalogen)"
                          tooltip="Angi hvilke team som har forvaltningsansvaret for IT-systemene."
                          fullwidth={true}
                        />
                      </div>
                    </div>

                    <div className="flex w-full justify-between">
                      <div className="w-[48%]">
                        <FieldProductTeam
                          productTeams={formikBag.values.productTeams || []}
                          fieldName="productTeams"
                        />
                      </div>
                    </div>
                  </Panel>
                  <Panel
                    title={<PanelTitle title="Behandlingsgrunnlag" expanded={isPanelExpanded} />}
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
              </Modal.Body>

              <Modal.Footer style={{ borderTop: 0 }}>
                <div className="flex justify-end">
                  <div className="self-end">{errorOnCreate && <p>{errorOnCreate}</p>}</div>
                  <Button type="button" variant="tertiary" onClick={() => onClose()}>
                    Avbryt
                  </Button>
                  <Button type="submit">Lagre</Button>
                </div>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  )
}

export default ModalThirdParty
