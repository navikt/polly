'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

export type TThemeMode = 'light' | 'dark'

const storageKey = 'polly-theme-mode'

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

const getSnapshot = (): TThemeMode => {
  const stored = window.localStorage.getItem(storageKey)
  return stored === 'light' || stored === 'dark' ? stored : 'light'
}

const getServerSnapshot = (): TThemeMode => 'light'

// avoids SSR/hydration mismatch: renders 'light' until React swaps in the real client snapshot
export const useStoredThemeMode = (): TThemeMode =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

export const persistThemeMode = (mode: TThemeMode) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(storageKey, mode)
}

export const useIsDark = (): boolean => {
  const [isDark, setIsDark] = useState<boolean>(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return isDark
}
