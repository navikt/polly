'use client'

import Script from 'next/script'
import { FunctionComponent, useLayoutEffect } from 'react'
import { hasAnalyticsConsent } from '@/util/analytics/innblikk'
import { useConsent } from '@/util/analytics/useConsent'
import { env } from '@/util/env'

type TInnblikkWindow = Window & {
  innblikkBeforeSend?: (type: string, payload: unknown) => unknown
}

const InnblikkSporing: FunctionComponent = () => {
  const { consent } = useConsent()

  useLayoutEffect(() => {
    const analyticsWindow = window as TInnblikkWindow
    analyticsWindow.innblikkBeforeSend = (_type, payload) =>
      hasAnalyticsConsent() ? payload : null
  }, [])

  if (consent !== 'accepted' || !env.innblikkScriptUrl || !env.innblikkWebsiteId) {
    return null
  }

  return (
    <Script
      id='polly-innblikk'
      src={env.innblikkScriptUrl}
      data-website-id={env.innblikkWebsiteId}
      data-exclude-search='true'
      data-before-send='innblikkBeforeSend'
      strategy='afterInteractive'
      onError={() => console.error('Kunne ikke laste Innblikk-skriptet.')}
    />
  )
}

export default InnblikkSporing
