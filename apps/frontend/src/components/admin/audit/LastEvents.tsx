import { Select } from '@navikt/ds-react'
import { StatefulTabs, Tab } from 'baseui/tabs'
import { HeadingXLarge, LabelMedium } from 'baseui/typography'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { getEvents } from '../../../api/AuditApi'
import { EAuditAction, EObjectType, IPageResponse, TEvent } from '../../../constants'
import { theme } from '../../../util'
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
          <div className="pr-2 overflow-hidden whitespace-nowrap text-ellipsis">
            <AuditActionIcon action={event.action} />
            {event.name}
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
        <HeadingXLarge>Siste hendelser</HeadingXLarge>
        <div className="flex justify-between items-center">
          <LabelMedium marginRight={theme.sizing.scale300}>Hendelsestype</LabelMedium>
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
        <StatefulTabs onChange={(args) => setTable(args.activeKey as EObjectType)}>
          {[
            EObjectType.PROCESS,
            EObjectType.INFORMATION_TYPE,
            EObjectType.DISCLOSURE,
            EObjectType.DOCUMENT,
          ].map((tableName) => (
            <Tab key={tableName} title={(tekster as any)[tableName] || tableName}>
              {content}
            </Tab>
          ))}
        </StatefulTabs>
      </div>
    </div>
  )
}
