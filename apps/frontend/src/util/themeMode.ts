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
