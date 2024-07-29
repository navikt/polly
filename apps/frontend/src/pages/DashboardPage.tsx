import { HeadingMedium } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDashboard } from '../api'
import Charts from '../components/Charts/Charts'
import Departments from '../components/Dashboard/Departments'
import { FilterDashboardStatus } from '../components/Dashboard/FilterDashboardStatus'
import { Spinner } from '../components/common/Spinner'
import { DashboardData, ProcessStatusFilter } from '../constants'
import { ampli } from '../service/Amplitude'
import { theme } from '../util'

export const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>()
  const { processStatus } = useParams<{ processStatus: ProcessStatusFilter }>()
  const [dashboardStatus, setDashboardStatus] = useState<ProcessStatusFilter>(processStatus ? (processStatus as ProcessStatusFilter) : ProcessStatusFilter.All)

  ampli.logEvent('besøk', { side: 'Dashboard', url: '/dashboard/', app: 'Behandlingskatalogen' })

  useEffect(() => {
    ;(async () => {
      setDashboardData(await getDashboard(dashboardStatus))
    })()
  }, [dashboardStatus])

  return (
    <div className="mb-12 flex flex-wrap">
      <div className="flex justify-between w-full">
        <HeadingMedium marginTop="0">Dashboard</HeadingMedium>
        <FilterDashboardStatus setFilter={setDashboardStatus} />
      </div>

      {dashboardData && <Departments data={dashboardData} />}
      {dashboardData && <Charts chartData={dashboardData.all} processStatus={dashboardStatus} />}
      {!dashboardData && <Spinner size={theme.sizing.scale600} />}
    </div>
  )
}
