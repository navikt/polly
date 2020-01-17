import moment from "moment"
import { Block } from "baseui/block"
import { intl, theme } from "../../util"
import ReactJson from "react-json-view"
import React, { RefObject, useEffect } from "react"
import { AuditAction, AuditLog } from "../../constants"
import { Label1 } from "baseui/typography"
import { AuditActionIcon, AuditLabel as Label } from "./AuditComponents"
import { Spinner } from "baseui/icon"
import { Card } from "baseui/card"
import { Button } from "baseui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBinoculars, faTimes } from "@fortawesome/free-solid-svg-icons"
import {PLACEMENT, StatefulTooltip} from "baseui/tooltip"
import { ObjectLink } from "../common/RouteLink"

type AuditViewProps = {
    auditLog?: AuditLog,
    auditId?: string,
    loading: boolean,
    viewId: (id: string) => void
}

type Refs = { [id: string]: RefObject<HTMLElement> }

export const AuditView = (props: AuditViewProps) => {
    const {auditLog, auditId, loading, viewId} = props
    const refs: Refs = auditLog?.audits.reduce((acc, value) => {
        acc[value.id] = React.createRef();
        return acc;
    }, {} as Refs) || {};

    useEffect(() => {
        if (auditId && auditLog && refs[auditId] && auditId !== auditLog.audits[0].id) {
            refs[auditId].current!.scrollIntoView({block: "start"})
        }
    }, [auditId, auditLog])

    const logFound = auditLog && !!auditLog.audits.length
    const newestAudit = auditLog?.audits[0]

    return <Card>
        {loading && <Spinner size={theme.sizing.scale2400}/>}
        {!loading && auditLog && !logFound && <Label1>{intl.auditNotFound}</Label1>}

        {logFound && <>
          <Block display="flex" justifyContent="space-between">
            <Block width="90%">
              <Label label={intl.id}>{auditLog?.id}</Label>
              <Label
                  label={intl.table}>{newestAudit?.table}</Label>
              <Label label={intl.audits}>{auditLog?.audits.length}</Label>
            </Block>
            <Block display="flex">
                {newestAudit?.action !== AuditAction.DELETE &&
                <StatefulTooltip content={() => intl.view} placement={PLACEMENT.top}>
                  <Block>
                    <ObjectLink id={newestAudit!.tableId} type={newestAudit!.table}>
                      <Button size="compact" shape="round" kind="tertiary"><FontAwesomeIcon icon={faBinoculars}/></Button>
                    </ObjectLink>
                  </Block>
                </StatefulTooltip>
                }
              <StatefulTooltip content={() => intl.close} placement={PLACEMENT.top}>
                <Block>
                  <Button size="compact" shape="round" kind="tertiary" onClick={() => viewId('')}><FontAwesomeIcon icon={faTimes}/></Button>
                </Block>
              </StatefulTooltip>
            </Block>
          </Block>

            {auditLog && auditLog.audits.map((audit, index) => {
                const time = moment(audit.time)
                return (
                    <Block key={audit.id} ref={refs[audit.id]} marginBottom='1rem' marginTop=".5rem"
                           backgroundColor={audit.id === props.auditId ? theme.colors.mono200 : undefined}>
                        <Label label={intl.auditNr}>{auditLog!.audits.length - index}</Label>
                        <Label label={intl.action}><AuditActionIcon action={audit.action} withText={true}/></Label>
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
    </Card>
}
