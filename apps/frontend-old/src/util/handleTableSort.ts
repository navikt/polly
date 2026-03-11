import { SortState } from '@navikt/ds-react'
import { Dispatch, SetStateAction } from 'react'

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
