import * as React from "react"
import { Block } from "baseui/block"
import { StyledBody, StyledCell, StyledHead, StyledHeadCell, StyledRow, StyledTable } from "baseui/table"

import { intl } from "../../util"
import { CodeUsage } from "../../constants"
import { ObjectLink, ObjectType } from "../common/RouteLink"
import { Label1, Label2 } from "baseui/typography"


export const Usage = (props: { usage: CodeUsage }) => {
    const {usage} = props;
    const maxRows = Math.max(usage.disclosures.length, usage.informationTypes.length, usage.processes.length, usage.policies.length)
    return (
        <Block marginTop="2rem">
            <Label2 font="font450" marginBottom=".5rem">Usage</Label2>
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
                                    {it && <ObjectLink id={it.id} type={ObjectType.INFORMATION_TYPE} withHistory={true}>{it.name}</ObjectLink>}
                                </StyledCell>
                                <StyledCell>
                                    {po && <ObjectLink id={po.id} type={ObjectType.POLICY} withHistory={true}>{po.name}</ObjectLink>}
                                </StyledCell>
                                <StyledCell>
                                    {pr && <ObjectLink id={pr.id} type={ObjectType.PROCESS} withHistory={true}>{pr.name}</ObjectLink>}
                                </StyledCell>
                                <StyledCell>
                                    {di && <ObjectLink id={di.id} type={ObjectType.DISCLOSURE} withHistory={true}>{di.name}</ObjectLink>}
                                </StyledCell>
                            </StyledRow>
                        )
                    })}
                </StyledBody>
            </StyledTable>
        </Block>
    )
}
