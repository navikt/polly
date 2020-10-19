import * as React from 'react'
import {useHistory} from 'react-router-dom'
import {Block} from 'baseui/block'
import {cardShadow, chartCardProps} from '../common/Style'
import {DepartmentProcessDashCount, ProcessesDashCount, ProcessField, ProcessState, ProcessStatus, ProductAreaProcessDashCount} from '../../constants'
import TriChart from './TriChart'
import {intl} from '../../util'
import {Chart} from './Chart'
import {clickOnPieChartSlice} from '../../util/dashboard'
import {chartColor} from '../../util/theme'
import {Paragraph1, Paragraph2} from 'baseui/typography'
import RouteLink from '../common/RouteLink'
import {lowerFirst} from 'lodash'
import {Section} from '../../pages/ProcessPage'
import {Card} from "baseui/card";

const chartSize = 80

type ChartsProps = {
  chartData: ProductAreaProcessDashCount | DepartmentProcessDashCount | ProcessesDashCount,
  processStatus: ProcessStatus,
  type?: Section,
  departmentCode?: string,
  productAreaId?: string
}

const Charts = (props: ChartsProps) => {
  const {chartData, processStatus, type, departmentCode, productAreaId} = props
  const history = useHistory()

  const link = (processField: ProcessField, processState: ProcessState = ProcessState.UNKNOWN) => {
    if (!type)
      return `/dashboard/${processField}/${processState}/${processStatus}`
    else if (type === Section.department)
      return `/dashboard/${processField}/${processState}/${processStatus}?department=${departmentCode}`
    else
      return `/dashboard/${processField}/${processState}/${processStatus}?productarea=${productAreaId}`
  }

  const handleClickPieChartSlice = (processField: ProcessField, processState: ProcessState, processStatus: ProcessStatus) => {
    if (!type)
      return clickOnPieChartSlice(processField, processState, processStatus, history)
    else if (type === Section.department)
      return clickOnPieChartSlice(processField, processState, processStatus, history, type, departmentCode)
    else
      return clickOnPieChartSlice(processField, processState, processStatus, history, type, productAreaId)
  }

  return (
    <Block display='flex' flexWrap={true} width={'100%'} justifyContent={"space-between"}>
      <Block {...chartCardProps}>
        <TriChart counter={chartData.dpia}
                  title={intl.dpiaNeeded}
                  processStatus={processStatus}
                  processField={ProcessField.DPIA}
                  onClickPieChartSlice={handleClickPieChartSlice}
        />
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
        <Paragraph1>
          {intl.processWithIncompleteRetention} <RouteLink href={link(ProcessField.RETENTION_DATA)}>{chartData.retentionDataIncomplete}</RouteLink>
        </Paragraph1>
      </Block>

      <Block {...chartCardProps}>
        <TriChart counter={chartData.dataProcessor}
                  processStatus={processStatus}
                  title={intl.isDataProcessorUsed}
                  processField={ProcessField.DATA_PROCESSOR}
                  onClickPieChartSlice={handleClickPieChartSlice}
        />
        <Paragraph1>
          {`${intl.dataProcessorAgreement} ${lowerFirst(intl.emptyMessage)}`} <RouteLink
          href={link(ProcessField.DATA_PROCESSOR_AGREEMENT_EMPTY)}>{chartData.dataProcessorAgreementMissing}</RouteLink>
        </Paragraph1>
        <TriChart counter={chartData.dataProcessorOutsideEU}
                  processStatus={processStatus}
                  title={`${intl.dataProcessor} ${lowerFirst(intl.dataProcessorOutsideEU)}`}
                  processField={ProcessField.DATA_PROCESSOR_OUTSIDE_EU}
                  onClickPieChartSlice={handleClickPieChartSlice}
        />
      </Block>
      <Block marginTop="2.5rem" width={"100%"}>
        <Card overrides={cardShadow}>
          <Block>
            <Paragraph2>
              {intl.navResponsible}: <RouteLink
              href={link(ProcessField.COMMON_EXTERNAL_PROCESSOR, ProcessState.YES)}>{chartData.commonExternalProcessResponsible}</RouteLink>
            </Paragraph2>
            <Paragraph2>
              {intl.dpProcessPageTitle}: <RouteLink
              href={"/dpprocess"}>{chartData.dpProcesses}</RouteLink>
            </Paragraph2>
          </Block>
        </Card>
      </Block>
    </Block>
  )
}

export default Charts
