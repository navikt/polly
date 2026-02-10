import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BodyShort, Table as NavTable } from '@navikt/ds-react'
import { Children, ReactElement, ReactNode, createContext } from 'react'
import { theme } from '../../util'
import { TTableState } from '../../util/hooks'
import { SORT_DIRECTION } from '../../util/hooks/table'

type TTableProps = {
  backgroundColor?: string
  hoverColor?: string
  emptyText: string
  headers: ReactElement
  children: ReactNode
}

type THeadProps<K extends keyof T, T> = {
  title?: string
  column?: K
  tableState?: TTableState<T, K>
  $style?: React.CSSProperties
  small?: boolean
  sort?: [
    string,
    { column: string; dir: typeof SORT_DIRECTION.ASC | typeof SORT_DIRECTION.DESC },
    (column: K) => void,
  ]
}

type TRowProps = {
  inactiveRow?: boolean
  selectedRow?: boolean
  infoRow?: boolean
  children?: any
  $style?: React.CSSProperties
}

const TableContext = createContext<Partial<TTableProps>>({})

export const Table = (props: TTableProps) => {
  const { headers, children, emptyText } = props

  const headerCount = Math.max(
    1,
    (headers as any)?.props?.children ? Children.count((headers as any).props.children) : 1
  )
  const hasChildren = Children.count(children) > 0

  return (
    <TableContext.Provider value={props}>
      <div
        style={{
          backgroundColor: props.backgroundColor || 'white',
          padding: theme.sizing.scale600,
          maxWidth: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        <NavTable size="medium" style={{ width: '100%', tableLayout: 'fixed' }}>
          <NavTable.Header>
            <NavTable.Row>{headers}</NavTable.Row>
          </NavTable.Header>
          <NavTable.Body>
            {hasChildren ? (
              children
            ) : (
              <NavTable.Row>
                <NavTable.DataCell colSpan={headerCount}>
                  <BodyShort>{emptyText}</BodyShort>
                </NavTable.DataCell>
              </NavTable.Row>
            )}
          </NavTable.Body>
        </NavTable>
      </div>
    </TableContext.Provider>
  )
}
export const Row = (props: TRowProps) => {
  const { inactiveRow, infoRow, selectedRow, $style, children } = props

  return (
    <NavTable.Row
      style={{
        opacity: inactiveRow ? 0.5 : undefined,
        backgroundColor: infoRow ? theme.colors.primary50 : undefined,
        borderLeft: infoRow || selectedRow ? `4px solid ${theme.colors.primary200}` : undefined,
        ...$style,
      }}
    >
      {children}
    </NavTable.Row>
  )
}

interface ISortDirectionIconProps {
  direction: typeof SORT_DIRECTION.ASC | typeof SORT_DIRECTION.DESC | null
}

const SortDirectionIcon = (props: ISortDirectionIconProps) => {
  switch (props?.direction) {
    case SORT_DIRECTION.ASC:
      return <FontAwesomeIcon icon={faSortDown} />
    case SORT_DIRECTION.DESC:
      return <FontAwesomeIcon icon={faSortUp} />
    default:
      return <FontAwesomeIcon icon={faSort} />
  }
}

export const HeadCell = <T, K extends keyof T>(props: THeadProps<K, T>) => {
  const { title, tableState, column, small } = props

  const widthStyle = small ? { maxWidth: '15%' } : undefined
  const styleOverride = { ...widthStyle, ...props.$style }
  if (!tableState || !column) {
    return <NavTable.ColumnHeader style={styleOverride}>{title}</NavTable.ColumnHeader>
  }

  const [table, sortColumn] = tableState

  return (
    <NavTable.ColumnHeader style={styleOverride}>
      <button
        type="button"
        className="flex items-center gap-2 text-left"
        onClick={() => sortColumn(column)}
      >
        <SortDirectionIcon direction={table.direction[column]} />
        <span>{title}</span>
      </button>
    </NavTable.ColumnHeader>
  )
}

interface ICellProps {
  small?: boolean
  $style?: React.CSSProperties
  children?: ReactNode
}

export const Cell = (props: ICellProps) => {
  const { small, $style, children } = props
  const widthStyle = small ? { maxWidth: '15%' } : undefined

  return <NavTable.DataCell style={{ ...widthStyle, ...$style }}>{children}</NavTable.DataCell>
}
