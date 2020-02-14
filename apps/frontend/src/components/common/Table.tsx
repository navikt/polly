import { SortableHeadCell, StyledBody, StyledCell, StyledHead, StyledHeadCell, StyledRow, StyledTable } from "baseui/table"
import { theme } from "../../util"
import * as React from "react"
import { ReactElement } from "react"
import { useStyletron, withStyle } from "baseui"
import { TableState } from "../../util/hooks"

type TableProps = {
  headers: ReactElement,
  children: ReactElement | ReactElement[]
}

type HeadProps<K extends keyof T, T> = {
  title: string,
  column: K,
  tableState: TableState<T, K>
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
      borderRight: "none"
    }
  }
}

const tableCss = {
  overflow: "hidden !important",
  backgroundColor: theme.colors.primary50,
  borderTop: "none",
  borderBottom: "none",
  borderLeft: "none",
  borderRight: "none"
}

const StyledHeader = withStyle(StyledHead, {
  backgroundColor: "transparent",
  boxShadow: "none",
  borderBottom: `2px solid ${theme.colors.mono600}`
})

export const Table = (props: TableProps) => {
  const [useCss] = useStyletron();

  return (
    <StyledTable className={useCss(tableCss)}>
      <StyledHeader>
        {props.headers}
      </StyledHeader>
      <StyledBody>
        {props.children}
      </StyledBody>
    </StyledTable>
  )
}
export const Row = (props: RowProps) => {
  const styleProps = {
    borderLeft: "none",
    borderBottom: `1px solid ${theme.colors.mono600}`,
    fontSize: "24px",
    opacity: props.inactiveRow ? '.5' : undefined,
    backgroundColor: props.infoRow ? theme.colors.accent50 : undefined,
    borderLeftWidth: props.infoRow || props.selectedRow ? theme.sizing.scale300 : undefined,
  }
  const StyleRow = withStyle(StyledRow, styleProps)
  return <StyleRow>{props.children}</StyleRow>
}

export const HeadCell = <T, K extends keyof T>(props: HeadProps<K, T>) => {
  const [table, sortColumn] = props.tableState

  return (
    <SortableHeadCell
      overrides={headerCellOverride}
      title={props.title}
      direction={table.direction[props.column]}
      onSort={() => sortColumn(props.column)}
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
