import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withStyle } from 'baseui'
import {
  SORT_DIRECTION,
  SortableHeadCell,
  StyledBody,
  StyledCell,
  StyledHead,
  StyledHeadCell,
  StyledRow,
  StyledTable,
} from 'baseui/table'
import { LabelMedium } from 'baseui/typography'
import { ReactElement, ReactNode, createContext, useContext } from 'react'
import { StyleObject } from 'styletron-standard'
import { theme } from '../../util'
import { TTableState } from '../../util/hooks'
import { paddingAll } from './Style'

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
  $style?: StyleObject
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
  $style?: StyleObject
}

const noBorder = {
  borderLeftWidth: '0',
  borderRightWidth: '0',
  borderTopWidth: '0',
  borderBottomWidth: '0',
}
const headerCellOverride = {
  HeadCell: {
    style: noBorder,
  },
}

const StyledHeader = withStyle(StyledHead, {
  backgroundColor: 'transparent',
  boxShadow: 'none',
  borderBottom: `2px solid ${theme.colors.mono600}`,
  marginBottom: '.5rem',
})

const tableStyle = {
  backgroundColor: 'white',
  overflow: 'hidden !important',
  ...noBorder,
  borderTopLeftRadius: '0',
  borderTopRightRadius: '0',
  borderBottomLeftRadius: '0',
  borderBottomRightRadius: '0',
  ...paddingAll(theme.sizing.scale600),
}

const TableContext = createContext<Partial<TTableProps>>({})

export const Table = (props: TTableProps) => {
  const { headers, children, emptyText } = props
  const StyleTable = withStyle(StyledTable, {
    ...tableStyle,
    backgroundColor: props.backgroundColor || tableStyle.backgroundColor,
  })

  return (
    <TableContext.Provider value={props}>
      <StyleTable>
        <StyledHeader>{headers}</StyledHeader>
        <StyledBody>
          {children}
          {(!children || (Array.isArray(children) && !children.length)) && (
            <LabelMedium margin="1rem">{emptyText}</LabelMedium>
          )}
        </StyledBody>
      </StyleTable>
    </TableContext.Provider>
  )
}
export const Row = (props: TRowProps) => {
  const { inactiveRow, infoRow, selectedRow, $style, children } = props
  const tableProps = useContext(TableContext)
  const styleProps: StyleObject = {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: theme.colors.mono600,
    opacity: inactiveRow ? '.5' : undefined,
    backgroundColor: infoRow ? theme.colors.primary50 : undefined,
    borderLeftColor: theme.colors.primary200,
    borderLeftWidth: infoRow || selectedRow ? theme.sizing.scale300 : '0',
    borderLeftStyle: 'solid',
    ':hover': {
      backgroundColor:
        tableProps.hoverColor || (infoRow ? theme.colors.mono100 : theme.colors.primary50),
    },
    ...$style,
  }
  const StyleRow = withStyle(StyledRow, styleProps)

  return <StyleRow>{children}</StyleRow>
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

const PlainHeadCell = withStyle(StyledHeadCell, headerCellOverride.HeadCell.style)

export const HeadCell = <T, K extends keyof T>(props: THeadProps<K, T>) => {
  const { title, tableState, column, small } = props

  const widthStyle = small ? { maxWidth: '15%' } : {}
  const styleOvveride = { ...widthStyle, ...props.$style }
  if (!tableState || !column) {
    return <PlainHeadCell $style={styleOvveride}>{title}</PlainHeadCell>
  }

  const [table, sortColumn] = tableState

  return (
    <SortableHeadCell
      overrides={{
        SortableLabel: {
          component: () => (
            <span>
              <SortDirectionIcon direction={table.direction[column]} />
              <div className="inline mr-1.5" />
              {title}
            </span>
          ),
        },
        HeadCell: { style: { ...headerCellOverride.HeadCell.style, ...styleOvveride } },
      }}
      title={title || ''}
      direction={table.direction[column]}
      onSort={() => sortColumn(column)}
      fillClickTarget
    />
  )
}

interface ICellProps {
  small?: boolean
  $style?: StyleObject
  children?: ReactNode
}

export const Cell = (props: ICellProps) => {
  const { small, $style, children } = props
  const widthStyle = small ? { maxWidth: '15%' } : {}

  return <StyledCell $style={{ ...$style, ...widthStyle }}>{children}</StyledCell>
}
