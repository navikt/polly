import { Heading, Loader } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getDashboard } from '../api/GetAllApi'
import Charts from '../components/Charts/Charts'
import Departments from '../components/Dashboard/Departments'
import { FilterDashboardStatus } from '../components/Dashboard/FilterDashboardStatus'
import { EProcessStatusFilter, IDashboardData } from '../constants'

export const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<IDashboardData>()
  const { processStatus } = useParams<{ processStatus: EProcessStatusFilter }>()
  const [dashboardStatus, setDashboardStatus] = useState<EProcessStatusFilter>(
    processStatus ? (processStatus as EProcessStatusFilter) : EProcessStatusFilter.All
  )

  useEffect(() => {
    ;(async () => {
      setDashboardData(await getDashboard(dashboardStatus))
    })()
  }, [dashboardStatus])

  return (
    <div className="mb-12 flex flex-wrap">
      <div className="flex justify-between w-full">
        <Heading size="large">Dashboard</Heading>
        <FilterDashboardStatus setFilter={setDashboardStatus} />
      </div>

      {dashboardData && <Departments data={dashboardData} />}
      {dashboardData && <Charts chartData={dashboardData.all} processStatus={dashboardStatus} />}
      {!dashboardData && (
        <div className="flex w-full justify-center">
          <Loader size="3xlarge" />
        </div>
      )}
    </div>
  )
}
