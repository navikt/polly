import {intl, theme} from '../util'
import * as React from 'react'
import {useEffect, useState} from 'react'
import {Block, BlockProps} from 'baseui/block'
import {Counter, DashboardData, ProcessField, ProcessState, ProcessStatus, Settings} from '../constants'
import {getSettings} from '../api/SettingsApi'
import {Card} from 'baseui/card'
import {cardShadow} from '../components/common/Style'
import Departments from '../components/Dashboard/Departments'
import {getDashboard} from '../api'
import {Chart} from '../components/Dashboard/Chart'
import {useHistory, useParams} from 'react-router-dom'
import {LastEvents} from '../components/audit/LastEvents'
import {Markdown} from '../components/common/Markdown'
import {Paragraph1} from "baseui/typography";
import RouteLink from "../components/common/RouteLink";
import {chartColor} from "../util/theme";
import * as H from 'history'
import {lowerFirst} from 'lodash'
import {FilterDashboardStatus} from "../components/Dashboard/FilterDashboardStatus";

const boxProps: BlockProps = {
  marginTop: theme.sizing.scale600,
  width: '30%',
  $style: {boxShadow: '0px 0px 6px 3px rgba(0,0,0,0.08)', padding: '15px'}
}
const chartSize = 80
const clickOnPieChartSlice = (processField: ProcessField, processState: ProcessState, processStatus: ProcessStatus, history: H.History) => () => history.push(`/dashboard/${processField}/${processState}/${processStatus}`)

export const MainPage = () => {

  const {processStatus} = useParams()
  const [settings, setSettings] = useState<Settings>()
  const [isLoading, setLoading] = useState(true)
  const [dashData, setDashData] = useState<DashboardData>()
  const [dashboardStatus, setDashboardStatus] = useState<ProcessStatus>(processStatus ? processStatus as ProcessStatus : ProcessStatus.All)

  useEffect(() => {
    (async () => {
      setSettings(await getSettings())
      setLoading(false)
    })()
  }, [])

  useEffect(() => {
    (async () => {
      setDashData(await getDashboard(dashboardStatus))
    })()
  }, [dashboardStatus])

  return (
    <Block marginTop={theme.sizing.scale400} display="flex" flexWrap>
      {
        !isLoading && dashData && (
          <>

            <Departments data={dashData}/>

            <FilterDashboardStatus setFilter={setDashboardStatus}/>

            <Charts dashData={dashData} processStatus={dashboardStatus}/>

            <Block marginTop="2.5rem">
              <Card overrides={cardShadow}>
                <Markdown source={settings?.frontpageMessage} escapeHtml={false} verbatim/>
              </Card>
            </Block>

            <Block width="100%" display="flex" alignContent="center" marginTop="2.5rem">
              <LastEvents/>
            </Block>
          </>
        )
      }
    </Block>
  )
}

const Charts = (props: { dashData: DashboardData, processStatus: ProcessStatus; }) => {
  const {dashData, processStatus} = props
  const history = useHistory()
  return (
    <Block display='flex' flexWrap={true} width={'100%'} justifyContent={"space-between"}>
      <Block {...boxProps}>
        <TriChart counter={dashData.allProcesses.dpia}
                  title={intl.dpiaNeeded}
                  processStatus={processStatus}
                  field={ProcessField.DPIA}/>
      </Block>

      <Block {...boxProps}>
        <TriChart counter={dashData.allProcesses.profiling}
                  title={intl.profiling}
                  processStatus={processStatus}
                  field={ProcessField.PROFILING}/>
      </Block>

      <Block {...boxProps}>
        <TriChart counter={dashData.allProcesses.automation}
                  title={intl.automaticProcessing}
                  processStatus={processStatus}
                  field={ProcessField.AUTOMATION}/>
      </Block>

      <Block {...boxProps}>
        <Chart chartTitle={intl.incompleteLegalBasis} size={chartSize}
               data={
                 [
                   {
                     label: intl.numberOfProcessesWithUnknownLegalBasis,
                     size: dashData.allProcesses.processesMissingLegalBases,
                     color: chartColor.generalRed,
                     onClick: clickOnPieChartSlice(ProcessField.MISSING_LEGAL_BASIS, ProcessState.YES, processStatus, history)
                   },
                   {
                     label: intl.numberOfProcessesWithoutArticle6LegalBasis,
                     size: dashData.allProcesses.processesMissingArt6,
                     color: chartColor.generalMustard,
                     onClick: clickOnPieChartSlice(ProcessField.MISSING_ARTICLE_6, ProcessState.YES, processStatus, history)
                   },
                   {
                     label: intl.numberOfProcessesWithoutArticle9LegalBasis,
                     size: dashData.allProcesses.processesMissingArt9,
                     color: chartColor.generalBlue,
                     onClick: clickOnPieChartSlice(ProcessField.MISSING_ARTICLE_9, ProcessState.YES, processStatus, history)
                   },
                 ]
               }/>
      </Block>

      <Block {...boxProps}>
        <TriChart counter={dashData.allProcesses.retention}
                  processStatus={processStatus}
                  header={intl.retention} title={intl.retentionPieChartTitle}
                  field={ProcessField.RETENTION}/>
        <Paragraph1>
          {intl.processWithIncompleteRetention} <RouteLink
          href={`/dashboard/${ProcessField.RETENTION_DATA}/${ProcessState.UNKNOWN}/${processStatus}`}>{dashData.allProcesses.retentionDataIncomplete}</RouteLink>
        </Paragraph1>
      </Block>

      <Block {...boxProps}>
        <TriChart counter={dashData.allProcesses.dataProcessor}
                  processStatus={processStatus}
                  header={intl.dataProcessor} title={intl.isDataProcessorUsed}
                  field={ProcessField.DATA_PROCESSOR}/>
        <Paragraph1>
          {`${intl.dataProcessorAgreement} ${lowerFirst(intl.emptyMessage)}`} <RouteLink
          href={`/dashboard/${ProcessField.DATA_PROCESSOR_AGREEMENT_EMPTY}/${ProcessState.YES}/${processStatus}`}>{dashData.allProcesses.dataProcessorAgreementMissing}</RouteLink>
        </Paragraph1>
        <TriChart counter={dashData.allProcesses.dataProcessorOutsideEU}
                  processStatus={processStatus}
                  title={`${intl.dataProcessor} ${lowerFirst(intl.dataProcessorOutsideEU)}`}
                  field={ProcessField.DATA_PROCESSOR_OUTSIDE_EU}/>
      </Block>
    </Block>
  )
}


const TriChart = (props: {
  counter: Counter, title: string, header?: string, field: ProcessField, processStatus: ProcessStatus
}) => {
  const history = useHistory()
  const {counter, title, header, field, processStatus} = props
  return (
    <Chart chartTitle={title} headerTitle={header} size={chartSize}
           data={
             [
               {
                 label: intl.yes,
                 size: counter.yes,
                 color: chartColor.generalBlue,
                 onClick: clickOnPieChartSlice(field, ProcessState.YES, processStatus, history)
               },
               {
                 label: intl.no,
                 size: counter.no,
                 color: chartColor.generalMustard,
                 onClick: clickOnPieChartSlice(field, ProcessState.NO, processStatus, history)
               },
               {
                 label: intl.unclarified,
                 size: counter.unknown,
                 color: chartColor.generalRed,
                 onClick: clickOnPieChartSlice(field, ProcessState.UNKNOWN, processStatus, history)
               },
             ]
           }/>
  )
}
