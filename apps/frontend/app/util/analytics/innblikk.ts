export type TConsentValue = 'accepted' | 'rejected'

const CONSENT_COOKIE_NAME = 'polly-cookie-consent'
export const CONSENT_EVENT_NAME = 'polly-consent-changed'

export const getConsentPreference = (): TConsentValue | null => {
  if (typeof document === 'undefined') {
    return null
  }

  const cookie = document.cookie
    .split('; ')
    .find((value) => value.startsWith(`${CONSENT_COOKIE_NAME}=`))
  const value = cookie?.split('=')[1]

  return value === 'accepted' || value === 'rejected' ? value : null
}

export const hasAnalyticsConsent = (): boolean => getConsentPreference() === 'accepted'

export const saveConsentPreference = (value: TConsentValue): void => {
  if (typeof document === 'undefined') {
    return
  }

  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toUTCString()
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; expires=${expires}; path=/; SameSite=Lax${secure}`

  window.dispatchEvent(new CustomEvent(CONSENT_EVENT_NAME, { detail: value }))
}
