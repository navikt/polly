import { SORT_DIRECTION } from 'baseui/table'
import { useEffect, useState } from 'react'

type TTableConfig<T, K extends keyof T> = {
  sorting?: TColumnCompares<T>
  useDefaultStringCompare?: boolean
  initialSortColumn?: K
  showLast?: (page: T) => boolean
}

type TTableData<T, K extends keyof T> = {
  sortColumn?: K
  sortDirection?: typeof SORT_DIRECTION.ASC | typeof SORT_DIRECTION.DESC
  direction: TColumnDirection<T>
  data: Array<T>
}

type TCompare<T> = (a: T, b: T) => number

export type TColumnCompares<T> = {
  [P in keyof T]?: TCompare<T>
}

export type TColumnDirection<T> = {
  [P in keyof T]-?: typeof SORT_DIRECTION.ASC | typeof SORT_DIRECTION.DESC | null
}

const newSort = <T, K extends keyof T>(
  newColumn?: K,
  columnPrevious?: K,
  directionPrevious?: typeof SORT_DIRECTION.ASC | typeof SORT_DIRECTION.DESC
) => {
  const newDirection =
    columnPrevious && newColumn === columnPrevious && directionPrevious === SORT_DIRECTION.ASC
      ? SORT_DIRECTION.DESC
      : SORT_DIRECTION.ASC
  return { newDirection, newColumn }
}

const getSortFunction = <T, K extends keyof T>(
  sortColumn: K,
  useDefaultStringCompare: boolean,
  sorting?: TColumnCompares<T>
): TCompare<T> | undefined => {
  if (!sorting) {
    if (useDefaultStringCompare) {
      return (a, b) =>
        (a[sortColumn] as any as string).localeCompare(b[sortColumn] as any as string)
    } else {
      return undefined
    }
  }
  return sorting[sortColumn]
}

const toDirection = <T, K extends keyof T>(
  direction: typeof SORT_DIRECTION.ASC | typeof SORT_DIRECTION.DESC,
  column?: K
): TColumnDirection<T> => {
  const newDirection: any = {}
  newDirection[column] = direction
  return newDirection
}

export type TTableState<T, K extends keyof T> = [TTableData<T, K>, (column: K) => void]

export const useTable = <T, K extends keyof T>(
  initialData: Array<T>,
  config?: TTableConfig<T, K>
) => {
  const { sorting, useDefaultStringCompare, showLast } = config || {}
  const initialSort = newSort<T, K>(config?.initialSortColumn)

  const [data, setData] = useState<T[]>(initialData)

  const [isInitialSort, setIsInitialSort] = useState(true)
  const [sortDirection, setSortDirection] = useState(initialSort.newDirection)
  const [sortColumn, setSortColumn] = useState(initialSort.newColumn)
  const [direction, setDirection] = useState<TColumnDirection<T>>(
    toDirection(initialSort.newDirection, initialSort.newColumn)
  )

  useEffect(() => setData(sortTableData()), [sortColumn, sortDirection, initialData])

  const sortTableData = (): T[] => {
    if (sortColumn) {
      const sortFunct = getSortFunction(sortColumn, !!useDefaultStringCompare, sorting)
      if (!sortFunct) {
        console.warn(`invalid sort column ${String(sortColumn)} no sort function supplied`)
      } else {
        try {
          const sorted = initialData.slice(0).sort(sortFunct)
          let ordered = sortDirection === SORT_DIRECTION.ASC ? sorted : sorted.reverse()
          if (showLast && isInitialSort) {
            ordered = [...ordered.filter((order) => !showLast(order)), ...ordered.filter(showLast)]
          }
          return ordered
        } catch (error: any) {
          console.error('Error during sort of ', initialData, sortFunct, error)
        }
      }
    }
    return initialData
  }

  const sort = (sortColumnName: K): void => {
    const { newDirection, newColumn } = newSort<T, K>(sortColumnName, sortColumn, sortDirection)
    setSortColumn(newColumn)
    setSortDirection(newDirection)
    setDirection(toDirection(newDirection, newColumn))
    setIsInitialSort(false)
  }

  const state: TTableData<T, K> = { data, direction, sortColumn, sortDirection }
  return [state, sort] as TTableState<T, K>
}
