import {Block} from 'baseui/block'
import React, {useEffect, useState} from 'react'
import {intl, useDebouncedState} from '../../util'
import {Input} from 'baseui/input'
import _ from 'lodash'
import {AuditView} from '../../components/audit/AuditView'
import {AuditLabel as Label} from '../../components/audit/AuditComponents'
import {getAuditLog} from '../../api/AuditApi'
import {AuditLog} from '../../constants'
import {AuditRecentTable} from '../../components/audit/AuditRecentTable'
import {H4, Paragraph2} from 'baseui/typography'
import {useHistory, useParams} from 'react-router-dom'

const format = (id: string) => _.trim(id, '"')


export const AuditPage = () => {
  const params = useParams<{id?: string, auditId?: string}>()
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [auditLog, setAuditLog] = useState<AuditLog>()
  const [idSearch, setIdInput, idInput] = useDebouncedState(params.id || '', 400)

  const lookupVersion = (id?: string) => {
    (async () => {
      if (id === auditLog?.id) {
        return
      }
      setAuditLog(undefined)
      setError(undefined)
      if (!id) {
        !!params.id && history.push('/admin/audit')
        return
      }
      setLoading(true)
      try {
        const log = await getAuditLog(_.escape(id))
        setAuditLog(log)
        if (log.audits.length && id !== params.id) {
          history.push(`/admin/audit/${id}`)
        }
      } catch (e) {
        setError(e)
      }
      setLoading(false)
    })()
  }

  useEffect(() => setIdInput(params.id || ''), [params.id])
  useEffect(() => lookupVersion(idSearch), [idSearch])

  return (
    <>
      <H4>{intl.audit}</H4>
      <Block marginBottom="1rem">
        <Label label={intl.searchId}>
          <Input size="compact" value={idInput}
                 overrides={{Input: {style: {width: '300px'}}}}
                 placeholder={intl.id}
                 onChange={e => setIdInput(format((e.target as HTMLInputElement).value))}
          />
        </Label>
      </Block>

      {error && <Paragraph2>{_.escape(error)}</Paragraph2>}
      {idInput && <AuditView auditLog={auditLog} auditId={params.auditId} loading={loading} viewId={lookupVersion}/>}
      <AuditRecentTable show={!idInput}/>
    </>
  )
}
