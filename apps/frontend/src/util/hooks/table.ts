import { SORT_DIRECTION } from "baseui/table"
import { useEffect, useState } from "react"

type TableData<T, K extends keyof T> = {
    sortColumn?: K
    sortDirection?: SORT_DIRECTION
    data: Array<T>
}

type Compare<T> = (a: T, b: T) => number

export type ColumnCompares<T> = {
    [P in keyof T]?: Compare<T>
}

const getSort = <T, K extends keyof T>(column?: K, existingSort?: K, existingDir?: SORT_DIRECTION) => {
    const nextDirection = existingSort && column === existingSort && existingDir === SORT_DIRECTION.ASC ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC
    return {sortDirection: nextDirection, sortColumn: column}
}

const getSortFunction = <T, K extends keyof T>(sortColumn: K, useDefaultStringCompare: boolean, sorting?: ColumnCompares<T>): Compare<T> | undefined => {
    if (!sorting) {
        if (useDefaultStringCompare) {
            return (a, b) => (a[sortColumn] as any as string).localeCompare(b[sortColumn] as any as string)
        } else {
            return undefined
        }
    }
    return sorting[sortColumn]
}

export const useTable = <T, K extends keyof T>(initialData: Array<T>, config?: { sorting?: ColumnCompares<T>, useDefaultStringCompare?: boolean, initialSortColumn?: K }) => {
    const {sorting, useDefaultStringCompare, initialSortColumn} = config || {}
    const initialSort = getSort<T, K>(initialSortColumn)

    const [tableData, setTableData] = useState<T[]>(initialData)
    const [sortDirection, setSortDirection] = useState(initialSort.sortDirection)
    const [sortColumn, setSortColumn] = useState(initialSort.sortColumn)

    useEffect(() => setTableData(sortTableData(initialData)), [initialData])
    useEffect(() => setTableData(sortTableData()), [sortColumn, sortDirection])

    const sortTableData = (data?: Array<T>) => {
        const sortData = data || tableData
        if (sortColumn) {
            const sortFunct = getSortFunction(sortColumn!, !!useDefaultStringCompare, sorting)
            if (!sortFunct) {
                console.warn(`invalid sort column ${sortColumn} no sort function supplied`)
            } else {
                try {
                    const sorted = sortData.slice(0).sort((a, b) => sortFunct(a, b))
                    return sortDirection === SORT_DIRECTION.ASC ? sorted : sorted.reverse()
                } catch (e) {
                    console.error("Error during sort of ", sortData, sortFunct, e)
                }
            }
        }
        return sortData
    }

    const sort = (column: K) => {
        const newSort = getSort<T, K>(column, sortColumn, sortDirection)
        setSortColumn(newSort.sortColumn)
        setSortDirection(newSort.sortDirection)
    }
    const direction = (column: K) => sortColumn === column ? sortDirection : null

    return [{data: tableData, sortColumn, sortDirection}, direction, sort] as [
        TableData<T, K>,
        (column: K) => SORT_DIRECTION | null,
        (column: K) => void
    ]
}
