import {intl, theme} from '../util'
import * as React from 'react'
import {useEffect, useState} from 'react'
import {Block} from 'baseui/block'
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
import {PLACEMENT, StatefulTooltip} from "baseui/tooltip";

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

  const colorYes = theme.colors.positive300
  const colorNo = theme.colors.negative300
  const colorUnknown = theme.colors.warning300

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
                             color: colorYes,
                             size: dashData.allProcesses.dpia.yes,
                             onClick: () => clickOnPieChartSlice(ProcessField.DPIA, ProcessState.YES)
                           },
                           {
                             label: `${intl.no}`,
                             color: colorNo,
                             size: dashData.allProcesses.dpia.no,
                             onClick: () => clickOnPieChartSlice(ProcessField.DPIA, ProcessState.NO)
                           },
                           {
                             label: `${intl.unclarified}`,
                             color: colorUnknown,
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
                             color: colorYes,
                             size: dashData.allProcesses.profiling?.yes || 0,
                             onClick: () => clickOnPieChartSlice(ProcessField.PROFILING, ProcessState.YES)
                           },
                           {
                             label: `${intl.no}`,
                             color: colorNo,
                             size: dashData.allProcesses.profiling?.no || 0,
                             onClick: () => clickOnPieChartSlice(ProcessField.PROFILING, ProcessState.NO)
                           },
                           {
                             label: `${intl.unclarified}`,
                             color: colorUnknown,
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
                             color: colorYes,
                             size: dashData.allProcesses.automation?.yes || 0,
                             onClick: () => clickOnPieChartSlice(ProcessField.AUTOMATION, ProcessState.YES)
                           },
                           {
                             label: `${intl.no}`,
                             color: colorNo,
                             size: dashData.allProcesses.automation?.no || 0,
                             onClick: () => clickOnPieChartSlice(ProcessField.AUTOMATION, ProcessState.NO)
                           },
                           {
                             label: `${intl.unclarified}`,
                             color: colorUnknown,
                             size: dashData.allProcesses.automation?.unknown || 0,
                             onClick: () => clickOnPieChartSlice(ProcessField.AUTOMATION, ProcessState.UNKNOWN)
                           },
                         ]
                       }/>
              </Block>

              <Block marginTop={theme.sizing.scale600} minWidth={'520px'}>
                <Chart title={intl.incompleteLegalBasis} size={chartSize}
                       data={
                         [
                           {
                             label:
                               <StatefulTooltip content={intl.numberOfProcessesWithUnknownLegalBasisHelpText} placement={PLACEMENT.topLeft}>
                                 {intl.numberOfProcessesWithUnknownLegalBasis}
                               </StatefulTooltip>,
                             size: dashData.allProcesses.processesMissingLegalBases,
                             onClick: () => clickOnPieChartSlice(ProcessField.MISSING_LEGAL_BASIS, ProcessState.YES)
                           },
                           {
                             label:
                               <StatefulTooltip content={intl.numberOfProcessesWithoutArticle6LegalBasisHelpText} placement={PLACEMENT.topLeft}>
                                 {intl.numberOfProcessesWithoutArticle6LegalBasis}
                               </StatefulTooltip>,
                             size: dashData.allProcesses.processesMissingArt6,
                             onClick: () => clickOnPieChartSlice(ProcessField.MISSING_ARTICLE_6, ProcessState.YES)
                           },
                           {
                             label:
                               <StatefulTooltip content={intl.numberOfProcessesWithoutArticle9LegalBasisHelpText} placement={PLACEMENT.topLeft}>
                                 {intl.numberOfProcessesWithoutArticle9LegalBasis}
                               </StatefulTooltip>,
                             size: dashData.allProcesses.processesMissingArt9,
                             onClick: () => clickOnPieChartSlice(ProcessField.MISSING_ARTICLE_9, ProcessState.YES)
                           },
                         ]
                       }/>
              </Block>
            </Block>


            <Block marginTop="2.5rem">
              <Card overrides={cardShadow}>
                <Markdown source={settings?.frontpageMessage} escapeHtml={false}/>
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
