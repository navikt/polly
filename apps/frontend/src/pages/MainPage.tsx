import {intl, theme} from '../util'
import * as React from 'react'
import {useEffect, useState} from 'react'
import {Block, BlockProps} from 'baseui/block'
import {DashboardData, ProcessField, ProcessState, Settings} from '../constants'
import {getSettings} from '../api/SettingsApi'
import {Card} from 'baseui/card'
import {cardShadow} from '../components/common/Style'
import Departments from '../components/Dashboard/Departments'
import {getDashboard} from '../api'
import {Chart} from '../components/Dashboard/Chart'
import {useHistory} from 'react-router-dom'
import {LastEvents} from '../components/audit/LastEvents'
import {Markdown} from '../components/common/Markdown'
import {Paragraph1} from "baseui/typography";
import RouteLink from "../components/common/RouteLink";
import {chartColor} from "../util/theme";

const boxProps: BlockProps = {
  marginTop: theme.sizing.scale600,
  marginRight: theme.sizing.scale600,
  minWidth: '520px',
  $style: {boxShadow: '0px 0px 6px 3px rgba(0,0,0,0.08)', padding: '15px'}
}

export const Main = () => {
  const history = useHistory()

  const [settings, setSettings] = useState<Settings>()
  const [isLoading, setLoading] = useState(true)
  const [dashData, setDashData] = useState<DashboardData>()
  const chartSize = 80

  const clickOnPieChartSlice = (processField: ProcessField, processState: ProcessState) => history.push(`/dashboard/${processField}/${processState}`)

  useEffect(() => {
    (async () => {
      setSettings(await getSettings())
      setDashData(await getDashboard())
      setLoading(false)
    })()
  }, [])

  return (
    <Block marginTop={theme.sizing.scale400} display="flex" flexWrap>
      {
        !isLoading && dashData && (
          <>
            <Departments data={dashData}/>

            <Block display='flex' flexWrap={true} width={'100%'}>
              <Block {...boxProps}>
                <Chart chartTitle={intl.dpiaNeeded} size={chartSize}
                       data={
                         [
                           {
                             label: `${intl.yes}`,
                             color: chartColor.generalBlue,
                             size: dashData.allProcesses.dpia.yes,
                             onClick: () => clickOnPieChartSlice(ProcessField.DPIA, ProcessState.YES)
                           },
                           {
                             label: `${intl.no}`,
                             color: chartColor.generalMustard,
                             size: dashData.allProcesses.dpia.no,
                             onClick: () => clickOnPieChartSlice(ProcessField.DPIA, ProcessState.NO)
                           },
                           {
                             label: `${intl.unclarified}`,
                             color: chartColor.generalRed,
                             size: dashData.allProcesses.dpia.unknown,
                             onClick: () => clickOnPieChartSlice(ProcessField.DPIA, ProcessState.UNKNOWN)
                           },
                         ]
                       }/>
              </Block>

              <Block {...boxProps}>
                <Chart chartTitle={intl.profiling} size={chartSize}
                       data={
                         [
                           {
                             label: `${intl.yes}`,
                             color: chartColor.generalBlue,
                             size: dashData.allProcesses.profiling?.yes || 0,
                             onClick: () => clickOnPieChartSlice(ProcessField.PROFILING, ProcessState.YES)
                           },
                           {
                             label: `${intl.no}`,
                             color: chartColor.generalMustard,
                             size: dashData.allProcesses.profiling?.no || 0,
                             onClick: () => clickOnPieChartSlice(ProcessField.PROFILING, ProcessState.NO)
                           },
                           {
                             label: `${intl.unclarified}`,
                             color: chartColor.generalRed,
                             size: dashData.allProcesses.profiling?.unknown || 0,
                             onClick: () => clickOnPieChartSlice(ProcessField.PROFILING, ProcessState.UNKNOWN)
                           },
                         ]
                       }/>
              </Block>

              <Block {...boxProps}>
                <Chart chartTitle={intl.automaticProcessing} size={chartSize}
                       data={
                         [
                           {
                             label: `${intl.yes}`,
                             color: chartColor.generalBlue,
                             size: dashData.allProcesses.automation?.yes || 0,
                             onClick: () => clickOnPieChartSlice(ProcessField.AUTOMATION, ProcessState.YES)
                           },
                           {
                             label: `${intl.no}`,
                             color: chartColor.generalMustard,
                             size: dashData.allProcesses.automation?.no || 0,
                             onClick: () => clickOnPieChartSlice(ProcessField.AUTOMATION, ProcessState.NO)
                           },
                           {
                             label: `${intl.unclarified}`,
                             color: chartColor.generalRed,
                             size: dashData.allProcesses.automation?.unknown || 0,
                             onClick: () => clickOnPieChartSlice(ProcessField.AUTOMATION, ProcessState.UNKNOWN)
                           },
                         ]
                       }/>
              </Block>

              <Block {...boxProps}>
                <Chart chartTitle={intl.incompleteLegalBasis} size={chartSize}
                       data={
                         [
                           {
                             label: intl.numberOfProcessesWithUnknownLegalBasis,
                             size: dashData.allProcesses.processesMissingLegalBases,
                             color:chartColor.generalRed,
                             onClick: () => clickOnPieChartSlice(ProcessField.MISSING_LEGAL_BASIS, ProcessState.YES)
                           },
                           {
                             label: intl.numberOfProcessesWithoutArticle6LegalBasis,
                             size: dashData.allProcesses.processesMissingArt6,
                             color:chartColor.generalMustard,
                             onClick: () => clickOnPieChartSlice(ProcessField.MISSING_ARTICLE_6, ProcessState.YES)
                           },
                           {
                             label: intl.numberOfProcessesWithoutArticle9LegalBasis,
                             size: dashData.allProcesses.processesMissingArt9,
                             color:chartColor.generalBlue,
                             onClick: () => clickOnPieChartSlice(ProcessField.MISSING_ARTICLE_9, ProcessState.YES)
                           },
                         ]
                       }/>
              </Block>
              <Block {...boxProps}>
                <Chart headerTitle={intl.retention} chartTitle={intl.retentionPieChartTitle} size={chartSize}
                       data={
                         [
                           {
                             label: intl.yes,
                             size: dashData.allProcesses.retention!.yes || 0,
                             color: chartColor.generalBlue,
                             onClick: () => clickOnPieChartSlice(ProcessField.RETENTION, ProcessState.YES)
                           },
                           {
                             label: intl.no,
                             size: dashData.allProcesses.retention!.no || 0,
                             color: chartColor.generalMustard,
                             onClick: () => clickOnPieChartSlice(ProcessField.RETENTION, ProcessState.NO)
                           },
                           {
                             label: intl.unclarified,
                             size: dashData.allProcesses.retention!.unknown || 0,
                             color: chartColor.generalRed,
                             onClick: () => clickOnPieChartSlice(ProcessField.RETENTION, ProcessState.UNKNOWN)
                           },
                         ]
                       }/>
                <Paragraph1>
                  {intl.processWithIncompleteRetention} <RouteLink
                  href={`/dashboard/${ProcessField.RETENTION_DATA}/${ProcessState.UNKNOWN}`}>{dashData.allProcesses.retentionDataIncomplete}</RouteLink>
                </Paragraph1>
              </Block>
            </Block>


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
