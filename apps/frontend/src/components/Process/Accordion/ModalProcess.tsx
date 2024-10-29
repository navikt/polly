import { Panel, PanelOverrides, StatelessAccordion } from 'baseui/accordion'
import { Button, KIND } from 'baseui/button'
import { FlexGridItem } from 'baseui/flex-grid'
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from 'baseui/modal'
import { ALIGN, Radio, RadioGroup } from 'baseui/radio'
import { OnChangeParams, Select, Value } from 'baseui/select'
import {
  Field,
  FieldArray,
  FieldArrayRenderProps,
  FieldProps,
  Form,
  Formik,
  FormikProps,
} from 'formik'
import { ChangeEvent, Key, useEffect, useState } from 'react'
import { getAll, getDisclosuresByRecipient } from '../../../api/GetAllApi'
import { writeLog } from '../../../api/LogApi'
import { getProcessorsByIds, getProcessorsByPageAndPageSize } from '../../../api/ProcessorApi'
import { EProcessStatus, IDisclosure, IProcessFormValues, IProcessor } from '../../../constants'
import { EListName, codelist } from '../../../service/Codelist'
import { theme } from '../../../util'
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
import { processSchema } from '../../common/schema'
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
import PanelTitle from '../common/PanelTitle'
import RetentionItems from '../common/RetentionItems'

type TModalProcessProps = {
  title: string
  isOpen: boolean
  isEdit?: boolean
  initialValues: IProcessFormValues
  errorOnCreate: any | undefined
  submit: (process: IProcessFormValues) => void
  onClose: () => void
}

