import * as React from 'react'
import {DepartmentProcessDashCount, ProcessesDashCount, ProcessField, ProcessState, ProcessStatus} from '../../constants'
import {useHistory} from 'react-router-dom'
import {Block} from 'baseui/block'
import {chartCardProps} from '../common/Style'
import TriChart from './TriChart'
import {intl} from '../../util'
import {Chart} from './Chart'
import {clickOnPieChartSlice} from '../../util/dashboard'
import {chartColor} from '../../util/theme'
import {Paragraph1} from 'baseui/typography'
import RouteLink from '../common/RouteLink'
import {lowerFirst} from 'lodash'

const chartSize = 80

type ChartsProps = {
    chartData: ProcessesDashCount | DepartmentProcessDashCount,
    processStatus: ProcessStatus,
    departmentCode?: string
}

const Charts = (props: ChartsProps ) => {
    const { chartData, processStatus, departmentCode } = props
    const history = useHistory()

    const link = (processField: ProcessField) =>
               departmentCode ? `/dashboard/${processField}/${ProcessState.UNKNOWN}/${processStatus}/${departmentCode}`
                              : `/dashboard/${processField}/${ProcessState.UNKNOWN}/${processStatus}`

    return (
      <Block display='flex' flexWrap={true} width={'100%'} justifyContent={"space-between"}>
        <Block {...chartCardProps}>
          <TriChart counter={chartData.dpia}
            title={intl.dpiaNeeded}
            processStatus={processStatus}
            processField={ProcessField.DPIA}
            departmentCode={departmentCode && departmentCode}
          />
        </Block>

        <Block {...chartCardProps}>
          <TriChart counter={chartData.profiling}
            title={intl.profiling}
            processStatus={processStatus}
            processField={ProcessField.PROFILING}
            departmentCode={departmentCode && departmentCode}
          />
        </Block>

        <Block {...chartCardProps}>
          <TriChart counter={chartData.automation}
            title={intl.automaticProcessing}
            processStatus={processStatus}
            processField={ProcessField.AUTOMATION}
            departmentCode={departmentCode && departmentCode}
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
                  onClick: clickOnPieChartSlice(ProcessField.MISSING_LEGAL_BASIS, ProcessState.YES, processStatus, history, departmentCode)
                },
                {
                  label: intl.numberOfProcessesWithoutArticle6LegalBasis,
                  size: chartData.processesMissingArt6,
                  color: chartColor.generalMustard,
                  onClick: clickOnPieChartSlice(ProcessField.MISSING_ARTICLE_6, ProcessState.YES, processStatus, history, departmentCode)
                },
                {
                  label: intl.numberOfProcessesWithoutArticle9LegalBasis,
                  size: chartData.processesMissingArt9,
                  color: chartColor.generalBlue,
                  onClick: clickOnPieChartSlice(ProcessField.MISSING_ARTICLE_9, ProcessState.YES, processStatus, history, departmentCode)
                },
              ]
            } />
        </Block>

        <Block {...chartCardProps}>
          <TriChart counter={chartData.retention}
            processStatus={processStatus}
            title={intl.retentionPieChartTitle}
            processField={ProcessField.RETENTION}
            departmentCode={departmentCode && departmentCode}
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
            departmentCode={departmentCode && departmentCode}
          />
          <Paragraph1>
            {`${intl.dataProcessorAgreement} ${lowerFirst(intl.emptyMessage)}`} <RouteLink
              href={link(ProcessField.DATA_PROCESSOR_AGREEMENT_EMPTY)}>{chartData.dataProcessorAgreementMissing}</RouteLink>
          </Paragraph1>
          <TriChart counter={chartData.dataProcessorOutsideEU}
            processStatus={processStatus}
            title={`${intl.dataProcessor} ${lowerFirst(intl.dataProcessorOutsideEU)}`}
            processField={ProcessField.DATA_PROCESSOR_OUTSIDE_EU}
            departmentCode={departmentCode && departmentCode}
          />
        </Block>
      </Block>
    )
  }

  export default Charts
