import moment from 'moment'
import { Block } from 'baseui/block'
import { theme } from '../../../util'
import ReactJson from 'react-json-view'
import React, { useEffect, useState } from 'react'
import { AuditAction, AuditLog } from '../../../constants'
import { LabelLarge } from 'baseui/typography'
import { AuditActionIcon, AuditLabel as Label } from './AuditComponents'
import { Card } from 'baseui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBinoculars, faExchangeAlt, faTimes } from '@fortawesome/free-solid-svg-icons'
import { PLACEMENT } from 'baseui/tooltip'
import { ObjectLink } from '../../common/RouteLink'
import { StatefulPopover } from 'baseui/popover'
import DiffViewer from 'react-diff-viewer'
import { useRefs } from '../../../util/hooks'
import { Spinner } from 'baseui/spinner'
import Button from '../../common/Button'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'

type AuditViewProps = {
  auditLog?: AuditLog
  auditId?: string
  loading: boolean
  viewId: (id: string) => void
}

function initialOpen(auditLog?: AuditLog, auditId?: string) {
  return auditLog?.audits.map((o, i) => i === 0 || o.id === auditId) || []
}

export const AuditView = (props: AuditViewProps) => {
  const { auditLog, auditId, loading, viewId } = props
  const refs = useRefs<HTMLDivElement>(auditLog?.audits.map((al) => al.id) || [])
  const [open, setOpen] = useState(initialOpen(auditLog, auditId))

  useEffect(() => {
    if (auditId && auditLog && refs[auditId] && auditId !== auditLog.audits[0].id) {
      refs[auditId].current!.scrollIntoView({ block: 'start' })
    }
    setOpen(initialOpen(auditLog, auditId))
  }, [auditId, auditLog])

  const logFound = auditLog && !!auditLog.audits.length
  const newestAudit = auditLog?.audits[0]

  return (
    <Card>
      {loading && <Spinner $size={theme.sizing.scale2400} />}
      {!loading && auditLog && !logFound && <LabelLarge>Fant ingen versjonering</LabelLarge>}

      {logFound && (
        <>
          <div className="flex justify-between">
            <div className="w-[90%]">
              <Label label='ID:'>{auditLog?.id}</Label>
              <Label label='Tabellnavn:'>{newestAudit?.table}</Label>
              <Label label='Versjoneringer:'>{auditLog?.audits.length}</Label>
            </div>
            <div className="flex">
              <Button size="compact" kind="tertiary" marginRight onClick={() => setOpen(auditLog!.audits.map(() => true))}>
                Åpne alle
              </Button>
              {newestAudit?.action !== AuditAction.DELETE && (
                <CustomizedStatefulTooltip content={() => 'Vis'}>
                  <div>
                    <ObjectLink id={newestAudit!.tableId} type={newestAudit!.table} audit={newestAudit}>
                      <Button size="compact" shape="round" kind="tertiary">
                        <FontAwesomeIcon icon={faBinoculars} />
                      </Button>
                    </ObjectLink>
                  </div>
                </CustomizedStatefulTooltip>
              )}
              <CustomizedStatefulTooltip content={() => 'Lukk'}>
                <div>
                  <Button size="compact" shape="round" kind="tertiary" onClick={() => viewId('')}>
                    <FontAwesomeIcon icon={faTimes} />
                  </Button>
                </div>
              </CustomizedStatefulTooltip>
            </div>
          </div>

          {auditLog &&
            auditLog.audits.map((audit, index) => {
              const time = moment(audit.time)
              return (
                <div className={`mb-4 mt-2 ${audit.id === props.auditId ? 'bg-[#F6F6F6]' : ''}`} key={audit.id} ref={refs[audit.id]}>
                  <div className="flex justify-center">
                    <div className="w-[90%]">
                      <Label label='Versjon #:'>{auditLog.audits.length - index}</Label>
                      <Label label='Handling:'>
                        <AuditActionIcon action={audit.action} withText={true} />
                      </Label>
                      <Label label='Tidspunkt: '>
                        {time.format('LL')} {time.format('HH:mm:ss.SSS Z')}
                      </Label>
                      <Label label='Bruker'>{audit.user}</Label>
                    </div>
                    <div>
                      <StatefulPopover
                        placement={PLACEMENT.left}
                        content={() => (
                          <Card>
                            <DiffViewer
                              leftTitle="Previous"
                              rightTitle="Current"
                              oldValue={JSON.stringify(auditLog?.audits[index + 1]?.data, null, 2)}
                              newValue={JSON.stringify(audit.data, null, 2)}
                            />
                          </Card>
                        )}
                        overrides={{
                          Body: {
                            style: () => ({
                              width: '80%',
                              maxHeight: '80%',
                              overflowY: 'scroll',
                            }),
                          },
                        }}
                      >
                        <div>
                          <Button size="compact" shape="round" kind="tertiary">
                            <FontAwesomeIcon icon={faExchangeAlt} />
                          </Button>
                        </div>
                      </StatefulPopover>
                    </div>
                  </div>
                  <ReactJson
                    src={audit.data}
                    name={null}
                    shouldCollapse={(p) => p.name === null && !open[index]}
                    onSelect={(sel) => {
                      ;(sel.name === 'id' || sel.name?.endsWith('Id')) && viewId(sel.value as string)
                    }}
                  />
                </div>
              )
            })}
        </>
      )}
    </Card>
  )
}
