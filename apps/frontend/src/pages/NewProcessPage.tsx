import { ModalBody, ModalButton, ModalFooter } from 'baseui/modal'
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikProps } from 'formik'
import CustomizedModalBlock from '../components/common/CustomizedModalBlock'
import { ModalLabel, Error } from '../components/common/ModalSchema'
import FieldName from '../components/Process/common/FieldName'
import FieldPurpose from '../components/Process/common/FieldPurpose'
import FieldRiskOwner from '../components/Process/common/FieldRiskOwner'
import FieldInput from '../components/Process/common/FieldInput'
import { DateFieldsProcessModal } from '../components/Process/DateFieldsProcessModal'
import { intl, theme } from '../util'
import { env } from '../util/env'
import { Block, BlockProps } from 'baseui/block'
import BoolField from '../components/Process/common/BoolField'
import FieldAdditionalDescription from '../components/Process/common/FieldAdditionalDescription'
import FieldDescription from '../components/Process/common/FieldDescription'
import { disableEnter } from '../util/helper-functions'
import { writeLog } from '../api/LogApi'
import { Disclosure, ProcessFormValues, ProcessStatus, Processor } from '../constants'
import { processSchema } from '../components/common/schema'
import { convertDisclosureToFormValues, convertProcessToFormValues, createProcess, getAll, getDisclosuresByRecipient, updateDisclosure } from '../api'
import { Section, genProcessPath } from './ProcessPage'
import { useNavigate } from 'react-router-dom'
import FieldProduct from '../components/common/FieldProduct'
import { ALIGN, Radio, RadioGroup } from 'baseui/radio'
import { Panel, PanelOverrides, StatelessAccordion } from 'baseui/accordion'
import { useEffect, useState } from 'react'
import { Select, Value } from 'baseui/select'
import { getProcessorsByPageAndPageSize } from '../api/ProcessorApi'
import FieldDepartment from '../components/Process/common/FieldDepartment'
import FieldSubDepartments from '../components/common/FieldSubDepartments'
import FieldProductTeam from '../components/common/form/FieldProductTeam'
import FieldCommonExternalProcessResponsible from '../components/Process/common/FieldCommonExternalProcessResponsible'
import { RadioBoolButton } from '../components/common/Radio'
import PanelTitle from '../components/Process/common/PanelTitle'
import FieldLegalBasis from '../components/Process/common/FieldLegalBasis'
import FieldDataProcessors from '../components/Process/common/FieldDataProcessors'
import { FlexGridItem } from 'baseui/flex-grid'
import RetentionItems from '../components/Process/common/RetentionItems'
import DpiaItems from '../components/Process/common/DpiaItems'
import FieldDispatcher from '../components/common/FieldDispatcher'
import { ListName, codelist } from '../service/Codelist'
import { renderTagList } from '../components/common/TagList'

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem',
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

