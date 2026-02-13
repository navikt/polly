export type TPermissionMode = 'admin' | 'write' | 'read'

const MODE_STORAGE_KEY = 'polly.permissionMode'
const LEGACY_OVERRIDE_KEY = 'polly.permissionOverride'

const DEFAULT_MODE: TPermissionMode = 'admin'

const isPermissionMode = (value: unknown): value is TPermissionMode => {
  return value === 'admin' || value === 'write' || value === 'read'
}

const readModeFromStorage = (): TPermissionMode => {
  if (typeof window === 'undefined') return DEFAULT_MODE

  const storedMode = window.localStorage.getItem(MODE_STORAGE_KEY)
  if (storedMode && isPermissionMode(storedMode)) {
    return storedMode
  }

  const legacy = window.localStorage.getItem(LEGACY_OVERRIDE_KEY)
  if (!legacy) return DEFAULT_MODE

  try {
    const parsed = JSON.parse(legacy) as Partial<{ adminEnabled: boolean; writeEnabled: boolean }>
    const adminEnabled = parsed.adminEnabled ?? true
    const writeEnabled = parsed.writeEnabled ?? true

    if (adminEnabled) return 'admin'
    if (writeEnabled) return 'write'
    return 'read'
  } catch {
    return DEFAULT_MODE
  }
}

let currentMode: TPermissionMode = readModeFromStorage()

export const getInitialPermissionMode = (): TPermissionMode => {
  return currentMode
}

export const persistPermissionMode = (value: TPermissionMode): void => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(MODE_STORAGE_KEY, value)
}

export const getPermissionMode = (): TPermissionMode => {
  return currentMode
}

export const setPermissionMode = (value: TPermissionMode): void => {
  currentMode = value
  persistPermissionMode(value)
}
