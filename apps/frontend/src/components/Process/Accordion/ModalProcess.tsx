import {
  Accordion,
  Alert,
  Button,
  ErrorSummary,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Textarea,
} from '@navikt/ds-react'
import {
  Field,
  FieldArray,
  FieldArrayRenderProps,
  FieldProps,
  Form,
  Formik,
  FormikProps,
} from 'formik'
import { useEffect, useRef, useState } from 'react'
import { getAll, getDisclosuresByRecipient } from '../../../api/GetAllApi'
import { writeLog } from '../../../api/LogApi'
import { getProcessorsByIds, getProcessorsByPageAndPageSize } from '../../../api/ProcessorApi'
import { EProcessStatus, IDisclosure, IProcessFormValues, IProcessor } from '../../../constants'
import { EListName, ICodelistProps } from '../../../service/Codelist'
import { env } from '../../../util/env'
import { disableEnter } from '../../../util/helper-functions'
import CustomizedModalBlock from '../../common/CustomizedModalBlock'
import FieldDispatcher from '../../common/FieldDispatcher'
import FieldProduct from '../../common/FieldProduct'
import FieldSubDepartments from '../../common/FieldSubDepartments'
import { Error, ModalLabel } from '../../common/ModalSchema'
import { RadioBoolButton } from '../../common/Radio'
import { renderTagList } from '../../common/TagList'
import FieldProductTeam from '../../common/form/FieldProductTeam'
import { processSchema } from '../../common/schemaValidation'
import { DateFieldsAiUsageDescriptionModal } from '../AiUsageDescription/DateFieldsAiUsageDescriptionModal'
import { DateFieldsProcessModal } from '../DateFieldsProcessModal'
import BoolField from '../common/BoolField'
import DpiaItems from '../common/DpiaItems'
import FieldAdditionalDescription from '../common/FieldAdditionalDescription'
import FieldCommonExternalProcessResponsible from '../common/FieldCommonExternalProcessResponsible'
import FieldDataProcessors from '../common/FieldDataProcessors'
import FieldDepartment from '../common/FieldDepartment'
import FieldDescription from '../common/FieldDescription'
import FieldInput from '../common/FieldInput'
import FieldLegalBasis from '../common/FieldLegalBasis'
import FieldName from '../common/FieldName'
import FieldPurpose from '../common/FieldPurpose'
import FieldRiskOwner from '../common/FieldRiskOwner'
import RetentionItems from '../common/RetentionItems'

const flattenFormikErrors = (
  errors: unknown,
  pathPrefix = ''
): Array<{ path: string; message: string }> => {
  if (!errors) return []

  if (typeof errors === 'string') {
    return [{ path: pathPrefix || 'form', message: errors }]
  }

  if (Array.isArray(errors)) {
    return errors.flatMap((value, index) =>
      flattenFormikErrors(value, pathPrefix ? `${pathPrefix}[${index}]` : String(index))
    )
  }

  if (typeof errors === 'object') {
    return Object.entries(errors as Record<string, unknown>).flatMap(([key, value]) =>
      flattenFormikErrors(value, pathPrefix ? `${pathPrefix}.${key}` : key)
    )
  }

  return []
}

const pathToAnchorId = (path: string): string => {
  if (!path) return 'form'

  if (path.startsWith('purposes')) return 'purposes'

  const root = path.replace(/\[\d+\]/g, '')
  const anchor = root.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '')
  return anchor || 'form'
}

const FormikSubmitEffects = (props: {
  formikBag: FormikProps<IProcessFormValues>
  setLegalBasesOpen: (open: boolean) => void
  setOrganizingOpen: (open: boolean) => void
}) => {
  const { formikBag, setLegalBasesOpen, setOrganizingOpen } = props
  const lastHandledSubmitCount = useRef<number>(0)

  useEffect(() => {
    if (formikBag.submitCount <= lastHandledSubmitCount.current) return

    if (!formikBag.isValid) {
      console.debug(formikBag.errors)
      writeLog('warn', 'submit process', JSON.stringify(formikBag.errors))

      if (formikBag.errors.affiliation) {
        setOrganizingOpen(true)
      }

      if (formikBag.errors.legalBasesOpen) {
        setLegalBasesOpen(true)
        formikBag.setFieldTouched('legalBasesOpen', true, false)
      }
    }

    lastHandledSubmitCount.current = formikBag.submitCount
  }, [formikBag, formikBag.submitCount, formikBag.errors, formikBag.isValid, setLegalBasesOpen])

  return null
}

