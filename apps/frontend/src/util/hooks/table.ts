import { SORT_DIRECTION } from "baseui/table"
import { useEffect, useState } from "react"

type TableData<T, K extends keyof T> = {
    sortColumn?: K
    sortDirection?: SORT_DIRECTION
    direction: ColumnDirection<T>
    data: Array<T>
}

type Compare<T> = (a: T, b: T) => number

export type ColumnCompares<T> = {
    [P in keyof T]?: Compare<T>
}

export type ColumnDirection<T> = {
    [P in keyof T]: SORT_DIRECTION | null
}

const getSort = <T, K extends keyof T>(column?: K, existingSort?: K, existingDir?: SORT_DIRECTION) => {
    const direction = existingSort && column === existingSort && existingDir === SORT_DIRECTION.ASC ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC
    return {direction, column}
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
    const [data, setData] = useState<T[]>(initialData)
    const [sortDirection, setSortDirection] = useState()
    const [sortColumn, setSortColumn] = useState()
    const [direction, setDirection] = useState<ColumnDirection<T>>({} as ColumnDirection<T>)

    useEffect(() => setData(sortTableData(initialData)), [initialData])
    useEffect(() => setData(sortTableData()), [sortColumn, sortDirection])
    useEffect(() => initialSortColumn && sort(initialSortColumn), [])

    const sortTableData = (initialData?: Array<T>) => {
        const sortData = initialData || data
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

    const sort = (columnName: K) => {
        const {direction, column} = getSort<T, K>(columnName, sortColumn, sortDirection)
        setSortColumn(column)
        setSortDirection(direction)
        const newDirection: any = {}
        newDirection[column!] = direction
        setDirection(newDirection)
    }

    const state: TableData<T, K> = {data, direction, sortColumn, sortDirection}
    return [state, sort] as [TableData<T, K>, (column: K) => void]
}
