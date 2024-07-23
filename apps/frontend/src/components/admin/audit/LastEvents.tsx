import * as React from 'react'
import { useEffect, useState } from 'react'
import { AuditAction, Event, ObjectType, PageResponse } from '../../../constants'
import { Option, StatefulSelect, Value } from 'baseui/select'
import { theme } from '../../../util'
import { getEvents } from '../../../api/AuditApi'
import { Block } from 'baseui/block'
import { ObjectLink } from '../../common/RouteLink'
import { AuditActionIcon } from './AuditComponents'
import moment from 'moment'
import { HeadingXLarge, LabelMedium } from 'baseui/typography'
import { StatefulTabs, Tab } from 'baseui/tabs'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'
import {tekster} from "../../../util/codeToFineText";

export const LastEvents = () => {
  const [events, setEvents] = useState<PageResponse<Event>>()
  const [table, setTable] = useState<ObjectType>(ObjectType.PROCESS)
  const [action, setAction] = useState<Value>([{ id: AuditAction.CREATE, label: "Opprett" } as Option])

  useEffect(() => {
    ;(async () => {
      setEvents(await getEvents(0, 10, table, action[0].id as AuditAction))
    })()
  }, [table, action])

  const content = events?.content.map((event, index) => (
    <div key={event.id} className="mb-1.5">
      <ObjectLink id={event.tableId} type={event.table} disable={event.action === AuditAction.DELETE} hideUnderline>
        <div className="w-full flex justify-between">
          <div className="pr-2 overflow-hidden whitespace-nowrap text-ellipsis">
            <AuditActionIcon action={event.action} />
            {event.name}
          </div>
          <div className="min-w-32 text-right">
            <CustomizedStatefulTooltip content={moment(event.time).format('lll')}>{moment(event.time).fromNow()}</CustomizedStatefulTooltip>
          </div>
        </div>
      </ObjectLink>
    </div>
  ))

  return (
    <div>
      <div className="flex justify-between items-center w-full">
        <HeadingXLarge>Siste hendelser</HeadingXLarge>
        <div className="flex justify-between items-center">
          <LabelMedium marginRight={theme.sizing.scale300}>Hendelsestype</LabelMedium>
          <StatefulSelect
            size="compact"
            clearable={false}
            searchable={false}
            options={Object.keys(AuditAction).map((auditAction) => ({ id: auditAction, label: tekster[auditAction as AuditAction] }))}
            initialState={{ value: action }}
            onChange={(params) => setAction(params.value)}
            overrides={{
              Root: {
                style: {
                  width: '120px',
                },
              },
            }}
          />
        </div>
      </div>
      <div>
        <StatefulTabs onChange={(args) => setTable(args.activeKey as ObjectType)}>
          {[ObjectType.PROCESS, ObjectType.INFORMATION_TYPE, ObjectType.DISCLOSURE, ObjectType.DOCUMENT].map((tableName) => (
            <Tab key={tableName} title={(tekster as any)[tableName] || tableName}>
              {content}
            </Tab>
          ))}
        </StatefulTabs>
      </div>
    </div>
  )
}
