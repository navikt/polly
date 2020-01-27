import { Label1, Label2, Label3 } from "baseui/typography"
import React, { useEffect, useState } from "react"
import { getAudits } from "../../api/AuditApi"
import { AuditItem, ObjectType, PageResponse } from "../../constants"
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
import ReactJson from "react-json-view"
import { faCode } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AuditActionIcon } from "./AuditComponents"
import randomColor from "randomcolor"
import { StatefulSelect } from "baseui/select"

export const AuditRecentTable = (props: { show: boolean }) => {
  const [audits, setAudits] = useState<PageResponse<AuditItem>>({content: [], numberOfElements: 0, pageNumber: 0, pages: 0, pageSize: 1, totalElements: 0})
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [table, setTable] = useState<ObjectType | undefined>(undefined)

  const colors = _.uniq(audits.content.map(a => a.tableId))
  .reduce((val, id) => {
    val[id] = randomColor({seed: id, luminosity: "dark"})
    return val
  }, {} as { [id: string]: string })

  useEffect(() => {
    (async () => {
      props.show && setAudits((await getAudits(page - 1, limit, table)))
    })()
  }, [page, limit, props.show, table])

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1) {
      return;
    }
    if (nextPage > audits.pages) {
      return;
    }
    setPage(nextPage);
  };

  useEffect(() => {
    const nextPageNum = Math.ceil(audits.totalElements / limit);
    if (audits.totalElements && nextPageNum < page) {
      setPage(nextPageNum);
    }
  }, [limit, audits.totalElements])

  if (!props.show) {
    return null
  }

  return (
    <>
      <Block display="flex" justifyContent="space-between" marginBottom=".5rem">
        <Label1>{intl.lastChanges}</Label1>
        <Block width="300px" display="flex" justifyContent="space-between">
          <Label3 alignSelf="center" marginRight=".5rem">{intl.table}: </Label3>
          <StatefulSelect size="compact" options={Object.keys(ObjectType).map(ot => ({id: ot, label: ot}))} onChange={p => setTable(p?.value[0]?.id as ObjectType)}/>
        </Block>
      </Block>
      <StyledTable>
        <StyledHead>
          <StyledHeadCell $style={{maxWidth: "13%"}}>{intl.time}</StyledHeadCell>
          <StyledHeadCell $style={{maxWidth: "17%"}}>{intl.action}</StyledHeadCell>
          <StyledHeadCell>{intl.id}</StyledHeadCell>
          <StyledHeadCell>{intl.user}</StyledHeadCell>
        </StyledHead>
        <StyledBody>
          {audits.content.map((audit, index) => {
            const length = window.innerWidth > 1000 ? window.innerWidth > 1200 ? 40 : 30 : 20
            return (
              <StyledRow key={audit.id}>
                <Block position="absolute" marginLeft="-40px" display="block">
                  {audits.pageNumber * audits.pageSize + index + 1}
                </Block>
                <StyledCell $style={{maxWidth: "13%"}}>
                  <AuditButton kind="tertiary" id={audit.tableId} auditId={audit.id}>
                    <StatefulTooltip content={audit.time} placement={PLACEMENT.top}>{moment(audit.time).fromNow()}</StatefulTooltip>
                  </AuditButton>
                </StyledCell>
                <StyledCell $style={{maxWidth: "17%"}}>
                  <AuditActionIcon action={audit.action}/> {audit.table}
                </StyledCell>
                <StyledCell>
                  <StatefulTooltip content={audit.tableId} placement={PLACEMENT.top}>
                    <Block color={colors[audit.tableId]}>{_.truncate(audit.tableId, {length})}</Block>
                  </StatefulTooltip>
                </StyledCell>
                <StyledCell $style={{display: "flex", justifyContent: "space-between"}}>
                  <Block>{audit.user}</Block>
                  <Block>
                    <StatefulPopover content={() => (<ReactJson src={audit.data} name={null}/>)}>
                      <Button size="compact" shape="pill"><FontAwesomeIcon icon={faCode}/></Button>
                    </StatefulPopover>
                  </Block>
                </StyledCell>
              </StyledRow>
            )
          })}
        </StyledBody>
      </StyledTable>
      {!audits.totalElements && <Label2 margin="1rem">{intl.emptyTable} {intl.audits}</Label2>}

      <Block display="flex" justifyContent="space-between" marginTop="1rem">
        <StatefulPopover
          content={({close}) => (
            <StatefulMenu
              items={[5, 10, 20, 50, 100].map(i => ({label: i,}))}
              onItemSelect={({item}) => {
                setLimit(item.label);
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
