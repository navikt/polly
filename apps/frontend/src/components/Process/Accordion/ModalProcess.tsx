import {
  Accordion,
  Alert,
  Button,
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
import { Key, useEffect, useState } from 'react'
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
  const [expanded, setExpanded] = useState<Key[]>([])
  const [showResponsibleSelect, setShowResponsibleSelect] = useState<boolean>(
    !!initialValues.commonExternalProcessResponsible
  )

  const [dataProcessors, setDataProcessors] = useState(new Map<string, string>())
  const [thirdParty, setThirdParty] = useState<string>('')
  const [disclosures, setDisclosures] = useState<IDisclosure[]>([])
  const [processorList, setProcessorList] = useState<IProcessor[]>([])
  const [legalBasesOpen, setLegalBasesOpen] = useState<boolean>(false)

  const expand: (panelKey: string) => void = (panelKey: string) => {
    if (expanded.indexOf(panelKey) < 0) {
      setExpanded([panelKey])
    }
  }

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
      <Modal.Body>
        <div className="w-[960px] px-8">
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              submit(values)
            }}
            validationSchema={processSchema(codelistUtils.getCodes(EListName.PURPOSE))}
            render={(formikBag: FormikProps<IProcessFormValues>) => {
              if (formikBag.isValidating && formikBag.isSubmitting && !formikBag.isValid) {
                console.debug(formikBag.errors)
                writeLog('warn', 'submit process', JSON.stringify(formikBag.errors))
                if (formikBag.errors.legalBasesOpen) {
                  expand('legalBasis')
                }
              }
              return (
                <Form id="modal-process-form" onKeyDown={disableEnter}>
                  <CustomizedModalBlock first>
                    <ModalLabel
                      label="Navn"
                      tooltip="Et kort navn som beskriver hva behandlingen går ut på. Eksempel: Saksbehandling, håndtere brukerhenvendelser eller rekruttering."
                    />
                    <FieldName />
                  </CustomizedModalBlock>
                  <Error fieldName="name" />

                  <CustomizedModalBlock>
                    <ModalLabel
                      label="Overordnet behandlingsaktivitet"
                      tooltip="Et kort navn som beskriver hva behandlingen går ut på. Eksempel: Saksbehandling, håndtere brukerhenvendelser eller rekruttering."
                    />
                    <FieldPurpose formikBag={formikBag} codelistUtils={codelistUtils} />
                  </CustomizedModalBlock>
                  <Error fieldName="purposes" />

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
                    <ModalLabel label="Er behandlingen innført i NAV?" />
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
                    <ModalLabel
                      label="Bruker alle opplysningstyper"
                      tooltip="Brukes for å angi at denne behandlingen bruker alle opplysningstyper. Brukes derfor kun unntaksvis for noen spesielle behandlinger som f.eks. logginnsyn, innsyn etter personopplysningsloven, behandlinger knyttet til personvernombudet eller Sikkerhetsseksjonens virksomhet."
                    />
                    <div>
                      <BoolField
                        value={formikBag.values.usesAllInformationTypes}
                        fieldName="usesAllInformationTypes"
                        omitUndefined
                        firstButtonLabel="(Brukes unntaksvis)"
                        direction="horizontal"
                      />
                    </div>
                  </CustomizedModalBlock>

                  <Accordion>
                    <Accordion.Item>
                      <Accordion.Header>Organisering</Accordion.Header>
                      <Accordion.Content>
                        <div className="flex w-full justify-between">
                          <div className="w-[48%]">
                            <ModalLabel
                              label="Avdeling"
                              tooltip="Angi hvilken avdeling som har hovedansvar for behandlingen."
                            />
                          </div>
                          <div className="w-[48%]">
                            <ModalLabel
                              label="Linja"
                              tooltip="Dersom behandlingen utføres i linja, angi hvor i linja behandlingen utføres."
                            />
                          </div>
                        </div>

                        <div className="flex w-full justify-between">
                          <div className="w-[48%]">
                            <FieldDepartment
                              department={formikBag.values.affiliation.nomDepartmentId}
                            />
                          </div>
                          <div className="w-[48%]">
                            <FieldSubDepartments
                              formikBag={formikBag}
                              codelistUtils={codelistUtils}
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
                          <div className="w-[48%]">
                            <ModalLabel
                              fullwidth
                              label="Felles behandlingsansvarlig"
                              tooltip="Er NAV behandlingsansvarlig sammen med annen virksomhet?"
                            />
                          </div>
                        </div>

                        <div className="flex w-full justify-between">
                          <div className="w-[48%]">
                            <FieldProductTeam
                              productTeams={formikBag.values.affiliation.productTeams}
                              fieldName="affiliation.productTeams"
                            />
                          </div>
                          <div className="w-[48%]">
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
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item
                      open={legalBasesOpen}
                      onOpenChange={(open) => {
                        setLegalBasesOpen(open)
                        formikBag.setFieldValue('legalBasesOpen', open)
                      }}
                    >
                      <Accordion.Header className="z-0">
                        Behandlingsgrunnlag for hele behandlingen
                      </Accordion.Header>
                      <Accordion.Content>
                        {legalBasesOpen && (
                          <FieldLegalBasis
                            formikBag={formikBag}
                            openArt6OnEmpty
                            codelistUtils={codelistUtils}
                          />
                        )}
                        <Error fieldName="legalBasesOpen" fullWidth={true} />
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                      <Accordion.Header className="z-0">
                        Automatisering og profilering
                      </Accordion.Header>
                      <Accordion.Content>
                        {' '}
                        <div className="flex w-full mt-4">
                          <ModalLabel
                            label="Treffes det et vedtak eller en avgjørelse som er basert på helautomatisert behandling?"
                            tooltip="Med helautomatisert behandling menes behandling som fører til en individuell avgjørelser eller vedtak uten menneskelig involvering"
                            fullwidth={true}
                          />
                          <BoolField
                            fieldName="automaticProcessing"
                            value={formikBag.values.automaticProcessing}
                            justifyContent={'flex-end'}
                          />
                        </div>
                        <div className="flex w-full mt-4">
                          <ModalLabel
                            label="Benyttes profilering"
                            tooltip="Med profilering menes det å utlede nye egenskaper, tilbøyeligheter eller behov hos en bruker etter sammenligning med andre brukere i liknende omstendigheter"
                          />
                          <BoolField
                            fieldName="profiling"
                            value={formikBag.values.profiling}
                            justifyContent={'flex-end'}
                          />
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
                        {' '}
                        <div className="flex w-full mt-4">
                          <ModalLabel
                            label="Benyttes det KI-systemer for å gjennomføre behandlingen?"
                            tooltip="Registrér om KI-systemer brukes for å realisere formålet med behandlingen."
                            fullwidth={true}
                          />
                          <BoolField
                            fieldName="aiUsageDescription.aiUsage"
                            value={formikBag.values.aiUsageDescription.aiUsage}
                            justifyContent={'flex-end'}
                          />
                        </div>
                        {formikBag.values.aiUsageDescription.aiUsage && (
                          <div className="flex w-full mt-4">
                            <ModalLabel label="Hvilken rolle har KI-systemet? Beskriv for alle KI-systemer som benyttes." />
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
                        )}
                        <div className="flex w-full mt-4">
                          <ModalLabel
                            label="Gjenbrukes personopplysningene til å utvikle KI-systemer?"
                            tooltip="Registrer her dersom personopplysninger innhentet til dette formålet brukes også til utvikling av KI-algoritmer/ systemer. Dette gjelder påstartede prosjekter for å utvikle KI-systemer, som muligens vil bli satt i produksjon i fremtiden."
                          />
                          <BoolField
                            fieldName="aiUsageDescription.reusingPersonalInformation"
                            value={formikBag.values.aiUsageDescription.reusingPersonalInformation}
                            justifyContent={'flex-end'}
                          />
                        </div>
                        {(formikBag.values.aiUsageDescription.aiUsage ||
                          formikBag.values.aiUsageDescription.reusingPersonalInformation) && (
                          <div className="flex w-full mt-4">
                            <ModalLabel label="Velg datoer for bruk av KI-systemer" />
                            <DateFieldsAiUsageDescriptionModal showDates={true} />
                          </div>
                        )}
                        {formikBag.values.aiUsageDescription.reusingPersonalInformation && (
                          <div className="flex w-full mt-4">
                            <ModalLabel label="Registreringsnummer i modellregisteret. Ved flere systemer, oppgi alle registreringsnumre." />
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
                        )}
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                      <Accordion.Header className="z-0">Databehandler</Accordion.Header>
                      <Accordion.Content>
                        {' '}
                        <div className="flex w-full mt-0">
                          <ModalLabel
                            label="Benyttes databehandler(e)"
                            tooltip="En databehandler er en virksomhet som behandler personopplysninger på NAVs vegne."
                          />
                          <BoolField
                            fieldName="dataProcessing.dataProcessor"
                            value={formikBag.values.dataProcessing.dataProcessor}
                          />
                        </div>
                        {formikBag.values.dataProcessing.dataProcessor && (
                          <>
                            <div className="flex w-full mt-4">
                              <ModalLabel label="Databehandler" />
                              <FieldDataProcessors
                                formikBag={formikBag}
                                dataProcessors={dataProcessors}
                                options={processorList.map((processor: IProcessor) => {
                                  return { id: processor.id, label: processor.name }
                                })}
                              />
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
                        <DpiaItems formikBag={formikBag} />
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                      <Accordion.Header className="z-0">Utlevering</Accordion.Header>
                      <Accordion.Content>
                        <CustomizedModalBlock first>
                          <ModalLabel label="Avsender" />
                          <FieldDispatcher formikBag={formikBag} codelistUtils={codelistUtils} />
                        </CustomizedModalBlock>

                        <div className="w-full flex mb-[5px]">
                          <ModalLabel label="Mottaker" />
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

                        <FieldArray
                          name="disclosures"
                          render={(arrayHelpers: FieldArrayRenderProps) => (
                            <div className="w-full">
                              <div className="w-full flex">
                                <ModalLabel label="Utleveringer" />
                                <div className="w-full">
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
                            </div>
                          )}
                        />
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>

                  <CustomizedModalBlock>
                    <ModalLabel label="Status på utfylling" />
                    <div className="flex w-full mt-4">
                      <Field
                        name="status"
                        render={({ form }: FieldProps<IProcessFormValues>) => (
                          <RadioGroup
                            value={formikBag.values.status}
                            legend=""
                            hideLegend
                            className="flex flex-wrap gap-4"
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
                  </CustomizedModalBlock>
                </Form>
              )
            }}
          />
        </div>
      </Modal.Body>

      <Modal.Footer style={{ borderTop: 0 }}>
        <div className="flex justify-end">
          <div className="self-end">{errorOnCreate && <p>{errorOnCreate}</p>}</div>
          <Button type="button" variant="tertiary" onClick={onClose}>
            Avbryt
          </Button>
          <Button type="submit" form="modal-process-form">
            Lagre
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalProcess
