import { SORT_DIRECTION } from "baseui/table"
import { useEffect, useState } from "react"

type TableConfig<T, K extends keyof T> = {
    sorting?: ColumnCompares<T>,
    useDefaultStringCompare?: boolean,
    initialSortColumn?: K,
    showLast?: (p: T) => boolean
}

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
    [P in keyof T]-?: SORT_DIRECTION | null
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

function toDirection<K, T>(column: K | undefined, direction: SORT_DIRECTION): ColumnDirection<T> {
    const newDirection: any = {}
    newDirection[column!] = direction
    return newDirection
}

export const useTable = <T, K extends keyof T>(initialData: Array<T>, config?: TableConfig<T, K>) => {
    const {sorting, useDefaultStringCompare, showLast} = config || {}
    const initialSort = getSort<T, K>(config?.initialSortColumn, undefined, undefined)

    const [data, setData] = useState<T[]>(initialData)

    const [isInitialSort, setIsInitialSort] = useState(true)
    const [sortDirection, setSortDirection] = useState(initialSort.direction)
    const [sortColumn, setSortColumn] = useState(initialSort.column)
    const [direction, setDirection] = useState<ColumnDirection<T>>(toDirection(initialSort.column, initialSort.direction))

    useEffect(() => setData(sortTableData()), [sortColumn, sortDirection, initialData])

    const sortTableData = () => {
        if (sortColumn) {
            const sortFunct = getSortFunction(sortColumn!, !!useDefaultStringCompare, sorting)
            if (!sortFunct) {
                console.warn(`invalid sort column ${sortColumn} no sort function supplied`)
            } else {
                try {
                    const sorted = initialData.slice(0).sort(sortFunct)
                    let ordered = sortDirection === SORT_DIRECTION.ASC ? sorted : sorted.reverse()
                    if (showLast && isInitialSort) {
                        ordered = [...ordered.filter(p => !showLast(p)), ...ordered.filter(showLast)]
                    }
                    return ordered
                } catch (e) {
                    console.error("Error during sort of ", initialData, sortFunct, e)
                }
            }
        }
        return initialData
    }

    const sort = (columnName: K, internal?: boolean) => {
        const {direction, column} = getSort<T, K>(columnName, sortColumn, sortDirection)
        setSortColumn(column)
        setSortDirection(direction)
        setDirection(toDirection(column, direction))
        setIsInitialSort(false)
    }

    const state: TableData<T, K> = {data, direction, sortColumn, sortDirection}
    return [state, sort] as [TableData<T, K>, (column: K) => void]
}
