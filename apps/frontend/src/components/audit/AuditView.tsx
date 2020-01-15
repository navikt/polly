import moment from "moment"
import { Block } from "baseui/block"
import { intl, theme } from "../../util"
import ReactJson from "react-json-view"
import React from "react"
import { AuditLog } from "../../constants"
import { Label1 } from "baseui/typography"
import { AuditLabel as Label } from "./AuditLabel"
import { Spinner } from "baseui/icon"

type AuditViewProps = {
    auditLog?: AuditLog,
    loading: boolean,
    viewId: (id: string) => void
}

export const AuditView = (props: AuditViewProps) => {
    const {auditLog, loading, viewId} = props
    const logFound = !!auditLog?.audits.length

    return (
        <>
            {loading && <Spinner size={theme.sizing.scale2400}/>}
            {!loading && auditLog && !logFound && <Label1>{intl.auditNotFound}</Label1>}

            {logFound &&
            <>
              <Block>
                <Label label={intl.id}>{auditLog?.id}</Label>
                <Label
                    label={intl.table}>{auditLog?.audits.length ? auditLog?.audits[0].table : undefined}</Label>
                <Label label={intl.audits}>{auditLog?.audits.length}</Label>
              </Block>

                {auditLog!.audits.map((audit, index) => {
                    const time = moment(audit.time)
                    return (
                        <Block key={audit.id} marginBottom='1rem' marginTop=".5rem">
                            <Label label={intl.auditNr}>{auditLog!.audits.length - index}</Label>
                            <Label label={intl.action}>{audit.action}</Label>
                            <Label label={intl.time}>{time.format('LL')} {time.format('HH:mm:ss.SSS Z')}</Label>
                            <Label label={intl.user}>{audit.user}</Label>
                            <ReactJson src={audit.data} name={null} onSelect={sel => {
                                (sel.name === 'id' || sel.name?.endsWith("Id")) && viewId(sel.value as string)
                            }}/>
                        </Block>
                    )
                })}
            </>
            }
        </>
    )
}