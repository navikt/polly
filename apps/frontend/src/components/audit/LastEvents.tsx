import * as React from 'react'
import { useEffect, useState } from 'react'
import { AuditAction, Event, ObjectType, PageResponse } from '../../constants'
import { Option, StatefulSelect, Value } from 'baseui/select'
import { intl, theme } from '../../util'
import { getEvents } from '../../api/AuditApi'
import { Block } from 'baseui/block'
import { ObjectLink } from '../common/RouteLink'
import { AuditActionIcon } from './AuditComponents'
import moment from 'moment'
import { HeadingXLarge, LabelMedium } from 'baseui/typography'
import { StatefulTabs, Tab } from 'baseui/tabs'
import CustomizedStatefulTooltip from '../common/CustomizedStatefulTooltip'

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
    <Block key={event.id} marginBottom={theme.sizing.scale200}>
      <ObjectLink id={event.tableId} type={event.table} disable={event.action === AuditAction.DELETE} hideUnderline>
        <Block width="100%" display="flex" justifyContent="space-between">
          <Block paddingRight={theme.sizing.scale300} $style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            <AuditActionIcon action={event.action} />
            {event.name}
          </Block>
          <Block minWidth={'125px'} $style={{ textAlign: 'right' }}>
            <CustomizedStatefulTooltip content={moment(event.time).format('lll')}>{moment(event.time).fromNow()}</CustomizedStatefulTooltip>
          </Block>
        </Block>
      </ObjectLink>
    </Block>
  ))

  return (
    <Block>
      <Block display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <HeadingXLarge>Siste hendelser</HeadingXLarge>
        <Block display="flex" justifyContent="space-between" alignItems="center">
          <LabelMedium marginRight={theme.sizing.scale300}>Hendelsestype</LabelMedium>
          <StatefulSelect
            size="compact"
            clearable={false}
            searchable={false}
            options={Object.keys(AuditAction).map((auditAction) => ({ id: auditAction, label: intl[auditAction as AuditAction] }))}
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
        </Block>
      </Block>
      <Block>
        <StatefulTabs onChange={(args) => setTable(args.activeKey as ObjectType)}>
          {[ObjectType.PROCESS, ObjectType.INFORMATION_TYPE, ObjectType.DISCLOSURE, ObjectType.DOCUMENT].map((tableName) => (
            <Tab key={tableName} title={(intl as any)[tableName] || tableName}>
              {content}
            </Tab>
          ))}
        </StatefulTabs>
      </Block>
    </Block>
  )
}
