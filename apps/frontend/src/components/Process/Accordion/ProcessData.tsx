import {Disclosure, Dpia, Process, ProcessStatus} from '../../../constants'
import * as React from 'react'
import {useEffect} from 'react'
import {getResourceById} from '../../../api'
import {codelist, ListName} from '../../../service/Codelist'
import {Block} from 'baseui/block'
import {intl, theme} from '../../../util'
import {LegalBasisView} from '../../common/LegalBasis'
import {ActiveIndicator} from '../../common/Durations'
import {DotTags} from '../../common/DotTag'
import {TeamList} from '../../common/Team'
import {boolToText} from '../../common/Radio'
import {RetentionView} from '../Retention'
import {env} from '../../../util/env'
import {isNil, sum, uniqBy} from 'lodash'
import {ProgressBar} from 'baseui/progress-bar'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'
import RouteLink, {ObjectLink} from "../../common/RouteLink";
import DataText from "../../common/DataText";
import {getNoDpiaLabel, shortenLinksInText} from "../../../util/helper-functions";

const showDpiaRequiredField = (dpia?: Dpia) => {
  if (dpia?.needForDpia === true) {
    if (dpia.refToDpia) {
      return <>
        {`${intl.yes}. ${intl.reference}`}
        {shortenLinksInText(dpia.refToDpia)}
      </>
    } else {
      return intl.yes
    }
  } else if (dpia?.needForDpia === false) {
    if (dpia) {
      return <>
        {`${intl.no}. ${intl.ground}`}
        <DotTags items={dpia.noDpiaReasons.map(r => {
            return r === 'OTHER' && dpia?.grounds ? `${getNoDpiaLabel(r)} (${dpia.grounds})` : getNoDpiaLabel(r)
          }
        )}/>
      </>
    }
  } else {
    return intl.unclarified
  }
}

export const processStatusText = (status: ProcessStatus | undefined) => {
  switch (status) {
    case ProcessStatus.COMPLETED:
      return intl.completedProcesses
    case ProcessStatus.NEEDS_REVISION:
      return intl.needsRevision
    case ProcessStatus.IN_PROGRESS:
    default:
      return intl.inProgress
  }
}

const ProcessData = (props: { process: Process, disclosures: Disclosure[] }) => {
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

      <DataText label={intl.processNumber} text={'' + process.number}/>

      <DataText label={intl.purposeOfTheProcess} text={process.description}/>

      {process.additionalDescription && <DataText label={intl.additionalDescription} text="">{shortenLinksInText(process.additionalDescription)}</DataText>}

      {process.legalBases.length ?
        <DataText label={intl.legalBasis} text={""}>
          {process
            .legalBases
            .sort((a, b) => (codelist.getShortname(ListName.GDPR_ARTICLE, a.gdpr.code)).localeCompare(codelist.getShortname(ListName.GDPR_ARTICLE, b.gdpr.code)))
            .map((legalBasis, index) =>
              <Block key={index}><LegalBasisView legalBasis={legalBasis}/></Block>
            )}
        </DataText> :
        <>
          <DataText label={intl.legalBasis}/>
        </>
      }

      <DataText label={intl.isProcessImplemented} text={""}>
        {(process.dpia?.processImplemented) ? intl.yes : intl.no}
      </DataText>

      {!env.disableRiskOwner &&
      <DataText label={intl.riskOwner}>
        <>
          <span>{(process.dpia?.riskOwner) ? riskOwnerFullName : intl.notFilled}</span>
          {!!process.dpia?.riskOwnerFunction && <span> {intl.riskOwnerFunctionBinder} {process.dpia.riskOwnerFunction}</span>}
        </>
      </DataText>}

      <DataText label={intl.validityOfProcess} text={""}>
        <ActiveIndicator alwaysShow={true} showDates={true} {...process} />
      </DataText>

      <DataText label={intl.summarySubjectCategories} text={!subjectCategoriesSummarised.length && !process.usesAllInformationTypes ? intl.notFilled : ""}>
        {process.usesAllInformationTypes ? intl.potentialPersonalCategoryUsage : !!subjectCategoriesSummarised.length &&
          <DotTags list={ListName.SUBJECT_CATEGORY} codes={subjectCategoriesSummarised}/>}
      </DataText>

      <DataText label={intl.organizing} text={""}>
        {process.affiliation.department ? <Block>
          <span>{intl.department}: </span>
          <span><DotTags list={ListName.DEPARTMENT} codes={[process.affiliation.department]} commaSeparator linkCodelist/> </span>
        </Block> : <span>{intl.department}: {intl.notFilled}</span>}
        {!!process.affiliation.subDepartments.length && <Block>
          <Block display="flex">
            <span>{intl.subDepartment}: </span>
            <DotTags list={ListName.SUB_DEPARTMENT} codes={process.affiliation.subDepartments} linkCodelist/>
          </Block>
        </Block>
        }

        <Block display="flex">
          <span>{intl.productTeam}: </span>
          {!!process.affiliation.productTeams?.length ? <TeamList teamIds={process.affiliation.productTeams}/> : intl.notFilled}
        </Block>

        <Block>
          <span>{intl.commonExternalProcessResponsible}: </span>
          <span>{!!process.commonExternalProcessResponsible ?
            <RouteLink href={`/thirdparty/${process.commonExternalProcessResponsible.code}`}>
              {codelist.getShortnameForCode(process.commonExternalProcessResponsible)}
            </RouteLink>
            : intl.no}</span>
        </Block>

      </DataText>

      <DataText label={intl.system} text={""}>
        <DotTags list={ListName.SYSTEM} codes={process.affiliation.products} linkCodelist/>
      </DataText>

      <DataText label={intl.automation} text={""}>
        <Block>
          <span>{intl.automaticProcessing}: </span>
          <span>{boolToText(process.automaticProcessing)}</span>
        </Block>
        <Block>
          <span>{intl.profiling}: </span>
          <span>{boolToText(process.profiling)}</span>
        </Block>
      </DataText>

      <DataText label={intl.dataProcessor} text={""}>
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
                <DotTags items={process.dataProcessing.dataProcessorAgreements} markdown/>
              </Block>
              }
            </Block>
            <Block>
              <span>{intl.isDataProcessedOutsideEUEEA} </span>
              <span>{boolToText(process.dataProcessing.dataProcessorOutsideEU)}</span>
            </Block>
            {process.dataProcessing.dataProcessorOutsideEU &&
            <>
              <Block>
                <span>{intl.transferGroundsOutsideEUEEA}: </span>
                {process.dataProcessing.transferGroundsOutsideEU && <span>{codelist.getShortnameForCode(process.dataProcessing.transferGroundsOutsideEU)} </span>}
                {!process.dataProcessing.transferGroundsOutsideEU && <span>{intl.emptyMessage} </span>}
                {process.dataProcessing.transferGroundsOutsideEUOther && <span>: {process.dataProcessing.transferGroundsOutsideEUOther}</span>}
              </Block>
              {!!process.dataProcessing?.transferCountries.length && <Block>
                <span>{intl.countries}: </span>
                <span>{process.dataProcessing.transferCountries.map(c => codelist.countryName(c)).join(', ')}</span>
              </Block>}
            </>
            }
          </Block>}
        </>
      </DataText>

      <DataText label={intl.retention} text={""}>
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
            {process.retention?.retentionDescription && shortenLinksInText(process.retention?.retentionDescription)}
          </Block>
        </>
      </DataText>

      <DataText label={intl.isDpiaRequired} text={""}>
        <Block>
          <span>{showDpiaRequiredField(process.dpia)}</span>
        </Block>
      </DataText>

      <DataText label={intl.disclosures} text={props.disclosures.length === 0 && intl.notFilled}>
        <Block>
          {
            props.disclosures.map(value =>
              <>
                <ObjectLink id={value.recipient.code} type={ListName.THIRD_PARTY}>{value.recipient.shortName}:{value.name}</ObjectLink>
                &nbsp;
              </>
            )
          }
        </Block>
      </DataText>
      <Completeness process={process}/>

      <DataText label={intl.status} text={""}>
        {processStatusText(process.status)}
        {process.revisionText && `: ${process.revisionText}`}
      </DataText>

    </Block>
  )
}

