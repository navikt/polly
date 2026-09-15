import { SortState } from '@navikt/ds-react'
import { Dispatch, SetStateAction } from 'react'

/**
 * Sorts table rows without mutating the source array.
 * Falls back to an alphabetical sort on `defaultOrderBy` when no column is actively sorted.
 */
export const sortTableData = <T>(
  data: T[],
  comparator: (a: T, b: T, orderBy: string) => number,
  defaultOrderBy: string,
  sort?: SortState
): T[] => {
  const orderBy: string = sort?.orderBy ?? defaultOrderBy
  const descending: boolean = sort?.direction === 'descending'

  return [...data].sort((a: T, b: T) =>
    descending ? comparator(b, a, orderBy) : comparator(a, b, orderBy)
  )
}

export const handleSort = (
  sort: SortState | undefined,
  setSort: Dispatch<SetStateAction<SortState | undefined>>,
  sortKey?: string
) => {
  setSort(
    sort && sortKey === sort.orderBy && sort.direction === 'descending'
      ? undefined
      : ({
          orderBy: sortKey,
          direction:
            sort && sortKey === sort.orderBy && sort.direction === 'ascending'
              ? 'descending'
              : 'ascending',
        } as SortState)
  )
}
