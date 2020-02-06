import { intl, theme, useAwait } from "../util"
import { user } from "../service/User"
import * as React from "react"
import { useEffect, useState } from "react"
import { Block } from "baseui/block"
import startIll from '../resources/start_illustration.svg'
import { getEvents } from "../api/AuditApi"
import { AuditAction, Event, ObjectType, PageResponse } from "../constants"
import { StatefulTabs, Tab } from "baseui/tabs"
import { HeadingMedium } from "baseui/typography"
import moment from "moment"
import { ObjectLink } from "../components/common/RouteLink"
import { Option, StatefulSelect, Value } from "baseui/select"
import { AuditActionIcon } from "../components/audit/AuditComponents"
import { PLACEMENT } from "baseui/popover"
import { StatefulTooltip } from "baseui/tooltip"

export const Main = () => {
  useAwait(user.wait())

  return (
    <Block display="flex" marginTop={theme.sizing.scale1200}
           overrides={{
             Block: {
               style: {
                 backgroundImage: `url(${startIll})`,
                 backgroundPosition: "bottom right",
                 backgroundRepeat: "no-repeat",
                 backgroundSize: "65%"
               }
             }
           }}
           minHeight="60vh">
      <LastEvents/>
    </Block>
  )
}

const LastEvents = () => {
  const [events, setEvents] = useState<PageResponse<Event>>()
  const [table, setTable] = useState<ObjectType>(ObjectType.INFORMATION_TYPE)
  const [action, setAction] = useState<Value>([{id: AuditAction.CREATE, label: intl.CREATE} as Option])

  useEffect(() => {
    (async () => {
      setEvents(await getEvents(0, 20, table, undefined, action[0].id as AuditAction))
    })()
  }, [table, action])

  const content = events?.content.map((event, index) =>
    <Block key={event.id}>
      <ObjectLink id={event.tableId} type={event.table} disable={event.action === AuditAction.DELETE} hideUnderline>
        <span>
          <AuditActionIcon action={event.action}/>
          <StatefulTooltip content={moment(event.time).format('lll')} placement={PLACEMENT.top}>{moment(event.time).fromNow()}</StatefulTooltip>
          : {event.name}
        </span>
      </ObjectLink>
    </Block>
  )

  return (
    <Block width="100%">
      <Block display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <HeadingMedium>Siste hendelser</HeadingMedium>
        <Block maxWidth="150px">
          <StatefulSelect
            size="compact"
            clearable={false}
            options={[{id: AuditAction.CREATE, label: intl.CREATE}, {id: AuditAction.UPDATE, label: intl.UPDATE}, {id: AuditAction.DELETE, label: intl.DELETE}]}
            initialState={{value: action}} onChange={params => setAction(params.value)}/>
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
