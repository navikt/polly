'use client'

import {
  ExclamationmarkTriangleIcon,
  InformationSquareIcon,
  PadlockLockedFillIcon,
  XMarkOctagonIcon,
} from '@navikt/aksel-icons'
import {
  Accordion,
  BodyLong,
  Button,
  ErrorSummary,
  InfoCard,
  InlineMessage,
  List,
  Modal,
  Radio,
  RadioGroup,
  ReadMore,
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
import { isEqual, sortBy } from 'lodash'
import InformationSquare from 'node_modules/@navikt/aksel-icons/dist/react/esm/InformationSquare'
import { useEffect, useMemo, useRef, useState } from 'react'
import AsyncSelect from 'react-select/async'
import { DropdownIndicator, noOptionMessage } from '@/components/common/AsyncSelectComponents'
import { LabelWithDescription } from '@/components/common/LabelWithTooltip'
import { EListName } from '@/constants/codelistConstant'
import { ICodelistProps } from '@/provider/kodeverkProvider'
import { checkForAvvikKeys, organiseringAvvikCheck } from '@/util/processUtils'
import { getAll, getDisclosuresByRecipient, searchProcessOptions } from '../../../api/GetAllApi'
import { writeLog } from '../../../api/LogApi'
import { getProcessorsByIds, getProcessorsByPageAndPageSize } from '../../../api/ProcessorApi'
import {
  EBehandlingsNivaa,
  EProcessStatus,
  IDisclosure,
  IProcess,
  IProcessFormValues,
  IProcessor,
} from '../../../constants'
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
import AvvikTag from '../common/AvvikTag'
import BoolField from '../common/BoolField'
import FieldAdditionalDescription from '../common/FieldAdditionalDescription'
import FieldCommonExternalProcessResponsible from '../common/FieldCommonExternalProcessResponsible'
import FieldDataProcessors from '../common/FieldDataProcessors'
import FieldDepartment from '../common/FieldDepartment'
import FieldDescription from '../common/FieldDescription'
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

const normalizeErrorPath = (path: string): string => path.replace(/\[\d+\]/g, '')

const errorSummaryFieldLabels: Record<string, string> = {
  name: 'Navn',
  purposes: 'Behandlingsaktivitet',
  description: 'Formål med behandlingen',
  additionalDescription: 'Ytterligere beskrivelse',
  'dpia.processImplemented': 'Er behandlingen innført i Nav?',
  legalBasesOpen: 'Behandlingsgrunnlag',
  affiliation: 'Organisering',
}

const errorSummaryLabelForPath = (path: string): string | undefined => {
  const normalizedPath = normalizeErrorPath(path)
  return (
    errorSummaryFieldLabels[normalizedPath] ?? errorSummaryFieldLabels[normalizedPath.split('.')[0]]
  )
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
  forUnderordnetBehandling?: boolean
  overordnetBehandling?: IProcess
  overordnetBehandlingUtleveringer?: IDisclosure[]
  underordnetBehandlingUtleveringer?: IDisclosure[]
  underordnetBehandling?: IProcess
}

const ModalProcess = ({
  codelistUtils,
  submit,
  errorOnCreate,
  onClose,
  isOpen,
  initialValues,
  title,
  forUnderordnetBehandling,
  overordnetBehandling,
  underordnetBehandling,
  overordnetBehandlingUtleveringer,
  underordnetBehandlingUtleveringer,
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
  const avvikKeys = useMemo(() => {
    if (overordnetBehandling && underordnetBehandling) {
      return checkForAvvikKeys(overordnetBehandling, underordnetBehandling)
    }
    return []
  }, [overordnetBehandling, underordnetBehandling])

  const utleveringAvvik = useMemo(() => {
    if (!overordnetBehandlingUtleveringer || !underordnetBehandlingUtleveringer) return false
    console.debug(underordnetBehandlingUtleveringer)

    return !isEqual(
      sortBy(overordnetBehandlingUtleveringer.map((utlevering) => utlevering.id)),
      sortBy(underordnetBehandlingUtleveringer.map((utlevering) => utlevering.id))
    )
  }, [overordnetBehandlingUtleveringer, underordnetBehandlingUtleveringer])

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

  const isOverordnetRelasjonLocked =
    initialValues.behandlingsNivaa === EBehandlingsNivaa.OVERORDNET &&
    initialValues.underordnetBehandlinger &&
    initialValues.underordnetBehandlinger.length > 0

  return (
    <Modal onClose={onClose} open={isOpen} header={{ heading: title }} width='960px'>
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
              <div className='w-full max-w-240 px-8'>
                <Form id='modal-process-form' onKeyDown={disableEnter}>
                  <FormikSubmitEffects
                    formikBag={formikBag}
                    setLegalBasesOpen={setLegalBasesOpen}
                    setOrganizingOpen={setOrganizingOpen}
                  />

                  {forUnderordnetBehandling && (
                    <InfoCard data-color='warning' className='mb-5'>
                      <InfoCard.Header icon={<ExclamationmarkTriangleIcon aria-hidden />}>
                        <InfoCard.Title>
                          Dere må sjekke om innholdet som dere arver fra den overordnede
                          behandlingen, faktisk stemmer.
                        </InfoCard.Title>
                      </InfoCard.Header>
                      <InfoCard.Content>
                        Før dere kan sette behandlingen til ferdig, må dere gjennomgå alle felt og
                        vurdere om det finnes forskjeller mellom det som står i den overordnede
                        behandlingen, og det som gjelder for deres egen behandling. Rediger
                        gjeldende felt i så fall. Felt som dere har redigert, vil vises etter at
                        dere har lagret endringene deres.
                      </InfoCard.Content>
                    </InfoCard>
                  )}

                  {avvikKeys.length > 0 && (
                    <BodyLong className='mb-5'>
                      <strong>
                        Felt som er endret i forhold til den overordnede behandling merkeres med
                        &nbsp;
                        <AvvikTag />
                      </strong>
                    </BodyLong>
                  )}

                  <div className='mb-7'>
                    <FieldName />
                  </div>

                  <ReadMore
                    defaultOpen={forUnderordnetBehandling}
                    header='Skal denne behandlingen være overordnet eller underordnet andre behandlinger?'
                  >
                    Det er mulig å velge at en behandling skal være overordnet eller underordnet
                    andre behandlinger. Dette kan være aktuelt ved:
                    <List as='ul' className='my-5'>
                      <List.Item>
                        Ulik type saksbehandling på Nav-kontor, basert på lovpålagte forpliktelser
                      </List.Item>
                      <List.Item>Inngåelse av avtaler om hjelpemidler</List.Item>
                      <List.Item>Kameraovervåkning på ulike Nav-kontor</List.Item>
                    </List>
                    Det forutsettes at underordnede behandlinger deler samme behandlingsaktivitet
                    som den overordnede behandlingen.
                    {formikBag.values.status !== EProcessStatus.COMPLETED &&
                      !forUnderordnetBehandling && (
                        <div className='mt-7'>
                          <InlineMessage status='info'>
                            <strong>
                              Dersom du vil bruke denne behandlingen som overordnet, må den først
                              fylles ut og så settes til Ferdig utfylt.
                            </strong>
                          </InlineMessage>
                        </div>
                      )}
                    {forUnderordnetBehandling && (
                      <div className='mt-7'>
                        <InlineMessage status='warning'>
                          <strong>
                            Fordi du oppretter en underordnet behandling, kan du ikke endre hvilket
                            behandlingsnivå som er valgt, eller hvilken behandling som denne er
                            underordnet.
                          </strong>
                        </InlineMessage>
                      </div>
                    )}
                    {isOverordnetRelasjonLocked && (
                      <div className='mt-7'>
                        <InlineMessage status='warning'>
                          <strong>
                            Fordi denne behandlingen har underordnede behandlinger, kan du ikke
                            endre hvilket behandlingsnivå som er valgt.
                          </strong>
                        </InlineMessage>
                      </div>
                    )}
                    <div className='mt-7'>
                      <Field name='behandlingsNivaa'>
                        {({ form }: FieldProps<string, IProcessFormValues>) => (
                          <RadioGroup
                            legend={
                              <div className='flex gap-2 items-center'>Velg behandlingsnivå</div>
                            }
                            value={form.values.behandlingsNivaa}
                            onChange={(value: EBehandlingsNivaa) => {
                              form.setFieldValue('behandlingsNivaa', value)
                            }}
                            readOnly={isOverordnetRelasjonLocked || forUnderordnetBehandling}
                          >
                            <Radio value={EBehandlingsNivaa.VANLIG}>
                              Dette er en vanlig behandling uten kobling til andre{' '}
                            </Radio>
                            {form.values.status === EProcessStatus.COMPLETED && (
                              <Radio value={EBehandlingsNivaa.OVERORDNET}>
                                Denne behandlingen skal være overordnet andre
                              </Radio>
                            )}
                            <Radio value={EBehandlingsNivaa.UNDERORDNET}>
                              Denne behandlingen skal være underordnet en annen
                            </Radio>
                          </RadioGroup>
                        )}
                      </Field>
                    </div>
                    {formikBag.values.behandlingsNivaa === EBehandlingsNivaa.OVERORDNET && (
                      <InfoCard data-color='info' className='mt-7'>
                        <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
                          <InfoCard.Title>
                            Denne behandlingen vil nå kunne finnes og brukes som overordnet
                            behandling.
                          </InfoCard.Title>
                        </InfoCard.Header>
                        <InfoCard.Content>
                          Det blir nå mulig å gå inn på andre behandlinger og velge denne
                          behandlingen som overordnet. I så fall vil den andre behandlingen
                          automatisk arve behandlingsaktivitet fra denne behandlingen.
                        </InfoCard.Content>
                      </InfoCard>
                    )}
                    {formikBag.values.behandlingsNivaa === EBehandlingsNivaa.UNDERORDNET && (
                      <div className='mt-7 ml-8'>
                        <LabelWithDescription
                          label='Velg hvilken behandling som skal være den overordnede'
                          description='Skriv minst 3 bokstaver eller sifre for å søke. Kun behandlinger som er satt til “Kan brukes som overordnet” vil vises i søketreff.'
                          icon={
                            forUnderordnetBehandling ? <PadlockLockedFillIcon aria-hidden /> : null
                          }
                        />

                        <AsyncSelect<any>
                          id='overordnetBehandling'
                          isDisabled={forUnderordnetBehandling}
                          className='w-full mt-1'
                          aria-label='Søk etter behandlinger'
                          placeholder='Søk'
                          components={{ DropdownIndicator }}
                          noOptionsMessage={({ inputValue }) => noOptionMessage(inputValue)}
                          loadingMessage={() => 'Søker...'}
                          isClearable={true}
                          value={
                            formikBag.values.overordnetBehandling
                              ? {
                                  ...formikBag.values.overordnetBehandling,
                                  value: formikBag.values.overordnetBehandling.id,
                                  label: `B${formikBag.values.overordnetBehandling.number} ${formikBag.values.overordnetBehandling.purposes[0].shortName}: ${formikBag.values.overordnetBehandling.name}`,
                                }
                              : null
                          }
                          loadOptions={(input) => searchProcessOptions(input, true)}
                          onChange={(val) => {
                            formikBag.setFieldValue(
                              'overordnetBehandling',
                              val ? (val as any).processShort : undefined
                            )

                            if (val && (val as any).purpose) {
                              formikBag.setFieldValue('purposes', [(val as any).purposes[0].code])
                            }
                          }}
                        />

                        <Error fieldName='overordnetBehandling' fullWidth={true} />
                      </div>
                    )}
                  </ReadMore>

                  <div className='my-7'>
                    {formikBag.values.behandlingsNivaa === EBehandlingsNivaa.UNDERORDNET &&
                      formikBag.values.overordnetBehandling &&
                      !forUnderordnetBehandling && (
                        <InfoCard data-color='warning' className='mb-5'>
                          <InfoCard.Message icon={<ExclamationmarkTriangleIcon aria-hidden />}>
                            <strong>
                              Fordi du har valgt at behandlingen skal være underordnet en annen, må
                              du i denne behandlingen bruke samme behandlingsaktivitet som den
                              overordnede.
                            </strong>
                          </InfoCard.Message>
                        </InfoCard>
                      )}
                    {initialValues.behandlingsNivaa === EBehandlingsNivaa.UNDERORDNET &&
                      formikBag.values.behandlingsNivaa !== EBehandlingsNivaa.UNDERORDNET && (
                        <InfoCard data-color='info' className='mb-5'>
                          <InfoCard.Message icon={<InformationSquare aria-hidden />}>
                            <strong>
                              Nå som du har fjernet kobling til overordnet behandling, kan du
                              vurdere om det også blir riktig å endre behandlingsaktivitet.
                            </strong>
                          </InfoCard.Message>
                        </InfoCard>
                      )}
                    <div className='mb-3'>
                      <LabelWithDescription
                        label='Velg behandlingsaktivitet'
                        icon={
                          formikBag.values.behandlingsNivaa === EBehandlingsNivaa.UNDERORDNET &&
                          formikBag.values.overordnetBehandling && (
                            <PadlockLockedFillIcon aria-hidden />
                          )
                        }
                      />
                    </div>
                    <FieldPurpose formikBag={formikBag} codelistUtils={codelistUtils} />
                    {initialValues.purposes.length !== 0 &&
                      initialValues.purposes.toLocaleString() !==
                        formikBag.values.purposes.toLocaleString() && (
                        <InfoCard data-color='info' className='my-5'>
                          <InfoCard.Header icon={<InformationSquare aria-hidden />}>
                            <InfoCard.Title> Du endrer behandlingsaktivitet</InfoCard.Title>
                          </InfoCard.Header>
                          <InfoCard.Content>
                            Som følge vil behandlingen flyttes til den siden som gjelder for den nye
                            behandlingsaktiviteten du har valgt. Etter at du har lagret endringen,
                            vil du få en lenke til behandlingens nye side.
                          </InfoCard.Content>
                        </InfoCard>
                      )}
                  </div>
                  <div className='my-7'>
                    <LabelWithDescription
                      label='Formål med behandlingen'
                      description='Skriv en kort oppsummering, for eksempel “Behandle og vurdere rett til
                        stønad ved behov for førerhund på grunn av nedsatt syn.”'
                      icon={avvikKeys.includes('description') && <AvvikTag />}
                    />
                    <FieldDescription />
                    <Error fieldName='description' fullWidth={true} />
                  </div>
                  <div className='my-7'>
                    <LabelWithDescription
                      label='Ytterligere beskrivelse'
                      description='Personrelevant informasjon som ikke passer inn i andre felt kan beskrives her. For eksempel, om man i behandlingen får uønskede personopplysninger gjennom et fritekstfelt.'
                      icon={avvikKeys.includes('additionalDescription') && <AvvikTag />}
                    />
                    <FieldAdditionalDescription />
                    <Error fieldName='additionalDescription' fullWidth={true} />
                  </div>
                  <div className='my-7'>
                    <LabelWithDescription
                      label='Er behandlingen innført i Nav?'
                      icon={avvikKeys.includes('dpia.processImplemented') && <AvvikTag />}
                    />
                    <BoolField
                      value={formikBag.values.dpia?.processImplemented}
                      fieldName='dpia.processImplemented'
                      omitUndefined
                      direction='horizontal'
                    />
                  </div>
                  {!env.disableRiskOwner && (
                    <div className='my-7'>
                      <LabelWithDescription
                        label='Risikoeier'
                        icon={avvikKeys.includes('dpia.riskOwner') && <AvvikTag />}
                      />
                      <FieldRiskOwner riskOwner={formikBag.values.dpia?.riskOwner} />
                    </div>
                  )}
                  <DateFieldsProcessModal
                    showDates={true}
                    showLabels={true}
                    avvikKeys={avvikKeys}
                  />
                  <div className='my-7'>
                    <LabelWithDescription
                      label='Angi hvilke systemer som er primært i bruk i denne behandlingen'
                      icon={avvikKeys.includes('affiliation.products') && <AvvikTag />}
                    />
                    <FieldProduct formikBag={formikBag} codelistUtils={codelistUtils} />
                  </div>
                  <div className='my-7'>
                    <LabelWithDescription
                      label='Bruker behandlingen alle opplysningstyper?'
                      description='De aller fleste behandlinger vil ikke bruke alle opplysningstyper. Det vil kun skje unntaksvis for noen spesielle behandlinger, eksempelvis logginnsyn, innsyn etter personopplysningsloven, behandlinger knyttet til personvernombudet eller Sikkerhetsseksjonens virksomhet.'
                      icon={avvikKeys.includes('usesAllInformationTypes') && <AvvikTag />}
                    />
                    <BoolField
                      value={formikBag.values.usesAllInformationTypes}
                      fieldName='usesAllInformationTypes'
                      omitUndefined
                      firstButtonLabel='(Brukes unntaksvis)'
                      direction='horizontal'
                      reverseOrder
                    />
                  </div>

                  {formikBag.values.usesAllInformationTypes === false && (
                    <InfoCard data-color='warning' className='my-7'>
                      <InfoCard.Message icon={<ExclamationmarkTriangleIcon aria-hidden />}>
                        Fordi du har valgt “Nei, bruker ikke alle”, må du når du lagrer behandlingen
                        legge til opplysninger nederst i behandlingen.
                      </InfoCard.Message>
                    </InfoCard>
                  )}

                  <Accordion>
                    <Accordion.Item open={organizingOpen} onOpenChange={setOrganizingOpen}>
                      <Accordion.Header>
                        {organiseringAvvikCheck(avvikKeys) && <AvvikTag />} Organisering
                      </Accordion.Header>
                      <Accordion.Content>
                        <div className='flex w-full flex-col gap-4'>
                          <div className='w-full'>
                            <LabelWithDescription
                              label='Avdeling'
                              description='Angi hvilken avdeling som har hovedansvar for behandlingen.'
                              icon={
                                avvikKeys.includes('affiliation.nomDepartmentId') && <AvvikTag />
                              }
                            />
                            <div className='mt-2'>
                              <FieldDepartment
                                department={formikBag.values.affiliation.nomDepartmentId}
                              />
                            </div>
                          </div>

                          <div className='w-full'>
                            <LabelWithDescription
                              label='Linja'
                              description='Dersom behandlingen utføres i linja, angi hvor i linja behandlingen utføres.'
                              icon={
                                avvikKeys.includes('affiliation.subDepartments') && <AvvikTag />
                              }
                            />
                            <div className='mt-2'>
                              <FieldSubDepartments
                                formikBag={formikBag}
                                codelistUtils={codelistUtils}
                              />
                            </div>
                          </div>

                          <div className='w-full'>
                            <LabelWithDescription
                              label='Team (Oppslag i Teamkatalogen)'
                              description='Angi hvilke team som har forvaltningsansvaret for IT-systemene.'
                              icon={avvikKeys.includes('affiliation.productTeams') && <AvvikTag />}
                            />
                            <div className='mt-2'>
                              <FieldProductTeam
                                productTeams={formikBag.values.affiliation.productTeams}
                                fieldName='affiliation.productTeams'
                              />
                            </div>
                          </div>

                          <div className='w-full'>
                            <LabelWithDescription
                              label='Felles behandlingsansvarlig'
                              description='Er Nav behandlingsansvarlig sammen med annen virksomhet?'
                              icon={
                                avvikKeys.includes('commonExternalProcessResponsible') && (
                                  <AvvikTag />
                                )
                              }
                            />
                            <div className='mt-2 mb-4'>
                              <RadioBoolButton
                                value={showResponsibleSelect}
                                setValue={(value) => {
                                  setShowResponsibleSelect(!!value)
                                  if (!value) {
                                    formikBag.setFieldValue('commonExternalProcessResponsible', '')
                                  }
                                }}
                                omitUndefined
                                direction='horizontal'
                              />
                              {showResponsibleSelect && (
                                <div className='mt-2'>
                                  <FieldCommonExternalProcessResponsible
                                    thirdParty={formikBag.values.commonExternalProcessResponsible}
                                    hideSelect={() => setShowResponsibleSelect(false)}
                                  />
                                </div>
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
                      <Accordion.Header id='legalBasesOpen' className='z-0'>
                        {avvikKeys.includes('legalBases') && <AvvikTag />} Behandlingsgrunnlag for
                        hele behandlingen
                      </Accordion.Header>
                      <Accordion.Content>
                        {legalBasesOpen && (
                          <FieldLegalBasis
                            formikBag={formikBag}
                            openArt6OnEmpty
                            codelistUtils={codelistUtils}
                            layout='vertical'
                          />
                        )}
                        <Error
                          fieldName='legalBasesOpen'
                          fullWidth={true}
                          messageClassName='!text-(--a-text-danger)'
                        />
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                      <Accordion.Header className='z-0'>
                        {(avvikKeys.includes('automaticProcessing') ||
                          avvikKeys.includes('profiling')) && <AvvikTag />}{' '}
                        Automatisering og profilering
                      </Accordion.Header>
                      <Accordion.Content>
                        <div className='w-full mt-4'>
                          <LabelWithDescription
                            label='Treffes det et vedtak eller en avgjørelse som er basert på helautomatisert behandling?'
                            description='Med helautomatisert behandling menes behandling som fører til en individuell avgjørelser eller vedtak uten menneskelig involvering'
                            icon={avvikKeys.includes('automaticProcessing') && <AvvikTag />}
                          />
                          <div className='mt-2'>
                            <BoolField
                              fieldName='automaticProcessing'
                              value={formikBag.values.automaticProcessing}
                              direction='horizontal'
                            />
                          </div>
                        </div>
                        <div className='w-full mt-4'>
                          <LabelWithDescription
                            label='Benyttes profilering'
                            description='Med profilering menes det å utlede nye egenskaper, tilbøyeligheter eller behov hos en bruker etter sammenligning med andre brukere i liknende omstendigheter'
                            icon={avvikKeys.includes('profiling') && <AvvikTag />}
                          />
                          <div className='mt-2'>
                            <BoolField
                              fieldName='profiling'
                              value={formikBag.values.profiling}
                              direction='horizontal'
                            />
                          </div>
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                      <Accordion.Header className='z-0'>
                        <div className='flex items-center gap-1'>
                          {avvikKeys.some((key: string) => key.includes('aiUsageDescription')) && (
                            <AvvikTag />
                          )}{' '}
                          Kunstig intelligens
                          {formikBag.errors.aiUsageDescription &&
                            ((!!formikBag.errors.aiUsageDescription.description &&
                              formikBag.touched.aiUsageDescription?.description) ||
                              (!!formikBag.errors.aiUsageDescription.registryNumber &&
                                formikBag.touched.aiUsageDescription?.registryNumber) ||
                              (!!formikBag.errors.aiUsageDescription.startDate &&
                                formikBag.touched.aiUsageDescription?.startDate)) && (
                              <InfoCard data-color='danger' className='ml-5' size='small'>
                                <InfoCard.Message icon={<XMarkOctagonIcon aria-hidden />}>
                                  Inneholder feil
                                </InfoCard.Message>
                              </InfoCard>
                            )}
                        </div>
                      </Accordion.Header>
                      <Accordion.Content>
                        <div className='w-full mt-4'>
                          <LabelWithDescription
                            label='Benyttes det KI-systemer for å gjennomføre behandlingen?'
                            description='Registrér om KI-systemer brukes for å realisere formålet med behandlingen.'
                            icon={avvikKeys.includes('aiUsageDescription.aiUsage') && <AvvikTag />}
                          />
                          <div className='mt-2'>
                            <BoolField
                              fieldName='aiUsageDescription.aiUsage'
                              value={formikBag.values.aiUsageDescription.aiUsage}
                              direction='horizontal'
                            />
                          </div>
                        </div>
                        {formikBag.values.aiUsageDescription.aiUsage && (
                          <div className='w-full mt-4'>
                            <LabelWithDescription
                              label='Hvilken rolle har KI-systemet? Beskriv for alle KI-systemer som benyttes.'
                              icon={
                                avvikKeys.includes('aiUsageDescription.description') && <AvvikTag />
                              }
                            />
                            <div className='mt-2'>
                              <Field name='aiUsageDescription.description'>
                                {({ field, form }: FieldProps<string, IProcessFormValues>) => (
                                  <Textarea
                                    className='w-full'
                                    label=''
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
                        <div className='w-full mt-4'>
                          <LabelWithDescription
                            label='Gjenbrukes personopplysningene til å utvikle KI-systemer?'
                            description='Registrer her dersom personopplysninger innhentet til dette formålet brukes også til utvikling av KI-algoritmer/ systemer. Dette gjelder påstartede prosjekter for å utvikle KI-systemer, som muligens vil bli satt i produksjon i fremtiden.'
                            icon={
                              avvikKeys.includes(
                                'aiUsageDescription.reusingPersonalInformation'
                              ) && <AvvikTag />
                            }
                          />
                          <div className='mt-2'>
                            <BoolField
                              fieldName='aiUsageDescription.reusingPersonalInformation'
                              value={formikBag.values.aiUsageDescription.reusingPersonalInformation}
                              direction='horizontal'
                            />
                          </div>
                        </div>
                        {(formikBag.values.aiUsageDescription.aiUsage ||
                          formikBag.values.aiUsageDescription.reusingPersonalInformation) && (
                          <div className='w-full mt-4'>
                            <LabelWithDescription
                              label='Velg datoer for bruk av KI-systemer'
                              icon={
                                (avvikKeys.includes('aiUsageDescription.startDate') ||
                                  avvikKeys.includes('aiUsageDescription.endDate')) && <AvvikTag />
                              }
                            />
                            <div className='mt-2'>
                              <DateFieldsAiUsageDescriptionModal
                                showDates={true}
                                hasStartDateAvvik={avvikKeys.includes('aiUsageDescription.endDate')}
                                hasEndDateAvvik={avvikKeys.includes('aiUsageDescription.startDate')}
                              />
                            </div>
                          </div>
                        )}
                        {formikBag.values.aiUsageDescription.reusingPersonalInformation && (
                          <div className='w-full mt-4'>
                            <LabelWithDescription
                              label='Registreringsnummer i modellregisteret. Ved flere systemer, oppgi alle registreringsnumre.'
                              icon={
                                avvikKeys.includes('aiUsageDescription.registryNumber') && (
                                  <AvvikTag />
                                )
                              }
                            />
                            <div className='mt-2'>
                              <Field name='aiUsageDescription.registryNumber'>
                                {({ field, form }: FieldProps<string, IProcessFormValues>) => (
                                  <Textarea
                                    className='w-full'
                                    label=''
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
                      <Accordion.Header className='z-0'>
                        {avvikKeys.includes('dataProcessing.dataProcessor') && <AvvikTag />}{' '}
                        Databehandler
                      </Accordion.Header>
                      <Accordion.Content>
                        <div className='w-full mt-0'>
                          <LabelWithDescription
                            label='Benyttes databehandler(e)'
                            description='En databehandler er en virksomhet som behandler personopplysninger på vegne av Nav.'
                            icon={
                              avvikKeys.includes('dataProcessing.dataProcessor') && <AvvikTag />
                            }
                          />
                          <div className='mt-2'>
                            <BoolField
                              fieldName='dataProcessing.dataProcessor'
                              value={formikBag.values.dataProcessing.dataProcessor}
                              direction='horizontal'
                            />
                          </div>
                        </div>
                        {formikBag.values.dataProcessing.dataProcessor && (
                          <>
                            <div className='w-full mt-4'>
                              <LabelWithDescription label='Databehandler' />
                              <div className='mt-2'>
                                <FieldDataProcessors
                                  formikBag={formikBag}
                                  dataProcessors={dataProcessors}
                                  options={processorList.map((processor: IProcessor) => {
                                    return { id: processor.id, label: processor.name }
                                  })}
                                />
                              </div>
                            </div>
                            <Error fieldName='dataProcessing.processors' />
                            <div />
                          </>
                        )}
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                      <Accordion.Header className='z-0'>
                        {avvikKeys.some((key: string) => key.includes('retention')) && <AvvikTag />}{' '}
                        Lagringsbehov
                      </Accordion.Header>
                      <Accordion.Content>
                        <RetentionItems formikBag={formikBag} avvikKeys={avvikKeys} />
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                      <Accordion.Header className='z-0'>
                        {(utleveringAvvik ||
                          avvikKeys.includes('affiliation.disclosureDispatchers')) && (
                          <AvvikTag />
                        )}{' '}
                        Utlevering
                      </Accordion.Header>
                      <Accordion.Content>
                        <div className='w-full'>
                          <div className='w-full mt-0'>
                            <LabelWithDescription
                              label='Avsender'
                              icon={
                                avvikKeys.includes('affiliation.disclosureDispatchers') && (
                                  <AvvikTag />
                                )
                              }
                            />
                            <div className='mt-2'>
                              <FieldDispatcher
                                formikBag={formikBag}
                                codelistUtils={codelistUtils}
                              />
                            </div>
                          </div>

                          <div className='w-full mt-4'>
                            <LabelWithDescription label='Mottaker' />
                            <div className='mt-2'>
                              <Select
                                className='w-full'
                                label='Velg Mottaker'
                                hideLabel
                                value={thirdParty}
                                onChange={(event) => setThirdParty(event.target.value)}
                              >
                                <option value=''>Velg mottaker</option>
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
                            name='disclosures'
                            render={(arrayHelpers: FieldArrayRenderProps) => (
                              <div className='w-full mt-4'>
                                <LabelWithDescription
                                  label='Utleveringer'
                                  icon={utleveringAvvik && <AvvikTag />}
                                />
                                <div className='mt-2'>
                                  <Select
                                    disabled={thirdParty === ''}
                                    label='Velg utleveringer'
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
                                    <option value=''>Velg utlevering</option>
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
                                  <div className='mt-2 flex flex-wrap gap-2'>
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
                    <div className='w-full flex flex-col'>
                      <ModalLabel fullwidth label='Status på utfylling' />
                      <div className='mt-2'>
                        <Field name='status'>
                          {({ form }: FieldProps<IProcessFormValues>) => (
                            <RadioGroup
                              value={formikBag.values.status}
                              legend=''
                              hideLegend
                              className='[&_.aksel-radio-buttons]:flex [&_.aksel-radio-buttons]:flex-row [&_.aksel-radio-buttons]:flex-wrap [&_.aksel-radio-buttons]:gap-4'
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
                        </Field>
                      </div>
                    </div>
                  </CustomizedModalBlock>
                </Form>
              </div>
            </Modal.Body>

            <Modal.Footer style={{ borderTop: 0 }}>
              <div className='w-full flex flex-col gap-4'>
                {formikBag.submitCount > 0 && Object.keys(formikBag.errors).length > 0 && (
                  <div className='max-h-48 overflow-auto'>
                    <ErrorSummary
                      className='polly-error-summary-flush'
                      heading='Du må rette disse feilene før du kan fortsette'
                      size='small'
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
                          {(() => {
                            const label = errorSummaryLabelForPath(e.path)
                            return label ? `${label}: ${e.message}` : e.message
                          })()}
                        </ErrorSummary.Item>
                      ))}
                    </ErrorSummary>
                  </div>
                )}

                <div className='flex items-end justify-between gap-4'>
                  <div className='self-end'>{errorOnCreate && <p>{errorOnCreate}</p>}</div>
                  <div className='flex justify-end gap-2'>
                    <Button type='button' variant='tertiary' onClick={onClose}>
                      Avbryt
                    </Button>
                    <Button type='submit' form='modal-process-form'>
                      Lagre
                    </Button>
                  </div>
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
