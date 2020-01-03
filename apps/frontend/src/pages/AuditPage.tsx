import { Block, BlockProps } from "baseui/block"
import Banner from "../components/Banner"
import React, { useEffect, useState } from "react"
import { intl, theme } from "../util"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { AuditLog } from "../constants"
import { getAuditLog } from "../api/AuditApi"
import { Label1, Label2, Label3 } from "baseui/typography"
import ReactJson from "react-json-view"
import moment from "moment"
import { Input } from "baseui/input"
import RouteLink from "../components/common/RouteLink"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHistory } from "@fortawesome/free-solid-svg-icons"
import { user } from "../service/User"
import { Button, KIND, SIZE as ButtonSize } from "baseui/button"
import _ from "lodash"
import { Spinner } from "baseui/icon"

const format = (id: string) => _.trim(id, "\"")

const labelBlockProps: BlockProps = {
    display: ['flex', 'block', 'block', 'flex'],
    width: ['20%', '100%', '100%', '20%'],
    alignSelf: 'flex-start',
};

const Label = (props: { label: string, children: any }) => {
    return (
        <Block display={['flex', 'block', 'block', 'flex']}>
            <Block {...labelBlockProps}>
                <Label2>{props.label}</Label2>
            </Block>
            <Block>
                <Label3>{props.children}</Label3>
            </Block>
        </Block>
    )
}

const AuditPageImpl = (props: RouteComponentProps<{ id?: string }>) => {
    const [selectedId, setSelectedId] = useState()
    const [auditLog, setAuditLog] = useState<AuditLog>()
    const [loading, setLoading] = useState(false)
    const logFound = !!auditLog?.audits.length

    useEffect(() => {
        (async () => {
            if (selectedId) {
                setLoading(true)
                setAuditLog(undefined)
                const log = await getAuditLog(selectedId)
                if (log) {
                    setAuditLog(log)
                    if (selectedId !== props.match.params.id) {
                        props.history.push(`/admin/audit/${selectedId}`)
                    }
                }
                setLoading(false)
            }
        })()
    }, [selectedId])

    useEffect(() => setSelectedId(props.match.params.id), [props.match.params.id])

    return (
        <>
            <Banner title={intl.audit}/>
            <Block>
                <Block marginBottom="2rem">
                    <Block marginBottom="1rem">
                        <Label label={intl.searchId}>
                            <Input autoFocus={true} size="compact" value={selectedId}
                                   overrides={{Input: {style: {width: '300px'}}}}
                                   onChange={(e) => setSelectedId(format((e.target as HTMLInputElement).value))}
                            />
                        </Label>
                    </Block>
                    {logFound && <>
                      <Label label={intl.id}>{auditLog?.id}</Label>
                      <Label label={intl.table}>{auditLog?.audits.length ? auditLog?.audits[0].table : undefined}</Label>
                      <Label label={intl.audits}>{auditLog?.audits.length}</Label>
                    </>}
                </Block>

                {loading && <Spinner size={theme.sizing.scale2400}/>}
                {!loading && !logFound && !!selectedId && <Label1>{intl.auditNotFound}</Label1>}

                {logFound && auditLog!.audits.map((audit, index) => {
                    const time = moment(audit.time)
                    return (
                        <Block key={audit.id} marginBottom='1rem' marginTop=".5rem">
                            <Label label={intl.auditNr}>{auditLog!.audits.length - index}</Label>
                            <Label label={intl.action}>{audit.action}</Label>
                            <Label label={intl.time}>{time.format('LL')} {time.format('HH:mm:ss.SSS Z')}</Label>
                            <Label label={intl.user}>{audit.user}</Label>
                            <ReactJson src={audit.data} name={null} onSelect={sel => sel.name === 'id' && setSelectedId(sel.value as string)}/>
                        </Block>
                    )
                })}
            </Block>
        </>
    )
}

export const AuditPage = withRouter(AuditPageImpl)

export const AuditButton = (props: { id: string }) => {
    return user.isAdmin() ?
        <RouteLink href={`/admin/audit/${props.id}`}>
            <Button
                size={ButtonSize.compact}
                kind={KIND.secondary}
                overrides={{
                    BaseButton: {
                        style: () => {
                            return {marginRight: theme.sizing.scale500}
                        }
                    }
                }}
            >
                <FontAwesomeIcon icon={faHistory}/>
            </Button>
        </RouteLink>
        : null
}