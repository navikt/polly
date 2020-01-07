import * as React from "react"
import { Block } from "baseui/block"
import { StyledBody, StyledCell, StyledHead, StyledHeadCell, StyledRow, StyledTable } from "baseui/table"
import { KIND } from "baseui/button"

import { intl } from "../../util"
import { AuditButton } from "../../pages/AuditPage"
import { CodeUsage } from "../../constants"


export const Usage = (props: { usage: CodeUsage }) => {
    const {usage} = props;
    const maxRows = Math.max(usage.disclosures.length, usage.informationTypes.length, usage.processes.length, usage.policies.length)
    return <Block marginTop="2rem">
        <StyledTable>
            <StyledHead>
                <StyledHeadCell>
                    {intl.informationType}
                </StyledHeadCell>
                <StyledHeadCell>
                    {intl.policy}
                </StyledHeadCell>
                <StyledHeadCell>
                    {intl.process}
                </StyledHeadCell>
                <StyledHeadCell>
                    {intl.disclosure}
                </StyledHeadCell>
            </StyledHead>
            <StyledBody>
                {Array.from(Array(maxRows).keys()).map(index => {
                    const it = usage.informationTypes[index];
                    const po = usage.policies[index];
                    const pr = usage.processes[index];
                    const di = usage.disclosures[index];
                    return (
                        <StyledRow key={index}>
                            <StyledCell>
                                {it && <AuditButton id={it.id} kind={KIND.tertiary}>{it.name}</AuditButton>}
                            </StyledCell>
                            <StyledCell>
                                {po && <AuditButton id={po.id} kind={KIND.tertiary}>{po.name}</AuditButton>}
                            </StyledCell>
                            <StyledCell>
                                {pr && <AuditButton id={pr.id} kind={KIND.tertiary}>{pr.name}</AuditButton>}
                            </StyledCell>
                            <StyledCell>
                                {di && <AuditButton id={di.id} kind={KIND.tertiary}>{di.name}</AuditButton>}
                            </StyledCell>
                        </StyledRow>
                    )
                })}
            </StyledBody>
        </StyledTable>
    </Block>
}
