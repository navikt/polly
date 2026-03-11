export type TThemeMode = 'light' | 'dark'

const storageKey = 'polly-theme-mode'

export const getInitialThemeMode = (): TThemeMode => {
  const stored = window.localStorage.getItem(storageKey)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
  return 'light'
}

export const persistThemeMode = (mode: TThemeMode) => {
  window.localStorage.setItem(storageKey, mode)
}
