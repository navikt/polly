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

const newSort = <T, K extends keyof T>(newColumn?: K, columnPrevious?: K, directionPrevious?: SORT_DIRECTION) => {
    const newDirection = columnPrevious && newColumn === columnPrevious && directionPrevious === SORT_DIRECTION.ASC ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC
    return {newDirection, newColumn}
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

const toDirection = <T, K extends keyof T>(direction: SORT_DIRECTION, column?: K): ColumnDirection<T> => {
    const newDirection: any = {}
    newDirection[column] = direction
    return newDirection
}

export type TableState<T, K extends keyof T> = [TableData<T, K>, (column: K) => void]

export const useTable = <T, K extends keyof T>(initialData: Array<T>, config?: TableConfig<T, K>) => {
    const {sorting, useDefaultStringCompare, showLast} = config || {}
    const initialSort = newSort<T, K>(config?.initialSortColumn)

    const [data, setData] = useState<T[]>(initialData)

    const [isInitialSort, setIsInitialSort] = useState(true)
    const [sortDirection, setSortDirection] = useState(initialSort.newDirection)
    const [sortColumn, setSortColumn] = useState(initialSort.newColumn)
    const [direction, setDirection] = useState<ColumnDirection<T>>(toDirection(initialSort.newDirection, initialSort.newColumn))

    useEffect(() => setData(sortTableData()), [sortColumn, sortDirection, initialData])

    const sortTableData = () => {
        if (sortColumn) {
            const sortFunct = getSortFunction(sortColumn, !!useDefaultStringCompare, sorting)
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

    const sort = (sortColumnName: K) => {
        const {newDirection, newColumn} = newSort<T, K>(sortColumnName, sortColumn, sortDirection)
        setSortColumn(newColumn)
        setSortDirection(newDirection)
        setDirection(toDirection(newDirection, newColumn))
        setIsInitialSort(false)
    }

    const state: TableData<T, K> = {data, direction, sortColumn, sortDirection}
    return [state, sort] as TableState<T, K>
}
