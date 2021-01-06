import {FilterDashboardStatus} from '../components/Dashboard/FilterDashboardStatus'
import Charts from '../components/Charts/Charts'
import * as React from 'react'
import {useEffect, useState} from 'react'
import {Block} from 'baseui/block'
import {intl, theme} from '../util'
import {DashboardData, ProcessStatus} from '../constants'
import {useParams} from 'react-router-dom'
import {getDashboard} from '../api'
import {Spinner} from '../components/common/Spinner'
import {HeadingMedium} from 'baseui/typography'

export const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>()
  const {processStatus} = useParams<{processStatus: ProcessStatus}>()
  const [dashboardStatus, setDashboardStatus] = useState<ProcessStatus>(processStatus ? processStatus as ProcessStatus : ProcessStatus.All)

  useEffect(() => {
    (async () => {
      setDashboardData(await getDashboard(dashboardStatus))
    })()
  }, [dashboardStatus])

  return (
    <Block marginBottom={theme.sizing.scale1200} display="flex" flexWrap>
      <Block display='flex' justifyContent='space-between' width='100%'>
        <HeadingMedium marginTop='0'>{intl.dashboard}</HeadingMedium>
        <FilterDashboardStatus setFilter={setDashboardStatus}/>
      </Block>

      {dashboardData && <Charts chartData={dashboardData.allProcesses} processStatus={dashboardStatus}/>}
      {!dashboardData && <Spinner size={theme.sizing.scale600}/>}
    </Block>
  )
}
