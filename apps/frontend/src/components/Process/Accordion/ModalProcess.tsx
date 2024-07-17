import * as React from 'react'
import { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from 'baseui/modal'
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikProps } from 'formik'
import { Block, BlockProps } from 'baseui/block'
import { Button, KIND } from 'baseui/button'
import { Error, ModalLabel } from '../../common/ModalSchema'
import { Disclosure, ProcessFormValues, Processor, ProcessStatus } from '../../../constants'
import { theme } from '../../../util'
import { processSchema } from '../../common/schema'
import { Panel, PanelOverrides, StatelessAccordion } from 'baseui/accordion'
import CustomizedModalBlock from '../../common/CustomizedModalBlock'
import { DateFieldsProcessModal } from '../DateFieldsProcessModal'
import FieldName from '../common/FieldName'
import FieldPurpose from '../common/FieldPurpose'
import FieldDescription from '../common/FieldDescription'
import FieldDepartment from '../common/FieldDepartment'
import FieldSubDepartments from '../../common/FieldSubDepartments'
import FieldProductTeam from '../../common/form/FieldProductTeam'
import FieldProduct from '../../common/FieldProduct'
import BoolField from '../common/BoolField'
import RetentionItems from '../common/RetentionItems'
import { ALIGN, Radio, RadioGroup } from 'baseui/radio'
import DpiaItems from '../common/DpiaItems'
import FieldRiskOwner from '../common/FieldRiskOwner'
import FieldInput from '../common/FieldInput'
import FieldCommonExternalProcessResponsible from '../common/FieldCommonExternalProcessResponsible'
import { RadioBoolButton } from '../../common/Radio'
import { env } from '../../../util/env'
import { writeLog } from '../../../api/LogApi'
import FieldLegalBasis from '../common/FieldLegalBasis'
import PanelTitle from '../common/PanelTitle'
import FieldAdditionalDescription from '../common/FieldAdditionalDescription'
import { Select, Value } from 'baseui/select'
import { getAll, getDisclosuresByRecipient } from '../../../api'
import { renderTagList } from '../../common/TagList'
import { codelist, ListName } from '../../../service/Codelist'
import { disableEnter } from '../../../util/helper-functions'
import { FlexGridItem } from 'baseui/flex-grid'
import { getProcessorsByIds, getProcessorsByPageAndPageSize } from '../../../api/ProcessorApi'
import FieldDataProcessors from '../common/FieldDataProcessors'
import FieldDispatcher from '../../common/FieldDispatcher'

const modalHeaderProps: BlockProps = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '2rem',
}

const modalBlockProps: BlockProps = {
  width: '960px',
  paddingRight: '2rem',
  paddingLeft: '2rem',
}

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem',
}

