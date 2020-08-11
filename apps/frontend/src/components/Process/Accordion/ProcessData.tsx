import {Dpia, Process, ProcessStatus} from '../../../constants'
import * as React from 'react'
import {useEffect} from 'react'
import {getResourceById} from '../../../api'
import {codelist, ListName} from '../../../service/Codelist'
import {Block} from 'baseui/block'
import DataText from '../common/DataText'
import {intl, theme} from '../../../util'
import {LegalBasisView} from '../../common/LegalBasis'
import {ActiveIndicator} from '../../common/Durations'
import {DotTags} from '../../common/DotTag'
import {TeamList} from '../../common/Team'
import {boolToText} from '../../common/Radio'
import {RetentionView} from '../Retention'
import {env} from '../../../util/env'
import {isNil, sum, uniqBy} from 'lodash'
import {Markdown} from '../../common/Markdown'
import {ProgressBar} from 'baseui/progress-bar/index'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'

const showDpiaRequiredField = (dpia?: Dpia) => {
  if (dpia?.needForDpia === true) {
    if (dpia.refToDpia) {
      return <Markdown source={`${intl.yes}. ${intl.reference}${dpia.refToDpia}`} singleWord/>
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

const ProcessData = (props: {process: Process}) => {
  const {process} = props
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


  const subjectCategoriesSummarised = uniqBy(process.policies.flatMap(p => p.subjectCategories), 'code')

  return (
    <Block>

      <DataText label={intl.purposeOfTheProcess} text={process.description} hide={!process.description}/>

      <DataText label={intl.legalBasis} text={process.legalBases.length ? undefined : intl.legalBasisNotFound}>
        {process
        .legalBases
        .sort((a, b) => (codelist.getShortname(ListName.GDPR_ARTICLE, a.gdpr.code)).localeCompare(codelist.getShortname(ListName.GDPR_ARTICLE, b.gdpr.code)))
        .map((legalBasis, index) =>
          <Block key={index}><LegalBasisView legalBasis={legalBasis}/></Block>
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
        {!!subjectCategoriesSummarised.length && <DotTags list={ListName.SUBJECT_CATEGORY} codes={subjectCategoriesSummarised}/>}
      </DataText>

      <DataText label={intl.organizing}>
        {process.department && <Block>
          <span>{intl.department}: </span>
          <span><DotTags list={ListName.DEPARTMENT} codes={[process.department]} commaSeparator linkCodelist/> </span>
        </Block>}
        {!!process?.subDepartments.length && <Block>
          <Block display="flex">
            <span>{intl.subDepartment}: </span>
            <DotTags list={ListName.SUB_DEPARTMENT} codes={process.subDepartments} linkCodelist/>
          </Block>
        </Block>}

        {process.commonExternalProcessResponsible && <Block>
          <span>{intl.commonExternalProcessResponsible}: </span>
          <span>{codelist.getShortnameForCode(process.commonExternalProcessResponsible)}</span>
        </Block>}

        {!!process.productTeams?.length && <Block>
          <span>{intl.productTeam}: </span>
          <TeamList teamIds={process.productTeams}/>
        </Block>}
      </DataText>

      <DataText label={intl.system} hide={!process.products?.length}>
        <DotTags list={ListName.SYSTEM} codes={process.products} linkCodelist/>
      </DataText>

      {process.usesAllInformationTypes && <DataText label={intl.USES_ALL_INFO_TYPE} text={intl.yes}/>}

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
              <Block display='flex' alignItems="center">
                <Block $style={{whiteSpace: 'nowrap', margin: '1rem 0'}}>
                  {`${intl.dataProcessorAgreement}: `}
                </Block>
                <DotTags items={process.dataProcessing?.dataProcessorAgreements} markdown/>
              </Block>
              }
            </Block>
            <Block>
              <span>{intl.isDataProcessedOutsideEUEEA}  </span>
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
          </Block>
          }
          <Block>
            <RetentionView retention={process.retention}/>
          </Block>
          <Block>
            <span>{process.retention?.retentionDescription && `${intl.retentionDescription}: `}</span>
            <span><Markdown source={process.retention?.retentionDescription} singleWord/></span>
          </Block>
        </>
      </DataText>

      <DataText label={intl.isDpiaRequired}>
        <Block>
          <span>{showDpiaRequiredField(process.dpia)}</span>
        </Block>
      </DataText>

      <Completeness process={process}/>

    </Block>
  )
}

const Completeness = (props: {process: Process}) => {
  const {process} = props
  const completeness = {
    dpia: !isNil(process.dpia?.needForDpia),
    profiling: !isNil(process.profiling),
    automation: !isNil(process.automaticProcessing),
    retention: !isNil(process.retention?.retentionPlan),
    dataProcessor: !isNil(process.dataProcessing?.dataProcessor),
    dataProcessorOutsideEU: !process.dataProcessing?.dataProcessor || !isNil(process.dataProcessing?.dataProcessorOutsideEU),
    completed: process.status !== ProcessStatus.COMPLETED
  }
  const completed = sum(Object.keys(completeness).map(k => (completeness as any)[k] ? 1 : 0))
  const completables = Object.keys(completeness).length

  return (

    <DataText label={intl.completeness}>
      <CustomizedStatefulTooltip content={<Block>
        <p>{completed === completables ? intl.completed : `${intl.notFilled}:`}</p>
        <p>{!completeness.dpia && intl.dpiaNeeded}</p>
        <p>{!completeness.profiling && intl.profiling}</p>
        <p>{!completeness.automation && intl.automation}</p>
        <p>{!completeness.retention && intl.retention}</p>
        <p>{!completeness.dataProcessor && intl.dataProcessor}</p>
        <p>{!completeness.dataProcessorOutsideEU && intl.dataProcessorOutsideEU}</p>
        <p>{!completeness.completed && intl.processStatus}</p>
      </Block>}>
        <Block $style={{cursor: 'pointer'}} height={theme.sizing.scale800} display='flex' alignItems='center'>
          <ProgressBar value={completed} successValue={completables}/>
        </Block>
      </CustomizedStatefulTooltip>
    </DataText>
  )
}

export default ProcessData
