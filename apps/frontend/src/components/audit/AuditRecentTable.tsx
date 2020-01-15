import { Label2 } from "baseui/typography"
import React, { useEffect, useState } from "react"
import { getAudits } from "../../api/AuditApi"
import { AuditItem, PageResponse } from "../../constants"
import { Table } from "baseui/table"
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

    const dataView = audits.content.map(audit => [
        <><AuditButton id={audit.tableId}/> <StatefulTooltip content={audit.time}>{moment(audit.time).fromNow()}</StatefulTooltip></>,
        audit.action,
        audit.table,
        audit.user
    ])

    return (
        <>
            <Label2>Hei</Label2>

            <Table columns={[intl.time, intl.action, intl.table, intl.user]} data={dataView}/>

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
