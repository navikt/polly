import * as React from 'react'
import {useNavigate} from 'react-router-dom'
import {Block} from 'baseui/block'
import {cardShadow, chartCardProps} from '../common/Style'
import {AllDashCount, DepartmentDashCount, ProcessField, ProcessState, ProcessStatusFilter, ProductAreaDashCount} from '../../constants'
import TriChart from './TriChart'
import {intl} from '../../util'
import {Chart} from './Chart'
import {clickOnPieChartSlice} from '../../util/dashboard'
import {chartColor} from '../../util/theme'
import {ParagraphLarge, ParagraphMedium} from 'baseui/typography'
import RouteLink from '../common/RouteLink'
import {Section} from '../../pages/ProcessPage'
import {Card} from "baseui/card";
import {lowerFirst} from 'lodash'

const chartSize = 80

type ChartsProps = {
  chartData: ProductAreaDashCount | DepartmentDashCount | AllDashCount,
  processStatus: ProcessStatusFilter,
  type?: Section,
  departmentCode?: string,
  productAreaId?: string
}

const Charts = (props: ChartsProps) => {
  const {chartData, processStatus, type, departmentCode, productAreaId} = props
  const navigate = useNavigate()

  const link = (processField: ProcessField, processState: ProcessState = ProcessState.UNKNOWN) => {
    if (!type)
      return `/dashboard/${processField}/${processState}/${processStatus}`
    else if (type === Section.department)
      return `/dashboard/${processField}/${processState}/${processStatus}?department=${departmentCode}`
    else
      return `/dashboard/${processField}/${processState}/${processStatus}?productarea=${productAreaId}`
  }

  const handleClickPieChartSlice = (processField: ProcessField, processState: ProcessState, processStatus: ProcessStatusFilter) => {
    if (!type)
      return clickOnPieChartSlice(processField, processState, processStatus, navigate)
    else if (type === Section.department)
      return clickOnPieChartSlice(processField, processState, processStatus, navigate, type, departmentCode)
    else
      return clickOnPieChartSlice(processField, processState, processStatus, navigate, type, productAreaId)
  }

  const all = chartData as AllDashCount

  return (
    <Block display='flex' flexWrap={true} width={'100%'} justifyContent={"space-between"}>
      <Block {...chartCardProps}>
        <TriChart counter={chartData.dpia}
                  title={intl.dpiaNeeded}
                  processStatus={processStatus}
                  processField={ProcessField.DPIA}
                  onClickPieChartSlice={handleClickPieChartSlice}
        />
        <ParagraphMedium>
          {intl.missingPVK}: <RouteLink
          href={link(ProcessField.DPIA_REFERENCE_MISSING, ProcessState.YES)}>{chartData.dpiaReferenceMissing}</RouteLink>
        </ParagraphMedium>
      </Block>

      <Block {...chartCardProps}>
        <TriChart counter={chartData.profiling}
                  title={intl.profiling}
                  processStatus={processStatus}
                  processField={ProcessField.PROFILING}
                  onClickPieChartSlice={handleClickPieChartSlice}
        />
      </Block>

      <Block {...chartCardProps}>
        <TriChart counter={chartData.automation}
                  title={intl.automaticProcessing}
                  processStatus={processStatus}
                  processField={ProcessField.AUTOMATION}
                  onClickPieChartSlice={handleClickPieChartSlice}
        />
      </Block>

      <Block {...chartCardProps}>
        <Chart chartTitle={intl.incompleteLegalBasis} size={chartSize}
               hidePercent type='bar'
               data={
                 [
                   {
                     label: intl.numberOfProcessesWithUnknownLegalBasis,
                     size: chartData.processesMissingLegalBases,
                     color: chartColor.generalRed,
                     onClick: handleClickPieChartSlice(ProcessField.MISSING_LEGAL_BASIS, ProcessState.YES, processStatus)
                   },
                   {
                     label: intl.numberOfProcessesWithoutArticle6LegalBasis,
                     size: chartData.processesMissingArt6,
                     color: chartColor.generalMustard,
                     onClick: handleClickPieChartSlice(ProcessField.MISSING_ARTICLE_6, ProcessState.YES, processStatus)
                   },
                   {
                     label: intl.numberOfProcessesWithoutArticle9LegalBasis,
                     size: chartData.processesMissingArt9,
                     color: chartColor.generalBlue,
                     onClick: handleClickPieChartSlice(ProcessField.MISSING_ARTICLE_9, ProcessState.YES, processStatus)
                   },
                 ]
               }/>
      </Block>

      <Block {...chartCardProps}>
        <TriChart counter={chartData.retention}
                  processStatus={processStatus}
                  title={intl.retentionPieChartTitle}
                  processField={ProcessField.RETENTION}
                  onClickPieChartSlice={handleClickPieChartSlice}
        />
        <ParagraphLarge>
          {intl.processWithIncompleteRetention} <RouteLink href={link(ProcessField.RETENTION_DATA)}>{chartData.retentionDataIncomplete}</RouteLink>
        </ParagraphLarge>
      </Block>

      <Block {...chartCardProps}>
        <TriChart counter={chartData.dataProcessor}
                  processStatus={processStatus}
                  title={intl.isProcessorUsed}
                  processField={ProcessField.DATA_PROCESSOR}
                  onClickPieChartSlice={handleClickPieChartSlice}
        />
      </Block>

      {all.disclosures !== undefined &&
      <Block {...chartCardProps}>
        <Chart chartTitle={intl.disclosures + " " + lowerFirst(intl.legalBasesShort)} data={[
          {
            label: intl.filled,
            size: all.disclosures - all.disclosuresIncomplete,
            color: chartColor.generalBlue,
            onClick: () => navigate('/disclosure?filter=legalbases')
          },
          {
            label: intl.incomplete,
            size: all.disclosuresIncomplete,
            color: chartColor.generalRed,
            onClick: () => navigate('/disclosure?filter=emptylegalbases')
          }
        ]} size={chartSize}/>
        <ParagraphMedium>
          {intl.disclosures}: <RouteLink
          href={"/disclosure"}>{all.disclosures}</RouteLink>
        </ParagraphMedium>
      </Block>}

      <Block marginTop="2.5rem" width={"100%"}>
        <Card overrides={cardShadow}>
          <Block>
            <ParagraphMedium>
              {intl.navResponsible}: <RouteLink
              href={link(ProcessField.COMMON_EXTERNAL_PROCESSOR, ProcessState.YES)}>{chartData.commonExternalProcessResponsible}</RouteLink>
            </ParagraphMedium>
            <ParagraphMedium>
              {intl.dpProcessPageTitle}: <RouteLink
              href={"/dpprocess"}>{chartData.dpProcesses}</RouteLink>
            </ParagraphMedium>
          </Block>
        </Card>
      </Block>
    </Block>
  )
}

export default Charts
