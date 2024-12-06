import { BodyLong, Heading, TextField } from '@navikt/ds-react'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import { getAuditLog } from '../../../api/AuditApi'
import { IAuditLog } from '../../../constants'
import { ampli } from '../../../service/Amplitude'
import { useDebouncedState } from '../../../util'
import { AuditLabel } from './AuditComponents'
import { AuditRecentTable } from './AuditRecentTable'
import { AuditView } from './AuditView'

const format = (id: string): string => _.trim(id, '"')

export const AuditPage = () => {
  const params: Readonly<
    Partial<{
      id?: string
      auditId?: string
    }>
  > = useParams<{ id?: string; auditId?: string }>()
  const navigate: NavigateFunction = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [auditLog, setAuditLog] = useState<IAuditLog>()
  const [idSearch, setIdInput, idInput] = useDebouncedState(params.id || '', 400)

  ampli.logEvent('besøk', {
    side: 'Admin',
    url: '/admin/audit/:id/',
    app: 'Behandlingskatalogen',
    type: 'Versjonering',
  })

  const lookupVersion = (id?: string): void => {
    ;(async () => {
      if (id === auditLog?.id) {
        return
      }
      setAuditLog(undefined)
      setError(undefined)
      if (!id) {
        if (params.id) {
          navigate('/admin/audit')
        }
        return
      }
      setLoading(true)
      try {
        const log: IAuditLog = await getAuditLog(_.escape(id))
        setAuditLog(log)
        if (log.audits.length && id !== params.id) {
          navigate(`/admin/audit/${id}`)
        }
      } catch (error: any) {
        setError(error)
      }
      setLoading(false)
    })()
  }

  useEffect(() => setIdInput(params.id || ''), [params.id])
  useEffect(() => lookupVersion(idSearch), [idSearch])

  return (
    <div role="main">
      <Heading size="medium" level="1">
        Versjonering
      </Heading>
      <div className="mb-4">
        <AuditLabel label="Søk etter ID">
          <TextField
            className="w-72"
            label="Søk etter ID"
            hideLabel
            value={idInput}
            placeholder="ID"
            onChange={(e) => setIdInput(format((e.target as HTMLInputElement).value))}
          />
        </AuditLabel>
      </div>

      {error && <BodyLong>{_.escape(error)}</BodyLong>}
      {idInput && (
        <AuditView
          auditLog={auditLog}
          auditId={params.auditId}
          loading={loading}
          viewId={lookupVersion}
        />
      )}
      <AuditRecentTable show={!idInput} />
    </div>
  )
}
