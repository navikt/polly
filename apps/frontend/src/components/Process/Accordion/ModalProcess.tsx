import * as React from 'react'
import { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from 'baseui/modal'
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikProps } from 'formik'
import { Block, BlockProps } from 'baseui/block'
import { Button, KIND } from 'baseui/button'
import { Error, ModalLabel } from '../../common/ModalSchema'
import { Disclosure, ProcessFormValues, Processor, ProcessStatus } from '../../../constants'
import { intl, theme } from '../../../util'
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
                    <ModalLabel label={intl.name} tooltip={intl.processNameHelpText} />
                    <FieldName />
                  </CustomizedModalBlock>
                  <Error fieldName="name" />

                  <CustomizedModalBlock>
                    <ModalLabel label={intl.overallPurposeActivity} tooltip={intl.overallPurposeHelpText} />
                    <FieldPurpose formikBag={formikBag} />
                  </CustomizedModalBlock>
                  <Error fieldName="purposes" />

                  <CustomizedModalBlock>
                    <ModalLabel label={intl.purposeOfTheProcess} tooltip={intl.processPurposeHelpText} />
                    <FieldDescription />
                  </CustomizedModalBlock>
                  <Error fieldName="description" />

                  <CustomizedModalBlock>
                    <ModalLabel label={intl.additionalDescription} tooltip={intl.additionalDescriptionHelpText} />
                    <FieldAdditionalDescription />
                  </CustomizedModalBlock>
                  <Error fieldName="additionalDescription" />

                  <CustomizedModalBlock>
                    <ModalLabel label={intl.isProcessImplemented} />
                    <Block>
                      <BoolField value={formikBag.values.dpia?.processImplemented} fieldName="dpia.processImplemented" omitUndefined />
                    </Block>
                  </CustomizedModalBlock>

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
                      <BoolField
                        value={formikBag.values.usesAllInformationTypes}
                        fieldName="usesAllInformationTypes"
                        omitUndefined
                        firstButtonLabel={`(${intl.exceptionalUsage})`}
                      />
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
                            {initialValues.status === ProcessStatus.NEEDS_REVISION && <Radio value={ProcessStatus.NEEDS_REVISION}>{intl.needsRevision}</Radio>}
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
                      <FieldLegalBasis formikBag={formikBag} openArt6OnEmpty />
                      <Error fieldName="legalBasesOpen" fullWidth={true} />
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
                </ModalBody>

                <ModalFooter
                  style={{
                    borderTop: 0,
                  }}
                >
                  <Block display="flex" justifyContent="flex-end">
                    <Block alignSelf="flex-end">{errorOnCreate && <p>{errorOnCreate}</p>}</Block>
                    <Button type="button" kind={KIND.tertiary} onClick={onClose}>
                      {intl.abort}
                    </Button>
                    <ModalButton type="submit">{intl.save}</ModalButton>
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
