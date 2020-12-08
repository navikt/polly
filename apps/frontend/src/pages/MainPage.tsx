import {theme} from '../util'
import * as React from 'react'
import {useEffect, useState} from 'react'
import {Block} from 'baseui/block'
import {DashboardData, ProcessStatus, Settings} from '../constants'
import {getSettings} from '../api/SettingsApi'
import {Card} from 'baseui/card'
import {cardShadow} from '../components/common/Style'
import Departments from '../components/Dashboard/Departments'
import {getDashboard} from '../api'
import {useParams} from 'react-router-dom'
import {LastEvents} from '../components/audit/LastEvents'
import {Markdown} from '../components/common/Markdown'
import {FilterDashboardStatus} from "../components/Dashboard/FilterDashboardStatus";
import Charts from '../components/Charts/Charts'
import {RecentEditsByUser} from "../components/audit/RecentEditsByUser";

export const MainPage = () => {
  const { processStatus } = useParams()
  const [settings, setSettings] = useState<Settings>()
  const [isLoading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData>()
  const [dashboardStatus, setDashboardStatus] = useState<ProcessStatus>(processStatus ? processStatus as ProcessStatus : ProcessStatus.All)

  useEffect(() => {
    (async () => {
      setSettings(await getSettings())
      setLoading(false)
      for (let key in localStorage){
        if(key.indexOf("Yposition")===0){
          localStorage.removeItem(key)
        }
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      setDashboardData(await getDashboard(dashboardStatus))
    })()
  }, [dashboardStatus])

  return (
    <Block marginTop={theme.sizing.scale400} display="flex" flexWrap>
      {
        !isLoading && dashboardData && (
          <>

            <Departments data={dashboardData} />

            <FilterDashboardStatus setFilter={setDashboardStatus} />

            <Charts chartData={dashboardData.allProcesses} processStatus={dashboardStatus} />

            <Block marginTop="2.5rem">
              <Card overrides={cardShadow}>
                <Markdown source={settings?.frontpageMessage} escapeHtml={false} verbatim />
              </Card>
            </Block>

            <Block width="100%" display="flex" alignContent="center" marginTop="2.5rem">
              <RecentEditsByUser/>
            </Block>

            <Block width="100%" display="flex" alignContent="center" marginTop="2.5rem">
              <LastEvents />
            </Block>

          </>
        )
      }
    </Block>
  )
}
