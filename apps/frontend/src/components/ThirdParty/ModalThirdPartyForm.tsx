import { Accordion, Button, Modal, Select, TextField, Textarea } from '@navikt/ds-react'
import {
  Field,
  FieldArray,
  FieldArrayRenderProps,
  FieldProps,
  Form,
  Formik,
  FormikProps,
  getIn,
} from 'formik'
import { KeyboardEvent, useEffect, useState } from 'react'
import { getAvdelingOptions } from '../../api/NomApi'
import { IDisclosureFormValues, IDocument, TOption } from '../../constants'
import { CodelistService, EListName, ICountryCode } from '../../service/Codelist'
import BoolField from '../Process/common/BoolField'
import FieldLegalBasis from '../Process/common/FieldLegalBasis'
import { Error, ModalLabel } from '../common/ModalSchema'
import SelectDocument from '../common/SelectDocument'
import SelectInformationTypes from '../common/SelectInformationTypes'
import SelectProcess from '../common/SelectProcess'
import { renderTagList } from '../common/TagList'
import FieldProductTeam from '../common/form/FieldProductTeam'
import { disclosureSchema } from '../common/schemaValidation'

interface IFieldRecipientProps {
  value?: string
  disabled: boolean | undefined
}

const FieldRecipient = (props: IFieldRecipientProps) => {
  const { value, disabled } = props
  const [recipientValue, setRecipientValue] = useState<string>(value ? value : '')
  const [codelistUtils] = CodelistService()

  return (
    <Field
      name="recipient"
      render={({ form }: FieldProps<IDisclosureFormValues>) => (
        <Select
          className="w-full"
          label=""
          hideLabel
          aria-label="Velg mottaker"
          onChange={(event) => {
            setRecipientValue(event.target.value)
            form.setFieldValue('recipient', event.target.value ? event.target.value : undefined)
          }}
          value={recipientValue}
          disabled={disabled}
        >
          <option value="">Velg mottaker</option>
          {codelistUtils.getParsedOptions(EListName.THIRD_PARTY).map((thirdparty) => (
            <option key={thirdparty.id} value={thirdparty.id}>
              {thirdparty.label}
            </option>
          ))}
        </Select>
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
    <Field name={fieldName}>
      {({ field, form }: FieldProps<string, IDisclosureFormValues>) => (
        <Textarea
          {...field}
          className="w-full"
          label=""
          hideLabel
          placeholder={placeholder}
          rows={4}
          error={
            !!getIn(form.errors, fieldName) &&
            (!!getIn(form.touched, fieldName) || form.submitCount > 0)
          }
          onKeyDown={(enter: KeyboardEvent<HTMLTextAreaElement>) => {
            if (enter.key === 'Enter') form.setFieldValue(fieldName, fieldValue + '\n')
          }}
        />
      )}
    </Field>
  )
}

interface IFieldInputProps {
  fieldName: string
  fieldValue?: string
}

const FieldInput = (props: IFieldInputProps) => {
  const { fieldName } = props

  return (
    <Field name={fieldName}>
      {({ field }: FieldProps<string, IDisclosureFormValues>) => (
        <TextField className="w-full" {...field} label="" hideLabel />
      )}
    </Field>
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
  const [alleAvdelingOptions, setAlleAvdelingOptions] = useState<TOption[]>([])
  const [codelistUtils] = CodelistService()

  useEffect(() => {
    ;(async () => {
      await getAvdelingOptions().then(setAlleAvdelingOptions)
    })()
  }, [])

  return (
    <Modal onClose={onClose} open={isOpen} header={{ heading: title || '' }} width="1050px">
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
          <>
            <Modal.Body>
              <div className="w-240 px-8">
                <Form id="modal-third-party-form">
                  <div className="w-full mt-4">
                    <ModalLabel label="Mottaker" fullwidth />
                    <div className="mt-2">
                      <FieldRecipient
                        value={formikBag.values.recipient}
                        disabled={disableRecipientField}
                      />
                    </div>
                  </div>

                  <div className="w-full mt-4">
                    <ModalLabel
                      label="Navn på utlevering"
                      tooltip="Et kort navn som beskriver hva utleveringen går ut på. Eksempel: Utlevering av syke- og uføreopplysninger fra NAV til forsikringsselskap."
                      fullwidth
                    />
                    <div className="mt-2">
                      <FieldInput fieldName="name" fieldValue={formikBag.values.name} />
                    </div>
                  </div>
                  <Error fieldName="name" fullWidth />

                  <div className="w-full mt-4">
                    <ModalLabel
                      label="Formål med utlevering"
                      tooltip="Beskriv formålet med utleveringen til mottaker. Eksempel: Formålet er å bidra til at forsikringsselskap kan motta opplysninger fra NAV som er nødvendig for å behandle en forsikringssak."
                      fullwidth
                    />
                    <div className="mt-2">
                      <FieldTextarea
                        fieldName="recipientPurpose"
                        fieldValue={formikBag.values.recipientPurpose}
                      />
                    </div>
                  </div>
                  <Error fieldName="recipientPurpose" fullWidth />

                  <div className="w-full mt-4">
                    <ModalLabel
                      label="Ytterligere beskrivelse"
                      tooltip="Relevant informasjon som ikke passer inn i andre felt kan beskrives her. For eksempel hva slags type informasjon som utleveres, regelmessighet eller lignende."
                      fullwidth
                    />
                    <div className="mt-2">
                      <FieldTextarea
                        fieldName="description"
                        fieldValue={formikBag.values.description}
                      />
                    </div>
                  </div>
                  <Error fieldName="description" fullWidth />

                  <div className="w-full mt-4">
                    <ModalLabel label="Relaterte behandlinger" fullwidth />
                    <div className="mt-2 w-full">
                      <SelectProcess formikBag={formikBag} />
                    </div>
                  </div>

                  <div className="w-full mt-4">
                    <ModalLabel label="Opplysningstyper" fullwidth />
                    <div className="mt-2 w-full">
                      <SelectInformationTypes formikBag={formikBag} />
                    </div>
                  </div>

                  <div className="w-full mt-4">
                    <ModalLabel
                      label="Dokument"
                      tooltip="En samling av opplysningstyper. Sykmelding og inntektsmelding er eksempel på dokumenter som inneholder flere opplysningstyper."
                      fullwidth
                    />
                    <div className="mt-2">
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
                  </div>
                  <Error fieldName="document" fullWidth />

                  <div className="w-full mt-4">
                    <ModalLabel label="Saksnummer i adminstrativt arkiv" fullwidth />
                    <div className="mt-2">
                      <FieldInput
                        fieldName="administrationArchiveCaseNumber"
                        fieldValue={formikBag.values.administrationArchiveCaseNumber}
                      />
                    </div>
                  </div>
                  <Error fieldName="administrationArchiveCaseNumber" fullWidth />

                  <div className="w-full mt-4">
                    <ModalLabel label="Utleveres personopplysningene til utlandet?" fullwidth />
                    <div className="mt-2">
                      <BoolField
                        fieldName="abroad.abroad"
                        value={formikBag.values.abroad.abroad}
                        direction="horizontal"
                        justifyContent="flex-start"
                      />
                    </div>
                  </div>

                  {formikBag.values.abroad.abroad && (
                    <>
                      <div className="w-full mt-4">
                        <ModalLabel label="Land" fullwidth />
                        <div className="mt-2">
                          <FieldArray
                            name="abroad.countries"
                            render={(arrayHelpers: FieldArrayRenderProps) => (
                              <div className="w-full">
                                <div>
                                  <Select
                                    className="w-full"
                                    label=""
                                    hideLabel
                                    aria-label="Velg land"
                                    onChange={(event) => {
                                      if (event.target.value) {
                                        arrayHelpers.form.setFieldValue('abroad.countries', [
                                          ...formikBag.values.abroad.countries,
                                          event.target.value,
                                        ])
                                      }
                                    }}
                                  >
                                    <option value="">Velg land</option>
                                    {codelistUtils
                                      .getCountryCodesOutsideEu()
                                      .map((code: ICountryCode) => ({
                                        id: code.code,
                                        label: code.description,
                                      }))
                                      .filter(
                                        (code) =>
                                          !formikBag.values.abroad.countries.includes(code.id)
                                      )
                                      .map((country) => (
                                        <option key={country.id} value={country.id}>
                                          {country.label}
                                        </option>
                                      ))}
                                  </Select>
                                </div>
                                <div className="mt-2">
                                  {renderTagList(
                                    formikBag.values.abroad.countries.map((country) =>
                                      codelistUtils.countryName(country)
                                    ),
                                    arrayHelpers
                                  )}
                                </div>
                              </div>
                            )}
                          />
                        </div>
                      </div>

                      <div className="w-full mt-4">
                        <ModalLabel label="Oppgi referanse til trygdeavtale" fullwidth />
                        <div className="mt-2">
                          <FieldInput
                            fieldName="abroad.refToAgreement"
                            fieldValue={formikBag.values.abroad.refToAgreement}
                          />
                        </div>
                      </div>

                      <div className="w-full mt-4">
                        <ModalLabel label="Trygdeområde" fullwidth />
                        <div className="mt-2">
                          <FieldInput
                            fieldName="abroad.businessArea"
                            fieldValue={formikBag.values.abroad.businessArea}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="w-full mt-4">
                    <ModalLabel label="Hjemmel for unntak fra taushetsplikt er vurdert" fullwidth />
                    <div className="mt-2">
                      <BoolField
                        fieldName="assessedConfidentiality"
                        value={formikBag.values.assessedConfidentiality}
                        omitUndefined={true}
                        direction="horizontal"
                        justifyContent="flex-start"
                      />
                    </div>
                    <Error fieldName="assessedConfidentiality" fullWidth />
                  </div>
                  {formikBag.values.assessedConfidentiality !== undefined && (
                    <>
                      <div className="w-full mt-4">
                        <ModalLabel
                          label={
                            formikBag.values.assessedConfidentiality
                              ? 'Hjemmel for unntak fra taushetsplikt, og ev. referanse til vurderingen'
                              : 'Begrunnelse for at hjemmel for unntak for taushetsplikt ikke er vurdert'
                          }
                          fullwidth
                        />
                        <div className="mt-2">
                          <FieldTextarea
                            fieldName="confidentialityDescription"
                            fieldValue={formikBag.values.confidentialityDescription}
                          />
                        </div>
                        <Error fieldName="confidentialityDescription" fullWidth />
                      </div>
                    </>
                  )}

                  <Accordion className="mt-5">
                    <Accordion.Item>
                      <Accordion.Header>Organisering</Accordion.Header>
                      <Accordion.Content>
                        <div className="w-full">
                          <ModalLabel
                            label="Avdeling"
                            tooltip="Angi hvilken avdeling som har hovedansvar for behandlingen."
                            fullwidth
                          />

                          <div className="mt-2">
                            <Select
                              className="w-full"
                              label="Velg avdeling"
                              hideLabel
                              aria-label="Velg avdeling"
                              onChange={async (event) => {
                                const selectedValue = event.target.value

                                if (!selectedValue) {
                                  await formikBag.setFieldValue('nomDepartmentId', '')
                                  await formikBag.setFieldValue('nomDepartmentName', '')
                                  return
                                }

                                const selected = alleAvdelingOptions.find(
                                  (avdeling) => String(avdeling.value) === selectedValue
                                )

                                await formikBag.setFieldValue('nomDepartmentId', selectedValue)
                                await formikBag.setFieldValue(
                                  'nomDepartmentName',
                                  typeof selected?.label === 'string'
                                    ? selected?.label
                                    : String(selected?.label ?? '')
                                )
                              }}
                              value={formikBag.values.nomDepartmentId ?? ''}
                            >
                              <option value="">Velg avdeling</option>
                              {alleAvdelingOptions.map((department) => (
                                <option key={department.value} value={department.value}>
                                  {department.label}
                                </option>
                              ))}
                            </Select>
                          </div>

                          <div className="mt-4">
                            <ModalLabel
                              label="Team (Oppslag i Teamkatalogen)"
                              tooltip="Angi hvilke team som har forvaltningsansvaret for IT-systemene."
                              fullwidth
                            />
                            <div className="mt-2">
                              <FieldProductTeam
                                productTeams={formikBag.values.productTeams || []}
                                fieldName="productTeams"
                              />
                            </div>
                          </div>
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item
                      onOpenChange={(open) => formikBag.setFieldValue('legalBasesOpen', open)}
                    >
                      <Accordion.Header>Behandlingsgrunnlag</Accordion.Header>
                      <Accordion.Content>
                        <div className="mt-4">
                          <FieldLegalBasis
                            formikBag={formikBag}
                            openArt6OnEmpty
                            codelistUtils={codelistUtils}
                            layout="vertical"
                          />
                        </div>
                        <Error fieldName="legalBasesOpen" fullWidth={true} />
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
                </Form>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <div className="flex justify-end">
                <div className="self-end">{errorOnCreate && <p>{errorOnCreate}</p>}</div>
                <Button type="button" variant="tertiary" onClick={() => onClose()}>
                  Avbryt
                </Button>
                <Button type="submit" form="modal-third-party-form">
                  Lagre
                </Button>
              </div>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </Modal>
  )
}

export default ModalThirdParty
