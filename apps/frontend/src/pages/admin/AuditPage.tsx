import { Block } from "baseui/block"
import Banner from "../../components/Banner"
import React, { useEffect, useState } from "react"
import { intl, useDebouncedState } from "../../util"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { Input } from "baseui/input"
import _ from "lodash"
import { AuditView } from "../../components/audit/AuditView"
import { AuditLabel as Label } from "../../components/audit/AuditComponents"
import { getAuditLog } from "../../api/AuditApi"
import { AuditLog } from "../../constants"
import { AuditRecentTable } from "../../components/audit/AuditRecentTable"
import { Paragraph2 } from "baseui/typography"

const format = (id: string) => _.trim(id, "\"")


const AuditPageImpl = (props: RouteComponentProps<{ id?: string, auditId?: string }>) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const [auditLog, setAuditLog] = useState<AuditLog>()
    const [idSearch, setIdInput, idInput] = useDebouncedState(props.match.params.id || '', 400)

    const lookupVersion = (id?: string) => {
        (async () => {
            if (id === auditLog?.id) {
                return
            }
            setAuditLog(undefined)
            setError(undefined)
            if (!id) {
                !!props.match.params.id && props.history.push('/admin/audit')
                return
            }
            setLoading(true)
            try {
                const log = await getAuditLog(_.escape(id))
                setAuditLog(log)
                if (log.audits.length && id !== props.match.params.id) {
                    props.history.push(`/admin/audit/${id}`)
                }
            } catch (e) {
                setError(e)
            }
            setLoading(false)
        })()
    }

    useEffect(() => setIdInput(props.match.params.id || ''), [props.match.params.id])
    useEffect(() => lookupVersion(idSearch), [idSearch])

    return (
        <>
            <Banner title={intl.audit}/>

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
            {idInput && <AuditView auditLog={auditLog} auditId={props.match.params.auditId} loading={loading} viewId={lookupVersion}/>}
            <AuditRecentTable show={!idInput}/>
        </>
    )
}

export const AuditPage = withRouter(AuditPageImpl)
