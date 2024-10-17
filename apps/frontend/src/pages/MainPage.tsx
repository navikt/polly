import { Card } from 'baseui/card'
import { HeadingXXLarge } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { getDashboard } from '../api/GetAllApi'
import { getSettings } from '../api/SettingsApi'
import ShortcutNav from '../components/Main/ShortcutNav'
import { LastEvents } from '../components/admin/audit/LastEvents'
import { RecentEditsByUser } from '../components/admin/audit/RecentEditsByUser'
import { Markdown } from '../components/common/Markdown'
import { cardShadow } from '../components/common/Style'
import { IDashboardData, ISettings } from '../constants'
import { ampli } from '../service/Amplitude'
import { user } from '../service/User'

export const MainPage = () => {
  const [settings, setSettings] = useState<ISettings>()
  const [isLoading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<IDashboardData>()

  ampli.logEvent('besøk', { side: 'Hovedside', url: '/', app: 'Behandlingskatalogen' })

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
    getDashboard().then(setDashboardData)
  }, [])

  const cardOverrides = {
    Root: {
      style: {
        ...cardShadow.Root.style,
        width: '100%',
      },
    },
  }

  return (
    <div className="flex flex-wrap" role="main">
      {!isLoading && dashboardData && (
        <>
          <div className="w-full flex flex-col">
            <div className="flex justify-center">
              <HeadingXXLarge>Hva vil du gjøre?</HeadingXXLarge>
            </div>
            <ShortcutNav />
          </div>

          <div className="w-full flex justify-center mt-12 mb-6">
            <HeadingXXLarge>Hva har endret seg i det siste?</HeadingXXLarge>
          </div>

          <div className="w-full flex justify-between mb-6 flex-wrap">
            {user.isLoggedIn() && (
              <div className="flex w-[48%] mb-6 min-h-[550px]">
                <Card overrides={cardOverrides}>
                  <RecentEditsByUser />
                </Card>
              </div>
            )}
            <div className="flex w-[48%] mb-6 min-h-[550px]">
              <Card overrides={cardOverrides}>
                <LastEvents />
              </Card>
            </div>

            <div
              className={`min-h-[550px] ${user.isLoggedIn() ? 'w-full mt-12 mb-[2px]' : 'w-[48%] mt-[2px] mb-6'}`}
            >
              <Card overrides={cardShadow}>
                <Markdown source={settings?.frontpageMessage} escapeHtml={false} />
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
