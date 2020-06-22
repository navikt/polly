import { intl, theme, useAwait } from '../util'
import { user } from '../service/User'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Block } from 'baseui/block'
import { DashboardData, ProcessField, ProcessState, Settings } from '../constants'
import { getSettings } from '../api/SettingsApi'
import ReactMarkdown from 'react-markdown/with-html'
import { Card } from 'baseui/card'
import { cardShadow } from '../components/common/Style'
import Departments from '../components/Dashboard/Departments'
import { getDashboard } from '../api'
import { Chart } from '../components/Dashboard/Chart'
import { RouteComponentProps } from 'react-router-dom'
import { LastEvents } from '../components/audit/LastEvents'

export const Main = (props: RouteComponentProps) => {
  useAwait(user.wait())
  const [settings, setSettings] = useState<Settings>()
  const [isLoading, setLoading] = useState(true)
  const [dashData, setDashData] = useState<DashboardData>()
  const chartSize = 80

  const clickOnPieChartSlice = (processField: ProcessField, processState: ProcessState) => props.history.push(`/dashboard/${processField}/${processState}`)

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
              <Block marginTop={theme.sizing.scale600} marginRight={theme.sizing.scale600} minWidth={'520px'}>
                <Chart title={intl.dpiaNeeded} size={chartSize}
                       data={
                         [
                           {
                             label: `${intl.yes}`,
                             size: dashData.allProcesses.dpia.yes,
                             onClick: () => clickOnPieChartSlice(ProcessField.DPIA, ProcessState.YES)
                           },
                           {
                             label: `${intl.no}`,
                             size: dashData.allProcesses.dpia.no,
                             onClick: () => clickOnPieChartSlice(ProcessField.DPIA, ProcessState.NO)
                           },
                           {
                             label: `${intl.unclarified}`,
                             size: dashData.allProcesses.dpia.unknown,
                             onClick: () => clickOnPieChartSlice(ProcessField.DPIA, ProcessState.UNKNOWN)
                           },
                         ]
                       }/>
              </Block>

              <Block marginTop={theme.sizing.scale600} marginRight={theme.sizing.scale600} minWidth={'520px'}>
                <Chart title={intl.profiling} size={chartSize}
                       data={
                         [
                           {
                             label: `${intl.yes}`,
                             size: dashData.allProcesses.profiling?.yes || 0,
                             onClick: () => clickOnPieChartSlice(ProcessField.PROFILING, ProcessState.YES)
                           },
                           {
                             label: `${intl.no}`,
                             size: dashData.allProcesses.profiling?.no || 0,
                             onClick: () => clickOnPieChartSlice(ProcessField.PROFILING, ProcessState.NO)
                           },
                           {
                             label: `${intl.unclarified}`,
                             size: dashData.allProcesses.profiling?.unknown || 0,
                             onClick: () => clickOnPieChartSlice(ProcessField.PROFILING, ProcessState.UNKNOWN)
                           },
                         ]
                       }/>
              </Block>

              <Block marginTop={theme.sizing.scale600} marginRight={theme.sizing.scale600} minWidth={'520px'}>
                <Chart title={intl.automaticProcessing} size={chartSize}
                       data={
                         [
                           {
                             label: `${intl.yes}`,
                             size: dashData.allProcesses.automation?.yes || 0,
                             onClick: () => clickOnPieChartSlice(ProcessField.AUTOMATION, ProcessState.YES)
                           },
                           {
                             label: `${intl.no}`,
                             size: dashData.allProcesses.automation?.no || 0,
                             onClick: () => clickOnPieChartSlice(ProcessField.AUTOMATION, ProcessState.NO)
                           },
                           {
                             label: `${intl.unclarified}`,
                             size: dashData.allProcesses.automation?.unknown || 0,
                             onClick: () => clickOnPieChartSlice(ProcessField.AUTOMATION, ProcessState.UNKNOWN)
                           },
                         ]
                       }/>
              </Block>

              <Block marginTop={theme.sizing.scale600}  minWidth={'520px'}>
                <Chart title={intl.incompleteLegalBasis} size={chartSize}
                       data={
                         [
                           {
                             label: `${intl.numberOfProcessesWithUnknownLegalBasis}`,
                             size: dashData.allProcesses.processesMissingLegalBases,
                             onClick: () => clickOnPieChartSlice(ProcessField.MISSING_LEGAL_BASIS, ProcessState.YES)
                           },
                           {
                             label: `${intl.numberOfProcessesWithoutArticle6LegalBasis}`,
                             size: dashData.allProcesses.processesMissingArt6,
                             onClick: () => clickOnPieChartSlice(ProcessField.MISSING_ARTICLE_6, ProcessState.YES)
                           },
                           {
                             label: `${intl.numberOfProcessesWithoutArticle9LegalBasis}`,
                             size: dashData.allProcesses.processesMissingArt9,
                             onClick: () => clickOnPieChartSlice(ProcessField.MISSING_ARTICLE_9, ProcessState.YES)
                           },
                         ]
                       }/>
              </Block>
            </Block>


            <Block marginTop="2.5rem">
              <Card overrides={cardShadow}>
                <ReactMarkdown source={settings?.frontpageMessage} escapeHtml={false}/>
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
