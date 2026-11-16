'use client'

import { useSyncExternalStore } from 'react'
import {
  CONSENT_EVENT_NAME,
  TConsentValue,
  getConsentPreference,
  saveConsentPreference,
} from './innblikk'

const subscribe = (listener: () => void) => {
  window.addEventListener(CONSENT_EVENT_NAME, listener)
  return () => window.removeEventListener(CONSENT_EVENT_NAME, listener)
}

const getServerSnapshot = () => undefined

export const useConsent = () => {
  const consent = useSyncExternalStore(subscribe, getConsentPreference, getServerSnapshot)

  const setConsent = (value: TConsentValue) => {
    saveConsentPreference(value)
  }

  return { consent, setConsent }
}
