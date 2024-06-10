import { Block } from 'baseui/block'
import React, { useEffect, useState } from 'react'
import { useDebouncedState } from '../../../util'
import { Input } from 'baseui/input'
import _ from 'lodash'
import { AuditView } from './AuditView'
import { AuditLabel as Label } from './AuditComponents'
import { getAuditLog } from '../../../api/AuditApi'
import { AuditLog } from '../../../constants'
import { AuditRecentTable } from './AuditRecentTable'
import { HeadingMedium, ParagraphMedium } from 'baseui/typography'
import { useNavigate, useParams } from 'react-router-dom'
import {ampli} from "../../../service/Amplitude";

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
    <>
      <HeadingMedium>Versjonering</HeadingMedium>
      <Block marginBottom="1rem">
        <Label label="Søk etter Id">
          <Input
            size="compact"
            value={idInput}
            overrides={{ Input: { style: { width: '300px' } } }}
            placeholder="Id"
            onChange={(e) => setIdInput(format((e.target as HTMLInputElement).value))}
          />
        </Label>
      </Block>

      {error && <ParagraphMedium>{_.escape(error)}</ParagraphMedium>}
      {idInput && <AuditView auditLog={auditLog} auditId={params.auditId} loading={loading} viewId={lookupVersion} />}
      <AuditRecentTable show={!idInput} />
    </>
  )
}
