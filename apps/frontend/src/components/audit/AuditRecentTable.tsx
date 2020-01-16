import { Label2 } from "baseui/typography"
import React, { useEffect, useState } from "react"
import { getAudits } from "../../api/AuditApi"
import { AuditItem, PageResponse } from "../../constants"
import { StyledBody, StyledCell, StyledHead, StyledHeadCell, StyledRow, StyledTable } from "baseui/table"
import { intl } from "../../util"
import moment from "moment"
import { Pagination } from "baseui/pagination"
import { TriangleDown } from "baseui/icon"
import { Button, KIND } from "baseui/button"
import { PLACEMENT, StatefulPopover } from "baseui/popover"
import { StatefulMenu } from "baseui/menu"
import { Block } from "baseui/block"
import { StatefulTooltip } from "baseui/tooltip"
import { AuditButton } from "./AuditButton"
import _ from "lodash"

export const AuditRecentTable = () => {
    const [audits, setAudits] = useState<PageResponse<AuditItem>>({content: [], numberOfElements: 0, pageNumber: 0, pages: 0, pageSize: 1, totalElements: 0})
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);

    useEffect(() => {
        (async () => {
            setAudits((await getAudits(page - 1, limit)))
        })()
    }, [page, limit])

    const handlePageChange = (nextPage: number) => {
        if (nextPage < 1) {
            return;
        }
        if (nextPage > audits.pages) {
            return;
        }
        setPage(nextPage);
    };

    const handleLimitChange = (nextLimit: number) => {
        const nextPageNum = Math.ceil(audits.totalElements / nextLimit);
        if (nextPageNum < page) {
            setPage(nextPageNum);
        }
        setLimit(nextLimit);
    };

    return (
        <>
            <Label2>Siste endringer</Label2>
            <StyledTable>
                <StyledHead>
                    <StyledHeadCell $style={{maxWidth: "13%"}}>{intl.time}</StyledHeadCell>
                    <StyledHeadCell>{intl.action}</StyledHeadCell>
                    <StyledHeadCell>{intl.id}</StyledHeadCell>
                    <StyledHeadCell>{intl.user}</StyledHeadCell>
                </StyledHead>
                <StyledBody>
                    {audits.content.map((audit, index) => {
                        const length = window.innerWidth > 1200 ? window.innerWidth > 1400 ? 40 : 30 : 20
                        return (
                            <StyledRow key={audit.id}>
                                <StyledCell $style={{maxWidth: "13%"}}>
                                    <AuditButton kind="tertiary" id={audit.tableId} auditId={audit.id}>
                                        <StatefulTooltip content={audit.time}>{moment(audit.time).fromNow()}</StatefulTooltip>
                                    </AuditButton>
                                </StyledCell>
                                <StyledCell>{audit.action} {audit.table}</StyledCell>
                                <StyledCell><StatefulTooltip content={audit.tableId}>{_.truncate(audit.tableId, {length})}</StatefulTooltip></StyledCell>
                                <StyledCell>{audit.user}</StyledCell>
                            </StyledRow>
                        )
                    })}
                </StyledBody>
            </StyledTable>

            <Block display="flex" justifyContent="space-between" marginTop="1rem">
                <StatefulPopover
                    content={({close}) => (
                        <StatefulMenu
                            items={[5, 10, 20, 50, 100].map(i => ({label: i,}))}
                            onItemSelect={({item}) => {
                                handleLimitChange(item.label);
                                close();
                            }}
                            overrides={{
                                List: {
                                    style: {height: '150px', width: '100px'},
                                },
                            }}
                        />
                    )}
                    placement={PLACEMENT.bottom}
                >
                    <Button kind={KIND.tertiary} endEnhancer={TriangleDown}>{`${limit} ${intl.rows}`}</Button>
                </StatefulPopover>
                <Pagination
                    currentPage={page}
                    numPages={audits.pages}
                    onPageChange={({nextPage}) => handlePageChange(nextPage)}
                    labels={{nextButton: intl.nextButton, prevButton: intl.prevButton}}
                />
            </Block>
        </>
    )
}
