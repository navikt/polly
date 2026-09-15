'use client'

import { Dispatch, RefObject, SetStateAction, createRef, useEffect, useState } from 'react'

export function useDebouncedState<T>(
  initialValue: T,
  delay: number
): [T, Dispatch<SetStateAction<T>>, T] {
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

type TRefs<T> = { [id: string]: RefObject<T> }

export function useRefs<T>(ids: string[]) {
  const refs: TRefs<T> =
    ids.reduce((acc, value) => {
      acc[value] = createRef() as RefObject<T>
      return acc
    }, {} as TRefs<T>) || {}

  return refs
}

function useQuery() {
  if (typeof window === 'undefined') return new URLSearchParams()
  const location = window.location
  return new URLSearchParams(location.search)
}

export function useQueryParam<T extends string>(queryParam: string) {
  return (useQuery().get(queryParam) as T) || undefined
}
