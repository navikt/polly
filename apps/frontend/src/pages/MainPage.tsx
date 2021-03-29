import * as React from 'react'
import {useEffect, useState} from 'react'
import {Block} from 'baseui/block'
import {DashboardData, Settings} from '../constants'
import {getSettings} from '../api/SettingsApi'
import {Card} from 'baseui/card'
import {cardShadow} from '../components/common/Style'
import {getDashboard} from '../api'
import {LastEvents} from '../components/audit/LastEvents'
import {Markdown} from '../components/common/Markdown'
import {RecentEditsByUser} from "../components/audit/RecentEditsByUser";
import {user} from "../service/User";
import {HeadingLarge} from 'baseui/typography'
import ShortcutNav from '../components/Main/ShortcutNav'
import {intl, theme} from '../util'

export const MainPage = () => {
  const [settings, setSettings] = useState<Settings>()
  const [isLoading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData>()

  useEffect(() => {
    (async () => {
      setSettings(await getSettings())
      setLoading(false)
      for (let key in localStorage) {
        if (key.indexOf("Yposition") === 0) {
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
        width: '100%'
      }
    }
  }

  return (
    <Block display="flex" flexWrap>
      {
        !isLoading && dashboardData && (
          <>
            <Block width="100%" display="flex" flexDirection="column">
              <Block display="flex" justifyContent="center"><HeadingLarge>{intl.mainPageMessage}</HeadingLarge></Block>
              <ShortcutNav/>
            </Block>

            <Block width="100%" display="flex" justifyContent="center" marginTop={theme.sizing.scale1200} marginBottom={theme.sizing.scale800}>
              <HeadingLarge>{intl.mainPageEventsMessage}</HeadingLarge>
            </Block>

            <Block width="100%" display="flex" justifyContent="space-between" marginBottom={theme.sizing.scale800} flexWrap>
              {user.isLoggedIn() && (
                <Block display="flex" width='48%' marginBottom={theme.sizing.scale800} height="550px">
                  <Card overrides={cardOverrides}>
                    <RecentEditsByUser/>
                  </Card>
                </Block>
              )}
              <Block display="flex" width='48%' marginBottom={theme.sizing.scale800} height="550px">
                <Card overrides={cardOverrides}>
                  <LastEvents/>

                </Card>
              </Block>

              <Block height="550px" width={user.isLoggedIn() ? '100%' : '48%'}
                     marginTop={user.isLoggedIn() ? theme.sizing.scale1200 : theme.sizing.scale0}
                     marginBottom={user.isLoggedIn() ? theme.sizing.scale0 : theme.sizing.scale2400}>
                <Card overrides={cardShadow}>
                  <Markdown source={settings?.frontpageMessage} escapeHtml={false} verbatim/>
                </Card>
              </Block>
            </Block>
          </>
        )
      }
    </Block>
  )
}
