import { Document } from "../../../constants"
import React, { useState } from "react"
import { SortableHeadCell, StyledBody, StyledCell, StyledHead, StyledRow, StyledTable } from "baseui/table"
import { intl, theme } from "../../../util"
import { useRefs, useTable } from "../../../util/hooks"
import { withStyle } from "baseui"
import RouteLink from "../../common/RouteLink"

const Head = withStyle(StyledHead, {
  backgroundColor: "transparent",
  boxShadow: "none",
  borderBottom: "2px solid #E9E7E7"
});

const Row = withStyle(StyledRow, (props: { selected: boolean }) => ({
  borderBottom: "1px solid #E9E7E7",
  padding: "8px",
  fontSize: "24px",
  backgroundColor: props.selected ? theme.colors.mono200 : undefined
}));

export interface DocumentReferences {
  [id: string]: () => void
}

interface DocumentTableProps {
  documents: Document[],
  documentRef: DocumentReferences
}

export const DocumentTable = (props: DocumentTableProps) => {
  const [table, sortColumn] = useTable<Document, keyof Document>(props.documents, {sorting: {/*todo*/}, initialSortColumn: 'name'})
  const [selected, setSelected] = useState<string>()
  const refs = useRefs(props.documents.map(d => d.id))

  props.documents.forEach(d => {
    props.documentRef[d.id] = () => {
      setSelected(d.id)
      refs[d.id].current?.scrollIntoView()
    }
  })

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
            <Row key={index} selected={row.id === selected} ref={refs[row.id]}>
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

    </>
  )
}
