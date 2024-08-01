import { ArrowRightLeftIcon, XMarkIcon } from '@navikt/aksel-icons'
import { Box, Button, Label, Loader, Modal, Tooltip } from '@navikt/ds-react'
import { Differ, Viewer } from 'json-diff-kit'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { JsonView } from 'react-json-view-lite'
import { AuditAction, AuditItem, AuditLog } from '../../../constants'
import { useRefs } from '../../../util/hooks'
import { ObjectLink } from '../../common/RouteLink'
import { AuditActionIcon, AuditLabel } from './AuditComponents'

type AuditViewProps = {
  auditLog?: AuditLog
  auditId?: string
  loading: boolean
  viewId: (id: string) => void
}

type ComparisonViewProps = {
  auditLog: AuditLog
  audit: AuditItem
  index: number
}

function initialOpen(auditLog?: AuditLog, auditId?: string) {
  return auditLog?.audits.map((audit, index) => index === 0 || audit.id === auditId) || []
}

export const AuditView = (props: AuditViewProps) => {
  const { auditLog, auditId, loading, viewId } = props
  const refs = useRefs<HTMLDivElement>(auditLog?.audits.map((audit) => audit.id) || [])
  const [open, setOpen] = useState(initialOpen(auditLog, auditId))

  useEffect(() => {
    if (auditId && auditLog && refs[auditId] && auditId !== auditLog.audits[0].id) {
      refs[auditId].current!.scrollIntoView({ block: 'start' })
    }
    setOpen(initialOpen(auditLog, auditId))
  }, [auditId, auditLog])

  const logFound: boolean | undefined = auditLog && !!auditLog.audits.length
  const newestAudit: AuditItem | undefined = auditLog?.audits[0]

  return (
    <Box>
      {loading && <Loader size="large" />}
      {!loading && auditLog && !logFound && <Label>Fant ingen versjonering</Label>}

      {logFound && (
        <>
          <div className="flex justify-between">
            <div className="w-[90%]">
              <AuditLabel label="ID:">{auditLog?.id}</AuditLabel>
              <AuditLabel label="Tabellnavn:">{newestAudit?.table}</AuditLabel>
              <AuditLabel label="Versjoneringer:">{auditLog?.audits.length}</AuditLabel>
            </div>
            <div className="flex">
              <Button variant="tertiary" onClick={() => setOpen(auditLog!.audits.map(() => true))}>
                Åpne alle
              </Button>
              {newestAudit?.action !== AuditAction.DELETE && (
                <ObjectLink id={newestAudit!.tableId} type={newestAudit!.table} audit={newestAudit}>
                  <Button variant="tertiary">Vis bruk</Button>
                </ObjectLink>
              )}
              <Tooltip content="Lukk" placement="top">
                <Button variant="tertiary" onClick={() => viewId('')} icon={<XMarkIcon title="Lukk" />} />
              </Tooltip>
            </div>
          </div>

          {auditLog &&
            auditLog.audits.map((audit: AuditItem, index: number) => {
              const time = moment(audit.time)

              return (
                <div className={`mb-4 mt-2 ${audit.id === auditId ? 'bg-[#F6F6F6]' : ''}`} key={audit.id} ref={refs[audit.id]}>
                  <div className="flex justify-between">
                    <div className="w-11/12">
                      <AuditLabel label="Versjon #:">{auditLog.audits.length - index}</AuditLabel>
                      <AuditLabel label="Handling:">
                        <AuditActionIcon action={audit.action} withText={true} />
                      </AuditLabel>
                      <AuditLabel label="Tidspunkt: ">
                        {time.format('LL')} {time.format('HH:mm:ss.SSS Z')}
                      </AuditLabel>
                      <AuditLabel label="Bruker">{audit.user}</AuditLabel>
                    </div>
                    <ComparisonView auditLog={auditLog} audit={audit} index={index} />
                  </div>
                  <JsonView
                    data={audit.data}
                    shouldExpandNode={() => {
                      if (open) {
                        return true
                      } else {
                        return index === 0 ? true : false
                      }
                    }}
                  />
                </div>
              )
            })}
        </>
      )}
    </Box>
  )
}
const ComparisonView = (props: ComparisonViewProps) => {
  const { auditLog, audit, index } = props
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div>
      <Button key={audit.id} onClick={() => setModalOpen(!modalOpen)} variant="tertiary" icon={<ArrowRightLeftIcon title="Se differansen" />} />
      <Modal key={audit.id} open={modalOpen} onClose={() => setModalOpen(false)} width="75%" className="h-3/4 overflow-y-scroll" header={{ heading: 'Sammenligning' }}>
        <Modal.Body>
          <Viewer
            diff={new Differ().diff(auditLog && auditLog.audits[index + 1] ? auditLog.audits[index + 1].data : {}, audit.data)}
            highlightInlineDiff={true}
            lineNumbers={true}
            indent={4}
          />
        </Modal.Body>
      </Modal>
    </div>
  )
}