const panelOverrides: PanelOverrides = {
  Header: {
    style: {
      paddingLeft: '0',
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

const ModalProcess = ({
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
  const [thirdParty, setThirdParty] = useState<Value>([])
  const [disclosures, setDisclosures] = useState<IDisclosure[]>([])
  const [processorList, setProcessorList] = useState<IProcessor[]>([])

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
      if (thirdParty.length > 0 && thirdParty[0].id) {
        const result = await getDisclosuresByRecipient(thirdParty[0].id.toString())
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
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      closeable={false}
      animate
      size={SIZE.auto}
      role={ROLE.dialog}
    >
      <div className="w-[960px] px-8">
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            submit(values)
          }}
          validationSchema={processSchema()}
          render={(formikBag: FormikProps<IProcessFormValues>) => {
            if (formikBag.isValidating && formikBag.isSubmitting && !formikBag.isValid) {
              console.debug(formikBag.errors)
              writeLog('warn', 'submit process', JSON.stringify(formikBag.errors))
              if (formikBag.errors.legalBasesOpen) {
                expand('legalBasis')
              }
            }
            return (
              <Form onKeyDown={disableEnter}>
                <ModalHeader>
                  <div className="flex justify-center mb-8">{title}</div>
                </ModalHeader>

                <ModalBody>
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
                    <FieldPurpose formikBag={formikBag} />
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
                    <FieldProduct formikBag={formikBag} />
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
                      />
                    </div>
                  </CustomizedModalBlock>

                  <StatelessAccordion
                    overrides={{
                      Root: {
                        style: {
                          marginTop: '25px',
                        },
                      },
                    }}
                    expanded={expanded}
                    onChange={(event) => setExpanded(event.expanded)}
                  >
                    <Panel
                      key="organizing"
                      title={
                        <ModalLabel
                          label={
                            <PanelTitle
                              title="Organisering"
                              expanded={expanded.indexOf('organizing') >= 0}
                            />
                          }
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
                        <div className="w-[48%]">
                          <ModalLabel
                            label="Linja"
                            tooltip="Dersom behandlingen utføres i linja, angi hvor i linja behandlingen utføres."
                          />
                        </div>
                      </div>

                      <div className="flex w-full justify-between">
                        <div className="w-[48%]">
                          <FieldDepartment department={formikBag.values.affiliation.department} />
                        </div>
                        <div className="w-[48%]">
                          <FieldSubDepartments formikBag={formikBag} />
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
                            />
                          )}
                        </div>
                      </div>
                    </Panel>

                    <Panel
                      key="legalBasis"
                      title={
                        <PanelTitle
                          title="Behandlingsgrunnlag for hele behandlingen"
                          expanded={expanded.indexOf('legalBasis') >= 0}
                        />
                      }
                      overrides={{ ...panelOverrides }}
                    >
                      <FieldLegalBasis formikBag={formikBag} openArt6OnEmpty />
                      <Error fieldName="legalBasesOpen" fullWidth={true} />
                    </Panel>

                    <Panel
                      key="automation"
                      title={
                        <PanelTitle
                          title="Automatisering og profilering"
                          expanded={expanded.indexOf('automation') >= 0}
                        />
                      }
                      overrides={{ ...panelOverrides }}
                    >
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
                    </Panel>

                    <Panel
                      key="dataProcessor"
                      title={
                        <PanelTitle
                          title="Databehandler"
                          expanded={expanded.indexOf('dataProcessor') >= 0}
                        />
                      }
                      overrides={{ ...panelOverrides }}
                    >
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
                                return {
                                  id: processor.id,
                                  label: processor.name,
                                }
                              })}
                            />
                          </div>
                          <Error fieldName="dataProcessing.processors" />
                          <FlexGridItem></FlexGridItem>
                        </>
                      )}
                    </Panel>
                    <Panel
                      key="retention"
                      title={
                        <PanelTitle
                          title="Lagringsbehov"
                          expanded={expanded.indexOf('retention') >= 0}
                        />
                      }
                      overrides={{ ...panelOverrides }}
                    >
                      <RetentionItems formikBag={formikBag} />
                    </Panel>

                    <Panel
                      key="dpia"
                      title={
                        <PanelTitle
                          title="Personkonsekvensvurdering (PVK)"
                          expanded={expanded.indexOf('dpia') >= 0}
                        />
                      }
                      overrides={{ ...panelOverrides }}
                    >
                      <DpiaItems formikBag={formikBag} />
                    </Panel>
                    <Panel
                      key="disclosure"
                      title={
                        <PanelTitle
                          title="Utlevering"
                          expanded={expanded.indexOf('disclosure') >= 0}
                        />
                      }
                      overrides={{ ...panelOverrides }}
                    >
                      <CustomizedModalBlock first>
                        <ModalLabel label="Avsender" />
                        <FieldDispatcher formikBag={formikBag} />
                      </CustomizedModalBlock>

                      <div className="w-full flex mb-[5px]">
                        <ModalLabel label="Mottaker" />
                        <Select
                          value={thirdParty}
                          options={codelist
                            .getParsedOptions(EListName.THIRD_PARTY)
                            .filter((thirdParty) => thirdParty.id != 'NAV')}
                          onChange={({ value }) => {
                            setThirdParty(value)
                          }}
                          overrides={{ Placeholder: { style: { color: 'black' } } }}
                        />
                      </div>

                      <FieldArray
                        name="disclosures"
                        render={(arrayHelpers: FieldArrayRenderProps) => (
                          <>
                            <div className="w-full">
                              <div className="w-full flex">
                                <ModalLabel label="Utleveringer" />
                                <div className="w-full">
                                  <Select
                                    disabled={thirdParty.length === 0}
                                    noResultsMsg="Ingen eksisterende utleveringer passer til søket. Opprett ny utlevering før du legger den til her."
                                    options={disclosures.filter(
                                      (disclosure: IDisclosure) =>
                                        !formikBag.values.disclosures
                                          .map((value: IDisclosure) => value.id)
                                          .includes(disclosure.id)
                                    )}
                                    onChange={(params: OnChangeParams) => {
                                      arrayHelpers.form.setFieldValue('disclosures', [
                                        ...formikBag.values.disclosures,
                                        ...params.value.map((value) => value),
                                      ])
                                    }}
                                    labelKey="name"
                                    valueKey="id"
                                    overrides={{ Placeholder: { style: { color: 'black' } } }}
                                  />
                                  <div>
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
                          </>
                        )}
                      />
                    </Panel>
                  </StatelessAccordion>
                  <CustomizedModalBlock>
                    <ModalLabel label="Status på utfylling" />
                    <div className="flex w-full mt-4">
                      <Field
                        name="status"
                        render={({ form }: FieldProps<IProcessFormValues>) => (
                          <RadioGroup
                            value={formikBag.values.status}
                            align={ALIGN.horizontal}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              form.setFieldValue('status', (event.target as HTMLInputElement).value)
                            }
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
                </ModalBody>

                <ModalFooter
                  style={{
                    borderTop: 0,
                  }}
                >
                  <div className="flex justify-end">
                    <div className="self-end">{errorOnCreate && <p>{errorOnCreate}</p>}</div>
                    <Button type="button" kind={KIND.tertiary} onClick={onClose}>
                      Avbryt
                    </Button>
                    <ModalButton type="submit">Lagre</ModalButton>
                  </div>
                </ModalFooter>
              </Form>
            )
          }}
        />
      </div>
    </Modal>
  )
}

export default ModalProcess