type TModalProcessProps = {
  codelistUtils: ICodelistProps
  title: string
  isOpen: boolean
  isEdit?: boolean
  initialValues: IProcessFormValues
  errorOnCreate: any | undefined
  submit: (process: IProcessFormValues) => void
  onClose: () => void
}

const ModalProcess = ({
  codelistUtils,
  submit,
  errorOnCreate,
  onClose,
  isOpen,
  initialValues,
  title,
}: TModalProcessProps) => {
  const [showResponsibleSelect, setShowResponsibleSelect] = useState<boolean>(
    !!initialValues.commonExternalProcessResponsible
  )

  const [dataProcessors, setDataProcessors] = useState(new Map<string, string>())
  const [thirdParty, setThirdParty] = useState<string>('')
  const [disclosures, setDisclosures] = useState<IDisclosure[]>([])
  const [processorList, setProcessorList] = useState<IProcessor[]>([])
  const [legalBasesOpen, setLegalBasesOpen] = useState<boolean>(false)
  const [organizingOpen, setOrganizingOpen] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      if (initialValues.dataProcessing.processors?.length > 0) {
        const result = await getProcessorsByIds(initialValues.dataProcessing.processors)
        const newProcs = new Map<string, string>()
        result.forEach((process) => newProcs.set(process.id, process.name))
        setDataProcessors(newProcs)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (thirdParty) {
        const result = await getDisclosuresByRecipient(thirdParty)
        setDisclosures(result)
      }
    })()
  }, [thirdParty])

  useEffect(() => {
    ;(async () => {
      const response: IProcessor[] = await getAll(getProcessorsByPageAndPageSize)()
      if (response) {
        setProcessorList(response)
      }
    })()
  }, [])

  return (
    <Modal onClose={onClose} open={isOpen} header={{ heading: title }} width="960px">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          submit(values)
        }}
        validationSchema={processSchema(codelistUtils.getCodes(EListName.PURPOSE))}
      >
        {(formikBag: FormikProps<IProcessFormValues>) => (
          <>
            <Modal.Body>
              <div className="w-240 px-8">
                <Form id="modal-process-form" onKeyDown={disableEnter}>
                  <FormikSubmitEffects
                    formikBag={formikBag}
                    setLegalBasesOpen={setLegalBasesOpen}
                    setOrganizingOpen={setOrganizingOpen}
                  />

                  <CustomizedModalBlock first>
                    <ModalLabel
                      label="Navn"
                      tooltip="Et kort navn som beskriver hva behandlingen går ut på. Eksempel: Saksbehandling, håndtere brukerhenvendelser eller rekruttering."
                    />
                    <FieldName />
                  </CustomizedModalBlock>

                  <CustomizedModalBlock>
                    <ModalLabel
                      label="Overordnet behandlingsaktivitet"
                      tooltip="Et kort navn som beskriver hva behandlingen går ut på. Eksempel: Saksbehandling, håndtere brukerhenvendelser eller rekruttering."
                    />
                    <FieldPurpose formikBag={formikBag} codelistUtils={codelistUtils} />
                  </CustomizedModalBlock>

                  <CustomizedModalBlock>
                    <ModalLabel
                      label="Formål med behandlingen"
                      tooltip="Beskriv formålet med å bruke personopplysninger i denne behandlingen. Eksempel: Behandle og vurdere rett til stønad ved behov for førerhund pga nedsatt syn."
                    />
                    <FieldDescription />
                  </CustomizedModalBlock>
                  <Error fieldName="description" />

                  <CustomizedModalBlock>
                    <ModalLabel
                      label="Ytterligere beskrivelse"
                      tooltip="Personvernrelevant informasjon som ikke passer inn i andre felt kan beskrives her. Eksempelvis om man i behandlingen får uønskede personopplysninger gjennom et fritekstfelt o.l."
                    />
                    <FieldAdditionalDescription />
                  </CustomizedModalBlock>
                  <Error fieldName="additionalDescription" />

                  <CustomizedModalBlock>
                    <ModalLabel label="Er behandlingen innført i Nav?" />
                    <div>
                      <BoolField
                        value={formikBag.values.dpia?.processImplemented}
                        fieldName="dpia.processImplemented"
                        omitUndefined
                        direction="horizontal"
                      />
                    </div>
                  </CustomizedModalBlock>

                  {!env.disableRiskOwner && (
                    <CustomizedModalBlock>
                      <ModalLabel label="Risikoeier" />
                      <FieldRiskOwner riskOwner={formikBag.values.dpia?.riskOwner} />
                    </CustomizedModalBlock>
                  )}

                  {!env.disableRiskOwner && (
                    <CustomizedModalBlock>
                      <ModalLabel label="Risikoeier funksjon9" />
                      <FieldInput
                        fieldName="dpia.riskOwnerFunction"
                        fieldValue={formikBag.values.dpia?.riskOwnerFunction}
                      />
                    </CustomizedModalBlock>
                  )}

                  <CustomizedModalBlock>
                    <ModalLabel label="Gyldighetsperiode for behandlingen" />
                    <DateFieldsProcessModal showDates={true} showLabels={true} />
                  </CustomizedModalBlock>

                  <CustomizedModalBlock>
                    <ModalLabel
                      label="System"
                      tooltip="Angi hvilke systemer som er primært i bruk i denne behandlingen."
                    />
                    <FieldProduct formikBag={formikBag} codelistUtils={codelistUtils} />
                  </CustomizedModalBlock>

                  <CustomizedModalBlock>
                    <div className="w-full flex flex-col">
                      <ModalLabel
                        fullwidth
                        label="Bruker alle opplysningstyper"
                        tooltip="Brukes for å angi at denne behandlingen bruker alle opplysningstyper. Brukes derfor kun unntaksvis for noen spesielle behandlinger som f.eks. logginnsyn, innsyn etter personopplysningsloven, behandlinger knyttet til personvernombudet eller Sikkerhetsseksjonens virksomhet."
                      />
                      <div className="mt-2">
                        <BoolField
                          value={formikBag.values.usesAllInformationTypes}
                          fieldName="usesAllInformationTypes"
                          omitUndefined
                          firstButtonLabel="(Brukes unntaksvis)"
                          direction="horizontal"
                        />
                      </div>
                    </div>
                  </CustomizedModalBlock>

                  <Accordion>
                    <Accordion.Item open={organizingOpen} onOpenChange={setOrganizingOpen}>
                      <Accordion.Header>Organisering</Accordion.Header>
                      <Accordion.Content>
                        <div className="flex w-full flex-col gap-4">
                          <div className="w-full">
                            <ModalLabel
                              label="Avdeling"
                              tooltip="Angi hvilken avdeling som har hovedansvar for behandlingen."
                            />
                            <div className="mt-2">
                              <FieldDepartment
                                department={formikBag.values.affiliation.nomDepartmentId}
                              />
                            </div>
                          </div>

                          <div className="w-full">
                            <ModalLabel
                              label="Linja"
                              tooltip="Dersom behandlingen utføres i linja, angi hvor i linja behandlingen utføres."
                            />
                            <div className="mt-2">
                              <FieldSubDepartments
                                formikBag={formikBag}
                                codelistUtils={codelistUtils}
                              />
                            </div>
                          </div>

                          <div className="w-full">
                            <ModalLabel
                              label="Team (Oppslag i Teamkatalogen)"
                              tooltip="Angi hvilke team som har forvaltningsansvaret for IT-systemene."
                              fullwidth={true}
                            />
                            <div className="mt-2">
                              <FieldProductTeam
                                productTeams={formikBag.values.affiliation.productTeams}
                                fieldName="affiliation.productTeams"
                              />
                            </div>
                          </div>

                          <div className="w-full">
                            <ModalLabel
                              fullwidth
                              label="Felles behandlingsansvarlig"
                              tooltip="Er Nav behandlingsansvarlig sammen med annen virksomhet?"
                            />
                            <div className="mt-2">
                              {showResponsibleSelect && (
                                <FieldCommonExternalProcessResponsible
                                  thirdParty={formikBag.values.commonExternalProcessResponsible}
                                  hideSelect={() => setShowResponsibleSelect(false)}
                                />
                              )}
                              {!showResponsibleSelect && (
                                <RadioBoolButton
                                  value={showResponsibleSelect}
                                  setValue={(value) => setShowResponsibleSelect(!!value)}
                                  omitUndefined
                                  direction="horizontal"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item
                      open={legalBasesOpen}
                      onOpenChange={(open) => {
                        setLegalBasesOpen(open)
                        formikBag.setFieldValue('legalBasesOpen', open)
                      }}
                    >
                      <Accordion.Header id="legalBasesOpen" className="z-0">
                        Behandlingsgrunnlag for hele behandlingen
                      </Accordion.Header>
                      <Accordion.Content>
                        {legalBasesOpen && (
                          <FieldLegalBasis
                            formikBag={formikBag}
                            openArt6OnEmpty
                            codelistUtils={codelistUtils}
                            layout="vertical"
                          />
                        )}
                        <Error
                          fieldName="legalBasesOpen"
                          fullWidth={true}
                          messageClassName="!text-(--a-text-danger)"
                        />
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                      <Accordion.Header className="z-0">
                        Automatisering og profilering
                      </Accordion.Header>
                      <Accordion.Content>
                        <div className="w-full mt-4">
                          <ModalLabel
                            label="Treffes det et vedtak eller en avgjørelse som er basert på helautomatisert behandling?"
                            tooltip="Med helautomatisert behandling menes behandling som fører til en individuell avgjørelser eller vedtak uten menneskelig involvering"
                            fullwidth={true}
                          />
                          <div className="mt-2">
                            <BoolField
                              fieldName="automaticProcessing"
                              value={formikBag.values.automaticProcessing}
                              direction="horizontal"
                            />
                          </div>
                        </div>
                        <div className="w-full mt-4">
                          <ModalLabel
                            label="Benyttes profilering"
                            tooltip="Med profilering menes det å utlede nye egenskaper, tilbøyeligheter eller behov hos en bruker etter sammenligning med andre brukere i liknende omstendigheter"
                          />
                          <div className="mt-2">
                            <BoolField
                              fieldName="profiling"
                              value={formikBag.values.profiling}
                              direction="horizontal"
                            />
                          </div>
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                      <Accordion.Header className="z-0">
                        <div className="flex">
                          Kunstig intelligens
                          {formikBag.errors.aiUsageDescription &&
                            ((!!formikBag.errors.aiUsageDescription.description &&
                              formikBag.touched.aiUsageDescription?.description) ||
                              (!!formikBag.errors.aiUsageDescription.registryNumber &&
                                formikBag.touched.aiUsageDescription?.registryNumber) ||
                              (!!formikBag.errors.aiUsageDescription.startDate &&
                                formikBag.touched.aiUsageDescription?.startDate)) && (
                              <Alert variant="error" inline className="ml-5">
                                Inneholder feil
                              </Alert>
                            )}
                        </div>
                      </Accordion.Header>
                      <Accordion.Content>
                        <div className="w-full mt-4">
                          <ModalLabel
                            label="Benyttes det KI-systemer for å gjennomføre behandlingen?"
                            tooltip="Registrér om KI-systemer brukes for å realisere formålet med behandlingen."
                            fullwidth={true}
                          />
                          <div className="mt-2">
                            <BoolField
                              fieldName="aiUsageDescription.aiUsage"
                              value={formikBag.values.aiUsageDescription.aiUsage}
                              direction="horizontal"
                            />
                          </div>
                        </div>
                        {formikBag.values.aiUsageDescription.aiUsage && (
                          <div className="w-full mt-4">
                            <ModalLabel label="Hvilken rolle har KI-systemet? Beskriv for alle KI-systemer som benyttes." />
                            <div className="mt-2">
                              <Field name="aiUsageDescription.description">
                                {({ field, form }: FieldProps<string, IProcessFormValues>) => (
                                  <Textarea
                                    className="w-full"
                                    label=""
                                    hideLabel
                                    {...field}
                                    error={
                                      !!form.errors.aiUsageDescription?.description &&
                                      form.touched.aiUsageDescription?.description
                                    }
                                  />
                                )}
                              </Field>
                            </div>
                          </div>
                        )}
                        <div className="w-full mt-4">
                          <ModalLabel
                            label="Gjenbrukes personopplysningene til å utvikle KI-systemer?"
                            tooltip="Registrer her dersom personopplysninger innhentet til dette formålet brukes også til utvikling av KI-algoritmer/ systemer. Dette gjelder påstartede prosjekter for å utvikle KI-systemer, som muligens vil bli satt i produksjon i fremtiden."
                          />
                          <div className="mt-2">
                            <BoolField
                              fieldName="aiUsageDescription.reusingPersonalInformation"
                              value={formikBag.values.aiUsageDescription.reusingPersonalInformation}
                              direction="horizontal"
                            />
                          </div>
                        </div>
                        {(formikBag.values.aiUsageDescription.aiUsage ||
                          formikBag.values.aiUsageDescription.reusingPersonalInformation) && (
                          <div className="w-full mt-4">
                            <ModalLabel label="Velg datoer for bruk av KI-systemer" />
                            <div className="mt-2">
                              <DateFieldsAiUsageDescriptionModal showDates={true} />
                            </div>
                          </div>
                        )}
                        {formikBag.values.aiUsageDescription.reusingPersonalInformation && (
                          <div className="w-full mt-4">
                            <ModalLabel label="Registreringsnummer i modellregisteret. Ved flere systemer, oppgi alle registreringsnumre." />
                            <div className="mt-2">
                              <Field name="aiUsageDescription.registryNumber">
                                {({ field, form }: FieldProps<string, IProcessFormValues>) => (
                                  <Textarea
                                    className="w-full"
                                    label=""
                                    hideLabel
                                    {...field}
                                    error={
                                      !!form.errors.aiUsageDescription?.registryNumber &&
                                      form.touched.aiUsageDescription?.registryNumber
                                    }
                                  />
                                )}
                              </Field>
                            </div>
                          </div>
                        )}
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                      <Accordion.Header className="z-0">Databehandler</Accordion.Header>
                      <Accordion.Content>
                        <div className="w-full mt-0">
                          <ModalLabel
                            fullwidth
                            label="Benyttes databehandler(e)"
                            tooltip="En databehandler er en virksomhet som behandler personopplysninger på vegne av Nav."
                          />
                          <div className="mt-2">
                            <BoolField
                              fieldName="dataProcessing.dataProcessor"
                              value={formikBag.values.dataProcessing.dataProcessor}
                              direction="horizontal"
                            />
                          </div>
                        </div>
                        {formikBag.values.dataProcessing.dataProcessor && (
                          <>
                            <div className="w-full mt-4">
                              <ModalLabel fullwidth label="Databehandler" />
                              <div className="mt-2">
                                <FieldDataProcessors
                                  formikBag={formikBag}
                                  dataProcessors={dataProcessors}
                                  options={processorList.map((processor: IProcessor) => {
                                    return { id: processor.id, label: processor.name }
                                  })}
                                />
                              </div>
                            </div>
                            <Error fieldName="dataProcessing.processors" />
                            <div />
                          </>
                        )}
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                      <Accordion.Header className="z-0">Lagringsbehov</Accordion.Header>
                      <Accordion.Content>
                        <RetentionItems formikBag={formikBag} />
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                      <Accordion.Header className="z-0">
                        Personkonsekvensvurdering (PVK)
                      </Accordion.Header>
                      <Accordion.Content>
                        <DpiaItems formikBag={formikBag} layout="vertical" />
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                      <Accordion.Header className="z-0">Utlevering</Accordion.Header>
                      <Accordion.Content>
                        <div className="w-full">
                          <div className="w-full mt-0">
                            <ModalLabel fullwidth label="Avsender" />
                            <div className="mt-2">
                              <FieldDispatcher
                                formikBag={formikBag}
                                codelistUtils={codelistUtils}
                              />
                            </div>
                          </div>

                          <div className="w-full mt-4">
                            <ModalLabel fullwidth label="Mottaker" />
                            <div className="mt-2">
                              <Select
                                className="w-full"
                                label="Velg Mottaker"
                                hideLabel
                                value={thirdParty}
                                onChange={(event) => setThirdParty(event.target.value)}
                              >
                                <option value="">Velg mottaker</option>
                                {codelistUtils
                                  .getParsedOptions(EListName.THIRD_PARTY)
                                  .filter((thirdParty) => thirdParty.id != 'NAV')
                                  .map((mottaker) => (
                                    <option key={mottaker.id} value={mottaker.id}>
                                      {mottaker.label}
                                    </option>
                                  ))}
                              </Select>
                            </div>
                          </div>

                          <FieldArray
                            name="disclosures"
                            render={(arrayHelpers: FieldArrayRenderProps) => (
                              <div className="w-full mt-4">
                                <ModalLabel fullwidth label="Utleveringer" />
                                <div className="mt-2">
                                  <Select
                                    disabled={thirdParty === ''}
                                    label="Velg utleveringer"
                                    hideLabel
                                    onChange={(event) => {
                                      if (event.target.value) {
                                        arrayHelpers.form.setFieldValue('disclosures', [
                                          ...formikBag.values.disclosures,
                                          disclosures.filter(
                                            (disclosure) => disclosure.id === event.target.value
                                          )[0],
                                        ])
                                      }
                                    }}
                                  >
                                    <option value="">Velg utlevering</option>
                                    {disclosures
                                      .filter(
                                        (disclosure: IDisclosure) =>
                                          !formikBag.values.disclosures
                                            .map((value: IDisclosure) => value.id)
                                            .includes(disclosure.id)
                                      )
                                      .map((disclosure) => (
                                        <option key={disclosure.id} value={disclosure.id}>
                                          {disclosure.name}
                                        </option>
                                      ))}
                                  </Select>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {renderTagList(
                                      formikBag.values.disclosures.map(
                                        (disclosure: IDisclosure) =>
                                          disclosure.recipient.shortName + ':' + disclosure.name
                                      ),
                                      arrayHelpers
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          />
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>

                  <CustomizedModalBlock>
                    <div className="w-full flex flex-col">
                      <ModalLabel fullwidth label="Status på utfylling" />
                      <div className="mt-2">
                        <Field
                          name="status"
                          render={({ form }: FieldProps<IProcessFormValues>) => (
                            <RadioGroup
                              value={formikBag.values.status}
                              legend=""
                              hideLegend
                              className="[&_.aksel-radio-buttons]:flex [&_.aksel-radio-buttons]:flex-row [&_.aksel-radio-buttons]:flex-wrap [&_.aksel-radio-buttons]:gap-4"
                              onChange={(value) => form.setFieldValue('status', value)}
                            >
                              <Radio value={EProcessStatus.COMPLETED}>Ferdig dokumentert</Radio>
                              <Radio value={EProcessStatus.IN_PROGRESS}>Under arbeid</Radio>
                              {initialValues.status === EProcessStatus.NEEDS_REVISION && (
                                <Radio value={EProcessStatus.NEEDS_REVISION}>
                                  Trenger revidering
                                </Radio>
                              )}
                            </RadioGroup>
                          )}
                        />
                      </div>
                    </div>
                  </CustomizedModalBlock>
                </Form>
              </div>
            </Modal.Body>

            <Modal.Footer style={{ borderTop: 0 }}>
              <div className="w-full flex flex-col gap-4">
                {formikBag.submitCount > 0 && Object.keys(formikBag.errors).length > 0 && (
                  <div className="max-h-48 overflow-auto">
                    <ErrorSummary
                      className="polly-error-summary-flush"
                      heading="Du må rette disse feilene før du kan fortsette"
                      size="small"
                    >
                      {Array.from(
                        new Map(
                          flattenFormikErrors(formikBag.errors).map((e) => [
                            pathToAnchorId(e.path),
                            e,
                          ])
                        ).values()
                      ).map((e) => (
                        <ErrorSummary.Item
                          href={`#${pathToAnchorId(e.path)}`}
                          key={e.path}
                          onClick={(event) => {
                            event.preventDefault()
                            const el = document.getElementById(pathToAnchorId(e.path))
                            el?.scrollIntoView({ block: 'center' })
                            ;(el as HTMLElement | null)?.focus?.()
                          }}
                        >
                          {e.message}
                        </ErrorSummary.Item>
                      ))}
                    </ErrorSummary>
                  </div>
                )}

                <div className="flex justify-end">
                  <div className="self-end">{errorOnCreate && <p>{errorOnCreate}</p>}</div>
                  <Button type="button" variant="tertiary" onClick={onClose}>
                    Avbryt
                  </Button>
                  <Button type="submit" form="modal-process-form">
                    Lagre
                  </Button>
                </div>
              </div>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </Modal>
  )
}

export default ModalProcess
