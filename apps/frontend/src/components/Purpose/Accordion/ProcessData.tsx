import { Dpia, Process, ProcessStatus } from '../../../constants'
import * as React from 'react'
import { useEffect } from 'react'
import { getResourceById } from '../../../api'
import { codelist, ListName, Code } from '../../../service/Codelist'
import { Block } from 'baseui/block'
import DataText from '../common/DataText'
import { intl, theme } from '../../../util'
import { LegalBasisView } from '../../common/LegalBasis'
import { ActiveIndicator } from '../../common/Durations'
import { DotTags } from '../../common/DotTag'
import { TeamPopover } from '../../common/Team'
import { boolToText } from '../../common/Radio'
import { RetentionView } from '../Retention'
import { env } from '../../../util/env'
import ReactMarkdown from 'react-markdown'

const showDpiaRequiredField = (dpia?: Dpia) => {
  if (dpia?.needForDpia === true) {
    if (dpia.refToDpia) {
      return <ReactMarkdown source={`${intl.yes}. ${intl.reference}${dpia.refToDpia}`} linkTarget='_blank' />
    } else {
      return intl.yes
    }
  } else if (dpia?.needForDpia === false) {
    if (dpia.grounds) {
      return `${intl.no}. ${intl.ground}${dpia.grounds}`
    } else {
      return intl.no
    }
  } else {
    return intl.unclarified
  }
}

const ProcessData = (props: { process: Process }) => {
  const { process } = props
  const dataProcessorAgreements = !!process.dataProcessing?.dataProcessorAgreements.length
  const [riskOwnerFullName, setRiskOwnerFullName] = React.useState<string>()


  useEffect(() => {
    (async () => {
      if (!env.disableRiskOwner && process.dpia?.riskOwner) {
        setRiskOwnerFullName((await getResourceById(process.dpia.riskOwner)).fullName)
      } else {
        setRiskOwnerFullName('')
      }
    })()
  }, [process])


  const subjectCategoriesSummarised = process.policies.flatMap(p => p.subjectCategories).reduce((acc, curr) => {
    if (!acc.find(item => item.code === curr.code)) acc = [...acc, curr]
    return acc
  }, [] as Code[])

  return (
    <Block>

      <DataText label={intl.purposeOfTheProcess} text={process.description} hide={!process.description} />

      <DataText label={intl.legalBasis} text={process.legalBases.length ? undefined : intl.legalBasisNotFound}>
        {process.legalBases.map((legalBasis, index) =>
          <Block key={index}><LegalBasisView legalBasis={legalBasis} /></Block>
        )}
      </DataText>

      <DataText label={intl.status}>
        {(process.status) === ProcessStatus.IN_PROGRESS ? intl.inProgress : intl.completedProcesses}
      </DataText>

      <DataText label={intl.isProcessImplemented}>
        {(process.dpia?.processImplemented) ? intl.yes : intl.no}
      </DataText>

      {!env.disableRiskOwner &&
        <DataText label={intl.riskOwner}>
          <>
            <span>{(process.dpia?.riskOwner) ? riskOwnerFullName : intl.notFilled}</span>
            {!!process.dpia?.riskOwnerFunction && <span> {intl.riskOwnerFunctionBinder} {process.dpia.riskOwnerFunction}</span>}
          </>
        </DataText>}

      <DataText label={intl.validityOfProcess}>
        <ActiveIndicator alwaysShow={true} showDates={true} {...process} />
      </DataText>

      <DataText label={intl.summarySubjectCategories} text={!subjectCategoriesSummarised.length && intl.subjectCategoriesNotFound}>
        {!!subjectCategoriesSummarised.length && <DotTags list={ListName.SUBJECT_CATEGORY} codes={subjectCategoriesSummarised} />}
      </DataText>

      <DataText label={intl.organizing}>
        {process.department && <Block>
          <span>{intl.department}: </span>
          <span>{codelist.getShortnameForCode(process.department)}</span>
        </Block>}
        {!!process?.subDepartments.length && <Block>
          <Block display="flex">
            <span>{intl.subDepartment}: </span>
            <DotTags list={ListName.SUB_DEPARTMENT} codes={process.subDepartments} />
          </Block>
        </Block>}

        {process.commonExternalProcessResponsible && <Block>
          <span>{intl.commonExternalProcessResponsible}: </span>
          <span>{codelist.getShortnameForCode(process.commonExternalProcessResponsible)}</span>
        </Block>}

        {!!process.productTeams?.length && <Block>
          <span>{intl.productTeam}: </span>
          {process.productTeams.map((t, i) =>
            <Block key={i} display='inline' marginRight={theme.sizing.scale100}>
              <TeamPopover teamId={t} />
            </Block>
          )}
        </Block>}
      </DataText>

      <DataText label={intl.system} hide={!process.products?.length}>
        <DotTags list={ListName.SYSTEM} codes={process.products} linkCodelist />
      </DataText>

      <DataText label={intl.USES_ALL_INFO_TYPE} text={boolToText(process.usesAllInformationTypes)} />

      <DataText label={intl.automation}>
        <Block>
          <span>{intl.automaticProcessing}: </span>
          <span>{boolToText(process.automaticProcessing)}</span>
        </Block>
        <Block>
          <span>{intl.profiling}: </span>
          <span>{boolToText(process.profiling)}</span>
        </Block>
      </DataText>

      <DataText label={intl.dataProcessor}>
        <>
          {process.dataProcessing?.dataProcessor === null && intl.dataProcessorUnclarified}
          {process.dataProcessing?.dataProcessor === false && intl.dataProcessorNo}
        </>
        <>
          {process.dataProcessing?.dataProcessor &&
            <Block>
              <Block>{intl.dataProcessorYes}</Block>
              <Block>
                {dataProcessorAgreements &&
                  <Block display='flex'>
                    <Block $style={{ whiteSpace: 'nowrap', margin: '1rem 0' }}>
                      {`${intl.dataProcessorAgreement}: `}
                    </Block>
                    <DotTags items={process.dataProcessing?.dataProcessorAgreements} markdown />
                  </Block>
                }
              </Block>
              <Block>
                <span>{intl.isDataProcessedOutsideEUEEAHelpText}: </span>
                <span>{boolToText(process.dataProcessing?.dataProcessorOutsideEU)}</span>
              </Block>
            </Block>}
        </>
      </DataText>

      <DataText label={intl.retention}>
        <>
          {process.retention?.retentionPlan === null && intl.retentionPlanUnclarified}
          {process.retention?.retentionPlan === false && intl.retentionPlanNo}
        </>
        <>
          {process.retention?.retentionPlan &&
            <Block>
              <Block>{intl.retentionPlanYes}</Block>
              <RetentionView retention={process.retention} />
            </Block>
          }
          <Block>
            <span>{process.retention?.retentionDescription && `${intl.retentionDescription}: `}</span>
            <span>{process.retention?.retentionDescription}</span>
          </Block>
        </>
      </DataText>

      <DataText label={intl.isDpiaRequired}>
        <Block>
          <span>{showDpiaRequiredField(process.dpia)}</span>
        </Block>
      </DataText>
    </Block>
  )
}

export default ProcessData
