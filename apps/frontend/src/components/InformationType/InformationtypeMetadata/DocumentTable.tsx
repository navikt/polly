import { Document } from "../../../constants"
import React from "react"
import { SortableHeadCell, StyledBody, StyledCell, StyledHead, StyledRow, StyledTable } from "baseui/table"
import { intl } from "../../../util"
import { useTable } from "../../../util/hooks"
import { withStyle } from "baseui"
import RouteLink from "../../common/RouteLink"
import { Label2 } from "baseui/typography"

const Head = withStyle(StyledHead, {
  backgroundColor: "transparent",
  boxShadow: "none",
  borderBottom: "2px solid #E9E7E7"
});

const Row = withStyle(StyledRow, () => ({
  borderBottom: "1px solid #E9E7E7",
  padding: "8px",
  fontSize: "24px"
}));

interface DocumentTableProps {
  documents: Document[],
}

export const DocumentTable = (props: DocumentTableProps) => {
  const [table, sortColumn] = useTable<Document, keyof Document>(props.documents, {sorting: {/*todo*/}, initialSortColumn: 'name'})

  return (
    <>
      <StyledTable>
        <Head>
          <SortableHeadCell direction={table.direction.name} onSort={() => sortColumn('name')} title={intl.name}/>
          <SortableHeadCell direction={table.direction.description} onSort={() => sortColumn('description')} title={intl.description}/>
          <SortableHeadCell direction={table.direction.informationTypes} onSort={() => sortColumn('informationTypes')} title={intl.informationTypes}/>
        </Head>

        <StyledBody>
          {table.data.map((row, index) => (
            <Row key={index}>
              <StyledCell>
                <RouteLink href={`/document/${row.id}`}>{row.name}</RouteLink>
              </StyledCell>
              <StyledCell>
                {row.description}
              </StyledCell>
              <StyledCell>
                {row.informationTypes.map(it => it.informationType.name).join(", ")}
              </StyledCell>
            </Row>
          ))}
        </StyledBody>
      </StyledTable>
      {!table.data.length && <Label2 margin="1rem">{intl.emptyTable} {intl.documents}</Label2>}
    </>
  )
}
