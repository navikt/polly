import { Heading } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { getDashboard } from '../api/GetAllApi'
import { getSettings } from '../api/SettingsApi'
import ShortcutNav from '../components/Main/ShortcutNav'
import { LastEvents } from '../components/admin/audit/LastEvents'
import { RecentEditsByUser } from '../components/admin/audit/RecentEditsByUser'
import { Markdown } from '../components/common/Markdown'
import { EProcessStatusFilter, IDashboardData, ISettings } from '../constants'
import { user } from '../service/User'

export const MainPage = () => {
  const [settings, setSettings] = useState<ISettings>()
  const [isLoading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<IDashboardData>()

  useEffect(() => {
    ;(async () => {
      setSettings(await getSettings())
      setLoading(false)
      for (const key in localStorage) {
        if (key.indexOf('Yposition') === 0) {
          localStorage.removeItem(key)
        }
      }
    })()
  }, [])

  useEffect(() => {
    getDashboard(EProcessStatusFilter.All).then(setDashboardData)
  }, [])

  return (
    <div className="flex flex-wrap" role="main">
      {!isLoading && dashboardData && (
        <>
          <div className="w-full flex flex-col">
            <div className="flex justify-center mb-10">
              <Heading size="xlarge" level="1">
                Hva vil du gjøre?
              </Heading>
            </div>
            <ShortcutNav />
          </div>

          <div className="w-full flex justify-center mt-12 mb-10">
            <Heading size="xlarge" level="1">
              Hva har endret seg i det siste?
            </Heading>
          </div>

          <div className="w-full flex mb-6 flex-wrap gap-6">
            {user.isLoggedIn() && (
              <div className="flex w-full md:w-[48%] min-w-0" style={{ minHeight: '550px' }}>
                <div className="bg-white p-4 rounded-lg shadow-[0px_0px_6px_3px_rgba(0,0,0,0.08)] w-full min-w-0">
                  <RecentEditsByUser />
                </div>
              </div>
            )}
            <div className="flex w-full md:w-[48%] min-w-0" style={{ minHeight: '550px' }}>
              <div className="bg-white p-4 rounded-lg shadow-[0px_0px_6px_3px_rgba(0,0,0,0.08)] w-full min-w-0">
                <LastEvents />
              </div>
            </div>

            <div
              className={`${user.isLoggedIn() ? 'w-full mt-12 mb-0.5' : 'w-full md:w-[48%] mt-0.5'}`}
              style={{ minHeight: '550px' }}
            >
              <div className="bg-white p-4 rounded-lg shadow-[0px_0px_6px_3px_rgba(0,0,0,0.08)]">
                <Markdown source={settings?.frontpageMessage} escapeHtml={false} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
