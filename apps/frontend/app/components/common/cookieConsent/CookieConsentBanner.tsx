'use client'

import { BodyLong, Button, Heading } from '@navikt/ds-react'
import { FunctionComponent } from 'react'
import { useConsent } from '@/util/analytics/useConsent'

const CookieConsentBanner: FunctionComponent = () => {
  const { consent, setConsent } = useConsent()

  if (consent !== null) {
    return null
  }

  return (
    <section
      aria-labelledby='cookie-consent-heading'
      className='sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm'
    >
      <div className='mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between'>
        <div className='max-w-3xl'>
          <Heading id='cookie-consent-heading' level='2' size='small'>
            Informasjonskapsler og analyse
          </Heading>
          <BodyLong className='mt-1'>
            Vi bruker analyseverktøyet Innblikk for å forstå hvordan Behandlingskatalogen brukes og
            forbedre brukeropplevelsen. Vi lagrer valget ditt i en informasjonskapsel i seks
            måneder. Du kan godta eller avvise målingen.
          </BodyLong>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <Button variant='secondary' onClick={() => setConsent('rejected')}>
            Avvis
          </Button>
          <Button onClick={() => setConsent('accepted')}>Godta</Button>
        </div>
      </div>
    </section>
  )
}

export default CookieConsentBanner
