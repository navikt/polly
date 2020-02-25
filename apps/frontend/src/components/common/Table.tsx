import { SortableHeadCell, StyledBody, StyledCell, StyledHead, StyledHeadCell, StyledRow, StyledTable } from "baseui/table"
import { theme } from "../../util"
import * as React from "react"
import { ReactElement, useContext } from "react"
import { withStyle } from "baseui"
import { TableState } from "../../util/hooks"
import { StyleObject } from "styletron-standard"

type TableProps = {
  backgroundColor?: string,
  hoverColor?: string,
  headers: ReactElement,
  children: ReactElement | ReactElement[]
}

type HeadProps<K extends keyof T, T> = {
  title: string,
  column?: K,
  tableState?: TableState<T, K>
}

type RowProps = {
  inactiveRow?: boolean,
  selectedRow?: boolean,
  infoRow?: boolean,
  children?: any
}

const headerCellOverride = {
  HeadCell: {
    style: {
      borderLeft: "none",
      borderRight: "none",
      borderTop: "none",
      borderBottom: "none"
    }
  }
}

const StyledHeader = withStyle(StyledHead, {
  backgroundColor: "transparent",
  boxShadow: "none",
  borderBottom: `2px solid ${theme.colors.mono600}`,
  marginBottom: ".5rem"
})

const tableStyle = {
  overflow: "hidden !important",
  borderWidth: "0",
  borderTopLeftRadius: "0",
  borderTopRightRadius: "0",
  borderBottomLeftRadius: "0",
  borderBottomRightRadius: "0"
}

const TableContext = React.createContext<Partial<TableProps>>({})

export const Table = (props: TableProps) => {
  const StyleTable = withStyle(StyledTable, {...tableStyle, backgroundColor: props.backgroundColor})
  return (
    <TableContext.Provider value={props}>
      <StyleTable>
        <StyledHeader>
          {props.headers}
        </StyledHeader>
        <StyledBody>
          {props.children}
        </StyledBody>
      </StyleTable>
    </TableContext.Provider>
  )
}
export const Row = (props: RowProps) => {
  const tableProps = useContext(TableContext)
  const styleProps: StyleObject = {
    borderBottom: `1px solid ${theme.colors.mono600}`,
    opacity: props.inactiveRow ? '.5' : undefined,
    backgroundColor: props.infoRow ? theme.colors.primary50 : undefined,
    borderLeftColor: theme.colors.primary200,
    borderLeftWidth: props.infoRow || props.selectedRow ? theme.sizing.scale300 : '0',
    borderLeftStyle: 'solid',
    ':hover': {
      backgroundColor: tableProps.hoverColor || (props.infoRow ? theme.colors.mono100 : theme.colors.primary50)
    }
  }
  const StyleRow = withStyle(StyledRow, styleProps)
  return <StyleRow>{props.children}</StyleRow>
}

const PlainHeadCell = withStyle(StyledHeadCell, headerCellOverride.HeadCell.style)

export const HeadCell = <T, K extends keyof T>(props: HeadProps<K, T>) => {
  if (!props.tableState || !props.column) {
    return <PlainHeadCell>{props.title}</PlainHeadCell>
  }

  const [table, sortColumn] = props.tableState

  return (
    <SortableHeadCell
      overrides={headerCellOverride}
      title={props.title}
      direction={table.direction[props.column]}
      onSort={() => sortColumn(props.column!)}
      fillClickTarget
    />
  )
}

export const SmallHeadCell = withStyle(StyledHeadCell, {
  maxWidth: '15%'
})

export const Cell = StyledCell

export const SmallCell = withStyle(StyledCell, {
  maxWidth: '15%'
})
