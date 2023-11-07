import { FilterDashboardStatus } from '../components/Dashboard/FilterDashboardStatus'
import Charts from '../components/Charts/Charts'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Block } from 'baseui/block'
import { intl, theme } from '../util'
import { DashboardData, ProcessStatusFilter } from '../constants'
import { useParams } from 'react-router-dom'
import { getDashboard } from '../api'
import { Spinner } from '../components/common/Spinner'
import { HeadingMedium } from 'baseui/typography'
import Departments from '../components/Dashboard/Departments'
import {ampli} from "../service/Amplitude";

export const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>()
  const { processStatus } = useParams<{ processStatus: ProcessStatusFilter }>()
  const [dashboardStatus, setDashboardStatus] = useState<ProcessStatusFilter>(processStatus ? (processStatus as ProcessStatusFilter) : ProcessStatusFilter.All)

  ampli.logEvent("besøk", {side: 'Dashboard'})

  useEffect(() => {
    ;(async () => {
      setDashboardData(await getDashboard(dashboardStatus))
    })()
  }, [dashboardStatus])

  return (
    <Block marginBottom={theme.sizing.scale1200} display="flex" flexWrap>
      <Block display="flex" justifyContent="space-between" width="100%">
        <HeadingMedium marginTop="0">{intl.dashboard}</HeadingMedium>
        <FilterDashboardStatus setFilter={setDashboardStatus} />
      </Block>

      {dashboardData && <Departments data={dashboardData} />}
      {dashboardData && <Charts chartData={dashboardData.all} processStatus={dashboardStatus} />}
      {!dashboardData && <Spinner size={theme.sizing.scale600} />}
    </Block>
  )
}
