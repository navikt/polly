import { Heading, Label, Select, Tabs } from '@navikt/ds-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { getEvents } from '../../../api/AuditApi'
import { EAuditAction, EObjectType, IPageResponse, TEvent } from '../../../constants'
import { tekster } from '../../../util/codeToFineText'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'
import { ObjectLink } from '../../common/RouteLink'
import { AuditActionIcon } from './AuditComponents'

export const LastEvents = () => {
  const [events, setEvents] = useState<IPageResponse<TEvent>>()
  const [table, setTable] = useState<EObjectType>(EObjectType.PROCESS)
  const [action, setAction] = useState<string>(EAuditAction.CREATE)

  useEffect(() => {
    ;(async () => {
      setEvents(await getEvents(0, 10, table, action as EAuditAction))
    })()
  }, [table, action])

  const content = events?.content.map((event: TEvent) => (
    <div key={event.id} className="mb-1.5">
      <ObjectLink
        id={event.tableId}
        type={event.table}
        disable={event.action === EAuditAction.DELETE}
        hideUnderline
      >
        <div className="w-full flex justify-between">
          <div className="pr-2 min-w-0 flex items-center gap-1">
            <span className="shrink-0 align-middle">
              <AuditActionIcon action={event.action} />
            </span>
            <span className="overflow-hidden whitespace-nowrap text-ellipsis">{event.name}</span>
          </div>
          <div className="min-w-32 text-right">
            <CustomizedStatefulTooltip
              content={moment(event.time).format('lll')}
              text={moment(event.time).fromNow()}
            />
          </div>
        </div>
      </ObjectLink>
    </div>
  ))

  return (
    <div>
      <div className="flex justify-between items-center w-full">
        <Heading size="xlarge" level="2">
          Siste hendelser
        </Heading>
        <div className="flex justify-between items-center">
          <Label className="mr-2">Hendelsestype</Label>
          <Select
            size="small"
            label="Hendelsestype"
            hideLabel
            onChange={(event) => setAction(event.target.value)}
          >
            {Object.keys(EAuditAction).map((auditAction: string) => (
              <option key={auditAction} value={auditAction}>
                {tekster[auditAction as EAuditAction]}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Tabs value={table} onChange={(val) => setTable(val as EObjectType)}>
          <Tabs.List>
            {[
              EObjectType.PROCESS,
              EObjectType.INFORMATION_TYPE,
              EObjectType.DISCLOSURE,
              EObjectType.DOCUMENT,
            ].map((tableName) => (
              <Tabs.Tab
                key={tableName}
                value={tableName}
                label={(tekster as any)[tableName] || tableName}
              />
            ))}
          </Tabs.List>

          {[
            EObjectType.PROCESS,
            EObjectType.INFORMATION_TYPE,
            EObjectType.DISCLOSURE,
            EObjectType.DOCUMENT,
          ].map((tableName) => (
            <Tabs.Panel key={tableName} value={tableName}>
              {content}
            </Tabs.Panel>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
