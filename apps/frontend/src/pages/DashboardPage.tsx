import { useParams } from '@/util/router'
import { Heading, Loader } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { getDashboard } from '../api/GetAllApi'
import Charts from '../components/Charts/Charts'
import Departments from '../components/Dashboard/Departments'
import { FilterDashboardStatus } from '../components/Dashboard/FilterDashboardStatus'
import { EProcessStatusFilter, IDashboardData } from '../constants'

export const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<IDashboardData>()
  const { filterName: processStatus } = useParams<{ filterName: EProcessStatusFilter }>()
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
      <div className="flex flex-col w-full gap-2">
        <Heading size="large">Dashboard</Heading>
        <FilterDashboardStatus setFilter={setDashboardStatus} />
      </div>

      {dashboardData && (
        <div className="w-full mt-6">
          <Heading size="medium" className="mb-2">
            Avdelinger
          </Heading>
          <Departments data={dashboardData} />
        </div>
      )}
      {dashboardData && (
        <div className="w-full mt-6">
          <Heading size="medium" className="mb-4">
            Behandlingsstatistikk (ikke inkludert NAV som databehandler)
          </Heading>
          <Charts chartData={dashboardData.all} processStatus={dashboardStatus} />
        </div>
      )}
      {!dashboardData && (
        <div className="flex w-full justify-center">
          <Loader size="3xlarge" />
        </div>
      )}
    </div>
  )
}
