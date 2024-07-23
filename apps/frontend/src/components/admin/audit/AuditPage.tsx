import React, { useEffect, useState } from 'react'
import { useDebouncedState } from '../../../util'
import _ from 'lodash'
import { AuditView } from './AuditView'
import {AuditLabel} from './AuditComponents'
import { getAuditLog } from '../../../api/AuditApi'
import { AuditLog } from '../../../constants'
import { AuditRecentTable } from './AuditRecentTable'
import { useNavigate, useParams } from 'react-router-dom'
import {ampli} from "../../../service/Amplitude";
import {BodyLong, Heading, TextField} from "@navikt/ds-react";

const format = (id: string) => _.trim(id, '"')

export const AuditPage = () => {
  const params = useParams<{ id?: string; auditId?: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [auditLog, setAuditLog] = useState<AuditLog>()
  const [idSearch, setIdInput, idInput] = useDebouncedState(params.id || '', 400)

  ampli.logEvent("besøk", {side: 'Admin', url: '/admin/audit/:id/', app: 'Behandlingskatalogen',  type:  'Versjonering'})

  const lookupVersion = (id?: string) => {
    ;(async () => {
      if (id === auditLog?.id) {
        return
      }
      setAuditLog(undefined)
      setError(undefined)
      if (!id) {
        !!params.id && navigate('/admin/audit')
        return
      }
      setLoading(true)
      try {
        const log = await getAuditLog(_.escape(id))
        setAuditLog(log)
        if (log.audits.length && id !== params.id) {
          navigate(`/admin/audit/${id}`)
        }
      } catch (e: any) {
        setError(e)
      }
      setLoading(false)
    })()
  }

  useEffect(() => setIdInput(params.id || ''), [params.id])
  useEffect(() => lookupVersion(idSearch), [idSearch])

  return (
    <div role="main">
      <Heading size="medium" level="1">Versjonering</Heading>
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
      {idInput && <AuditView auditLog={auditLog} auditId={params.auditId} loading={loading} viewId={lookupVersion} />}
      <AuditRecentTable show={!idInput} />
    </div>
  )
}
