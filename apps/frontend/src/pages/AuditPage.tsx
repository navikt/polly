import { Block, BlockProps } from "baseui/block"
import Banner from "../components/Banner"
import React, { useEffect, useState } from "react"
import { intl, theme } from "../util"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { AuditLog } from "../constants"
import { getAuditLog } from "../api/AuditApi"
import { Label2, Label3 } from "baseui/typography"
import ReactJson from "react-json-view"
import moment from "moment"
import { Input } from "baseui/input"
import RouteLink from "../components/common/RouteLink"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHistory } from "@fortawesome/free-solid-svg-icons"
import { user } from "../service/User"
import { Button, KIND, SIZE as ButtonSize } from "baseui/button"


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
    const [selectedId, setSelectedId] = useState(props.match.params.id)
    const [auditLog, setAuditLog] = useState<AuditLog>()
    const [auditTable, setAuditTable] = useState()

    useEffect(() => {
        (async () => selectedId && setAuditLog(await getAuditLog(selectedId)))()
    }, [selectedId])

    useEffect(() => {
        setAuditTable(auditLog?.audits.length ? auditLog?.audits[0].table : undefined)
    }, [auditLog])

    return (
        <>
            <Banner title={intl.audit}/>
            <Block>
                <Block marginBottom="2rem">
                    <Label label={intl.id}>
                        <Input autoFocus={true} size="compact" value={selectedId}
                               overrides={{Input: {style: {width: '300px'}}}}
                               onChange={(e) => setSelectedId((e.target as HTMLInputElement).value)}
                        />
                    </Label>
                    {selectedId && <>
                      <Label label={intl.table}>{auditTable}</Label>
                      <Label label={intl.audits}>{auditLog?.audits.length}</Label>
                    </>}
                </Block>

                {auditLog && auditLog.audits.map((audit, index) => {
                    const time = moment(audit.time)
                    return (
                        <Block key={audit.id} marginBottom='1rem'>
                            <Label label={intl.auditNr}>{auditLog?.audits.length - index}</Label>
                            <Label label={intl.action}>{audit.action}</Label>
                            <Label label={intl.time}>{time.format('LL')} {time.format('HH:mm:ss.SSS Z')}</Label>
                            <Label label={intl.user}>{audit.user}</Label>
                            <ReactJson src={audit.data} name={null}/>
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