const Completeness = (props: { process: Process }) => {
  const {process} = props
  const completeness = {
    dpia: !isNil(process.dpia?.needForDpia),
    dpiaReference: !process.dpia?.needForDpia || !isNil(process.dpia?.refToDpia),
    profiling: !isNil(process.profiling),
    automation: !isNil(process.automaticProcessing),
    retention: !isNil(process.retention?.retentionPlan),
    retentionTime: !process.retention?.retentionPlan || (!!process.retention.retentionStart && !!process.retention.retentionMonths),
    dataProcessor: !isNil(process.dataProcessing?.dataProcessor),
    dataProcessorAgreementMissing: !process.dataProcessing?.dataProcessor || !!process.dataProcessing?.dataProcessorAgreements.length,
    dataProcessorOutsideEU: !process.dataProcessing?.dataProcessor || !isNil(process.dataProcessing?.dataProcessorOutsideEU),
    policies: process.usesAllInformationTypes || !!process.policies.length,
    completed: process.status === ProcessStatus.COMPLETED
  }
  const completed = sum(Object.keys(completeness).map(k => (completeness as any)[k] ? 1 : 0))
  const completables = Object.keys(completeness).length
  const color = () => {
    const perc = completed / completables
    if (perc < .3) return theme.colors.negative400
    if (perc === 1) return theme.colors.positive400
    return theme.colors.warning400
  }

  const barOverrides = {BarProgress: {style: {backgroundColor: color()}}, Bar: {style: {marginLeft: 0, marginRight: 0}}}

  return (
    <DataText label={intl.completeness} text={""}>
      <CustomizedStatefulTooltip content={<Block>
        <p>{completed === completables ? intl.completed : `${intl.notFilled}:`}</p>
        <p>{!completeness.dpia && intl.dpiaNeeded}</p>
        <p>{!completeness.dpiaReference && intl.dpiaReference}</p>
        <p>{!completeness.profiling && intl.profiling}</p>
        <p>{!completeness.automation && intl.automation}</p>
        <p>{!completeness.retention && intl.retention}</p>
        <p>{!completeness.retentionTime && intl.retentionMonths}</p>
        <p>{!completeness.dataProcessor && intl.dataProcessor}</p>
        <p>{!completeness.dataProcessorAgreementMissing && intl.dataProcessorAgreement}</p>
        <p>{!completeness.dataProcessorOutsideEU && intl.dataProcessorOutsideEU}</p>
        <p>{!completeness.policies && intl.informationTypes}</p>
        <p>{!completeness.completed && intl.processStatus}</p>
      </Block>}>
        <Block $style={{cursor: 'help'}} height={theme.sizing.scale800} display='flex' alignItems='center'>
          <ProgressBar value={completed} successValue={completables} overrides={barOverrides}/>
        </Block>
      </CustomizedStatefulTooltip>
    </DataText>
  )
}

export default ProcessData
