import { intl, theme, useAwait } from "../util"
import { user } from "../service/User"
import * as React from "react"
import { useEffect, useState } from "react"
import { Block } from "baseui/block"
import { getEvents } from "../api/AuditApi"
import { AuditAction, Event, ObjectType, PageResponse, Settings, DashboardData } from "../constants"
import { StatefulTabs, Tab } from "baseui/tabs"
import { HeadingMedium, Label2 } from "baseui/typography"
import moment from "moment"
import { ObjectLink } from "../components/common/RouteLink"
import { Option, StatefulSelect, Value } from "baseui/select"
import { AuditActionIcon } from "../components/audit/AuditComponents"
import { PLACEMENT } from "baseui/popover"
import { StatefulTooltip } from "baseui/tooltip"
import { getSettings } from "../api/SettingsApi"
import ReactMarkdown from "react-markdown/with-html"
import { Card } from "baseui/card"
import { cardShadow } from "../components/common/Style"
import DepartmentCard from "../components/Dashboard/Departments"
import Departments from "../components/Dashboard/Departments"
import { getDashboard } from "../api"

const LastEvents = () => {
  const [events, setEvents] = useState<PageResponse<Event>>()
  const [table, setTable] = useState<ObjectType>(ObjectType.INFORMATION_TYPE)
  const [action, setAction] = useState<Value>([{ id: AuditAction.CREATE, label: intl.CREATE } as Option])

  useEffect(() => {
    (async () => {
      setEvents(await getEvents(0, 20, table, undefined, action[0].id as AuditAction))
    })()
  }, [table, action])

  const content = events?.content.map((event, index) =>
    <Block key={event.id} marginBottom=".3rem">
      <ObjectLink id={event.tableId} type={event.table} disable={event.action === AuditAction.DELETE} hideUnderline>
        <span>
          <AuditActionIcon action={event.action} />
          <StatefulTooltip content={moment(event.time).format('lll')} placement={PLACEMENT.top}>{moment(event.time).fromNow()}</StatefulTooltip>
          : {event.name}
        </span>
      </ObjectLink>
    </Block>
  )

  return (
    <Block width="100%">
      <Block display="flex" justifyContent="space-between" alignItems="flex-end" width="100%">
        <HeadingMedium>{intl.lastEvents}</HeadingMedium>
        <Block width="25%" marginBottom=".5rem" display="flex" justifyContent="space-between" alignItems="center">
          <Label2 marginRight=".5rem">{intl.eventType}</Label2>
          <StatefulSelect
            size="compact"
            clearable={false}
            options={Object.keys(AuditAction).map(auditAction => ({ id: auditAction, label: intl[auditAction as AuditAction] }))}
            initialState={{ value: action }} onChange={params => setAction(params.value)}
          />
        </Block>
      </Block>
      <Block>
        <StatefulTabs onChange={(args => setTable(args.activeKey as ObjectType))}
        >
          {Object.keys(ObjectType).filter(tableName => tableName !== ObjectType.GENERIC_STORAGE && tableName !== ObjectType.CODELIST)
            .map(tableName =>
              <Tab key={tableName}
                title={(intl as any)[tableName] || tableName}>{content}
              </Tab>)}
        </StatefulTabs>
      </Block>
    </Block>
  )
}

export const Main = () => {
  useAwait(user.wait())
  const [settings, setSettings] = useState<Settings>()
  const [isLoading, setLoading] = useState(true)
  const [dashData, setDashData] = useState<DashboardData>()

  useEffect(() => {
    (async () => {
      setSettings(await getSettings())
      setDashData(await getDashboard())
      setLoading(false)
    })()
  }, [])

  return (
    <Block marginTop={theme.sizing.scale400} display="flex" flexWrap>
      {
        !isLoading && dashData && (
          <>
            <Departments data={dashData} />

            <Block marginTop="2.5rem">
              <Card overrides={cardShadow}>
                <ReactMarkdown source={settings?.frontpageMessage} escapeHtml={false} />
              </Card>
            </Block>

            <Block width="100%" display="flex" justifyContent="center" alignContent="center">
              {user.isAdmin() &&
                <Card overrides={cardShadow}>
                  <LastEvents />
                </Card>
              }
            </Block>
          </>
        )
      }
    </Block>
  )
}
