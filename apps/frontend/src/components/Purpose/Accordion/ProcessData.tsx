import {Dpia, Process, ProcessStatus} from '../../../constants'
import * as React from 'react'
import {useEffect} from 'react'
import {getResourceById} from '../../../api'
import {codelist, ListName} from '../../../service/Codelist'
import _includes from 'lodash/includes'
import {Block} from 'baseui/block'
import DataText from '../common/DataText'
import {intl} from '../../../util'
import {LegalBasisView} from '../../common/LegalBasis'
import {ActiveIndicator} from '../../common/Durations'
import {DotTags} from '../../common/DotTag'
import {TeamPopover} from '../../common/Team'
import {boolToText} from '../../common/Radio'
import {RetentionView} from '../Retention'

const showDpiaRequiredField = (dpia?: Dpia) => {
  if (dpia?.needForDpia === true) {
    if (dpia.refToDpia) {
      return `${intl.yes}. ${intl.reference}${dpia.refToDpia}`
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
  const {process} = props
  const dataProcessorAgreements = !!process.dataProcessing?.dataProcessorAgreements.length
  const [riskOwnerFullName, setRiskOwnerFullName] = React.useState<string>()


  useEffect(() => {
    (async () => {
      if (process.dpia?.riskOwner) {
        setRiskOwnerFullName((await getResourceById(process.dpia.riskOwner)).fullName)
      } else {
        setRiskOwnerFullName('')
      }
    })()
  }, [process])

  const subjectCategories = process.policies.flatMap(p => p.subjectCategories).reduce((acc: string[], curr) => {
    const subjectCategory = codelist.getShortname(ListName.SUBJECT_CATEGORY, curr.code)
    if (!_includes(acc, subjectCategory) && subjectCategory)
      acc = [...acc, subjectCategory]
    return acc
  }, [])

  return (
    <Block>

      <DataText label={intl.purposeOfTheProcess} text={process.description} hide={!process.description}/>

      <DataText label={intl.legalBasis} text={process.legalBases.length ? undefined : intl.legalBasisNotFound}>
        {process.legalBases.map((legalBasis, index) =>
          <Block key={index}><LegalBasisView legalBasis={legalBasis}/></Block>
        )}
      </DataText>

      <DataText label={intl.status}>
        <Block>
          <span>{(process.status) === ProcessStatus.IN_PROGRESS ? intl.inProgress : intl.completedProcesses}</span>
        </Block>
      </DataText>

      <DataText label={intl.isProcessImplemented}>
        <Block>
          <span>{(process.dpia?.processImplemented) ? intl.yes : intl.no}</span>
        </Block>
      </DataText>

      <DataText label={intl.riskOwner}>
        <Block>
          <span>{(process.dpia?.riskOwner) ? riskOwnerFullName : intl.notFilled}</span>
        </Block>
      </DataText>

      <DataText label={intl.validityOfProcess}>
        <ActiveIndicator alwaysShow={true} showDates={true} {...process} />
      </DataText>

      <DataText label={intl.summarySubjectCategories} text={!subjectCategories.length && intl.subjectCategoriesNotFound}>
        {!!subjectCategories.length && <DotTags items={subjectCategories}/>}
      </DataText>

      <DataText label={intl.organizing}>
        {process.department && <Block>
          <span>{intl.department}: </span>
          <span>{codelist.getShortnameForCode(process.department)}</span>
        </Block>}
        {process.subDepartment && <Block>
          <span>{intl.subDepartment}: </span>
          <span>{codelist.getShortnameForCode(process.subDepartment)}</span>
        </Block>}
        {!!process.productTeam && <Block>
          <span>{intl.productTeam}: </span>
          <TeamPopover teamId={process.productTeam}/>
        </Block>}
      </DataText>

      <DataText label={intl.system} hide={!process.products?.length}>
        <DotTags items={process.products.map(product => codelist.getShortname(ListName.SYSTEM, product.code))}/>
      </DataText>

      {process.usesAllInformationTypes &&
      <DataText label={intl.usesAllInformationTypes} text={intl.usesAllInformationTypesHelpText}/>
      }

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
            <Block>
              <span>{intl.dataProcessorYes}</span>
            </Block>
            <Block>
              {dataProcessorAgreements &&
              <Block display='flex'>
                <Block $style={{whiteSpace: 'nowrap'}}>
                  {`${intl.dataProcessorAgreement}: `}
                </Block>
                <DotTags items={process.dataProcessing?.dataProcessorAgreements}/>
              </Block>
              }
            </Block>
            <Block>
              <span>{intl.dataProcessorOutsideEUExtra}: </span>
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
            <Block>
              <span>{intl.retentionPlanYes}</span>
            </Block>
            <Block>
              <RetentionView retention={process.retention}/>
            </Block>
            <Block>
              <span>{process.retention?.retentionDescription && `${intl.retentionDescription}: `}</span>
              <span>{process.retention?.retentionDescription}</span>
            </Block>
          </Block>
          }
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
