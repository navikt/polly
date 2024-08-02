import { Dispatch, RefObject, SetStateAction, createRef, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function useDebouncedState<T>(initialValue: T, delay: number): [T, Dispatch<SetStateAction<T>>, T] {
  const [value, setValue] = useState<T>(initialValue)
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler: NodeJS.Timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  // value returned as actual non-debounced value to be used in inputfields etc
  return [debouncedValue, setValue, value]
}

export function useForceUpdate() {
  const [val, setVal] = useState(0)
  return () => setVal(val + 1)
}

export function useUpdateOnChange(value: any) {
  const update = useForceUpdate()

  useEffect(() => {
    update()
  }, [value])
}

export function useAwait<T>(p: Promise<T>, setLoading?: Dispatch<SetStateAction<boolean>>) {
  const update: () => void = useForceUpdate()

  useEffect(() => {
    ;(async () => {
      setLoading && setLoading(true)
      await p
      update()
      setLoading && setLoading(false)
    })()
  }, [])
}

type Refs<T> = { [id: string]: RefObject<T> }

export function useRefs<T>(ids: string[]) {
  const refs: Refs<T> =
    ids.reduce((acc, value) => {
      acc[value] = createRef()
      return acc
    }, {} as Refs<T>) || {}

  return refs
}

export function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export function useQueryParam<T extends string>(queryParam: string) {
  return (useQuery().get(queryParam) as T) || undefined
}
