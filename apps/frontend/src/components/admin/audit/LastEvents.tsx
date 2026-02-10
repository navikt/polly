import { Heading, Label, Select, Tabs } from '@navikt/ds-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { getEvents } from '../../../api/AuditApi'
import { EAuditAction, EObjectType, IPageResponse, TEvent } from '../../../constants'
import { tekster } from '../../../util/codeToFineText'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'
import RouteLink, { urlForObject } from '../../common/RouteLink'
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

  const content = events?.content.map((event: TEvent) => {
    const row = (
      <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
        <div className="pr-2 min-w-0 flex items-center gap-1">
          <span className="shrink-0 align-middle">
            <AuditActionIcon action={event.action} />
          </span>
          <span className="overflow-hidden whitespace-nowrap text-ellipsis">{event.name}</span>
        </div>
        <div className="sm:min-w-32 sm:text-right">
          <CustomizedStatefulTooltip
            content={moment(event.time).format('lll')}
            text={moment(event.time).fromNow()}
          />
        </div>
      </div>
    )

    return (
      <div key={event.id} className="mb-1.5">
        {event.action === EAuditAction.DELETE ? (
          row
        ) : (
          <RouteLink
            href={urlForObject(event.table, event.tableId)}
            hideUnderline
            className="block w-full min-w-0"
          >
            {row}
          </RouteLink>
        )}
      </div>
    )
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-2">
        <Heading size="xlarge" level="2">
          Siste hendelser
        </Heading>
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
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
          <div className="overflow-x-auto">
            <Tabs.List className="min-w-max">
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
          </div>

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