type ModalProcessProps = {
  title: string
  isOpen: boolean
  isEdit?: boolean
  initialValues: ProcessFormValues
  errorOnCreate: any | undefined
  submit: (process: ProcessFormValues) => void
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

const ModalProcess = ({ submit, errorOnCreate, onClose, isOpen, initialValues, title }: ModalProcessProps) => {
  const [expanded, setExpanded] = useState<React.Key[]>([])
  const [showResponsibleSelect, setShowResponsibleSelect] = React.useState<boolean>(!!initialValues.commonExternalProcessResponsible)

  const [dataProcessors, setDataProcessors] = useState(new Map<string, string>())
  const [thirdParty, setThirdParty] = useState<Value>([])
  const [disclosures, setDisclosures] = useState<Disclosure[]>([])
  const [processorList, setProcessorList] = useState<Processor[]>([])

  const expand = (panelKey: string) => {
    if (expanded.indexOf(panelKey) < 0) {
      setExpanded([panelKey])
    }
  }

  useEffect(() => {
    ;(async () => {
      if (initialValues.dataProcessing.processors?.length > 0) {
        const res = await getProcessorsByIds(initialValues.dataProcessing.processors)
        const newProcs = new Map<string, string>()
        res.forEach((d) => newProcs.set(d.id, d.name))
        setDataProcessors(newProcs)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (thirdParty.length > 0 && thirdParty[0].id) {
        const res = await getDisclosuresByRecipient(thirdParty[0].id.toString())
        setDisclosures(res)
      }
    })()
  }, [thirdParty])

  useEffect(() => {
    ;(async () => {
      const res = await getAll(getProcessorsByPageAndPageSize)()
      if (res) {
        setProcessorList(res)
      }
    })()
  }, [])

  return (
    <Modal onClose={onClose} isOpen={isOpen} closeable={false} animate size={SIZE.auto} role={ROLE.dialog}>
      <Block {...modalBlockProps}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            submit(values)
          }}
          validationSchema={processSchema()}
          render={(formikBag: FormikProps<ProcessFormValues>) => {
            if (formikBag.isValidating && formikBag.isSubmitting && !formikBag.isValid) {
              console.log(formikBag.errors)
              writeLog('warn', 'submit process', JSON.stringify(formikBag.errors))
              if (formikBag.errors.legalBasesOpen) {
                expand('legalBasis')
              }
            }
            return (
              <Form onKeyDown={disableEnter}>
                <ModalHeader>
                  <Block {...modalHeaderProps}>{title}</Block>
                </ModalHeader>

                <ModalBody>
                  <CustomizedModalBlock first>
                    <ModalLabel label='Navn' tooltip='Et kort navn som beskriver hva behandlingen går ut på. Eksempel: Saksbehandling, håndtere brukerhenvendelser eller rekruttering.' />
                    <FieldName />
                  </CustomizedModalBlock>
                  <Error fieldName="name" />

                  <CustomizedModalBlock>
                    <ModalLabel label='Overordnet behandlingsaktivitet' tooltip='Et kort navn som beskriver hva behandlingen går ut på. Eksempel: Saksbehandling, håndtere brukerhenvendelser eller rekruttering.' />
                    <FieldPurpose formikBag={formikBag} />
                  </CustomizedModalBlock>
                  <Error fieldName="purposes" />

                  <CustomizedModalBlock>
                    <ModalLabel label='Formål med behandlingen' tooltip='Beskriv formålet med å bruke personopplysninger i denne behandlingen. Eksempel: Behandle og vurdere rett til stønad ved behov for førerhund pga nedsatt syn.' />
                    <FieldDescription />
                  </CustomizedModalBlock>
                  <Error fieldName="description" />

                  <CustomizedModalBlock>
                    <ModalLabel label='Ytterligere beskrivelse' tooltip='Personvernrelevant informasjon som ikke passer inn i andre felt kan beskrives her. Eksempelvis om man i behandlingen får uønskede personopplysninger gjennom et fritekstfelt o.l.' />
                    <FieldAdditionalDescription />
                  </CustomizedModalBlock>
                  <Error fieldName="additionalDescription" />

                  <CustomizedModalBlock>
                    <ModalLabel label='Er behandlingen innført i NAV?' />
                    <Block>
                      <BoolField value={formikBag.values.dpia?.processImplemented} fieldName="dpia.processImplemented" omitUndefined />
                    </Block>
                  </CustomizedModalBlock>

                  {!env.disableRiskOwner && (
                    <CustomizedModalBlock>
                      <ModalLabel label='Risikoeier' />
                      <FieldRiskOwner riskOwner={formikBag.values.dpia?.riskOwner} />
                    </CustomizedModalBlock>
                  )}

                  {!env.disableRiskOwner && (
                    <CustomizedModalBlock>
                      <ModalLabel label='Risikoeier funksjon9' />
                      <FieldInput fieldName="dpia.riskOwnerFunction" fieldValue={formikBag.values.dpia?.riskOwnerFunction} />
                    </CustomizedModalBlock>
                  )}

                  <CustomizedModalBlock>
                    <ModalLabel label='Gyldighetsperiode for behandlingen' />
                    <DateFieldsProcessModal showDates={true} showLabels={true} />
                  </CustomizedModalBlock>

                  <CustomizedModalBlock>
                    <ModalLabel label='System' tooltip='Angi hvilke systemer som er primært i bruk i denne behandlingen.' />
                    <FieldProduct formikBag={formikBag} />
                  </CustomizedModalBlock>

                  <CustomizedModalBlock>
                    <ModalLabel label='Bruker alle opplysningstyper' tooltip='Brukes for å angi at denne behandlingen bruker alle opplysningstyper. Brukes derfor kun unntaksvis for noen spesielle behandlinger som f.eks. logginnsyn, innsyn etter personopplysningsloven, behandlinger knyttet til personvernombudet eller Sikkerhetsseksjonens virksomhet.' />
                    <Block>
                      <BoolField
                        value={formikBag.values.usesAllInformationTypes}
                        fieldName="usesAllInformationTypes"
                        omitUndefined
                        firstButtonLabel='(Brukes unntaksvis)'
                      />
                    </Block>
                  </CustomizedModalBlock>

                  <CustomizedModalBlock>
                    <ModalLabel label='Status på utfylling' />
                    <Block {...rowBlockProps}>
                      <Field
                        name="status"
                        render={({ form }: FieldProps<ProcessFormValues>) => (
                          <RadioGroup value={formikBag.values.status} align={ALIGN.horizontal} onChange={(e) => form.setFieldValue('status', (e.target as HTMLInputElement).value)}>
                            <Radio value={ProcessStatus.COMPLETED}>Ferdig dokumentert</Radio>
                            <Radio value={ProcessStatus.IN_PROGRESS}>Under arbeid</Radio>
                            {initialValues.status === ProcessStatus.NEEDS_REVISION && <Radio value={ProcessStatus.NEEDS_REVISION}>Trenger revidering</Radio>}
                          </RadioGroup>
                        )}
                      />
                    </Block>
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
                    onChange={(e) => setExpanded(e.expanded)}
                  >
                    <Panel
                      key="organizing"
                      title={<ModalLabel label={<PanelTitle title='Organisering' expanded={expanded.indexOf('organizing') >= 0} />} />}
                      overrides={{ ...panelOverrides }}
                    >
                      <Block display="flex" width="100%" justifyContent="space-between">
                        <Block width="48%">
                          <ModalLabel label='Avdeling' tooltip='Angi hvilken avdeling som har hovedansvar for behandlingen.' />
                        </Block>
                        <Block width="48%">
                          <ModalLabel label='Linja' tooltip='Dersom behandlingen utføres i linja, angi hvor i linja behandlingen utføres.' />
                        </Block>
                      </Block>

                      <Block display="flex" width="100%" justifyContent="space-between">
                        <Block width="48%">
                          <FieldDepartment department={formikBag.values.affiliation.department} />
                        </Block>
                        <Block width="48%">
                          <FieldSubDepartments formikBag={formikBag} />
                        </Block>
                      </Block>

                      <Block display="flex" width="100%" justifyContent="space-between" marginTop={theme.sizing.scale400}>
                        <Block width="48%">
                          <ModalLabel label='Team (Oppslag i Teamkatalogen)' tooltip='Angi hvilke team som har forvaltningsansvaret for IT-systemene.' fullwidth={true} />
                        </Block>
                        <Block width="48%">
                          <ModalLabel fullwidth label='Felles behandlingsansvarlig' tooltip='Er NAV behandlingsansvarlig sammen med annen virksomhet?' />
                        </Block>
                      </Block>

                      <Block display="flex" width="100%" justifyContent="space-between">
                        <Block width="48%">
                          <FieldProductTeam productTeams={formikBag.values.affiliation.productTeams} fieldName="affiliation.productTeams" />
                        </Block>
                        <Block width="48%">
                          {showResponsibleSelect && (
                            <FieldCommonExternalProcessResponsible
                              thirdParty={formikBag.values.commonExternalProcessResponsible}
                              hideSelect={() => setShowResponsibleSelect(false)}
                            />
                          )}
                          {!showResponsibleSelect && <RadioBoolButton value={showResponsibleSelect} setValue={(b) => setShowResponsibleSelect(b!)} omitUndefined />}
                        </Block>
                      </Block>
                    </Panel>

                    <Panel key="legalBasis" title={<PanelTitle title='Behandlingsgrunnlag for hele behandlingen'expanded={expanded.indexOf('legalBasis') >= 0} />} overrides={{ ...panelOverrides }}>
                      <FieldLegalBasis formikBag={formikBag} openArt6OnEmpty />
                      <Error fieldName="legalBasesOpen" fullWidth={true} />
                    </Panel>

                    <Panel key="automation" title={<PanelTitle title='Automatisering og profilering' expanded={expanded.indexOf('automation') >= 0} />} overrides={{ ...panelOverrides }}>
                      <Block {...rowBlockProps}>
                        <ModalLabel label='Treffes det et vedtak eller en avgjørelse som er basert på helautomatisert behandling?' tooltip='Med helautomatisert behandling menes behandling som fører til en individuell avgjørelser eller vedtak uten menneskelig involvering' fullwidth={true} />
                        <BoolField fieldName="automaticProcessing" value={formikBag.values.automaticProcessing} justifyContent={'flex-end'} />
                      </Block>
                      <Block {...rowBlockProps}>
                        <ModalLabel label='Benyttes profilering' tooltip='Med profilering menes det å utlede nye egenskaper, tilbøyeligheter eller behov hos en bruker etter sammenligning med andre brukere i liknende omstendigheter' />
                        <BoolField fieldName="profiling" value={formikBag.values.profiling} justifyContent={'flex-end'} />
                      </Block>
                    </Panel>

                    <Panel key="dataProcessor" title={<PanelTitle title='Databehandler' expanded={expanded.indexOf('dataProcessor') >= 0} />} overrides={{ ...panelOverrides }}>
                      <Block {...rowBlockProps} marginTop={0}>
                        <ModalLabel label='Benyttes databehandler(e)' tooltip='En databehandler er en virksomhet som behandler personopplysninger på NAVs vegne.' />
                        <BoolField fieldName="dataProcessing.dataProcessor" value={formikBag.values.dataProcessing.dataProcessor} />
                      </Block>

                      {formikBag.values.dataProcessing.dataProcessor && (
                        <>
                          <Block {...rowBlockProps}>
                            <ModalLabel label='Databehandler' />
                            <FieldDataProcessors
                              formikBag={formikBag}
                              dataProcessors={dataProcessors}
                              options={processorList.map((p) => {
                                return {
                                  id: p.id,
                                  label: p.name,
                                }
                              })}
                            />
                          </Block>
                          <Error fieldName="dataProcessing.processors" />
                          <FlexGridItem></FlexGridItem>
                        </>
                      )}
                    </Panel>
                    <Panel key="retention" title={<PanelTitle title='Lagringsbehov' expanded={expanded.indexOf('retention') >= 0} />} overrides={{ ...panelOverrides }}>
                      <RetentionItems formikBag={formikBag} />
                    </Panel>

                    <Panel key="dpia" title={<PanelTitle title='Personkonsekvensvurdering (PVK)' expanded={expanded.indexOf('dpia') >= 0} />} overrides={{ ...panelOverrides }}>
                      <DpiaItems formikBag={formikBag} />
                    </Panel>
                    <Panel key="disclosure" title={<PanelTitle title='Utlevering' expanded={expanded.indexOf('disclosure') >= 0} />} overrides={{ ...panelOverrides }}>
                      <CustomizedModalBlock first>
                        <ModalLabel label='Avsender' />
                        <FieldDispatcher formikBag={formikBag} />
                      </CustomizedModalBlock>

                      <Block width="100%" marginBottom={'5px'} display="flex">
                        <ModalLabel label='Mottaker' />
                        <Select
                          value={thirdParty}
                          options={codelist.getParsedOptions(ListName.THIRD_PARTY).filter((thirdParty) => thirdParty.id != 'NAV')}
                          onChange={({ value }) => {
                            setThirdParty(value)
                          }}
                          overrides={{ Placeholder: { style: { color: 'black' } } }}
                        />
                      </Block>

                      <FieldArray
                        name="disclosures"
                        render={(arrayHelpers: FieldArrayRenderProps) => (
                          <>
                            <Block width="100%">
                              <Block width="100%" display="flex">
                                <ModalLabel label='Utleveringer' />
                                <Block width="100%">
                                  <Select
                                    disabled={thirdParty.length === 0}
                                    noResultsMsg='Ingen eksisterende utleveringer passer til søket. Opprett ny utlevering før du legger den til her.'
                                    options={disclosures.filter((d) => !formikBag.values.disclosures.map((v) => v.id).includes(d.id))}
                                    onChange={(params) => {
                                      arrayHelpers.form.setFieldValue('disclosures', [...formikBag.values.disclosures, ...params.value.map((v) => v)])
                                    }}
                                    labelKey="name"
                                    valueKey="id"
                                    overrides={{ Placeholder: { style: { color: 'black' } } }}
                                  />
                                  <Block>
                                    {renderTagList(
                                      formikBag.values.disclosures.map((d) => d.recipient.shortName + ':' + d.name),
                                      arrayHelpers,
                                    )}
                                  </Block>
                                </Block>
                              </Block>
                            </Block>
                          </>
                        )}
                      />
                    </Panel>
                  </StatelessAccordion>
                </ModalBody>

                <ModalFooter
                  style={{
                    borderTop: 0,
                  }}
                >
                  <Block display="flex" justifyContent="flex-end">
                    <Block alignSelf="flex-end">{errorOnCreate && <p>{errorOnCreate}</p>}</Block>
                    <Button type="button" kind={KIND.tertiary} onClick={onClose}>
                      Avbryt
                    </Button>
                    <ModalButton type="submit">Lagre</ModalButton>
                  </Block>
                </ModalFooter>
              </Form>
            )
          }}
        />
      </Block>
    </Modal>
  )
}

export default ModalProcess
