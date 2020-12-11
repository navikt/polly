import {intl, theme} from '../util'
import * as React from 'react'
import {useEffect, useState} from 'react'
import {Block} from 'baseui/block'
import {DashboardData, Settings} from '../constants'
import {getSettings} from '../api/SettingsApi'
import {Card} from 'baseui/card'
import {cardShadow, padding} from '../components/common/Style'
import Departments from '../components/Dashboard/Departments'
import {getDashboard} from '../api'
import {LastEvents} from '../components/audit/LastEvents'
import {Markdown} from '../components/common/Markdown'
import {RecentEditsByUser} from "../components/audit/RecentEditsByUser";
import {user} from "../service/User";
import RouteLink from '../components/common/RouteLink'
import {LabelMedium} from 'baseui/typography'

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

  return (
    <Block marginTop={theme.sizing.scale400} display="flex" flexWrap>
      {
        !isLoading && dashboardData && (
          <>

            <Departments data={dashboardData}/>

            <Block marginTop='2.5rem' width='100%'>
              <Card overrides={cardShadow}>
                <Block $style={padding('16px', '6px')} display='flex' justifyContent='center'>
                  <LabelMedium>Choose your path!</LabelMedium>
                </Block>
              </Card>

              <Block width='100%' marginTop='1.5rem' display='flex' justifyContent='space-between'>
                <Card overrides={cardShadow}>
                  <Block $style={padding('16px', '6px')}>
                    <RouteLink href='/process'>{intl.processes}</RouteLink>
                  </Block>
                </Card>
                <Card overrides={cardShadow}>
                  <Block $style={padding('16px', '6px')}>
                    <RouteLink href='/dpprocess'>{intl.dpProcesses}</RouteLink>
                  </Block>
                </Card>
                <Card overrides={cardShadow}>
                  <Block $style={padding('16px', '6px')}>
                    <RouteLink href='/informationtype'>{intl.informationTypes}</RouteLink>
                  </Block>
                </Card>
                <Card overrides={cardShadow}>
                  <Block $style={padding('16px', '6px')}>
                    <RouteLink href='/document'>{intl.documents}</RouteLink>
                  </Block>
                </Card>
              </Block>
            </Block>

            <Block marginTop="2.5rem">
              <Card overrides={cardShadow}>
                <Markdown source={settings?.frontpageMessage} escapeHtml={false} verbatim/>
              </Card>
            </Block>

            {user.isLoggedIn() && (
              <Block width="100%" display="flex" alignContent="center" marginTop="2.5rem">
                <RecentEditsByUser/>
              </Block>
            )}


            <Block width="100%" display="flex" alignContent="center" marginTop="2.5rem" marginBottom={"200px"}>
              <LastEvents/>
            </Block>

          </>
        )
      }
    </Block>
  )
}
