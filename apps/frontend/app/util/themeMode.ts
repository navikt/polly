import { useEffect, useState } from 'react'

export type TThemeMode = 'light' | 'dark'

const storageKey = 'polly-theme-mode'

export const getInitialThemeMode = (): TThemeMode => {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(storageKey)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
  return 'light'
}

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
