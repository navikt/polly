import { Block } from 'baseui/block'
import React, { useEffect, useState } from 'react'
import { intl, useDebouncedState } from '../../util'
import { Input } from 'baseui/input'
import _ from 'lodash'
import { AuditView } from '../../components/audit/AuditView'
import { AuditLabel as Label } from '../../components/audit/AuditComponents'
import { getAuditLog } from '../../api/AuditApi'
import { AuditLog } from '../../constants'
import { AuditRecentTable } from '../../components/audit/AuditRecentTable'
import { HeadingMedium, ParagraphMedium } from 'baseui/typography'
import { useNavigate, useParams } from 'react-router-dom'
import {ampli} from "../../service/Amplitude";

const format = (id: string) => _.trim(id, '"')

export const AuditPage = () => {
  const params = useParams<{ id?: string; auditId?: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [auditLog, setAuditLog] = useState<AuditLog>()
  const [idSearch, setIdInput, idInput] = useDebouncedState(params.id || '', 400)

  ampli.logEvent("besøk", {side: 'Admin', type:  'Versjonering'})

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
      <HeadingMedium>{intl.audit}</HeadingMedium>
      <Block marginBottom="1rem">
        <Label label={intl.searchId}>
          <Input
            size="compact"
            value={idInput}
            overrides={{ Input: { style: { width: '300px' } } }}
            placeholder={intl.id}
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