export const NewProcessPage = () => {
  const initialValues = convertProcessToFormValues()

  const [expanded, setExpanded] = useState<React.Key[]>([])
  const [showResponsibleSelect, setShowResponsibleSelect] = useState<boolean>(!!initialValues.commonExternalProcessResponsible)

  const [dataProcessors, setDataProcessors] = useState(new Map<string, string>())
  const [thirdParty, setThirdParty] = useState<Value>([])
  const [disclosures, setDisclosures] = useState<Disclosure[]>([])
  const [processorList, setProcessorList] = useState<Processor[]>([])

  const navigate = useNavigate()

  const expand = (panelKey: string) => {
    if (expanded.indexOf(panelKey) < 0) {
      setExpanded([panelKey])
    }
  }

  const submit = async (process: ProcessFormValues) => {
    if (!process) return
    try {
      const newProcess = await createProcess(process)
      // todo multipurpose url
      navigate(genProcessPath(Section.purpose, newProcess.purposes[0].code, newProcess, undefined, true))
      process.disclosures.forEach((d) => {
        updateDisclosure(convertDisclosureToFormValues({ ...d, processIds: [...d.processIds, newProcess.id] }))
      })
    } catch (err: any) {
      console.log('oh no')
    }
  }

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
    <Block>
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
              <div className="flex flex-col gap-2 max-w-3xl">
                <FieldPurpose formikBag={formikBag} />
                <Error fieldName="purposes" />
                <FieldName />
                <Error fieldName="name" />

                <FieldDescription />
                <Error fieldName="description" />

                {
                  //todo: remove :)
                }
                <FieldAdditionalDescription />
                <Error fieldName="additionalDescription" />

                <FieldLegalBasis formikBag={formikBag} openArt6OnEmpty />
                <Error fieldName="legalBasesOpen" fullWidth={true} />


                <ModalLabel label={intl.isProcessImplemented} />
                <Block>
                  <BoolField value={formikBag.values.dpia?.processImplemented} fieldName="dpia.processImplemented" omitUndefined />
                </Block>

                {!env.disableRiskOwner && (
                  <CustomizedModalBlock>
                    <ModalLabel label={intl.riskOwner} />
                    <FieldRiskOwner riskOwner={formikBag.values.dpia?.riskOwner} />
                  </CustomizedModalBlock>
                )}

                {!env.disableRiskOwner && (
                  <CustomizedModalBlock>
                    <ModalLabel label={intl.riskOwnerFunction} />
                    <FieldInput fieldName="dpia.riskOwnerFunction" fieldValue={formikBag.values.dpia?.riskOwnerFunction} />
                  </CustomizedModalBlock>
                )}

                <CustomizedModalBlock>
                  <ModalLabel label={intl.validityOfProcess} />
                  <DateFieldsProcessModal showDates={true} showLabels={true} rowBlockProps={rowBlockProps} />
                </CustomizedModalBlock>

                <CustomizedModalBlock>
                  <ModalLabel label={intl.system} tooltip={intl.systemHelpText} />
                  <FieldProduct formikBag={formikBag} />
                </CustomizedModalBlock>

                <CustomizedModalBlock>
                  <ModalLabel label={intl.USES_ALL_INFO_TYPE} tooltip={intl.usesAllInformationTypesHelpText} />
                  <Block>
                    <BoolField value={formikBag.values.usesAllInformationTypes} fieldName="usesAllInformationTypes" omitUndefined firstButtonLabel={`(${intl.exceptionalUsage})`} />
                  </Block>
                </CustomizedModalBlock>

                <CustomizedModalBlock>
                  <ModalLabel label={intl.processStatus} tooltip={intl.processStatusHelpText} />
                  <Block {...rowBlockProps}>
                    <Field
                      name="status"
                      render={({ form }: FieldProps<ProcessFormValues>) => (
                        <RadioGroup value={formikBag.values.status} align={ALIGN.horizontal} onChange={(e) => form.setFieldValue('status', (e.target as HTMLInputElement).value)}>
                          <Radio value={ProcessStatus.COMPLETED}>{intl.completedProcesses}</Radio>
                          <Radio value={ProcessStatus.IN_PROGRESS}>{intl.inProgress}</Radio>
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
                    title={<ModalLabel label={<PanelTitle title={intl.organizing} expanded={expanded.indexOf('organizing') >= 0} />} />}
                    overrides={{ ...panelOverrides }}
                  >
                    <Block display="flex" width="100%" justifyContent="space-between">
                      <Block width="48%">
                        <ModalLabel label={intl.department} tooltip={intl.departmentHelpText} />
                      </Block>
                      <Block width="48%">
                        <ModalLabel label={intl.subDepartment} tooltip={intl.subDepartmentHelpText} />
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
                        <ModalLabel label={intl.productTeamFromTK} tooltip={intl.productTeamFromTKHelpText} fullwidth={true} />
                      </Block>
                      <Block width="48%">
                        <ModalLabel fullwidth label={intl.commonExternalProcessResponsible} tooltip={intl.commonExternalProcessResponsibleHelpText} />
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

                  <Panel key="legalBasis" title={<PanelTitle title={intl.legalBasis} expanded={expanded.indexOf('legalBasis') >= 0} />} overrides={{ ...panelOverrides }}>
                                      </Panel>

                  <Panel key="automation" title={<PanelTitle title={intl.automation} expanded={expanded.indexOf('automation') >= 0} />} overrides={{ ...panelOverrides }}>
                    <Block {...rowBlockProps}>
                      <ModalLabel label={intl.isAutomationNeeded} tooltip={intl.processAutomationHelpText} fullwidth={true} />
                      <BoolField fieldName="automaticProcessing" value={formikBag.values.automaticProcessing} justifyContent={'flex-end'} />
                    </Block>
                    <Block {...rowBlockProps}>
                      <ModalLabel label={intl.isProfilingUsed} tooltip={intl.profilingHelpText} />
                      <BoolField fieldName="profiling" value={formikBag.values.profiling} justifyContent={'flex-end'} />
                    </Block>
                  </Panel>

                  <Panel key="dataProcessor" title={<PanelTitle title={intl.processor} expanded={expanded.indexOf('dataProcessor') >= 0} />} overrides={{ ...panelOverrides }}>
                    <Block {...rowBlockProps} marginTop={0}>
                      <ModalLabel label={intl.isProcessorUsed} tooltip={intl.processorHelpText} />
                      <BoolField fieldName="dataProcessing.dataProcessor" value={formikBag.values.dataProcessing.dataProcessor} />
                    </Block>

                    {formikBag.values.dataProcessing.dataProcessor && (
                      <>
                        <Block {...rowBlockProps}>
                          <ModalLabel label={intl.processor} />
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
                  <Panel key="retention" title={<PanelTitle title={intl.retention} expanded={expanded.indexOf('retention') >= 0} />} overrides={{ ...panelOverrides }}>
                    <RetentionItems formikBag={formikBag} />
                  </Panel>

                  <Panel key="dpia" title={<PanelTitle title={intl.pvkRequired} expanded={expanded.indexOf('dpia') >= 0} />} overrides={{ ...panelOverrides }}>
                    <DpiaItems formikBag={formikBag} />
                  </Panel>
                  <Panel key="disclosure" title={<PanelTitle title={intl.disclosure} expanded={expanded.indexOf('disclosure') >= 0} />} overrides={{ ...panelOverrides }}>
                    <CustomizedModalBlock first>
                      <ModalLabel label={intl.dispatcher} />
                      <FieldDispatcher formikBag={formikBag} />
                    </CustomizedModalBlock>

                    <Block width="100%" marginBottom={'5px'} display="flex">
                      <ModalLabel label={intl.recipient} />
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
                              <ModalLabel label={intl.disclosures} />
                              <Block width="100%">
                                <Select
                                  disabled={thirdParty.length === 0}
                                  noResultsMsg={intl.notFoundDisclosure}
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
              </div>

              <ModalFooter
                style={{
                  borderTop: 0,
                }}
              >
                <Block display="flex" justifyContent="flex-end">
                  <ModalButton type="submit">{intl.save}</ModalButton>
                </Block>
              </ModalFooter>
            </Form>
          )
        }}
      />
    </Block>
  )
}
