import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {DpProcess} from '../../constants';
import {getDpProcess} from '../../api/DpProcessApi';
import {StyledSpinnerNext} from 'baseui/spinner';
import {Block} from 'baseui/block';
import {H4} from "baseui/typography";
import {intl, theme} from "../../util";
import {StyledLink} from "baseui/link";
import {DotTags} from "../common/DotTag";
import {Markdown} from "../common/Markdown";
import DataText from "../common/DataText";
import {codelist, ListName} from "../../service/Codelist";
import {TeamList} from "../common/Team";
import {RetentionView} from "../Process/Retention";
import {isLink} from "../../util/helper-functions";
import {ActiveIndicator} from "../common/Durations";
import {boolToText} from "../common/Radio";
import RouteLink from "../common/RouteLink";

const DpProcessView = () => {
  const params = useParams<{ id?: string }>()
  const [dpProcess, setDpProcess] = useState<DpProcess>()
  const [isLoading, setLoading] = useState<boolean>(true)
  const dividerDistance = theme.sizing.scale2400
  const isSubDataProcessorAgreementsAvailable = !!dpProcess?.subDataProcessing?.dataProcessorAgreements.length
  const isDataProcessingAgreementsAvailable = !!dpProcess?.dataProcessingAgreements.length
  useEffect(() => {
    (async () => {
      if (params.id) {
        setLoading(true)
        setDpProcess(await getDpProcess(params.id))
        setLoading(false)
      }
    })()
  }, [])

  return (
    <>
      {!isLoading ? (
        <>
          <H4>{dpProcess?.name}</H4>
          <DataText label={intl.description} text={dpProcess?.description}/>
          <DataText label={intl.purpose} text={dpProcess?.purposeDescription}/>
          <DataText label={intl.validityOfProcess} text={""}>
            <ActiveIndicator alwaysShow={true} showDates={true} {...dpProcess} />
          </DataText>

          <DataText label={intl.article9} text={boolToText(dpProcess?.art9)}/>
          <DataText label={intl.article10} text={boolToText(dpProcess?.art10)}/>

          <DataText label={intl.externalProcessResponsible} text={""}>
            <span>{!!dpProcess?.externalProcessResponsible ?
              <RouteLink href={`/thirdparty/${dpProcess.externalProcessResponsible.code}`}>
                {codelist.getShortnameForCode(dpProcess.externalProcessResponsible)}
              </RouteLink>
              : intl.no}</span>
          </DataText>

          <DataText label={intl.organizing} text={""}>
            {dpProcess?.affiliation.department ? <Block>
              <span>{intl.department}: </span>
              <span><DotTags list={ListName.DEPARTMENT} codes={[dpProcess?.affiliation.department]} commaSeparator linkCodelist/> </span>
            </Block> : <span>{intl.department}: {intl.notFilled}</span>}
            {!!dpProcess?.affiliation.subDepartments.length ? <Block>
                <Block display="flex">
                  <span>{intl.subDepartment}: </span>
                  <DotTags list={ListName.SUB_DEPARTMENT} codes={dpProcess?.affiliation.subDepartments} linkCodelist/>
                </Block>
              </Block> :
              <Block display="flex">
                <span>{intl.subDepartment}: {intl.notFilled}</span>
              </Block>
            }

            <Block>
              <span>{intl.productTeam}: </span>
              {!!dpProcess?.affiliation.productTeams?.length ? <TeamList teamIds={dpProcess?.affiliation.productTeams}/> : intl.notFilled}
            </Block>
          </DataText>
          <DataText label={intl.retention} text={""}>
            <>
              {dpProcess?.retention?.retentionPlan === null && intl.retentionPlanUnclarified}
              {dpProcess?.retention?.retentionPlan === false && intl.retentionPlanNo}
            </>
            <>
              {dpProcess?.retention?.retentionPlan &&
              <Block>
                <Block>{intl.retentionPlanYes}</Block>
              </Block>
              }
              <Block>
                <RetentionView retention={dpProcess?.retention}/>
              </Block>
              <Block>
                <span>{dpProcess?.retention?.retentionDescription && `${intl.retentionDescription}: `}</span>
                {dpProcess?.retention?.retentionDescription && isLink(dpProcess?.retention?.retentionDescription) ?
                  <StyledLink href={`${dpProcess?.retention?.retentionDescription}`}>{intl.seeExternalLink}</StyledLink> :
                  <span><Markdown source={dpProcess?.retention?.retentionDescription} singleWord/></span>
                }
              </Block>
            </>
          </DataText>
          <DataText label={intl.dpProcessDataProcessor} text={""}>
            <>
              {dpProcess?.dataProcessingAgreement === null && intl.dpProcessDataProcessorUnclarified}
              {dpProcess?.dataProcessingAgreement === false && intl.dpProcessDataProcessorNo}
            </>
            <>
              {dpProcess?.dataProcessingAgreement &&
              <Block>
                <Block>{intl.dpProcessDataProcessorYes}</Block>
                <Block>
                  {isDataProcessingAgreementsAvailable &&
                  <Block display='flex' alignItems="center">
                    <Block $style={{whiteSpace: 'nowrap', margin: '1rem 0'}}>
                      {`${intl.dataProcessorAgreement}: `}
                    </Block>
                    <DotTags items={dpProcess.dataProcessingAgreements} markdown/>
                  </Block>
                  }
                </Block>
              </Block>}
            </>

          </DataText>


          <DataText label={intl.subDataProcessor} text={""}>
            <>
              {dpProcess?.subDataProcessing?.dataProcessor === null && intl.dataProcessorUnclarified}
              {dpProcess?.subDataProcessing?.dataProcessor === false && intl.dataProcessorNo}
            </>
            <>
              {dpProcess?.subDataProcessing?.dataProcessor &&
              <Block>
                <Block>{intl.dataProcessorYes}</Block>
                <Block>
                  {isSubDataProcessorAgreementsAvailable &&
                  <Block display='flex' alignItems="center">
                    <Block $style={{whiteSpace: 'nowrap', margin: '1rem 0'}}>
                      {`${intl.dataProcessorAgreement}: `}
                    </Block>
                    <DotTags items={dpProcess?.subDataProcessing.dataProcessorAgreements} markdown/>
                  </Block>
                  }
                </Block>
                <Block>
                  <span>{intl.isDataProcessedOutsideEUEEA} </span>
                  <span>{boolToText(dpProcess?.subDataProcessing.dataProcessorOutsideEU)}</span>
                </Block>
                {dpProcess?.subDataProcessing.dataProcessorOutsideEU &&
                <>
                  <Block>
                    <span>{intl.transferGroundsOutsideEUEEA}: </span>
                    {dpProcess?.subDataProcessing.transferGroundsOutsideEU && <span>{codelist.getShortnameForCode(dpProcess?.subDataProcessing.transferGroundsOutsideEU)} </span>}
                    {!dpProcess?.subDataProcessing.transferGroundsOutsideEU && <span>{intl.emptyMessage} </span>}
                    {dpProcess?.subDataProcessing.transferGroundsOutsideEUOther && <span>: {dpProcess?.subDataProcessing.transferGroundsOutsideEUOther}</span>}
                  </Block>
                  {!!dpProcess?.subDataProcessing?.transferCountries.length && <Block>
                    <span>{intl.countries}: </span>
                    <span>{dpProcess?.subDataProcessing.transferCountries.map(c => codelist.countryName(c)).join(', ')}</span>
                  </Block>}
                </>
                }
              </Block>}
            </>
          </DataText>
        </>
      ) : (
        <StyledSpinnerNext/>
      )}
    </>
  )
}

export default DpProcessView
